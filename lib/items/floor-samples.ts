/**
 * Floor sample set — three real products from the inventory intake pass.
 *
 * These are the demo items photographed while building the capture/barcode
 * inventory system. Each has a real intake hero plus related warehouse
 * angles so the PDP can show a gallery. Call for price — no digital checkout.
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
    subtitle: "Solid wood · glass lite · one of many on the door wall",
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
    id: "floor-sample-kohler-vessel-sink",
    sku: "PL-FLOOR-002",
    brand: "priceless",
    category: "vanities",
    status: "published",
    title: "Kohler Floral Vessel Sink",
    subtitle: "Decorative ceramic vessel · vanities, tops & sinks ready to install",
    price: 0,
    image: "/real-photos/business/intake-kohler-floral-vessel-sink.jpg",
    gallery: [
      "/real-photos/business/floor-vessel-and-drop-in-sinks.jpg",
      "/real-photos/business/floor-vanity-tops-aisle.jpg",
      "/real-photos/business/floor-vanity-row-mirrors-lights.jpg",
    ],
    badges: ["On the floor"],
    featured: true,
    location: "Vanity aisle",
    inStock: 1,
    manufacturer: "Kohler",
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
      "/real-photos/business/warehouse-lighting-inventory.jpg",
      "/real-photos/business/floor-vanity-row-mirrors-lights.jpg",
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
