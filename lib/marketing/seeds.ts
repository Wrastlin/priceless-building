/**
 * Marketing seed helpers — pure type module, no runtime deps.
 *
 * A "seed" is a floor item whose store photos feed the ad-kit pipeline
 * (studio master → cutout → placements → feed post / micro / motion clip).
 * The compounding-library rule: one permanent slug per product across every
 * marketing folder and manifest, minted once and never renamed.
 */
import type { CatalogItem, MarketingSeedStatus } from "@/lib/items/types";

/** Mint the library slug: up to four title words + the sku, lowercased. */
export function marketingSlugFor(item: Pick<CatalogItem, "sku" | "title">): string {
  const words = item.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w && w !== "untitled")
    .slice(0, 4);
  const sku = item.sku.toLowerCase();
  const base = words.join("-");
  return base ? `${base}-${sku}` : sku;
}

/** True when the item can seed the pipeline (has at least one real photo). */
export function isSeedable(item: CatalogItem): boolean {
  return (item.photos?.length ?? 0) > 0 || !!item.image;
}

/**
 * True for items that came from a real capture (intake or import), not the
 * demo catalogs: the sandbox loader stamps createdBy "sandbox", and the fake
 * 40-SKU seed catalog has no createdAt at all.
 */
export function isRealCapture(item: CatalogItem): boolean {
  return !!item.createdAt && item.createdBy !== "sandbox";
}

/** Effective queue status — items never marked are "new" seeds. */
export function seedStatus(item: CatalogItem): MarketingSeedStatus {
  return item.marketing?.status ?? "new";
}

/** Deliverable classes the pipeline ships, in library order. */
export const DELIVERABLE_CLASSES = [
  "master",
  "cutout",
  "placement",
  "feed-post",
  "plate",
  "micro",
  "motion-clip",
  "sell-sheet",
] as const;
