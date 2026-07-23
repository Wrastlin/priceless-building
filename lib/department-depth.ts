/**
 * Selection copy for shop departments. Qualitative prose informed by the
 * walkthrough; no quantity chips on the storefront.
 */
import type { Category } from "@/lib/items/types";

export type DepartmentDepth = {
  /** Short mosaic / eyebrow line */
  headline: string;
  /** Supporting sentence for heroes and category pages */
  detail: string;
};

const DEPTH: Record<Category, DepartmentDepth> = {
  doors: {
    headline: "Wide selection",
    detail:
      "Interior slabs, pre-hungs, exterior and patio, bifolds, and one-of-a-kind glass finds, from everyday pieces through premium.",
  },
  windows: {
    headline: "Aisles of options",
    detail:
      "Double-hung, casement, wood-framed, and specialty shapes. New-in-box brands like JELD-WEN, Andersen, and Thermo-Tech.",
  },
  cabinets: {
    headline: "Kitchen & bath depth",
    detail:
      "12\" uppers, 24\" bases, door parts, and full kitchen runs, from surplus stock through Builders Corner custom.",
  },
  vanities: {
    headline: "Floor models & tops",
    detail:
      "18\" and 21\" baths up through doubles: floor models, cultured-marble tops, and vessel sinks ready to install.",
  },
  countertops: {
    headline: "Slabs & remnants",
    detail:
      "Butcher block by the stack, laminate remnants, quartz and granite. The deals shoppers keep talking about.",
  },
  hardware: {
    headline: "Finishing pieces",
    detail:
      "Locksets, pulls, hinges, and fasteners: Schlage, Kwikset, Amerock, GRK, and new-in-box overstock.",
  },
  lighting: {
    headline: "Fixtures on display",
    detail:
      "Chandeliers, pendants, vanity bars, and ceiling fans hanging across the warehouse, from statement pieces to workhorse fixtures.",
  },
  trim: {
    headline: "Millwork & moldings",
    detail:
      "Casing, base, crown, dowels, newels, and balusters, primed stock ready for the job.",
  },
};

export const DEPARTMENT_DEPTH: Record<Category, DepartmentDepth> = DEPTH;

/**
 * Supporting stills for the department feature band (lead + two sides).
 * Doors / vanities / lighting use placement scenes + mood stills (all still).
 * Other departments keep real warehouse aisle photos until placements exist.
 * Never mix video into this band.
 */
export function departmentFeaturePhotos(category: Category): string[] {
  const P = "/real-photos/placements";
  const M = "/real-photos/mood-stills";

  const extras: Partial<Record<Category, string[]>> = {
    doors: [
      `${P}/craftsman.jpg`,
      `${P}/barndoor.jpg`,
      `${M}/detail-arched8-dusk.jpg`,
    ],
    windows: [
      "/real-photos/business/floor-window-aisle-warehouse.jpg",
      "/real-photos/business/floor-wood-doublehung-arched-windows.jpg",
      "/real-photos/business/floor-windows-stacked-blue-rack.jpg",
    ],
    cabinets: [
      "/real-photos/business/white-base-cabinets-warehouse.jpg",
      "/real-photos/business/floor-white-and-wood-cabinet-displays.jpg",
      "/real-photos/business/dark-base-cabinets-warehouse-row.jpg",
    ],
    vanities: [
      `${P}/espressovanity.jpg`,
      `${P}/floralbowl.jpg`,
      `${M}/detail-copper-macro.jpg`,
    ],
    countertops: [
      "/real-photos/business/floor-butcher-block-rack-stacks.jpg",
      "/real-photos/business/floor-live-edge-wood-slabs.jpg",
      "/real-photos/business/floor-countertop-remnant-panels.jpg",
    ],
    hardware: [
      "/real-photos/business/floor-door-hardware-lock-shelves.jpg",
      "/real-photos/business/floor-fasteners-grk-simpson-display.jpg",
    ],
    lighting: [
      `${P}/candelabra.jpg`,
      `${P}/sputnik.jpg`,
      `${M}/detail-globe-macro.jpg`,
    ],
    trim: [
      "/real-photos/business/floor-lumber-millwork-room.jpg",
      "/real-photos/business/floor-trim-molding-extrusions-rack.jpg",
      "/real-photos/business/floor-stair-newels-and-balusters.jpg",
    ],
  };
  return extras[category] ?? [];
}
