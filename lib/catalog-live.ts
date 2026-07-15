/**
 * Feature gate for individual SKU product grids on the public storefront.
 *
 * Until real tagged inventory is ready, the shop leads with department
 * depth (walkthrough + floor photos) instead of the sandbox/demo SKU
 * catalog currently published in Supabase. Flip on with:
 *   NEXT_PUBLIC_CATALOG_LIVE=1
 */
export function isCatalogLive(): boolean {
  return process.env.NEXT_PUBLIC_CATALOG_LIVE === "1";
}
