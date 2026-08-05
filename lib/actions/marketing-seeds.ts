"use server";

/**
 * Marketing-seed server actions. Owner-only: marketing is the owner's lane
 * (floor logins inventory and sell; they never manage the ad-kit pipeline).
 */
import { requireOwner } from "@/lib/auth/session";
import { logCaptureEvent } from "@/lib/capture/events";
import { findBySku, updateItem } from "@/lib/items/store";
import type { ItemMarketing, MarketingSeedStatus } from "@/lib/items/types";
import { marketingSlugFor } from "@/lib/marketing/seeds";

const STATUSES: MarketingSeedStatus[] = ["new", "processed", "skipped"];

/** Mark a seed's pipeline status. Mints the permanent slug on first touch. */
export async function markSeedAction(
  sku: string,
  status: string,
  note?: string,
): Promise<ItemMarketing> {
  const owner = await requireOwner();
  if (!STATUSES.includes(status as MarketingSeedStatus)) {
    throw new Error(`Unknown seed status: ${status}`);
  }

  const item = await findBySku(sku);
  if (!item) throw new Error(`No item ${sku}`);

  const next: ItemMarketing = {
    ...(item.marketing ?? { slug: marketingSlugFor(item) }),
    status: status as MarketingSeedStatus,
  };
  if (status === "processed" && !next.processedAt) {
    next.processedAt = new Date().toISOString();
  }
  if (status === "new") delete next.processedAt;
  const trimmed = note?.trim();
  if (trimmed) next.note = trimmed;

  await updateItem(sku, { marketing: next });
  await logCaptureEvent({
    source: "action",
    action: `marketing.seed_${status}`,
    sku,
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { slug: next.slug, deliverables: next.deliverables ?? [] },
  });
  return next;
}
