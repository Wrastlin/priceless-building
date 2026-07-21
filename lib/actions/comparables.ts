"use server";

import { requireAdminSession } from "@/lib/auth/session";
import { resolveActor, actorStamp } from "@/lib/auth/actor";
import { logCaptureEvent } from "@/lib/capture/events";
import { insertCompsSnapshot } from "@/lib/comps/snapshots";
import {
  findComparables,
  marketAnchor,
  medianPrice,
  averagePrice,
  MIN_COMPS_FOR_VALUE,
} from "@/lib/comparable-search";
import { findBySku, updateItem } from "@/lib/items/store";

/**
 * Re-run SerpAPI comps. Appends a snapshot; updates live compare-at.
 * Never changes Our price (item.price).
 */
export async function refreshComparablesAction(sku: string, query?: string, broaden = false) {
  await requireAdminSession();
  const actor = await resolveActor();
  const stamp = actor ? actorStamp(actor) : null;
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
  const med = medianPrice(comps);
  const trimmed = averagePrice(comps);

  await insertCompsSnapshot({
    sku,
    query: q,
    broadened: broaden,
    rawResults: comps,
    anchor: retailAverage,
    median: med,
    trimmedMean: trimmed,
    n: comparables.length,
    actorName: stamp?.actorName ?? stamp?.createdBy,
    loginEmail: stamp?.loginEmail,
  });

  const patch: Parameters<typeof updateItem>[1] = { comparables };
  if (retailAverage > 0) {
    patch.compareAt = Math.round(retailAverage);
    patch.compareAtSource = "market";
    patch.msrp = Math.round(retailAverage);
    const top = comps[0];
    if (top) {
      patch.comparable = { retailer: top.source, price: top.price, url: top.url };
    }
  }
  // Deliberately do NOT set price — Our price is human.

  await updateItem(sku, patch);
  await logCaptureEvent({
    source: "action",
    action: "comps.refresh",
    sku,
    itemId: item.id,
    actorId: stamp?.actorId,
    actorName: stamp?.actorName,
    loginEmail: stamp?.loginEmail,
    loginRole: stamp?.loginRole,
    payload: {
      query: q,
      broaden,
      count: comparables.length,
      anchor: retailAverage,
      median: med,
      trimmedMean: trimmed,
      thinSample: comparables.length < MIN_COMPS_FOR_VALUE,
    },
  });

  return {
    count: comparables.length,
    retailAverage,
    thinSample: comparables.length < MIN_COMPS_FOR_VALUE,
  };
}
