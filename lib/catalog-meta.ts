/**
 * Pure catalog metadata — no runtime data-layer deps, no server-only
 * imports. Safe to import from client components, server components, or
 * edge.
 *
 * The department definitions (label, hero image, blurb) and the shared
 * item types live here so a client component (e.g. the main menu) can use
 * them WITHOUT pulling in `lib/items/store` and its server-only Supabase
 * client (which imports `next/headers` and cannot exist in a client
 * bundle).
 */
import type { Category } from "@/lib/items/types";

export type { CatalogItem, Category, Brand, ItemStatus } from "@/lib/items/types";

export const CATEGORIES: Record<Category, { label: string; image: string; blurb: string }> = {
  doors: {
    label: "Doors",
    image: "/real-photos/business/craftsman-door-warehouse.jpg",
    blurb: "Interior, exterior, slabs, pre-hung. Solid-core and reclaimed.",
  },
  windows: {
    label: "Windows",
    image: "/real-photos/business/black-framed-windows-warehouse.jpg",
    blurb: "Double-hung, casement, picture, sliders. New and surplus.",
  },
  cabinets: {
    label: "Cabinets",
    image: "/real-photos/business/warehouse-cabinet-display.jpg",
    blurb: "Stock kitchen runs to full-overlay custom Builders Corner sets.",
  },
  vanities: {
    label: "Vanities",
    image: "/real-photos/business/bathroom-vanities-warehouse-display.jpg",
    blurb: "30\" to 72\". Quartz tops, soft-close, ready to install.",
  },
  countertops: {
    label: "Countertops",
    image: "/real-photos/business/discount-countertop-slabs.jpg",
    blurb: "Quartz, granite and butcher block. Remnants and full slabs.",
  },
  hardware: {
    label: "Hardware",
    image: "/test-images/07-cabinet-hardware-brushed-brass.jpg",
    blurb: "Pulls, hinges, latches, casters. New-in-box from contractor overstock.",
  },
  lighting: {
    label: "Lighting",
    image: "/real-photos/business/warehouse-lighting-inventory.jpg",
    blurb: "Pendants, sconces, vanity bars, recessed cans.",
  },
  trim: {
    label: "Trim & Millwork",
    image: "/real-photos/business/paint-supplies-shelves.jpg",
    blurb: "Casing, base, crown. Primed and ready.",
  },
};
