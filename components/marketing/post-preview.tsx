"use client";

import Image from "next/image";
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Share2,
  ShoppingCart,
} from "lucide-react";
import type { CatalogItem } from "@/lib/items/types";
import { formatCurrency } from "@/lib/utils";
import {
  craigslistPost,
  ebayPost,
  facebookPost,
  flyerCopy,
  instagramCaption,
} from "@/lib/marketing/templates";

/**
 * Live, platform-accurate previews of how an item's post will look on
 * each channel. The point is WYSIWYG: a staffer edits the item fields and
 * watches the Facebook Marketplace card / Instagram post / eBay listing
 * update in real time, so they can see the real thing before they ever
 * leave the app to post it.
 *
 * These are visual mockups, not pixel-perfect clones — close enough that
 * the wording, photo crop, and price all read the way they will on the
 * actual platform.
 */

export type PostChannel = "facebook" | "instagram" | "ebay" | "flyer" | "craigslist";

const STORE = "Price-Less Building Center";
const HANDLE = "pricelessbuilding";
const CITY = "Wausau, WI";

export function PostPreview({
  item,
  images,
  channel,
}: {
  item: CatalogItem;
  images: string[];
  channel: PostChannel;
}) {
  const cover = images[0] ?? item.image ?? "";
  switch (channel) {
    case "facebook":
      return <FacebookPreview item={item} cover={cover} />;
    case "instagram":
      return <InstagramPreview item={item} cover={cover} />;
    case "ebay":
      return <EbayPreview item={item} cover={cover} />;
    case "craigslist":
      return <CraigslistPreview item={item} images={images} />;
    case "flyer":
      return <FlyerPreview item={item} />;
  }
}

function Cover({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 text-xs text-neutral-400 ${className ?? ""}`}>
        Add a photo
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${className ?? ""}`}>
      <Image src={src} alt={alt} fill className="object-cover" unoptimized sizes="480px" />
    </div>
  );
}

function Avatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[var(--brand-priceless)] font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      P
    </div>
  );
}

/* ----------------------------- Facebook ----------------------------- */
function FacebookPreview({ item, cover }: { item: CatalogItem; cover: string }) {
  const { body } = facebookPost(item);
  return (
    <div className="mx-auto max-w-[500px] overflow-hidden rounded-lg border border-neutral-200 bg-white font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[#050505] shadow-sm">
      <Cover src={cover} alt={item.title} className="aspect-[4/3] w-full" />
      <div className="p-4">
        <div className="text-[22px] font-bold leading-tight">
          {item.price > 0 ? formatCurrency(item.price) : "$—"}
        </div>
        <div className="mt-0.5 text-[15px] leading-snug">{item.title || "Item title"}</div>
        <div className="mt-1 flex items-center gap-1 text-[13px] text-[#65676b]">
          <MapPin size={13} /> {CITY} · Listed just now
        </div>

        <div className="mt-3 border-t border-neutral-200 pt-3">
          <div className="text-[15px] font-semibold">Details</div>
          <p className="mt-1 whitespace-pre-line text-[14px] leading-relaxed text-[#050505]">
            {body}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-neutral-200 pt-3">
          <Avatar size={36} />
          <div className="leading-tight">
            <div className="text-[13px] font-semibold">{STORE}</div>
            <div className="text-[12px] text-[#65676b]">Seller · Wausau, Wisconsin</div>
          </div>
          <button className="ml-auto rounded-md bg-[#0866ff] px-4 py-1.5 text-[13px] font-semibold text-white">
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Instagram ----------------------------- */
function InstagramPreview({ item, cover }: { item: CatalogItem; cover: string }) {
  const caption = instagramCaption(item);
  // First line is the hook; render the rest as the body.
  return (
    <div className="mx-auto max-w-[400px] overflow-hidden rounded-lg border border-neutral-200 bg-white font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[#262626] shadow-sm">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar size={32} />
        <div className="leading-tight">
          <div className="text-[13px] font-semibold">{HANDLE}</div>
          <div className="text-[11px] text-[#737373]">{CITY}</div>
        </div>
        <MoreHorizontal size={18} className="ml-auto text-[#262626]" />
      </div>
      <Cover src={cover} alt={item.title} className="aspect-square w-full" />
      <div className="px-3 pt-2.5">
        <div className="flex items-center gap-4">
          <Heart size={24} className="text-[#262626]" />
          <MessageCircle size={24} className="text-[#262626]" />
          <Send size={24} className="text-[#262626]" />
          <Bookmark size={24} className="ml-auto text-[#262626]" />
        </div>
        <div className="mt-2 text-[13px] font-semibold">Liked by your neighbors and others</div>
        <p className="mt-1 whitespace-pre-line pb-3 text-[13px] leading-relaxed">
          <span className="font-semibold">{HANDLE}</span>{" "}
          {caption}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------- eBay -------------------------------- */
function EbayPreview({ item, cover }: { item: CatalogItem; cover: string }) {
  const { title, body } = ebayPost(item);
  const s =
    item.msrp && item.msrp > item.price
      ? Math.round((1 - item.price / item.msrp) * 100)
      : null;
  return (
    <div className="mx-auto max-w-[560px] overflow-hidden rounded-lg border border-neutral-200 bg-white font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[#191919] shadow-sm">
      {/* eBay top bar */}
      <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-[#e53238]">e</span>
          <span className="text-[#0064d2]">b</span>
          <span className="text-[#f5af02]">a</span>
          <span className="text-[#86b817]">y</span>
        </span>
        <div className="ml-2 flex flex-1 items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-[12px] text-neutral-400">
          <Search size={13} /> Search for anything
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[200px_1fr]">
        <Cover src={cover} alt={title} className="aspect-square w-full rounded border border-neutral-200" />
        <div className="min-w-0">
          <div className="text-[16px] font-semibold leading-snug">{title || "Listing title"}</div>
          <div className="mt-1 text-[12px] text-[#707070]">
            Condition: <span className="text-[#191919]">New (other)</span>
          </div>
          <div className="mt-3 text-[24px] font-bold">
            {item.price > 0 ? formatCurrency(item.price) : "$—"}
          </div>
          {s ? (
            <div className="text-[12px] text-[#707070]">
              Was{" "}
              <span className="line-through">{formatCurrency(item.msrp!)}</span> · Save {s}%
            </div>
          ) : null}
          <div className="mt-1 text-[12px] text-[#707070]">
            {item.inStock > 0 ? `${item.inStock} available` : "Out of stock"} · Local pickup in {CITY}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <button className="rounded-full bg-[#3665f3] py-2 text-[13px] font-semibold text-white">
              Buy It Now
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-full border border-[#3665f3] py-2 text-[13px] font-semibold text-[#3665f3]">
              <ShoppingCart size={14} /> Add to cart
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 px-4 py-3">
        <div className="text-[14px] font-semibold">About this item</div>
        <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-[#191919]">{body}</p>
      </div>
    </div>
  );
}

/* ---------------------------- Craigslist ----------------------------- */
function CraigslistPreview({ item, images }: { item: CatalogItem; images: string[] }) {
  const { title, body } = craigslistPost(item);
  const cover = images[0] ?? item.image ?? "";
  return (
    <div className="mx-auto max-w-[600px] overflow-hidden rounded border border-neutral-300 bg-white p-4 font-[Helvetica,Arial,sans-serif] text-[#222]">
      <div className="text-[20px] font-bold leading-tight text-[#222]">
        {item.title || "Item title"}{" "}
        <span className="font-bold">- {item.price > 0 ? formatCurrency(item.price) : "$—"}</span>{" "}
        <span className="text-[15px] font-normal text-[#666]">({CITY})</span>
      </div>
      <div className="mt-1 text-[12px] text-[#666]">
        posted just now · <span className="text-[#00e]">reply</span>
      </div>

      <div className="mt-3 flex gap-3">
        <Cover src={cover} alt={title} className="aspect-[4/3] w-[55%] rounded border border-neutral-300" />
        {images.length > 1 ? (
          <div className="flex w-[40%] flex-wrap content-start gap-1">
            {images.slice(1, 5).map((src, i) => (
              <Cover key={i} src={src} alt="" className="aspect-square w-[48%] rounded border border-neutral-300" />
            ))}
          </div>
        ) : null}
      </div>

      <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-[#222]">{body}</p>
      <div className="mt-3 border-t border-neutral-200 pt-2 text-[12px] text-[#666]">
        QR Code Link to This Post · post id: {item.sku}
      </div>
    </div>
  );
}

/* ------------------------------ Flyer -------------------------------- */
function FlyerPreview({ item }: { item: CatalogItem }) {
  const text = flyerCopy(item);
  return (
    <div className="mx-auto max-w-[360px]">
      <div className="rounded border-2 border-[var(--brand-priceless)] bg-white p-6 text-center shadow-sm">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--brand-priceless)]">
          {STORE}
        </div>
        <div className="mt-3 text-lg font-bold uppercase leading-tight text-neutral-900">
          {item.title || "Item title"}
        </div>
        {item.subtitle ? (
          <div className="mt-1 text-sm text-neutral-600">{item.subtitle}</div>
        ) : null}
        <div className="my-4 border-t border-dashed border-neutral-300" />
        <div className="text-5xl font-extrabold tabular-nums text-[var(--brand-priceless)]">
          {item.price > 0 ? formatCurrency(item.price) : "$—"}
        </div>
        {item.msrp && item.msrp > item.price ? (
          <div className="mt-1 text-sm text-neutral-500">
            Retail <span className="line-through">{formatCurrency(item.msrp)}</span> · save{" "}
            {Math.round((1 - item.price / item.msrp) * 100)}%
          </div>
        ) : null}
        {item.dimensions ? <div className="mt-3 text-sm text-neutral-700">{item.dimensions}</div> : null}
        {item.location ? (
          <div className="mt-1 text-sm font-medium text-neutral-700">Find it: {item.location}</div>
        ) : null}
        <div className="mt-4 whitespace-pre-line border-t border-dashed border-neutral-300 pt-3 text-[11px] text-neutral-500">
          {text.split("\n").slice(-2).join("\n")}
        </div>
      </div>
      <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] text-muted-foreground">
        <Share2 size={11} /> Print on a 4×6 quarter sheet or 5×7 thermal.
      </p>
    </div>
  );
}
