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
