"use server";

import { requireAdminSession } from "@/lib/auth/session";
import { findBySku, updateItem } from "@/lib/items/store";
import type { ChannelListing, ItemChannels, SocialChannelKey } from "@/lib/items/types";

const KEYS: SocialChannelKey[] = [
  "facebook",
  "instagram",
  "ebay",
  "craigslist",
  "offerup",
];

function isKey(v: string): v is SocialChannelKey {
  return (KEYS as string[]).includes(v);
}

/** Mark or clear a social channel listing on a floor item. */
export async function setChannelListingAction(
  sku: string,
  channel: string,
  listing: ChannelListing | null,
): Promise<ItemChannels> {
  await requireAdminSession();
  if (!isKey(channel)) throw new Error(`Unknown channel: ${channel}`);

  const item = await findBySku(sku);
  if (!item) throw new Error(`No item ${sku}`);

  const next: ItemChannels = { ...(item.channels ?? {}) };
  if (listing === null) {
    delete next[channel];
  } else {
    next[channel] = {
      listedAt: listing.listedAt ?? new Date().toISOString(),
      url: listing.url?.trim() || undefined,
      note: listing.note?.trim() || undefined,
    };
  }

  await updateItem(sku, { channels: next });
  return next;
}
