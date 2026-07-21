"use server";

import { requireAdminSession } from "@/lib/auth/session";
import {
  findComparables,
  marketAnchor,
  suggestTagPrice,
  MIN_COMPS_FOR_VALUE,
} from "@/lib/comparable-search";
import { findBySku, updateItem } from "@/lib/items/store";

/** Re-run SerpAPI comparables for a floor item and optionally nudge compare-at. */
export async function refreshComparablesAction(sku: string, query?: string, broaden = false) {
  await requireAdminSession();
  const item = await findBySku(sku);
  if (!item) throw new Error(`No item ${sku}`);

  const q = (query || item.title || "").trim();
  if (q.length < 3) throw new Error("Need a title to search comparables");

  const comps = await findComparables(q, { broaden });
  const now = new Date().toISOString();
  const comparables = comps.map((c) => ({
    source: c.source,
    title: c.title,
    price: c.price,
    url: c.url,
    image: c.image,
    capturedAt: now,
  }));

  const retailAverage = marketAnchor(comps);
  const patch: Parameters<typeof updateItem>[1] = { comparables };
  if (retailAverage > 0) {
    patch.compareAt = Math.round(retailAverage);
    patch.compareAtSource = "market";
    patch.msrp = Math.round(retailAverage);
    if (!item.price || item.price <= 0) {
      patch.price = suggestTagPrice(retailAverage);
    }
    const top = comps[0];
    if (top) {
      patch.comparable = { retailer: top.source, price: top.price, url: top.url };
    }
  }

  await updateItem(sku, patch);
  return {
    count: comparables.length,
    retailAverage,
    thinSample: comparables.length < MIN_COMPS_FOR_VALUE,
  };
}
