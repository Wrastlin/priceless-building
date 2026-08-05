/**
 * Pure type module — no runtime deps. Safe to import from anywhere
 * (server, client, edge).
 */

/** Built-in storefront filter ids. Custom intake departments may be any string. */
export type StorefrontCategory =
  | "doors"
  | "windows"
  | "cabinets"
  | "vanities"
  | "countertops"
  | "hardware"
  | "lighting"
  | "trim";

/** Department id — storefront known set plus open intake departments. */
export type Category = StorefrontCategory | (string & {});

export type Brand = "priceless" | "builders";

export type ItemStatus = "draft" | "staged" | "published" | "archived" | "sold";

export interface CatalogItem {
  id: string;
  sku: string;
  brand: Brand;
  category: Category;
  /** Intake subcategory id (e.g. exterior, vessel). */
  subcategory?: string;
  status: ItemStatus;
  title: string;
  subtitle: string;
  price: number;
  msrp?: number;
  /** Compare-at anchor for shoppers (tag list or market median). */
  compareAt?: number;
  compareAtSource?: "tag" | "market";
  /** Printed manufacturer/retailer list price from the physical tag. */
  listPrice?: number;
  image: string;
  staged?: string;
  gallery?: string[];
  /** Preferred photo list (Storage URLs); falls back to image + gallery. */
  photos?: string[];
  badges?: string[];
  /** Hand-picked (or, later, algorithm-picked) flag; the home page rotates the featured pool. */
  featured?: boolean;
  location?: string;
  inStock: number;
  manufacturer?: string;
  modelNumber?: string;
  color?: string;
  material?: string;
  dimensions?: string;
  condition?: string;
  weight?: string;
  description?: string;
  /** Category-specific specs from intake taxonomy. */
  specs?: Record<string, string>;
  comparable?: { retailer: string; price: number; url?: string };
  // Full set of live retail comparables captured at the time of pricing.
  // Each entry includes a clickable URL to the actual retailer product
  // page so staff (and customers, where surfaced) can verify.
  comparables?: Array<{
    source: string;
    title: string;
    price: number;
    url: string;
    image?: string;
    capturedAt?: string;
    match?: "strong" | "loose";
    reason?: string;
  }>;
  fulfillment?: { pickup: boolean; localDelivery: boolean; ships: boolean };
  createdAt?: string;
  createdBy?: string;
  /**
   * Set when the item was entered through the rapid inventory-capture flow
   * (/admin/capture). This is the marker for "physically inventoried" during
   * the store-wide count — absent on items created any other way.
   */
  inventoriedAt?: string;
  /**
   * Physical sticker numbers on the units themselves. Every individual unit
   * gets its own consecutive number off the sticker roll (7 identical doors
   * = e.g. #51–#57, one record, inStock 7), so at the register any single
   * unit's sticker maps back to this record. start === end for a single unit.
   */
  tagRange?: { start: number; end: number };
  /** Free-text note jotted during the capture pass (condition, location…). */
  captureNote?: string;
  /**
   * Verbatim transcription of the item's physical tag/label, extracted by
   * vision from the tag photo. Transcription only — no inferred values.
   * Kept raw so a redesigned catalog can re-map it later.
   */
  tagExtract?: TagExtract;
  /**
   * Manual social / marketplace listing tracker. Staff mark a channel after
   * they paste a listing — no auto-post APIs yet. Kept off the public shop.
   */
  channels?: ItemChannels;
  /**
   * Marketing-deliverables seed state (the compounding library). Every floor
   * item with photos is a permanent seed for the ad-kit pipeline (studio
   * master, cutout, placements, feed post, micros, motion clips). The slug is
   * minted once and never changes — it names this product across every
   * marketing folder and manifest. Kept off the public shop.
   */
  marketing?: ItemMarketing;
  /** Staff ↔ AI chat thread for refining catalog copy on the item detail page. */
  aiThread?: Array<{ role: "user" | "assistant"; content: string; at: string }>;
}

/** Where a marketing seed sits in the ad-kit pipeline. */
export type MarketingSeedStatus = "new" | "processed" | "skipped";

/** Marketing-deliverables state carried on the item (see CatalogItem.marketing). */
export type ItemMarketing = {
  /** Permanent library slug (short title words + sku), minted once. */
  slug: string;
  status: MarketingSeedStatus;
  /** Set when the ad kit shipped. */
  processedAt?: string;
  /** Deliverable classes shipped (master, cutout, placement, feed-post, plate, micro, motion-clip…). */
  deliverables?: string[];
  note?: string;
};

/** Social sell channels tracked on floor inventory (manual checklist). */
export type SocialChannelKey =
  | "facebook"
  | "instagram"
  | "ebay"
  | "craigslist"
  | "offerup";

export type ChannelListing = {
  listedAt?: string;
  url?: string;
  note?: string;
};

export type ItemChannels = Partial<Record<SocialChannelKey, ChannelListing>>;

/** What the vision pass reads off the physical tag. Every field is a
 *  literal transcription; anything not printed on the tag stays absent. */
export interface TagExtract {
  productName?: string;
  manufacturer?: string;
  modelNumber?: string;
  dimensions?: string;
  color?: string;
  material?: string;
  price?: number;
  /** Printed manufacturer/retailer list (distinct from our tag price). */
  listPrice?: number;
  upc?: string;
  /** Any other printed lines that don't fit the fields above. */
  otherLines?: string[];
  /** Full raw text of the tag as printed, line by line. */
  rawText?: string;
}
