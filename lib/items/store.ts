/**
 * Item store — Supabase-backed.
 *
 * Replaces the old `data/items.json` file backend, which could not be
 * written on Vercel's read-only serverless filesystem (a save threw EROFS
 * and surfaced as the generic "error occurred in the Server Components
 * render" digest). The catalog now lives in the `public.items` table.
 *
 * Two access paths:
 *   - PUBLIC reads (published items, storefront): the anon, session-less
 *     client in `lib/supabase/public.ts`. Cacheable + tag-revalidated, so
 *     storefront pages stay static and refresh when the catalog changes.
 *   - ADMIN reads (drafts/staged) and ALL writes: the per-request cookie
 *     client in `lib/supabase/server.ts`, which carries the signed-in
 *     staffer's session (RLS `authenticated` role). The application-level
 *     allowlist (`requireAdminSession`) gates who can reach the writes.
 *
 * The full CatalogItem lives in the row's `data` jsonb column (canonical);
 * sku/status/brand/category are mirrored as columns only so queries can
 * filter without scanning jsonb. Every write updates both.
 *
 * When Supabase env vars are absent (e.g. CI, or a designer with no
 * secrets) reads fall back to the in-memory SEED_ITEMS and writes throw a
 * clear "not configured" error rather than corrupting anything.
 */
import type { CatalogItem, Brand, Category, ItemStatus } from "@/lib/items/types";
import { SEED_ITEMS } from "@/lib/items/seed";
import { publicClient } from "@/lib/supabase/public";

export type { CatalogItem, Brand, Category, ItemStatus } from "@/lib/items/types";

const CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Per-request cookie client (authenticated staff session) for admin reads + writes. */
async function sessionClient() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

function rowsToItems(rows: Array<{ data: unknown }> | null): CatalogItem[] {
  return (rows ?? []).map((r) => r.data as CatalogItem);
}

function mustBeConfigured(op: string): void {
  if (!CONFIGURED) {
    throw new Error(
      `${op}: item store is not configured. Set NEXT_PUBLIC_SUPABASE_URL and ` +
        `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (and sign in) to write catalog items.`,
    );
  }
}

/** Invalidate the storefront + admin caches after a write. */
function bustPaths() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { revalidatePath } = require("next/cache") as typeof import("next/cache");
    revalidatePath("/");
    revalidatePath("/shop", "layout");
    revalidatePath("/admin/staging");
    revalidatePath("/admin/inventory");
  } catch {
    // Outside a request context (ad-hoc script). The DB is the source of
    // truth; the next render reads fresh.
  }
}

// ----- PUBLIC READS (anon, published only) -----

type PublishedFilter = { brand?: Brand; category?: Category };

async function queryPublished(filter: PublishedFilter = {}): Promise<CatalogItem[]> {
  if (!CONFIGURED) {
    return SEED_ITEMS.filter(
      (it) =>
        it.status === "published" &&
        (filter.brand === undefined || it.brand === filter.brand) &&
        (filter.category === undefined || it.category === filter.category),
    );
  }
  let q = publicClient().from("items").select("data").eq("status", "published");
  if (filter.brand !== undefined) q = q.eq("brand", filter.brand);
  if (filter.category !== undefined) q = q.eq("category", filter.category);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) throw new Error(`items query failed: ${error.message}`);
  return rowsToItems(data);
}

export async function listPublished(): Promise<CatalogItem[]> {
  return queryPublished();
}

export async function byBrand(brand: Brand): Promise<CatalogItem[]> {
  return queryPublished({ brand });
}

export async function byCategory(brand: Brand, category: Category): Promise<CatalogItem[]> {
  return queryPublished({ brand, category });
}

/** Public lookup — published items only (storefront product page). */
export async function findPublished(sku: string): Promise<CatalogItem | undefined> {
  if (!CONFIGURED) return SEED_ITEMS.find((it) => it.sku === sku && it.status === "published");
  const { data, error } = await publicClient()
    .from("items")
    .select("data")
    .eq("status", "published")
    .eq("sku", sku)
    .maybeSingle();
  if (error) throw new Error(`findPublished: ${error.message}`);
  return data ? (data.data as CatalogItem) : undefined;
}

// ----- ADMIN READS (authenticated staff, any status) -----

async function listByStatus(status: ItemStatus): Promise<CatalogItem[]> {
  if (!CONFIGURED) return SEED_ITEMS.filter((it) => it.status === status);
  const supabase = await sessionClient();
  const { data, error } = await supabase
    .from("items")
    .select("data")
    .eq("status", status)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`listByStatus(${status}): ${error.message}`);
  return rowsToItems(data);
}

export async function listDrafts(): Promise<CatalogItem[]> {
  return listByStatus("draft");
}

export async function listStaged(): Promise<CatalogItem[]> {
  return listByStatus("staged");
}

/** Admin lookup — any status. Uses the authenticated session client. */
export async function findBySku(sku: string): Promise<CatalogItem | undefined> {
  if (!CONFIGURED) return SEED_ITEMS.find((it) => it.sku === sku);
  const supabase = await sessionClient();
  const { data, error } = await supabase
    .from("items")
    .select("data")
    .eq("sku", sku)
    .maybeSingle();
  if (error) throw new Error(`findBySku: ${error.message}`);
  return data ? (data.data as CatalogItem) : undefined;
}

// ----- WRITES (authenticated staff only) -----

export type CreateDraftInput = Omit<CatalogItem, "status" | "createdAt"> & {
  status?: ItemStatus;
};

export async function createDraft(input: CreateDraftInput): Promise<CatalogItem> {
  mustBeConfigured("createDraft");
  const item: CatalogItem = {
    ...input,
    status: input.status ?? "draft",
    createdAt: new Date().toISOString(),
  };
  const supabase = await sessionClient();
  const { error } = await supabase.from("items").insert({
    sku: item.sku,
    status: item.status,
    brand: item.brand,
    category: item.category,
    data: item,
  });
  if (error) {
    if (error.code === "23505") throw new Error(`createDraft: SKU "${item.sku}" already exists`);
    throw new Error(`createDraft: ${error.message}`);
  }
  bustPaths();
  return item;
}

export async function setStatus(sku: string, status: ItemStatus): Promise<CatalogItem> {
  mustBeConfigured("setStatus");
  const existing = await findBySku(sku);
  if (!existing) throw new Error(`setStatus: no item with sku "${sku}"`);
  const next: CatalogItem = { ...existing, status };
  const supabase = await sessionClient();
  const { error } = await supabase.from("items").update({ status, data: next }).eq("sku", sku);
  if (error) throw new Error(`setStatus: ${error.message}`);
  bustPaths();
  return next;
}

export async function updateItem(sku: string, partial: Partial<CatalogItem>): Promise<CatalogItem> {
  mustBeConfigured("updateItem");
  const existing = await findBySku(sku);
  if (!existing) throw new Error(`updateItem: no item with sku "${sku}"`);
  // sku is immutable; merge everything else into the canonical jsonb.
  const next: CatalogItem = { ...existing, ...partial, sku: existing.sku };
  const supabase = await sessionClient();
  const { error } = await supabase
    .from("items")
    .update({
      status: next.status,
      brand: next.brand,
      category: next.category,
      data: next,
    })
    .eq("sku", sku);
  if (error) throw new Error(`updateItem: ${error.message}`);
  bustPaths();
  return next;
}

export async function deleteItem(sku: string): Promise<void> {
  mustBeConfigured("deleteItem");
  const supabase = await sessionClient();
  const { error } = await supabase.from("items").delete().eq("sku", sku);
  if (error) throw new Error(`deleteItem: ${error.message}`);
  bustPaths();
}

// internal — for tooling/tests
export { SEED_ITEMS };
