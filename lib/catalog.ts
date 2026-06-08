/**
 * Legacy catalog facade.
 *
 * The data layer moved to `lib/items/store.ts` (file-backed, status
 * aware). This module re-exports the SYNC reads so every existing
 * callsite — `byBrand`, `byCategory`, `findItem`, `CATALOG`,
 * `CATEGORIES` — keeps compiling unchanged.
 *
 * Important: `CATALOG`, `byBrand`, and `byCategory` now return only
 * PUBLISHED items. Drafts and staged items live in /admin/staging.
 */
import {
  listPublished,
  findBySku,
  byBrand as _byBrand,
  byCategory as _byCategory,
} from "@/lib/items/store";

export type { CatalogItem, Category, Brand, ItemStatus } from "@/lib/items/store";
import type { Category } from "@/lib/items/store";

export const CATEGORIES: Record<Category, { label: string; image: string; blurb: string }> = {
  doors: {
    label: "Doors",
    image: "/real-photos/store-interior-jeldwen-aisle.webp",
    blurb: "Interior, exterior, slabs, pre-hung. Solid-core and reclaimed.",
  },
  windows: {
    label: "Windows",
    image: "/real-photos/store-interior-window-andersen.webp",
    blurb: "Double-hung, casement, picture, sliders. New and surplus.",
  },
  cabinets: {
    label: "Cabinets",
    image: "/real-photos/store-interior-warehouse.webp",
    blurb: "Stock kitchen runs to full-overlay custom Builders Corner sets.",
  },
  vanities: {
    label: "Vanities",
    image: "/real-photos/store-interior-vanity-display.webp",
    blurb: "30\" to 72\". Quartz tops, soft-close, ready to install.",
  },
  countertops: {
    label: "Countertops",
    image: "/test-images/19-calacatta-quartz-slab.jpg",
    blurb: "Quartz, granite and butcher block. Remnants and full slabs.",
  },
  hardware: {
    label: "Hardware",
    image: "/test-images/07-cabinet-hardware-brushed-brass.jpg",
    blurb: "Pulls, hinges, latches, casters. New-in-box from contractor overstock.",
  },
  lighting: {
    label: "Lighting",
    image: "/test-images/10-flush-mount-light.jpg",
    blurb: "Pendants, sconces, vanity bars, recessed cans.",
  },
  trim: {
    label: "Trim & Millwork",
    image: "/test-images/08-painted-trim-stack.jpg",
    blurb: "Casing, base, crown. Primed and ready.",
  },
};

/**
 * The full set of PUBLISHED catalog items. Drafts and staged items
 * are intentionally filtered out — request them from
 * `listDrafts()` / `listStaged()` directly if you need them in admin.
 *
 * Implemented as a getter via Proxy-style getter so it stays sync but
 * always reflects the current store state (after writes).
 */
export const CATALOG = new Proxy([] as ReturnType<typeof listPublished>, {
  get(_target, prop) {
    const live = listPublished();
    // Return underlying array's property — forwards length, map,
    // filter, find, iteration protocol, indexed access, etc.
    const value = (live as unknown as Record<string | symbol, unknown>)[prop as string];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(live) : value;
  },
  has(_t, prop) {
    return prop in listPublished();
  },
  ownKeys() {
    return Reflect.ownKeys(listPublished());
  },
  getOwnPropertyDescriptor(_t, prop) {
    return Object.getOwnPropertyDescriptor(listPublished(), prop);
  },
}) as ReturnType<typeof listPublished>;

export function byBrand(brand: Parameters<typeof _byBrand>[0]) {
  return _byBrand(brand);
}

export function byCategory(brand: Parameters<typeof _byCategory>[0], category: Parameters<typeof _byCategory>[1]) {
  return _byCategory(brand, category);
}

export function findItem(sku: string) {
  return findBySku(sku);
}
