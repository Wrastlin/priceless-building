/**
 * Display-only featured floor finds — real warehouse photos of individual
 * pieces worth spotlighting. Not a purchasable catalog; no product pages.
 *
 * Curated from intake captures + CURATED.md product-detail picks. Skips
 * shots that aren't real intake demos (e.g. brushed-gold pulls).
 */
export type FloorFeature = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  categoryLabel: string;
};

export const FLOOR_FEATURES: FloorFeature[] = [
  {
    id: "feat-craftsman-door",
    title: "Black Craftsman Entry Door",
    subtitle: "Solid wood · glass lite",
    image: "/real-photos/business/intake-black-craftsman-door.jpg",
    category: "doors",
    categoryLabel: "Doors",
  },
  {
    id: "feat-kohler-vessel",
    title: "Kohler Floral Vessel Sink",
    subtitle: "Decorative ceramic · bath ready",
    image: "/real-photos/business/intake-kohler-floral-vessel-sink.jpg",
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-crystal-candelabra",
    title: "Crystal Candelabra Chandelier",
    subtitle: "Statement lighting on the floor",
    image: "/real-photos/business/intake-crystal-candelabra-chandelier.jpg",
    category: "lighting",
    categoryLabel: "Lighting",
  },
  {
    id: "feat-red-sputnik",
    title: "Red Sputnik Chandelier",
    subtitle: "Bold mid-century statement piece",
    image: "/real-photos/business/red-sputnik-chandelier.jpg",
    category: "lighting",
    categoryLabel: "Lighting",
  },
  {
    id: "feat-kohler-gold-faucet",
    title: "Kohler Vessel with Gold Faucet",
    subtitle: "Showroom vanity display",
    image: "/real-photos/business/kohler-vessel-sink-gold-faucet.jpg",
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-copper-sink",
    title: "Copper Sink on Wood Counter",
    subtitle: "One-of-a-kind floor find",
    image: "/real-photos/business/copper-sink-wood-counter-display.jpg",
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-knotty-pine-door",
    title: "Knotty Pine 6-Panel Door",
    subtitle: "Character wood · interior slab",
    image: "/real-photos/business/knotty-pine-6-panel-door.jpg",
    category: "doors",
    categoryLabel: "Doors",
  },
  {
    id: "feat-pendant",
    title: "Pendant Light Fixture",
    subtitle: "Warehouse lighting aisle",
    image: "/real-photos/business/pendant-light-fixture-warehouse.jpg",
    category: "lighting",
    categoryLabel: "Lighting",
  },
  {
    id: "feat-oak-double-vanity",
    title: "Oak Double Vanity",
    subtitle: "Floor model · ready to finish",
    image: "/real-photos/business/oak-double-vanity-warehouse.jpg",
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-reclaimed-mirror",
    title: "Reclaimed Wood Framed Mirror",
    subtitle: "Accent piece for bath or entry",
    image: "/real-photos/business/reclaimed-wood-framed-mirror.jpg",
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-white-vanity-copper",
    title: "White Vanity with Copper Sink",
    subtitle: "Bath display on the floor",
    image: "/real-photos/business/white-vanity-copper-sink.jpg",
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-pedestal-sink",
    title: "Pedestal Sink with Gold Faucet",
    subtitle: "Classic bath fixture",
    image: "/real-photos/business/pedestal-sink-gold-faucet.jpg",
    category: "vanities",
    categoryLabel: "Vanities",
  },
];
