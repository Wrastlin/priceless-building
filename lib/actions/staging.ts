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
import { requireAdminSession } from "@/lib/auth/session";
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
  await requireAdminSession();
  await setStatus(sku, "published");
}

export async function rejectDraftAction(sku: string): Promise<void> {
  await requireAdminSession();
  await setStatus(sku, "archived");
}

/**
 * Reverse a recent staging mutation. Sends the item back to draft
 * status whether it was just approved or rejected. Used by the Undo
 * action on the staging page.
 */
export async function undoStatusChangeAction(sku: string): Promise<void> {
  await requireAdminSession();
  await setStatus(sku, "draft");
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
  // Time-based suffix for uniqueness without a counter.
  const suffix = Math.floor(Date.now() / 1000) % 1_000_000;
  const sku = formatSKU(prefix, suffix);
  const id = sku.toLowerCase();

  const draft: Omit<CatalogItem, "status" | "createdAt"> = {
    id,
    sku,
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
    createdBy: "floor staff",
  };

  await createDraft(draft);
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
