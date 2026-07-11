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
    image: "/real-photos/legacy/install-french-doors-exterior.webp",
    blurb: "Interior, exterior, slabs, pre-hung. Solid-core and reclaimed.",
  },
  windows: {
    label: "Windows",
    image: "/real-photos/business/black-framed-windows-warehouse.jpg",
    blurb: "Double-hung, casement, picture, sliders. New and surplus.",
  },
  cabinets: {
    label: "Cabinets",
    image: "/real-photos/builders-corner-hero.jpg",
    blurb: "Stock kitchen runs to full-overlay custom Builders Corner sets.",
  },
  vanities: {
    label: "Vanities",
    image: "/real-photos/business/dark-double-vanity-bathroom-install.jpg",
    blurb: "30\" to 72\". Quartz tops, soft-close, ready to install.",
  },
  countertops: {
    label: "Countertops",
    image: "/real-photos/foursquared/kitchen-counter-marble-detail.jpg",
    blurb: "Quartz, granite and butcher block. Remnants and full slabs.",
  },
  hardware: {
    label: "Hardware",
    image: "/real-photos/business/intake-brushed-gold-cabinet-pulls.jpg",
    blurb: "Pulls, hinges, latches, casters. New-in-box from contractor overstock.",
  },
  lighting: {
    label: "Lighting",
    image: "/real-photos/business/red-sputnik-chandelier.jpg",
    blurb: "Pendants, sconces, vanity bars, recessed cans.",
  },
  trim: {
    label: "Trim & Millwork",
    image: "/real-photos/legacy/store-interior-trim-lumber-aisle.webp",
    blurb: "Casing, base, crown. Primed and ready.",
  },
};
