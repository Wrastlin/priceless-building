/**
 * Catalog facade.
 *
 * The data layer lives in `lib/items/store.ts` (Supabase-backed, status
 * aware). This module re-exports the storefront reads under their familiar
 * names — `listCatalog`, `byBrand`, `byCategory`, `findItem`, `CATEGORIES`.
 *
 * These are ASYNC now (the store reads over the network), so callers must
 * `await` them. The old synchronous `CATALOG` array proxy is gone; use
 * `await listCatalog()` instead.
 *
 * Important: every read here returns only PUBLISHED items. Drafts and
 * staged items live in /admin/staging.
 */
import {
  listPublished,
  findPublished,
  byBrand as _byBrand,
  byCategory as _byCategory,
} from "@/lib/items/store";

// Pure metadata + types re-exported for convenience. Client components
// should import these straight from `@/lib/catalog-meta` to avoid pulling
// in this module's server-only data layer.
export { CATEGORIES } from "@/lib/catalog-meta";
export type { CatalogItem, Category, Brand, ItemStatus } from "@/lib/catalog-meta";

/**
 * The full set of PUBLISHED catalog items. Drafts and staged items are
 * intentionally filtered out — request them from `listDrafts()` /
 * `listStaged()` in `lib/items/store` if you need them in admin.
 */
export async function listCatalog() {
  return listPublished();
}

export function byBrand(brand: Parameters<typeof _byBrand>[0]) {
  return _byBrand(brand);
}

export function byCategory(brand: Parameters<typeof _byCategory>[0], category: Parameters<typeof _byCategory>[1]) {
  return _byCategory(brand, category);
}

export function findItem(sku: string) {
  return findPublished(sku);
}
