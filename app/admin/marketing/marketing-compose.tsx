"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import type { CatalogItem } from "@/lib/items/types";
import { updateItemDetailsAction, type EditableItemFields } from "@/lib/actions/staging";
import {
  craigslistPost,
  ebayPost,
  facebookPost,
  flyerCopy,
  instagramCaption,
} from "@/lib/marketing/templates";
import { GenerateVariants } from "./generate-variants";
import { PhotoCarousel } from "./photo-carousel";
import { PostPreview } from "@/components/marketing/post-preview";

type Channel = "facebook" | "instagram" | "flyer" | "craigslist" | "ebay";

const TABS: { key: Channel; label: string; subtitle: string }[] = [
  { key: "facebook", label: "Facebook Marketplace", subtitle: "Title + body for a Marketplace listing." },
  { key: "instagram", label: "Instagram caption", subtitle: "Square-post caption with hashtag stack." },
  { key: "ebay", label: "eBay", subtitle: "Keyword title (80-char cap) + structured description." },
  { key: "flyer", label: "Floor flyer", subtitle: "Print-ready text for an in-store flyer." },
  { key: "craigslist", label: "Craigslist", subtitle: "Plain-text listing for a Wausau classifieds post." },
];

interface DraftItem {
  title: string;
  subtitle: string;
  price: number;
  msrp: number | "";
  dimensions: string;
  manufacturer: string;
  location: string;
  inStock: number;
}

function fromItem(i: CatalogItem): DraftItem {
  return {
    title: i.title ?? "",
    subtitle: i.subtitle ?? "",
    price: i.price ?? 0,
    msrp: i.msrp ?? "",
    dimensions: i.dimensions ?? "",
    manufacturer: i.manufacturer ?? "",
    location: i.location ?? "",
    inStock: i.inStock ?? 1,
  };
}

function merged(item: CatalogItem, draft: DraftItem): CatalogItem {
  return {
    ...item,
    title: draft.title,
    subtitle: draft.subtitle,
    price: draft.price,
    msrp: draft.msrp === "" ? undefined : draft.msrp,
    dimensions: draft.dimensions || undefined,
    manufacturer: draft.manufacturer || undefined,
    location: draft.location || undefined,
    inStock: draft.inStock,
  };
}

export function MarketingCompose({ item }: { item: CatalogItem }) {
  const [tab, setTab] = useState<Channel>("facebook");
  const [draft, setDraft] = useState<DraftItem>(() => fromItem(item));
  const [savedItem, setSavedItem] = useState<CatalogItem>(item);
  const [saving, startSaving] = useTransition();

  // The "effective" item used for template rendering is the live draft
  // applied to the most recently SAVED item. This way every keystroke
  // on a detail field re-renders the previews instantly even before
  // hitting Save.
  const effective = useMemo(() => merged(savedItem, draft), [savedItem, draft]);

  // Reset key forces all textareas to remount whenever the effective
  // item changes, so freshly-generated template text replaces any
  // stale tweaks the user had made.
  const resetKey = useMemo(
    () =>
      JSON.stringify({
        t: draft.title,
        s: draft.subtitle,
        p: draft.price,
        m: draft.msrp,
        d: draft.dimensions,
        f: draft.manufacturer,
        l: draft.location,
        n: draft.inStock,
      }),
    [draft],
  );

  const copy = useMemo(() => {
    return {
      facebook: facebookPost(effective),
      instagram: instagramCaption(effective),
      ebay: ebayPost(effective),
      flyer: flyerCopy(effective),
      craigslist: craigslistPost(effective),
    };
  }, [effective]);

  const dirty = useMemo(() => {
    const original = fromItem(savedItem);
    return JSON.stringify(original) !== JSON.stringify(draft);
  }, [savedItem, draft]);

  function set<K extends keyof DraftItem>(key: K, value: DraftItem[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function revert() {
    setDraft(fromItem(savedItem));
  }

  function save() {
    if (!dirty) return;
    const fields: EditableItemFields = {
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      price: Number(draft.price) || 0,
      msrp: draft.msrp === "" ? null : Number(draft.msrp),
      dimensions: draft.dimensions.trim() || null,
      manufacturer: draft.manufacturer.trim() || null,
      location: draft.location.trim() || null,
      inStock: Number(draft.inStock) || 0,
    };
    startSaving(async () => {
      try {
        await updateItemDetailsAction(item.sku, fields);
        const updated = merged(savedItem, draft);
        setSavedItem(updated);
        toast.success("Item details saved");
      } catch (err) {
        toast.error(`Save failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Item card — inline editable */}
      <aside className="admin-card overflow-hidden">
        <div className="relative aspect-[4/3] w-full bg-[#f7f7f6]">
          <Image
            src={savedItem.image}
            alt={savedItem.title}
            fill
            sizes="360px"
            className="object-cover"
            quality={80}
          />
        </div>
        <div className="space-y-3 p-4">
          <div className="font-mono text-xs text-muted-foreground">{savedItem.sku}</div>

          <EditField label="Title" value={draft.title} onChange={(v) => set("title", v)} multiline />
          <EditField label="Subtitle" value={draft.subtitle} onChange={(v) => set("subtitle", v)} multiline />

          <div className="grid grid-cols-2 gap-3">
            <EditField
              label="Tag price"
              value={String(draft.price)}
              onChange={(v) => set("price", Number(v) || 0)}
              type="number"
              prefix="$"
            />
            <EditField
              label="Retail (MSRP)"
              value={draft.msrp === "" ? "" : String(draft.msrp)}
              onChange={(v) => set("msrp", v === "" ? "" : Number(v))}
              type="number"
              prefix="$"
              placeholder="—"
            />
          </div>

          <EditField label="Dimensions" value={draft.dimensions} onChange={(v) => set("dimensions", v)} />
          <EditField label="Manufacturer" value={draft.manufacturer} onChange={(v) => set("manufacturer", v)} />

          <div className="grid grid-cols-2 gap-3">
            <EditField label="Aisle / bin" value={draft.location} onChange={(v) => set("location", v)} />
            <EditField
              label="In stock"
              value={String(draft.inStock)}
              onChange={(v) => set("inStock", Number(v) || 0)}
              type="number"
            />
          </div>

          {dirty ? (
            <div className="flex items-center justify-between gap-2 rounded border border-[var(--brand-priceless)]/30 bg-[#fff5f4] px-3 py-2 text-xs">
              <span className="text-foreground">Unsaved item edits.</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={revert}
                  disabled={saving}
                  className="admin-btn admin-btn-outline px-2 py-1 text-[11px]"
                >
                  Revert
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="admin-btn admin-btn-primary px-2.5 py-1 text-[11px]"
                >
                  {saving ? "Saving…" : "Save details"}
                </button>
              </div>
            </div>
          ) : null}

          <PhotoBundle item={savedItem} />
        </div>
      </aside>

      {/* Compose */}
      <div>
        <nav className="flex flex-wrap gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                "px-3 py-2 text-sm font-medium transition border-b-2 -mb-px " +
                (tab === t.key
                  ? "border-[var(--brand-priceless)] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>

        <p className="mt-4 admin-help">
          {TABS.find((t) => t.key === tab)?.subtitle} Live preview below updates as you edit;
          the text blocks under it are editable — tweak, then hit Copy.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-[#eef0f2] p-3 sm:p-4">
          <PostPreview
            item={effective}
            images={[savedItem.image, ...(savedItem.gallery ?? [])].filter(Boolean) as string[]}
            channel={tab}
          />
        </div>

        {tab === "facebook" ? (
          <div className="mt-4 space-y-4">
            <CopyBlock label="Listing title" value={copy.facebook.title} short resetKey={resetKey} />
            <CopyBlock label="Body" value={copy.facebook.body} resetKey={resetKey} />
            <PhotoCarousel item={savedItem} channel="facebook" />
          </div>
        ) : tab === "instagram" ? (
          <div className="mt-4 space-y-4">
            <CopyBlock label="Caption + hashtags" value={copy.instagram} resetKey={resetKey} />
            <PhotoCarousel item={savedItem} channel="instagram" />
          </div>
        ) : tab === "ebay" ? (
          <div className="mt-4 space-y-4">
            <CopyBlock label="Listing title (80-char cap)" value={copy.ebay.title} short resetKey={resetKey} />
            <CopyBlock label="Description" value={copy.ebay.body} resetKey={resetKey} />
            <PhotoCarousel item={savedItem} channel="ebay" />
          </div>
        ) : tab === "flyer" ? (
          <div className="mt-4">
            <CopyBlock label="Flyer text" value={copy.flyer} resetKey={resetKey} />
            <p className="admin-help mt-3">
              Drop into the floor template, print on a 4×6 quarter sheet or a 5×7
              thermal. The headline goes top, price block centered, footer line at
              the bottom.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <CopyBlock label="Listing title" value={copy.craigslist.title} short resetKey={resetKey} />
            <CopyBlock label="Body" value={copy.craigslist.body} resetKey={resetKey} />
            <PhotoCarousel item={savedItem} channel="craigslist" />
          </div>
        )}

        <GenerateVariants item={savedItem} />
      </div>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  prefix,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: "text" | "number";
  prefix?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono mb-1 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="block w-full resize-y rounded border border-border bg-white px-2 py-1.5 text-sm leading-snug text-foreground focus:border-[var(--brand-priceless)] focus:outline-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={
              "block w-full rounded border border-border bg-white py-1.5 text-sm text-foreground focus:border-[var(--brand-priceless)] focus:outline-none " +
              (prefix ? "pl-5 pr-2" : "px-2")
            }
          />
        )}
      </div>
    </label>
  );
}

function PhotoBundle({ item }: { item: CatalogItem }) {
  const allPhotos = [item.image, ...(item.gallery ?? [])].filter(Boolean) as string[];

  async function copyAll() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const absolute = allPhotos.map((p) =>
      p.startsWith("http") || p.startsWith("data:") ? p : `${origin}${p}`,
    );
    try {
      await navigator.clipboard.writeText(absolute.join("\n"));
      toast.success(`Copied ${allPhotos.length} photo URL${allPhotos.length === 1 ? "" : "s"}`);
    } catch {
      toast.error("Copy failed");
    }
  }

  async function copyOne(url: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const absolute = url.startsWith("http") || url.startsWith("data:") ? url : `${origin}${url}`;
    try {
      await navigator.clipboard.writeText(absolute);
      toast.success("Photo URL copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  if (allPhotos.length === 0) return null;

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Photos ({allPhotos.length})
        </div>
        <button type="button" onClick={copyAll} className="admin-btn admin-btn-outline px-2 py-1 text-[11px]">
          Copy all URLs
        </button>
      </div>
      <ul className="mt-2 grid grid-cols-3 gap-1.5">
        {allPhotos.map((g, i) => (
          <li key={`${g}-${i}`} className="group relative">
            <div className="relative aspect-square overflow-hidden bg-[#f7f7f6]">
              <Image
                src={g}
                alt={`${item.title} photo ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized={g.startsWith("data:")}
              />
            </div>
            <button
              type="button"
              onClick={() => copyOne(g)}
              className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/65 py-1 text-[10px] font-medium text-white opacity-100 transition md:inset-0 md:opacity-0 md:group-hover:opacity-100"
            >
              Copy URL
            </button>
            <a
              href={g}
              download={`${item.sku}-photo-${i + 1}.jpg`}
              className="absolute top-1 right-1 rounded bg-white/95 px-1 py-0.5 text-[9px] font-medium text-foreground shadow-sm opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
              aria-label="Download photo"
            >
              ↓
            </a>
          </li>
        ))}
      </ul>
      <p className="admin-help mt-2 text-[11px]">
        Hover to copy or download a single photo, or copy all URLs at once for batch upload.
      </p>
    </div>
  );
}

function CopyBlock({
  label,
  value,
  short = false,
  resetKey,
}: {
  label: string;
  value: string;
  short?: boolean;
  resetKey: string;
}) {
  // Uncontrolled textarea (keyed on resetKey so it remounts with new
  // template output when the item details change). The user's tweaks
  // live in the DOM until then; the Copy button reads the current
  // DOM value so tweaks always go to the clipboard.
  const [ref, setRef] = useState<HTMLTextAreaElement | null>(null);
  async function copy() {
    const text = ref?.value ?? value;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  }
  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <button type="button" onClick={copy} className="admin-btn admin-btn-outline px-2.5 py-1 text-xs">
          Copy
        </button>
      </div>
      <textarea
        key={`${label}-${resetKey}`}
        ref={setRef}
        defaultValue={value}
        rows={short ? 2 : 14}
        className="block w-full resize-y bg-white px-3 py-3 font-mono text-xs leading-relaxed text-foreground focus:outline-none"
      />
    </div>
  );
}
