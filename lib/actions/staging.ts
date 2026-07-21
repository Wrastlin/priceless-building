"use server";

/**
 * Staging server actions.
 *
 * Manager workflow:
 *   floor staff → createDraftFromFormAction → /admin/staging
 *   manager     → approveDraftAction        → live on storefront
 *   manager     → rejectDraftAction         → archived (out of sight)
 *
 * All writes go through `lib/items/store.ts` which atomically writes
 * to disk and revalidates the storefront + staging paths.
 */

import { redirect } from "next/navigation";
import {
  createDraft,
  setStatus,
  type Brand,
  type Category,
  type CatalogItem,
} from "@/lib/items/store";
import { requireAdminSession, requireOwner, adminIdentity } from "@/lib/auth/session";
import { resolveActor, actorStamp } from "@/lib/auth/actor";
import { logCaptureEvent } from "@/lib/capture/events";
import { formatSKU } from "@/lib/utils";

const CATEGORY_TO_BRAND: Record<string, Brand> = {
  cabinets: "builders",
  countertops: "builders",
};

function deriveBrand(category: string): Brand {
  return CATEGORY_TO_BRAND[category] ?? "priceless";
}

function nonEmpty(form: FormData, key: string): string {
  const v = form.get(key);
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`Missing required field: ${key}`);
  }
  return v.trim();
}

function optional(form: FormData, key: string): string | undefined {
  const v = form.get(key);
  if (typeof v !== "string" || v.trim() === "") return undefined;
  return v.trim();
}

function optionalNumber(form: FormData, key: string): number | undefined {
  const v = form.get(key);
  if (typeof v !== "string" || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function approveDraftAction(sku: string): Promise<void> {
  const me = await requireOwner();
  await setStatus(sku, "published");
  await logCaptureEvent({
    source: "action",
    action: "item.publish",
    sku,
    loginEmail: me.email,
    loginRole: me.role,
  });
}

export async function rejectDraftAction(sku: string): Promise<void> {
  const me = await requireOwner();
  await setStatus(sku, "archived");
  await logCaptureEvent({
    source: "action",
    action: "item.archive",
    sku,
    loginEmail: me.email,
    loginRole: me.role,
  });
}

/**
 * Reverse a recent staging mutation. Sends the item back to draft
 * status whether it was just approved or rejected. Used by the Undo
 * action on the staging page.
 */
export async function undoStatusChangeAction(sku: string): Promise<void> {
  const me = await requireOwner();
  await setStatus(sku, "draft");
  await logCaptureEvent({
    source: "action",
    action: "item.undo_status",
    sku,
    loginEmail: me.email,
    loginRole: me.role,
  });
}

/**
 * Builds a new draft item from a multipart form submission. Generates
 * the SKU server-side (the brand prefix is inferred from category).
 *
 * Redirects to /admin/staging on success so the floor staffer
 * immediately sees their entry land in the review queue.
 */
export async function createDraftFromFormAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const actor = await resolveActor();
  const stamp = actor ? actorStamp(actor) : { createdBy: "Floor", actorId: null, actorName: null, loginEmail: null, loginRole: null };
  const title = nonEmpty(formData, "title");
  const subtitle = optional(formData, "subtitle") ?? "";
  const category = nonEmpty(formData, "category") as Category;
  const manufacturer = optional(formData, "manufacturer");
  const dimensions = optional(formData, "dimensions");
  const price = optionalNumber(formData, "price") ?? 0;
  const msrp = optionalNumber(formData, "msrp");
  const location = optional(formData, "location");
  const inStock = optionalNumber(formData, "inStock") ?? 1;
  const image = nonEmpty(formData, "image");

  // Gallery is a JSON-encoded array of data URLs (one per non-cover
  // photo). Falls back to empty if not provided.
  const galleryRaw = optional(formData, "gallery");
  let gallery: string[] | undefined;
  if (galleryRaw) {
    try {
      const parsed = JSON.parse(galleryRaw);
      if (Array.isArray(parsed)) {
        gallery = parsed.filter((g): g is string => typeof g === "string");
      }
    } catch {
      // Bad JSON: ignore the gallery field rather than fail the save.
    }
  }

  const compRetailer = optional(formData, "comparable_retailer");
  const compPrice = optionalNumber(formData, "comparable_price");
  const compUrl = optional(formData, "comparable_url");

  // Full comparables array (JSON-encoded). Each entry must have a
  // real clickable URL — that's what makes the saved data useful
  // when the staffer revisits the item later to re-verify pricing.
  const comparablesRaw = optional(formData, "comparables");
  let comparablesArr: Array<{
    source: string;
    title: string;
    price: number;
    url: string;
    image?: string;
    capturedAt?: string;
  }> | undefined;
  if (comparablesRaw) {
    try {
      const parsed = JSON.parse(comparablesRaw);
      if (Array.isArray(parsed)) {
        const now = new Date().toISOString();
        comparablesArr = parsed
          .filter((c) => c && typeof c.url === "string" && c.url.startsWith("http"))
          .map((c) => ({
            source: String(c.source ?? "Online"),
            title: String(c.title ?? ""),
            price: Number(c.price) || 0,
            url: String(c.url),
            image: c.image ? String(c.image) : undefined,
            capturedAt: now,
          }))
          .filter((c) => c.price > 0);
      }
    } catch {
      // Bad JSON: skip; the single `comparable` field will still hold the top.
    }
  }

  const brand = deriveBrand(category);
  const prefix = brand === "builders" ? "BC" : "PL";

  const baseDraft: Omit<CatalogItem, "status" | "createdAt" | "id" | "sku"> = {
    brand,
    category,
    title,
    subtitle,
    price,
    msrp,
    image,
    gallery,
    location,
    inStock,
    manufacturer,
    dimensions,
    comparable: compRetailer && typeof compPrice === "number"
      ? { retailer: compRetailer, price: compPrice, url: compUrl }
      : undefined,
    comparables: comparablesArr,
    createdBy: stamp.createdBy,
  };

  // Allocate a unique SKU with retry. The items table has a UNIQUE constraint
  // on sku (createDraft surfaces a clear "already exists" error on duplicate),
  // so we retry with a fresh suffix instead of losing the save. The old
  // per-second suffix collided whenever two items were saved in the same
  // second — normal during batch scanning, or with two staffers at once. A
  // millisecond clock plus per-attempt jitter makes a repeat collision
  // vanishingly unlikely within the retry budget.
  let createdSku: string | null = null;
  for (let attempt = 0; attempt < 8 && !createdSku; attempt++) {
    const suffix = (Date.now() + Math.floor(Math.random() * 1_000_000)) % 1_000_000;
    const sku = formatSKU(prefix, suffix);
    try {
      await createDraft({ ...baseDraft, id: sku.toLowerCase(), sku });
      createdSku = sku;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) continue; // SKU collision — try a new suffix
      throw err; // any other failure bubbles up
    }
  }
  if (!createdSku) {
    throw new Error("Couldn't generate a unique SKU after several tries — please save again.");
  }

  // Private (never-public) cost + source lot, stored in item_private. Best
  // effort: the draft is already saved, so if this fails (e.g. the migration
  // hasn't run yet) don't lose the item — cost can be re-entered on the item
  // page.
  const cost = optionalNumber(formData, "cost");
  const sourceLot = optional(formData, "source_lot");
  if (cost !== undefined || sourceLot !== undefined) {
    try {
      const { upsertItemPrivate } = await import("@/lib/items/private-store");
      await upsertItemPrivate(createdSku, { cost: cost ?? null, sourceLot: sourceLot ?? null });
    } catch (err) {
      console.error("createDraft: cost/source save failed (item still created)", err);
    }
  }

  redirect("/admin/staging");
}

/**
 * Append additional photos to an already-existing item's gallery.
 * Used by the Item detail page's "Add photo" action.
 */
export async function addPhotosToItemAction(sku: string, dataUrls: string[]): Promise<void> {
  await requireAdminSession();
  if (dataUrls.length === 0) return;
  const { findBySku, updateItem } = await import("@/lib/items/store");
  const existing = await findBySku(sku);
  if (!existing) throw new Error(`addPhotosToItem: no item with sku "${sku}"`);
  const merged = [...(existing.gallery ?? []), ...dataUrls];
  await updateItem(sku, { gallery: merged });
}

/**
 * Edit an item's marketing-facing details (title, subtitle, price, etc.)
 * without going through staging. Used by the Marketing compose page's
 * inline editor so a manager can tweak a published item's copy on the
 * fly when something reads wrong.
 *
 * Whitelisted fields only — SKU, status, image/gallery, and createdAt
 * are intentionally NOT editable here (those need their own flows).
 */
export type EditableItemFields = Partial<{
  title: string;
  subtitle: string;
  price: number;
  msrp: number | null;
  dimensions: string | null;
  manufacturer: string | null;
  location: string | null;
  inStock: number;
}>;

/**
 * Toggle whether an item is featured. Featured published items make up the
 * pool the home page rotates through. Used by the admin Featured manager.
 */
export async function setFeaturedAction(sku: string, featured: boolean): Promise<void> {
  const me = await requireOwner();
  const { updateItem } = await import("@/lib/items/store");
  await updateItem(sku, { featured });
  await logCaptureEvent({
    source: "action",
    action: featured ? "item.feature" : "item.unfeature",
    sku,
    loginEmail: me.email,
    loginRole: me.role,
  });
}

/**
 * Set an item's on-hand quantity. Powers the inline +/- stock steppers on
 * the Inventory list so staff can adjust counts from the floor without
 * opening the edit screen. Clamps to a non-negative integer.
 */
export async function updateStockAction(sku: string, inStock: number): Promise<void> {
  await requireAdminSession();
  const qty = Math.max(0, Math.floor(Number(inStock) || 0));
  const { updateItem } = await import("@/lib/items/store");
  await updateItem(sku, { inStock: qty });
}

export async function updateItemDetailsAction(
  sku: string,
  fields: EditableItemFields,
): Promise<void> {
  await requireAdminSession();
  const { updateItem } = await import("@/lib/items/store");
  // Strip undefined; convert null → undefined so the store clears the field.
  const clean: Record<string, string | number | undefined> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    clean[k] = v === null ? undefined : v;
  }
  await updateItem(sku, clean);
}

/**
 * Mark an item sold. Flips status to 'sold' (so it drops off the storefront —
 * public reads only show 'published') and records the sale (when, price, who)
 * in item_private. `soldPrice` defaults to the tag price if not passed.
 */
export async function markSoldAction(sku: string, soldPrice?: number | null): Promise<void> {
  await requireAdminSession();
  const actor = await resolveActor();
  const stamp = actor ? actorStamp(actor) : null;
  const { setStatus, findBySku } = await import("@/lib/items/store");
  const item = await findBySku(sku);
  const price = soldPrice ?? item?.price ?? null;
  await setStatus(sku, "sold");
  try {
    const { upsertItemPrivate } = await import("@/lib/items/private-store");
    await upsertItemPrivate(sku, {
      soldAt: new Date().toISOString(),
      soldPrice: price,
      soldBy: stamp?.createdBy ?? stamp?.loginEmail ?? null,
    });
  } catch (err) {
    console.error("markSold: sold record save failed", err);
  }
  await logCaptureEvent({
    source: "action",
    action: "item.sold",
    sku,
    actorId: stamp?.actorId,
    actorName: stamp?.actorName,
    loginEmail: stamp?.loginEmail,
    loginRole: stamp?.loginRole,
    payload: { soldPrice: price },
  });
}

/** Reverse a mark-sold: back to published and clear the sold record. */
export async function unmarkSoldAction(sku: string): Promise<void> {
  const me = await requireOwner();
  const { setStatus } = await import("@/lib/items/store");
  await setStatus(sku, "published");
  try {
    const { upsertItemPrivate } = await import("@/lib/items/private-store");
    await upsertItemPrivate(sku, { soldAt: null, soldPrice: null, soldBy: null });
  } catch (err) {
    console.error("unmarkSold: clear failed", err);
  }
  await logCaptureEvent({
    source: "action",
    action: "item.unsold",
    sku,
    loginEmail: me.email,
    loginRole: me.role,
  });
}

/**
 * Set an item's private cost + source lot (the "what we paid" / which
 * liquidation buy). Stored in item_private, never exposed to the storefront.
 * Pass null to clear a value.
 */
export async function updateItemCostAction(
  sku: string,
  fields: { cost?: number | null; sourceLot?: string | null },
): Promise<void> {
  const me = await requireOwner();
  const { upsertItemPrivate } = await import("@/lib/items/private-store");
  await upsertItemPrivate(sku, fields);
  await logCaptureEvent({
    source: "action",
    action: "item.cost_update",
    sku,
    loginEmail: me.email,
    loginRole: me.role,
    payload: fields as Record<string, unknown>,
  });
  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/admin/inventory/${sku}`);
}
