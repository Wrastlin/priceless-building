"use server";

/**
 * Staging server actions.
 *
 * Manager workflow:
 *   floor staff → createDraftFromFormAction → /admin/staging
 *   manager     → approveDraftAction        → live on storefront
 *   manager     → rejectDraftAction         → archived (out of sight)
 *
 * All writes go through `lib/items/store.ts` which atomically writes
 * to disk and revalidates the storefront + staging paths.
 */

import { redirect } from "next/navigation";
import {
  createDraft,
  setStatus,
  type Brand,
  type Category,
  type CatalogItem,
} from "@/lib/items/store";
import { formatSKU } from "@/lib/utils";

const CATEGORY_TO_BRAND: Record<string, Brand> = {
  cabinets: "builders",
  countertops: "builders",
};

function deriveBrand(category: string): Brand {
  return CATEGORY_TO_BRAND[category] ?? "priceless";
}

function nonEmpty(form: FormData, key: string): string {
  const v = form.get(key);
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`Missing required field: ${key}`);
  }
  return v.trim();
}

function optional(form: FormData, key: string): string | undefined {
  const v = form.get(key);
  if (typeof v !== "string" || v.trim() === "") return undefined;
  return v.trim();
}

function optionalNumber(form: FormData, key: string): number | undefined {
  const v = form.get(key);
  if (typeof v !== "string" || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function approveDraftAction(sku: string): Promise<void> {
  await setStatus(sku, "published");
}

export async function rejectDraftAction(sku: string): Promise<void> {
  await setStatus(sku, "archived");
}

/**
 * Builds a new draft item from a multipart form submission. Generates
 * the SKU server-side (the brand prefix is inferred from category).
 *
 * Redirects to /admin/staging on success so the floor staffer
 * immediately sees their entry land in the review queue.
 */
export async function createDraftFromFormAction(formData: FormData): Promise<void> {
  const title = nonEmpty(formData, "title");
  const subtitle = optional(formData, "subtitle") ?? "";
  const category = nonEmpty(formData, "category") as Category;
  const manufacturer = optional(formData, "manufacturer");
  const price = optionalNumber(formData, "price") ?? 0;
  const msrp = optionalNumber(formData, "msrp");
  const location = optional(formData, "location");
  const inStock = optionalNumber(formData, "inStock") ?? 1;
  const image = nonEmpty(formData, "image");

  const compRetailer = optional(formData, "comparable_retailer");
  const compPrice = optionalNumber(formData, "comparable_price");
  const compUrl = optional(formData, "comparable_url");

  const brand = deriveBrand(category);
  const prefix = brand === "builders" ? "BC" : "PL";
  // Time-based suffix for uniqueness without a counter.
  const suffix = Math.floor(Date.now() / 1000) % 1_000_000;
  const sku = formatSKU(prefix, suffix);
  const id = sku.toLowerCase();

  const draft: Omit<CatalogItem, "status" | "createdAt"> = {
    id,
    sku,
    brand,
    category,
    title,
    subtitle,
    price,
    msrp,
    image,
    location,
    inStock,
    manufacturer,
    comparable: compRetailer && typeof compPrice === "number"
      ? { retailer: compRetailer, price: compPrice, url: compUrl }
      : undefined,
    createdBy: "floor staff",
  };

  await createDraft(draft);
  redirect("/admin/staging");
}
