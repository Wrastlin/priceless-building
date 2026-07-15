/**
 * Maps each walkthrough product type to a real, clean store photo so the
 * department inventory can be shown image-first (a Menards-style product
 * grid) instead of a wall of text. Photos prefer the July 2026 floor
 * inventory shoot (`floor-*`) where one fits, then older warehouse shots
 * and studio-clean test-images.
 *
 * Any type without an explicit photo falls back to the department hero, so
 * every inventory card is guaranteed to render an image. Type names must
 * match WALKTHROUGH_INVENTORY exactly.
 */
import { CATEGORIES, type Category } from "@/lib/catalog-meta";

const TYPE_PHOTOS: Partial<Record<Category, Record<string, string>>> = {
  doors: {
    "Interior door": "/real-photos/business/floor-six-panel-oak-door-aisle.jpg",
    "Exterior door": "/real-photos/business/floor-arched-eight-panel-door.jpg",
    "Bifold door": "/test-images/11-reclaimed-pine-door.jpg",
    "Door slab (unfinished)": "/real-photos/business/floor-door-inventory-ten-lite-rows.jpg",
    "Glass-panel door": "/real-photos/business/floor-dark-espresso-four-lite-doors.jpg",
    "Prehung door": "/real-photos/business/floor-door-aisle-light-and-dark.jpg",
    "Door frame / jamb": "/real-photos/business/unfinished-wood-doors-stock.jpg",
    "Patio / sliding door": "/real-photos/business/floor-barn-door-diamond-glass.jpg",
  },
  windows: {
    "Double-hung window": "/real-photos/business/floor-wood-doublehung-arched-windows.jpg",
    "Casement / vinyl window": "/real-photos/business/floor-thermotech-tan-grid-windows.jpg",
    "Window unit": "/real-photos/business/floor-window-aisle-warehouse.jpg",
    "Wood-framed window": "/real-photos/business/floor-wood-doublehung-arched-windows.jpg",
    "Window (wrapped/new)": "/real-photos/business/floor-jeldwen-boxed-windows.jpg",
    "Arched / round window": "/real-photos/business/floor-windows-stacked-blue-rack.jpg",
  },
  cabinets: {
    "Base cabinet": "/real-photos/business/white-base-cabinets-warehouse.jpg",
    "Wall cabinet": "/real-photos/business/floor-white-and-wood-cabinet-displays.jpg",
    "Pantry / tall cabinet": "/real-photos/business/dark-base-cabinets-warehouse-row.jpg",
    "Cabinet (assorted)": "/real-photos/business/grey-cabinets-warehouse.jpg",
    "Cabinet door / part": "/real-photos/business/floor-white-and-wood-cabinet-displays.jpg",
  },
  vanities: {
    "Vanity base cabinet": "/real-photos/business/floor-vanity-floor-models-row.jpg",
    "Vanity top w/ sink": "/real-photos/business/floor-vanity-tops-aisle.jpg",
  },
  countertops: {
    "Quartz countertop / sample": "/test-images/19-calacatta-quartz-slab.jpg",
    "Granite / stone countertop": "/real-photos/business/floor-countertop-remnant-panels.jpg",
    "Laminate countertop": "/real-photos/business/floor-laminate-countertop-slabs.jpg",
    "Countertop (assorted)": "/real-photos/business/floor-cultured-marble-vanity-tops.jpg",
    "Butcher block / wood top": "/real-photos/business/floor-butcher-block-rack-stacks.jpg",
  },
  hardware: {
    "Hardware (assorted)": "/real-photos/business/floor-fasteners-grk-simpson-display.jpg",
    "Cabinet pulls / knobs": "/test-images/15-matte-black-pulls.jpg",
    "Lockset / door hardware": "/real-photos/business/floor-door-hardware-lock-shelves.jpg",
  },
  lighting: {
    Chandelier: "/real-photos/business/floor-globe-crystal-chandelier.jpg",
    "Light fixture (assorted)": "/real-photos/business/warehouse-lighting-inventory.jpg",
    "Pendant light": "/real-photos/business/pendant-light-fixture-warehouse.jpg",
    "Ceiling fan": "/real-photos/business/ceiling-fan-warehouse-display.jpg",
    "Vanity / bath light": "/test-images/16-brass-vanity-bar.jpg",
    "Ceiling / hanging fixture": "/real-photos/business/hanging-light-fixture-textured-shade.jpg",
  },
  trim: {
    "Trim / molding profile": "/real-photos/business/floor-trim-molding-extrusions-rack.jpg",
    "Molding (assorted)": "/real-photos/business/floor-dowels-closet-rods-rack.jpg",
    "Crown / profile molding": "/real-photos/business/floor-lumber-millwork-room.jpg",
    "Base shoe molding": "/test-images/08-painted-trim-stack.jpg",
    "Baluster / spindle": "/real-photos/business/floor-stair-newels-and-balusters.jpg",
    "Newel post": "/real-photos/business/floor-stair-newel-posts-closeup.jpg",
  },
};

/** Best real photo for a product type, falling back to the department hero. */
export function typePhoto(category: string, typeName: string): string {
  const dept = TYPE_PHOTOS[category as Category];
  return (
    (dept && dept[typeName]) ||
    CATEGORIES[category as Category]?.image ||
    "/real-photos/logo-priceless-clean.webp"
  );
}

/**
 * Extra on-topic photos per department, used to fill product types that
 * have no type-specific photo (or whose photo was already taken by an
 * earlier type). Every entry here is distinct from the type-specific map
 * and from the department hero.
 */
const DEPT_EXTRA: Partial<Record<Category, string[]>> = {
  doors: [
    "/real-photos/business/floor-arched-iron-studded-doors.jpg",
    "/real-photos/business/floor-door-aisle-light-and-dark.jpg",
    "/real-photos/business/floor-door-inventory-ten-lite-rows.jpg",
    "/real-photos/business/brown-exterior-door-decorative-glass.jpg",
  ],
  windows: [
    "/real-photos/business/floor-windows-stacked-blue-rack.jpg",
    "/real-photos/business/floor-jeldwen-boxed-windows.jpg",
    "/real-photos/business/floor-thermotech-tan-grid-windows.jpg",
    "/real-photos/business/black-framed-windows-warehouse.jpg",
  ],
  cabinets: [
    "/real-photos/business/floor-white-and-wood-cabinet-displays.jpg",
    "/real-photos/business/white-base-cabinets-warehouse.jpg",
    "/real-photos/business/grey-cabinets-warehouse.jpg",
    "/real-photos/business/dark-base-cabinets-warehouse-row.jpg",
  ],
  vanities: [
    "/real-photos/business/floor-double-vanity-top-on-barrels.jpg",
    "/real-photos/business/floor-vanity-row-high-angle.jpg",
    "/real-photos/business/floor-white-vessel-sink-black-table.jpg",
    "/real-photos/business/floor-vanity-tops-and-oak-cabinets.jpg",
    "/real-photos/business/floor-vanity-tops-underside-aisle.jpg",
  ],
  countertops: [
    "/real-photos/business/floor-live-edge-wood-slabs.jpg",
    "/real-photos/business/floor-countertop-remnant-panels.jpg",
    "/real-photos/business/intake-butcher-block-stacks.jpg",
    "/real-photos/business/warehouse-countertop-slabs.jpg",
  ],
  hardware: [
    "/real-photos/business/floor-fasteners-grk-simpson-display.jpg",
    "/real-photos/business/floor-door-hardware-lock-shelves.jpg",
  ],
  lighting: [
    "/real-photos/business/red-sputnik-chandelier.jpg",
    "/real-photos/business/crystal-ceiling-fan-warehouse.jpg",
    "/real-photos/business/decorative-light-fixture-warehouse.jpg",
    "/real-photos/business/intake-crystal-candelabra-chandelier.jpg",
  ],
  trim: [
    "/real-photos/business/floor-dowels-closet-rods-rack.jpg",
    "/real-photos/business/floor-stair-newels-and-balusters.jpg",
    "/real-photos/business/floor-stair-newel-posts-closeup.jpg",
    "/real-photos/business/floor-trim-molding-extrusions-rack.jpg",
  ],
};

/**
 * Assign each product type a photo that is UNIQUE within the returned set
 * (no photo is ever repeated in the same section). Tries the type-specific
 * photo first, then the department's extra pool. Returns null for a type
 * when no unused on-topic photo is left — the caller renders that type
 * without an image rather than repeating one.
 *
 * `seed` marks photos already shown elsewhere in the same section (e.g. a
 * department hero) so thumbnails never echo them.
 */
export function assignUniquePhotos(
  category: string,
  typeNames: string[],
  seed: string[] = [],
): (string | null)[] {
  const cat = category as Category;
  const used = new Set(seed);
  const extra = [...(DEPT_EXTRA[cat] ?? [])];
  const specific = TYPE_PHOTOS[cat] ?? {};
  return typeNames.map((name) => {
    const pref = specific[name];
    if (pref && !used.has(pref)) {
      used.add(pref);
      return pref;
    }
    while (extra.length) {
      const cand = extra.shift()!;
      if (!used.has(cand)) {
        used.add(cand);
        return cand;
      }
    }
    return null;
  });
}
