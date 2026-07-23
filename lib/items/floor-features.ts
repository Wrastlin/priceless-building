/**
 * Display-only featured floor finds — placement-scene stills that advertise
 * real pieces on the floor. Not a purchasable catalog; no product pages.
 *
 * All still. No video in this band (one-medium doctrine).
 */
export type FloorFeature = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  categoryLabel: string;
};

const P = "/real-photos/placements";

export const FLOOR_FEATURES: FloorFeature[] = [
  {
    id: "feat-craftsman-door",
    title: "Black Craftsman Entry Door",
    subtitle: "Solid wood · glass lite",
    image: `${P}/craftsman.jpg`,
    category: "doors",
    categoryLabel: "Doors",
  },
  {
    id: "feat-floral-bowl",
    title: "Kohler Floral Vessel Sink",
    subtitle: "Decorative ceramic · bath ready",
    image: `${P}/floralbowl.jpg`,
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-candelabra",
    title: "Crystal Candelabra Chandelier",
    subtitle: "Statement lighting",
    image: `${P}/candelabra.jpg`,
    category: "lighting",
    categoryLabel: "Lighting",
  },
  {
    id: "feat-sputnik",
    title: "Red Sputnik Chandelier",
    subtitle: "Bold mid-century statement piece",
    image: `${P}/sputnik.jpg`,
    category: "lighting",
    categoryLabel: "Lighting",
  },
  {
    id: "feat-kohler-vessel",
    title: "Kohler Vessel with Gold Faucet",
    subtitle: "Showroom vanity display",
    image: `${P}/kohlervessel.jpg`,
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-copper-sink",
    title: "Copper Sink on Wood Counter",
    subtitle: "Liquidation find · one of a kind",
    image: `${P}/copper.jpg`,
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-barnwood-mirror",
    title: "Reclaimed Wood Framed Mirror",
    subtitle: "Accent piece for bath or entry",
    image: `${P}/barnwoodmirror.jpg`,
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-pedestal",
    title: "Pedestal Sink with Gold Faucet",
    subtitle: "Classic bath fixture",
    image: `${P}/pedestal.jpg`,
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-barndoor",
    title: "Sliding Barn Door",
    subtitle: "Character hardware · ready to hang",
    image: `${P}/barndoor.jpg`,
    category: "doors",
    categoryLabel: "Doors",
  },
  {
    id: "feat-arched8",
    title: "Arched Glass Entry Door",
    subtitle: "Eight-lite arched top",
    image: `${P}/arched8.jpg`,
    category: "doors",
    categoryLabel: "Doors",
  },
  {
    id: "feat-globe",
    title: "Globe Pendant Chandelier",
    subtitle: "Warm ambient lighting",
    image: `${P}/globe.jpg`,
    category: "lighting",
    categoryLabel: "Lighting",
  },
  {
    id: "feat-ring-pendant",
    title: "Ring Pendant Light",
    subtitle: "Modern fixture · floor find",
    image: `${P}/ringpendant.jpg`,
    category: "lighting",
    categoryLabel: "Lighting",
  },
  {
    id: "feat-espresso-vanity",
    title: "Espresso Bath Vanity",
    subtitle: "Floor model · ready to finish",
    image: `${P}/espressovanity.jpg`,
    category: "vanities",
    categoryLabel: "Vanities",
  },
  {
    id: "feat-artglass",
    title: "Art Glass Door",
    subtitle: "Decorative lite · one of a kind",
    image: `${P}/artglass.jpg`,
    category: "doors",
    categoryLabel: "Doors",
  },
  {
    id: "feat-oak-craftsman",
    title: "Oak Craftsman Door",
    subtitle: "Warm wood · glass lite",
    image: `${P}/oakcraftsman.jpg`,
    category: "doors",
    categoryLabel: "Doors",
  },
  {
    id: "feat-white-vessel",
    title: "White Vessel Sink",
    subtitle: "Clean bath display piece",
    image: `${P}/whitevessel.jpg`,
    category: "vanities",
    categoryLabel: "Vanities",
  },
];
