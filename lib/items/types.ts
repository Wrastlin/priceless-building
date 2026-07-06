/**
 * Pure type module — no runtime deps. Safe to import from anywhere
 * (server, client, edge).
 */

export type Category =
  | "doors"
  | "windows"
  | "cabinets"
  | "vanities"
  | "countertops"
  | "hardware"
  | "lighting"
  | "trim";

export type Brand = "priceless" | "builders";

export type ItemStatus = "draft" | "staged" | "published" | "archived" | "sold";

export interface CatalogItem {
  id: string;
  sku: string;
  brand: Brand;
  category: Category;
  status: ItemStatus;
  title: string;
  subtitle: string;
  price: number;
  msrp?: number;
  image: string;
  staged?: string;
  gallery?: string[];
  badges?: string[];
  /** Hand-picked (or, later, algorithm-picked) flag; the home page rotates the featured pool. */
  featured?: boolean;
  location?: string;
  inStock: number;
  manufacturer?: string;
  dimensions?: string;
  weight?: string;
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
}

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
  upc?: string;
  /** Any other printed lines that don't fit the fields above. */
  otherLines?: string[];
  /** Full raw text of the tag as printed, line by line. */
  rawText?: string;
}
