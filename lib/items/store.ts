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
import { unstable_cache } from "next/cache";
import type { CatalogItem, Brand, Category, ItemStatus } from "@/lib/items/types";
import { SEED_ITEMS } from "@/lib/items/seed";
import { publicClient } from "@/lib/supabase/public";

export type { CatalogItem, Brand, Category, ItemStatus } from "@/lib/items/types";

const CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Sandbox demo mode. When NEXT_PUBLIC_SANDBOX=1 every read/write is served
 * from the in-memory sandbox catalog (sandbox/catalog.json) instead of
 * Supabase, so the filled demo store renders and the admin is interactive
 * WITHOUT touching the real database or any payment path. Off by default.
 */
const SANDBOX = process.env.NEXT_PUBLIC_SANDBOX === "1";

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
    // These path revalidations also purge the data cache behind the paginated
    // storefront grids (the `unstable_cache` reads below run during these
    // routes' render), so a publish/price edit shows up without waiting out
    // the 1-hour TTL.
    revalidatePath("/");
    revalidatePath("/shop", "layout");
    // Explicitly revalidate the DYNAMIC product + category routes by their
    // route pattern. Without these, a "/shop", "layout" revalidation does
    // not reliably reach the nested /shop/[category] and /shop/item/[sku]
    // pages, so a newly published item or a price/copy edit would serve
    // stale (or 404) on the detail page until the next deploy.
    revalidatePath("/shop/[category]", "page");
    revalidatePath("/shop/item/[sku]", "page");
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
  if (SANDBOX) {
    const { getSandboxItems } = await import("@/lib/items/sandbox-data");
    return getSandboxItems().filter(
      (it) =>
        it.status === "published" &&
        (filter.brand === undefined || it.brand === filter.brand) &&
        (filter.category === undefined || it.category === filter.category),
    );
  }
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

// Cached, tag-revalidated full-list read. Routes every non-paginated
// storefront read (home featured pool, "similar items", brand/category lists)
// through one cache so a render doesn't re-pull the whole catalog on every
// request. null = "no filter" so the cache key serializes.
const cachedList = unstable_cache(
  (brand: Brand | null, category: Category | null) =>
    queryPublished({ brand: brand ?? undefined, category: category ?? undefined }),
  ["published-list"],
  { tags: ["items"], revalidate: 3600 },
);

export async function listPublished(): Promise<CatalogItem[]> {
  return cachedList(null, null);
}

/** Published items flagged featured (the home-page featured pool). */
export async function listFeatured(): Promise<CatalogItem[]> {
  return (await cachedList(null, null)).filter((it) => it.featured === true);
}

// ----- PAGINATED PUBLIC READS (big-box style: one page of rows at a time) -----
//
// The storefront grids (/shop, /shop/[category], /search) used to render the
// ENTIRE published catalog at once — thousands of cards + full-size images,
// which locked up the browser. These reads fetch a single page of rows
// (default 24, matching Home Depot's per-page count) and the results are
// cached + tag-revalidated so a category view is cheap and stays static
// between inventory writes.

export const DEFAULT_PAGE_SIZE = 24;

export type Page<T> = {
  items: T[];
  /** Total matching published items across all pages. */
  total: number;
  /** 1-based, clamped to >= 1. */
  page: number;
  pageSize: number;
  totalPages: number;
};

function matchesFilter(filter: PublishedFilter) {
  return (it: CatalogItem) =>
    it.status === "published" &&
    (filter.brand === undefined || it.brand === filter.brand) &&
    (filter.category === undefined || it.category === filter.category);
}

function paginateArray(all: CatalogItem[], page: number, pageSize: number): Page<CatalogItem> {
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = (safePage - 1) * pageSize;
  return { items: all.slice(from, from + pageSize), total, page: safePage, pageSize, totalPages };
}

async function queryPublishedPage(
  filter: PublishedFilter,
  page: number,
  pageSize: number,
): Promise<Page<CatalogItem>> {
  if (SANDBOX) {
    const { getSandboxItems } = await import("@/lib/items/sandbox-data");
    return paginateArray(getSandboxItems().filter(matchesFilter(filter)), page, pageSize);
  }
  if (!CONFIGURED) {
    return paginateArray(SEED_ITEMS.filter(matchesFilter(filter)), page, pageSize);
  }
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;
  let q = publicClient().from("items").select("data", { count: "exact" }).eq("status", "published");
  if (filter.brand !== undefined) q = q.eq("brand", filter.brand);
  if (filter.category !== undefined) q = q.eq("category", filter.category);
  const { data, count, error } = await q.order("created_at", { ascending: false }).range(from, to);
  if (error) throw new Error(`items page query failed: ${error.message}`);
  const total = count ?? 0;
  return {
    items: rowsToItems(data),
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

async function queryCount(filter: PublishedFilter): Promise<number> {
  if (SANDBOX) {
    const { getSandboxItems } = await import("@/lib/items/sandbox-data");
    return getSandboxItems().filter(matchesFilter(filter)).length;
  }
  if (!CONFIGURED) return SEED_ITEMS.filter(matchesFilter(filter)).length;
  let q = publicClient()
    .from("items")
    .select("sku", { count: "exact", head: true })
    .eq("status", "published");
  if (filter.brand !== undefined) q = q.eq("brand", filter.brand);
  if (filter.category !== undefined) q = q.eq("category", filter.category);
  const { count, error } = await q;
  if (error) throw new Error(`items count failed: ${error.message}`);
  return count ?? 0;
}

// Cached, tag-revalidated wrappers. A page fetches ONE page of rows and the
// result is cached under the "items" tag until an admin write busts it
// (see bustPaths). null is used for "no filter" so the cache key serializes.
const cachedPage = unstable_cache(
  (brand: Brand | null, category: Category | null, page: number, pageSize: number) =>
    queryPublishedPage({ brand: brand ?? undefined, category: category ?? undefined }, page, pageSize),
  ["published-page"],
  { tags: ["items"], revalidate: 3600 },
);

const cachedCount = unstable_cache(
  (brand: Brand | null, category: Category | null) =>
    queryCount({ brand: brand ?? undefined, category: category ?? undefined }),
  ["published-count"],
  { tags: ["items"], revalidate: 3600 },
);

/** One page of published items, cheapest read for the storefront grids. */
export async function listPublishedPage(opts: {
  brand?: Brand;
  category?: Category;
  page?: number;
  pageSize?: number;
}): Promise<Page<CatalogItem>> {
  const { brand = null, category = null, page = 1, pageSize = DEFAULT_PAGE_SIZE } = opts;
  return cachedPage(brand, category, page, pageSize);
}

/** Total count of published items matching the filter (for headers/metadata). */
export async function countPublished(opts: { brand?: Brand; category?: Category } = {}): Promise<number> {
  const { brand = null, category = null } = opts;
  return cachedCount(brand, category);
}

export async function byBrand(brand: Brand): Promise<CatalogItem[]> {
  return cachedList(brand, null);
}

export async function byCategory(brand: Brand, category: Category): Promise<CatalogItem[]> {
  return cachedList(brand, category);
}

/** Public lookup — published items only (storefront product page). */
export async function findPublished(sku: string): Promise<CatalogItem | undefined> {
  if (SANDBOX) {
    const { sandboxFind } = await import("@/lib/items/sandbox-data");
    const it = sandboxFind(sku);
    return it && it.status === "published" ? it : undefined;
  }
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
  if (SANDBOX) {
    const { getSandboxItems } = await import("@/lib/items/sandbox-data");
    return getSandboxItems().filter((it) => it.status === status);
  }
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

/** Sold items (status = 'sold'). Used by the velocity dashboard. */
export async function listSold(): Promise<CatalogItem[]> {
  return listByStatus("sold");
}

/** Admin lookup — any status. Uses the authenticated session client. */
export async function findBySku(sku: string): Promise<CatalogItem | undefined> {
  if (SANDBOX) {
    const { sandboxFind } = await import("@/lib/items/sandbox-data");
    return sandboxFind(sku);
  }
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
  const item: CatalogItem = {
    ...input,
    status: input.status ?? "draft",
    createdAt: new Date().toISOString(),
  };
  if (SANDBOX) {
    const { sandboxUpsert } = await import("@/lib/items/sandbox-data");
    sandboxUpsert(item);
    bustPaths();
    return item;
  }
  mustBeConfigured("createDraft");
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
  if (SANDBOX) {
    const { sandboxFind, sandboxUpsert } = await import("@/lib/items/sandbox-data");
    const existing = sandboxFind(sku);
    if (!existing) throw new Error(`setStatus: no item with sku "${sku}"`);
    const next: CatalogItem = { ...existing, status };
    sandboxUpsert(next);
    bustPaths();
    return next;
  }
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
  if (SANDBOX) {
    const { sandboxFind, sandboxUpsert } = await import("@/lib/items/sandbox-data");
    const existing = sandboxFind(sku);
    if (!existing) throw new Error(`updateItem: no item with sku "${sku}"`);
    const next: CatalogItem = { ...existing, ...partial, sku: existing.sku };
    sandboxUpsert(next);
    bustPaths();
    return next;
  }
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
  if (SANDBOX) {
    const { sandboxDelete } = await import("@/lib/items/sandbox-data");
    sandboxDelete(sku);
    bustPaths();
    return;
  }
  mustBeConfigured("deleteItem");
  const supabase = await sessionClient();
  const { error } = await supabase.from("items").delete().eq("sku", sku);
  if (error) throw new Error(`deleteItem: ${error.message}`);
  bustPaths();
}

// internal — for tooling/tests
export { SEED_ITEMS };
