/**
 * Feature gate for individual SKU product grids on the public storefront.
 *
 * Until real tagged inventory is ready, the shop leads with department
 * depth (walkthrough + floor photos) and a small sample set of three
 * real intake photos (`FLOOR_SAMPLES`) instead of the sandbox/demo SKU
 * catalog. Flip full grids on with:
 *   NEXT_PUBLIC_CATALOG_LIVE=1
 */
export function isCatalogLive(): boolean {
  return process.env.NEXT_PUBLIC_CATALOG_LIVE === "1";
}
