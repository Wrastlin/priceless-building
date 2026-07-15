/**
 * Floor sample set — three real products from the inventory intake pass.
 *
 * These are the demo items photographed while building the capture/barcode
 * inventory system. Each has a real intake hero plus related warehouse
 * angles so the PDP can show a gallery (same pattern as future tagged items
 * with AI scene variants). Call for price — no digital checkout yet.
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
    subtitle: "Solid wood · glass lite · one of nearly 1,000 doors on the floor",
    price: 0,
    image: "/real-photos/business/intake-black-craftsman-door.jpg",
    gallery: [
      "/real-photos/business/craftsman-door-warehouse.jpg",
      "/real-photos/business/floor-door-aisle-light-and-dark.jpg",
      "/real-photos/business/floor-barn-door-diamond-glass.jpg",
    ],
    badges: ["On the floor"],
    featured: true,
    location: "Door wall",
    inStock: 1,
    manufacturer: "On the floor",
    inventoriedAt: "2026-07-08",
    captureNote: "Inventory intake demo — real warehouse photos",
    fulfillment: { pickup: true, localDelivery: true, ships: false },
  },
  {
    id: "floor-sample-hardware-pulls",
    sku: "PL-FLOOR-002",
    brand: "priceless",
    category: "hardware",
    status: "published",
    title: "Brushed Gold Cabinet Pulls",
    subtitle: "New-in-box contractor overstock · pulls, knobs & locksets deep in stock",
    price: 0,
    image: "/real-photos/business/intake-brushed-gold-cabinet-pulls.jpg",
    gallery: [
      "/real-photos/business/floor-door-hardware-lock-shelves.jpg",
      "/real-photos/business/floor-fasteners-grk-simpson-display.jpg",
      "/real-photos/business/dark-wood-cabinets-glass-knobs.jpg",
    ],
    badges: ["On the floor"],
    featured: true,
    location: "Hardware aisle",
    inStock: 1,
    manufacturer: "On the floor",
    inventoriedAt: "2026-07-08",
    captureNote: "Inventory intake demo — real warehouse photos",
    fulfillment: { pickup: true, localDelivery: true, ships: false },
  },
  {
    id: "floor-sample-lighting-candelabra",
    sku: "PL-FLOOR-003",
    brand: "priceless",
    category: "lighting",
    status: "published",
    title: "Crystal Candelabra Chandelier",
    subtitle: "Statement fixture · chandeliers & pendants hanging throughout the warehouse",
    price: 0,
    image: "/real-photos/business/intake-crystal-candelabra-chandelier.jpg",
    gallery: [
      "/real-photos/business/floor-globe-crystal-chandelier.jpg",
      "/real-photos/business/red-sputnik-chandelier.jpg",
      "/real-photos/business/warehouse-lighting-inventory.jpg",
    ],
    badges: ["On the floor"],
    featured: true,
    location: "Lighting aisle",
    inStock: 1,
    manufacturer: "On the floor",
    inventoriedAt: "2026-07-08",
    captureNote: "Inventory intake demo — real warehouse photos",
    fulfillment: { pickup: true, localDelivery: true, ships: false },
  },
];

export function findFloorSample(sku: string): CatalogItem | undefined {
  return FLOOR_SAMPLES.find((it) => it.sku === sku);
}
