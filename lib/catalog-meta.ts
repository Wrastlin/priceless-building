/**
 * Pure catalog metadata — no runtime data-layer deps, no server-only
 * imports. Safe to import from client components, server components, or
 * edge.
 *
 * Blurbs lean on the 2026-06-11 floor walkthrough (real types, brands, and
 * tag price bands) plus July 2026 floor photography. Depth claims are
 * conservative showcase estimates — surplus moves weekly.
 */
import type { Category } from "@/lib/items/types";

export type { CatalogItem, Category, Brand, ItemStatus } from "@/lib/items/types";

export const CATEGORIES: Record<Category, { label: string; image: string; blurb: string }> = {
  doors: {
    label: "Doors",
    image: "/real-photos/business/floor-barn-door-diamond-glass.jpg",
    blurb:
      "Nearly 1,000 on the floor — interior slabs from about $25, pre-hungs, exterior & patio, bifolds, and one-of-a-kind glass finds.",
  },
  windows: {
    label: "Windows",
    image: "/real-photos/business/floor-window-aisle-warehouse.jpg",
    blurb:
      "Hundreds in stock — double-hung, casement, wood-framed, and specialty shapes. New-in-box JELD-WEN, Andersen, Thermo-Tech and more.",
  },
  cabinets: {
    label: "Cabinets",
    image: "/real-photos/business/floor-cabinet-door-sample-rack.jpg",
    blurb:
      "12\" uppers, 24\" bases, door parts, and full kitchen runs — stock surplus through Builders Corner custom.",
  },
  vanities: {
    label: "Vanities",
    image: "/real-photos/business/floor-vanity-row-mirrors-lights.jpg",
    blurb:
      "18\" and 21\" baths up through 72\" doubles — floor models, cultured-marble tops, and vessel sinks ready to install.",
  },
  countertops: {
    label: "Countertops",
    image: "/real-photos/business/floor-butcher-block-rack-stacks.jpg",
    blurb:
      "Butcher block by the stack, laminate remnants, quartz and granite — the deal shoppers rave about (yes, even $25 tops).",
  },
  hardware: {
    label: "Hardware",
    image: "/real-photos/business/floor-door-hardware-lock-shelves.jpg",
    blurb:
      "Hundreds of locksets, pulls, hinges, and fasteners — Schlage, Kwikset, Amerock, GRK, new-in-box overstock.",
  },
  lighting: {
    label: "Lighting",
    image: "/real-photos/business/floor-globe-crystal-chandelier.jpg",
    blurb:
      "Chandeliers, pendants, vanity bars, and ceiling fans hanging across the warehouse — statement pieces to workhorse fixtures.",
  },
  trim: {
    label: "Trim & Millwork",
    image: "/real-photos/business/floor-lumber-millwork-room.jpg",
    blurb:
      "Casing, base, crown, dowels, newels, and balusters — thousands of feet and pieces, primed and ready.",
  },
};
