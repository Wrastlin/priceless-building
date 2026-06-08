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

export type ItemStatus = "draft" | "staged" | "published" | "archived";

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
  location?: string;
  inStock: number;
  manufacturer?: string;
  dimensions?: string;
  weight?: string;
  comparable?: { retailer: string; price: number; url?: string };
  fulfillment?: { pickup: boolean; localDelivery: boolean; ships: boolean };
  createdAt?: string;
  createdBy?: string;
}
