"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setChannelListingAction } from "@/lib/actions/channels";
import type { ItemChannels, SocialChannelKey } from "@/lib/items/types";

const CHANNELS: { key: SocialChannelKey; label: string }[] = [
  { key: "facebook", label: "Facebook Marketplace" },
  { key: "instagram", label: "Instagram" },
  { key: "ebay", label: "eBay" },
  { key: "craigslist", label: "Craigslist" },
  { key: "offerup", label: "OfferUp" },
];

export function ChannelChecklist({
  sku,
  initial,
}: {
  sku: string;
  initial?: ItemChannels;
}) {
  const router = useRouter();
  const [channels, setChannels] = useState<ItemChannels>(initial ?? {});
  const [pending, start] = useTransition();
  const [urlDraft, setUrlDraft] = useState<Partial<Record<SocialChannelKey, string>>>({});

  function toggle(key: SocialChannelKey, listed: boolean) {
    start(async () => {
      try {
        const next = await setChannelListingAction(
          sku,
          key,
          listed
            ? {
                listedAt: new Date().toISOString(),
                url: urlDraft[key]?.trim() || undefined,
              }
            : null,
        );
        setChannels(next);
        toast.success(listed ? `Marked listed on ${key}` : `Cleared ${key}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not update channel");
      }
    });
  }

  function saveUrl(key: SocialChannelKey) {
    const url = urlDraft[key]?.trim();
    if (!url) return;
    start(async () => {
      try {
        const existing = channels[key];
        const next = await setChannelListingAction(sku, key, {
          listedAt: existing?.listedAt ?? new Date().toISOString(),
          url,
          note: existing?.note,
        });
        setChannels(next);
        toast.success("Listing URL saved");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not save URL");
      }
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-[var(--muted-foreground)]">
        After you paste a listing on each channel, check it off here. No auto-post yet — this is the sell tracker.
      </p>
      <ul className="divide-y divide-[var(--border)]">
        {CHANNELS.map(({ key, label }) => {
          const row = channels[key];
          const on = !!row?.listedAt;
          return (
            <li key={key} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--brand-navy)]"
                  checked={on}
                  disabled={pending}
                  onChange={(e) => toggle(key, e.target.checked)}
                />
                <span className="font-medium">{label}</span>
                {on && row?.listedAt ? (
                  <span className="text-[12px] text-[var(--muted-foreground)]">
                    {new Date(row.listedAt).toLocaleDateString()}
                  </span>
                ) : null}
              </label>
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-xs sm:justify-end">
                <input
                  className="inv-input text-[13px]"
                  placeholder="Listing URL (optional)"
                  value={urlDraft[key] ?? row?.url ?? ""}
                  onChange={(e) => setUrlDraft((d) => ({ ...d, [key]: e.target.value }))}
                  disabled={pending}
                />
                <button
                  type="button"
                  className="inv-btn inv-btn-ghost shrink-0 text-[12px]"
                  disabled={pending || !(urlDraft[key] ?? row?.url)}
                  onClick={() => saveUrl(key)}
                >
                  Save
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
