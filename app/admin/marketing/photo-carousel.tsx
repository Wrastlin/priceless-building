"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { CatalogItem } from "@/lib/items/types";

interface CarouselSpec {
  channel: "facebook" | "instagram" | "craigslist" | "ebay";
  label: string;
  max: number;
  note: string;
}

const SPECS: Record<CarouselSpec["channel"], CarouselSpec> = {
  facebook: {
    channel: "facebook",
    label: "Facebook Marketplace photos",
    max: 10,
    note: "Marketplace listings allow up to 10 photos. First photo is the cover thumbnail buyers see in search.",
  },
  instagram: {
    channel: "instagram",
    label: "Instagram carousel",
    max: 10,
    note: "Carousel posts support up to 10 slides. First slide is what shows in the feed; later slides have to be swiped to.",
  },
  craigslist: {
    channel: "craigslist",
    label: "Craigslist gallery",
    max: 24,
    note: "Up to 24 images per listing. Order them so the strongest hero shot is first.",
  },
  ebay: {
    channel: "ebay",
    label: "eBay photos",
    max: 24,
    note: "eBay allows up to 24 photos (first 12 are free). The first photo is the gallery thumbnail buyers see in search — make it the cleanest hero shot.",
  },
};

/**
 * Photo carousel composer. Lets the user pick which of an item's
 * photos go into a multi-photo post on FB/IG/CL, set their order, and
 * (for Instagram) attach a one-line caption to each slide. The output
 * is a "Copy ordered URLs" action that drops the URLs in chosen order
 * to clipboard, ready for batch upload on the target platform.
 *
 * Per-channel slide caps are enforced. Reordering is via up/down
 * arrows so we don't pull in a drag-and-drop library.
 */
export function PhotoCarousel({
  item,
  channel,
}: {
  item: CatalogItem;
  channel: CarouselSpec["channel"];
}) {
  const spec = SPECS[channel];
  const all = useMemo<string[]>(
    () => [item.image, ...(item.gallery ?? [])].filter(Boolean) as string[],
    [item.image, item.gallery],
  );

  // Default selection: first `max` photos in their natural order.
  const [order, setOrder] = useState<string[]>(() => all.slice(0, spec.max));
  const [captions, setCaptions] = useState<Record<string, string>>({});

  function toggle(url: string) {
    setOrder((prev) => {
      if (prev.includes(url)) return prev.filter((u) => u !== url);
      if (prev.length >= spec.max) {
        toast.error(`${spec.label} maxes out at ${spec.max} photos.`);
        return prev;
      }
      return [...prev, url];
    });
  }

  function move(url: string, dir: -1 | 1) {
    setOrder((prev) => {
      const idx = prev.indexOf(url);
      if (idx === -1) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target]!, copy[idx]!];
      return copy;
    });
  }

  async function copyOrderedUrls() {
    if (order.length === 0) {
      toast.error("Pick at least one photo first.");
      return;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const absolute = order.map((p) =>
      p.startsWith("http") || p.startsWith("data:") ? p : `${origin}${p}`,
    );
    const text =
      channel === "instagram" && order.some((u) => captions[u])
        ? order
            .map((u, i) => {
              const cap = captions[u]?.trim();
              const abs = u.startsWith("http") || u.startsWith("data:") ? u : `${origin}${u}`;
              return `${i + 1}. ${abs}${cap ? `\n   caption: ${cap}` : ""}`;
            })
            .join("\n")
        : absolute.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${order.length} photo${order.length === 1 ? "" : "s"} copied in carousel order`);
    } catch {
      toast.error("Copy failed");
    }
  }

  if (all.length <= 1) {
    return (
      <div className="mt-4 rounded border border-dashed border-border bg-[#fafaf9] px-3 py-4 text-xs text-muted-foreground">
        Add more photos to the item gallery to use the {spec.label.toLowerCase()}.
      </div>
    );
  }

  return (
    <section className="admin-card mt-4 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{spec.label}</h3>
          <p className="admin-help mt-0.5 max-w-prose">{spec.note}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {order.length} / {spec.max}
          </span>
          <button
            type="button"
            onClick={copyOrderedUrls}
            className="admin-btn admin-btn-primary px-2.5 py-1 text-xs"
          >
            Copy ordered URLs
          </button>
        </div>
      </div>

      {/* Ordered selection (the actual carousel order, top = slot 1) */}
      <div className="mt-4">
        <div className="font-mono mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          In the post (slot 1 first)
        </div>
        {order.length === 0 ? (
          <div className="rounded border border-dashed border-border bg-[#fafaf9] px-3 py-4 text-xs text-muted-foreground">
            No photos selected. Pick from below.
          </div>
        ) : (
          <ul className="space-y-2">
            {order.map((url, i) => (
              <li
                key={url}
                className="flex items-center gap-3 rounded border border-border bg-white p-2"
              >
                <span className="font-mono inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[var(--brand-priceless)] text-[11px] font-semibold text-white tabular-nums">
                  {i + 1}
                </span>
                <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-[#f7f7f6]">
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized={url.startsWith("data:")}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {channel === "instagram" ? (
                    <input
                      type="text"
                      value={captions[url] ?? ""}
                      onChange={(e) =>
                        setCaptions((c) => ({ ...c, [url]: e.target.value }))
                      }
                      placeholder="Slide caption (optional, IG-only)"
                      className="block w-full rounded border border-border bg-white px-2 py-1 text-xs text-foreground focus:border-[var(--brand-priceless)] focus:outline-none"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Slot {i + 1} {i === 0 ? "· cover / thumbnail" : ""}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(url, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="rounded border border-border bg-white px-1.5 py-0.5 text-xs text-foreground hover:border-foreground/40 disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(url, 1)}
                    disabled={i === order.length - 1}
                    aria-label="Move down"
                    className="rounded border border-border bg-white px-1.5 py-0.5 text-xs text-foreground hover:border-foreground/40 disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(url)}
                    aria-label="Remove from carousel"
                    className="rounded border border-border bg-white px-1.5 py-0.5 text-xs text-muted-foreground hover:border-[var(--brand-priceless)] hover:text-[var(--brand-priceless)]"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Unused photos available to add */}
      {all.some((u) => !order.includes(u)) ? (
        <div className="mt-4">
          <div className="font-mono mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Available to add
          </div>
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {all
              .filter((u) => !order.includes(u))
              .map((url) => (
                <li key={url}>
                  <button
                    type="button"
                    onClick={() => toggle(url)}
                    className="group relative block aspect-square w-full overflow-hidden rounded border border-border bg-[#f7f7f6] transition hover:border-[var(--brand-priceless)]"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="(min-width:640px) 96px, 80px"
                      className="object-cover"
                      unoptimized={url.startsWith("data:")}
                    />
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/60 py-1 text-xs font-medium text-white opacity-100 transition md:inset-0 md:bg-black/0 md:opacity-0 md:group-hover:bg-black/60 md:group-hover:opacity-100">
                      + Add
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
