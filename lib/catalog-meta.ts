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
 *
 * Department hero images prefer the July 2026 floor inventory shoot
 * (`floor-*` in `public/real-photos/business/`) so shop tiles show what
 * is actually on the warehouse floor right now.
 */
import type { Category } from "@/lib/items/types";

export type { CatalogItem, Category, Brand, ItemStatus } from "@/lib/items/types";

export const CATEGORIES: Record<Category, { label: string; image: string; blurb: string }> = {
  doors: {
    label: "Doors",
    image: "/real-photos/business/floor-barn-door-diamond-glass.jpg",
    blurb: "Interior, exterior, slabs, pre-hung. Solid-core and reclaimed.",
  },
  windows: {
    label: "Windows",
    image: "/real-photos/business/floor-window-aisle-warehouse.jpg",
    blurb: "Double-hung, casement, picture, sliders. New and surplus.",
  },
  cabinets: {
    label: "Cabinets",
    image: "/real-photos/business/floor-cabinet-door-sample-rack.jpg",
    blurb: "Stock kitchen runs to full-overlay custom Builders Corner sets.",
  },
  vanities: {
    label: "Vanities",
    image: "/real-photos/business/floor-vanity-row-mirrors-lights.jpg",
    blurb: "30\" to 72\". Quartz tops, soft-close, ready to install.",
  },
  countertops: {
    label: "Countertops",
    image: "/real-photos/business/floor-butcher-block-rack-stacks.jpg",
    blurb: "Quartz, granite and butcher block. Remnants and full slabs.",
  },
  hardware: {
    label: "Hardware",
    image: "/real-photos/business/floor-door-hardware-lock-shelves.jpg",
    blurb: "Pulls, hinges, latches, casters. New-in-box from contractor overstock.",
  },
  lighting: {
    label: "Lighting",
    image: "/real-photos/business/floor-globe-crystal-chandelier.jpg",
    blurb: "Pendants, sconces, vanity bars, recessed cans.",
  },
  trim: {
    label: "Trim & Millwork",
    image: "/real-photos/business/floor-lumber-millwork-room.jpg",
    blurb: "Casing, base, crown. Primed and ready.",
  },
};
