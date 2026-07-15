/**
 * Floor sample set — three real items photographed during the inventory
 * intake pass. Shown on the storefront while the full tagged catalog is
 * still gated behind NEXT_PUBLIC_CATALOG_LIVE.
 *
 * Photos: `public/real-photos/business/intake-*.jpg` (best of the intake set).
 * Prices are "call for price" until tags are entered in admin.
 */
import type { CatalogItem } from "@/lib/items/types";

export const FLOOR_SAMPLES: CatalogItem[] = [
  {
    id: "floor-sample-door-craftsman",
    sku: "PL-FLOOR-001",
    brand: "priceless",
    category: "doors",
    status: "published",
    title: "Black Craftsman Entry Door",
    subtitle: "Solid wood · glass lite · photographed on the floor",
    price: 0,
    image: "/real-photos/business/intake-black-craftsman-door.jpg",
    badges: ["Floor sample"],
    featured: true,
    location: "Door wall",
    inStock: 1,
    manufacturer: "On the floor",
    inventoriedAt: "2026-07-08",
    captureNote: "Intake pass — real warehouse photo",
    fulfillment: { pickup: true, localDelivery: true, ships: false },
  },
  {
    id: "floor-sample-hardware-pulls",
    sku: "PL-FLOOR-002",
    brand: "priceless",
    category: "hardware",
    status: "published",
    title: "Brushed Gold Cabinet Pulls",
    subtitle: "New-in-box contractor overstock · clean product shot",
    price: 0,
    image: "/real-photos/business/intake-brushed-gold-cabinet-pulls.jpg",
    badges: ["Floor sample"],
    featured: true,
    location: "Hardware aisle",
    inStock: 1,
    manufacturer: "On the floor",
    inventoriedAt: "2026-07-08",
    captureNote: "Intake pass — real warehouse photo",
    fulfillment: { pickup: true, localDelivery: true, ships: false },
  },
  {
    id: "floor-sample-lighting-candelabra",
    sku: "PL-FLOOR-003",
    brand: "priceless",
    category: "lighting",
    status: "published",
    title: "Crystal Candelabra Chandelier",
    subtitle: "Statement fixture · hanging in the warehouse",
    price: 0,
    image: "/real-photos/business/intake-crystal-candelabra-chandelier.jpg",
    badges: ["Floor sample"],
    featured: true,
    location: "Lighting aisle",
    inStock: 1,
    manufacturer: "On the floor",
    inventoriedAt: "2026-07-08",
    captureNote: "Intake pass — real warehouse photo",
    fulfillment: { pickup: true, localDelivery: true, ships: false },
  },
];

export function findFloorSample(sku: string): CatalogItem | undefined {
  return FLOOR_SAMPLES.find((it) => it.sku === sku);
}
