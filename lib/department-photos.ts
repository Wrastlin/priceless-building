/**
 * Maps each walkthrough product type to a real, clean store photo so the
 * department inventory can be shown image-first (a Menards-style product
 * grid) instead of a wall of text. Photos are the studio-clean test-images
 * where one exists, otherwise a real warehouse shot from the FB/IG archive.
 *
 * Any type without an explicit photo falls back to the department hero, so
 * every inventory card is guaranteed to render an image. Type names must
 * match WALKTHROUGH_INVENTORY exactly.
 */
import { CATEGORIES, type Category } from "@/lib/catalog-meta";

const TYPE_PHOTOS: Partial<Record<Category, Record<string, string>>> = {
  doors: {
    "Interior door": "/test-images/01-interior-door-shaker.jpg",
    "Exterior door": "/test-images/02-exterior-door-black-steel.jpg",
    "Bifold door": "/test-images/11-reclaimed-pine-door.jpg",
    "Door slab (unfinished)": "/real-photos/business/knotty-pine-6-panel-door.jpg",
    "Glass-panel door": "/real-photos/business/wood-look-exterior-door-glass-insert.jpg",
    "Prehung door": "/real-photos/business/craftsman-door-warehouse.jpg",
    "Door frame / jamb": "/real-photos/business/unfinished-wood-doors-stock.jpg",
    "Patio / sliding door": "/real-photos/business/wrapped-wood-glass-door.jpg",
  },
  windows: {
    "Double-hung window": "/test-images/06-double-hung-window.jpg",
    "Casement / vinyl window": "/test-images/12-black-casement-window.jpg",
    "Window unit": "/real-photos/business/warehouse-assorted-windows.jpg",
    "Wood-framed window": "/real-photos/business/warehouse-assorted-windows.jpg",
    "Window (wrapped/new)": "/real-photos/business/black-framed-windows-warehouse.jpg",
    "Arched / round window": "/real-photos/business/warehouse-assorted-windows.jpg",
  },
  cabinets: {
    "Base cabinet": "/test-images/03-base-cabinet-white-shaker.jpg",
    "Wall cabinet": "/test-images/13-espresso-wall-cabinet.jpg",
    "Pantry / tall cabinet": "/test-images/04-pantry-cabinet-walnut.jpg",
    "Cabinet (assorted)": "/real-photos/business/warehouse-cabinet-display.jpg",
    "Cabinet door / part": "/real-photos/business/dark-wood-cabinets-glass-knobs.jpg",
  },
  vanities: {
    "Vanity base cabinet": "/test-images/05-vanity-single-marble-top.jpg",
    "Vanity top w/ sink": "/real-photos/business/vanity-tops-inventory.jpg",
  },
  countertops: {
    "Quartz countertop / sample": "/test-images/19-calacatta-quartz-slab.jpg",
    "Granite / stone countertop": "/real-photos/business/discount-countertop-slabs.jpg",
    "Laminate countertop": "/real-photos/business/countertop-blanks-inventory.jpg",
    "Countertop (assorted)": "/real-photos/business/warehouse-countertop-slabs.jpg",
    "Butcher block / wood top": "/real-photos/business/wood-countertop-edge-detail.jpg",
  },
  hardware: {
    "Hardware (assorted)": "/test-images/07-cabinet-hardware-brushed-brass.jpg",
    "Cabinet pulls / knobs": "/test-images/15-matte-black-pulls.jpg",
    "Lockset / door hardware": "/test-images/07-cabinet-hardware-brushed-brass.jpg",
  },
  lighting: {
    Chandelier: "/real-photos/business/red-sputnik-chandelier.jpg",
    "Light fixture (assorted)": "/real-photos/business/warehouse-lighting-inventory.jpg",
    "Pendant light": "/real-photos/business/pendant-light-fixture-warehouse.jpg",
    "Ceiling fan": "/real-photos/business/ceiling-fan-warehouse-display.jpg",
    "Vanity / bath light": "/test-images/16-brass-vanity-bar.jpg",
    "Ceiling / hanging fixture": "/real-photos/business/hanging-light-fixture-textured-shade.jpg",
  },
  trim: {
    "Trim / molding profile": "/test-images/08-painted-trim-stack.jpg",
    "Molding (assorted)": "/test-images/08-painted-trim-stack.jpg",
    "Crown / profile molding": "/test-images/08-painted-trim-stack.jpg",
    "Base shoe molding": "/test-images/08-painted-trim-stack.jpg",
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
    "/real-photos/business/brown-exterior-door-decorative-glass.jpg",
    "/real-photos/business/dark-wood-exterior-door-glass.jpg",
    "/real-photos/business/warehouse-unfinished-wood-doors.jpg",
    "/real-photos/business/door-inventory-collage.webp",
  ],
  windows: [],
  cabinets: [
    "/real-photos/business/white-base-cabinets-warehouse.jpg",
    "/real-photos/business/grey-cabinets-warehouse.jpg",
    "/real-photos/business/light-wood-cabinet-display.jpg",
    "/real-photos/business/dark-base-cabinets-warehouse-row.jpg",
  ],
  vanities: [
    "/real-photos/business/oak-double-vanity-warehouse.jpg",
    "/real-photos/business/dark-wood-vanities-warehouse.jpg",
    "/real-photos/business/marble-vanity-black-legs.jpg",
    "/real-photos/business/trough-sink-vanity-display.jpg",
  ],
  countertops: ["/real-photos/business/warehouse-countertop-slabs.jpg"],
  hardware: ["/real-photos/business/dark-wood-cabinets-glass-knobs.jpg"],
  lighting: [
    "/real-photos/business/crystal-ceiling-fan-warehouse.jpg",
    "/real-photos/business/decorative-light-fixture-warehouse.jpg",
  ],
  trim: [],
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
