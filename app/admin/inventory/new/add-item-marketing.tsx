"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { CatalogItem, Category } from "@/lib/items/types";
import {
  craigslistPost,
  ebayPost,
  facebookPost,
  flyerCopy,
  instagramCaption,
} from "@/lib/marketing/templates";
import { SCENES, type SceneKey } from "@/lib/marketing/scene-prompts";
import { downscaleDataUrl, readJsonSafe } from "@/lib/client/media";
import { PostPreview } from "@/components/marketing/post-preview";

/**
 * Marketing studio embedded directly in the Add Item page so a staffer
 * can produce listing copy AND photo-realistic scene images for the item
 * they're entering — before it's even saved — without bouncing to the
 * separate /admin/marketing page.
 *
 * Copy is rendered deterministically from the current (possibly unsaved)
 * form fields. Scene images run against the real cover photo through
 * /api/marketing-variants using inline item fields (no SKU required yet).
 * Generated images flow back into the form's photo list via onAddPhotos,
 * tagged "ai-variant", so they save with the item.
 */

export interface MarketingFields {
  title: string;
  subtitle: string;
  category: string;
  manufacturer: string;
  dimensions: string;
  location: string;
  price: number;
  retailAvg: number;
  inStock: number;
}

type Channel = "facebook" | "instagram" | "ebay" | "flyer" | "craigslist";

const TABS: { key: Channel; label: string }[] = [
  { key: "facebook", label: "Facebook Marketplace" },
  { key: "instagram", label: "Instagram" },
  { key: "ebay", label: "eBay" },
  { key: "flyer", label: "Floor flyer" },
  { key: "craigslist", label: "Craigslist" },
];

interface VariantResult {
  scene: string;
  image: string | null;
  reason?: string;
}

function syntheticItem(f: MarketingFields): CatalogItem {
  const category = ([
    "doors", "windows", "cabinets", "vanities", "countertops", "hardware", "lighting", "trim",
  ] as string[]).includes(f.category)
    ? (f.category as Category)
    : "hardware";
  return {
    id: "pending",
    sku: "(SKU on save)",
    brand: "priceless",
    category,
    status: "draft",
    title: f.title.trim() || "Untitled item",
    subtitle: f.subtitle.trim(),
    price: f.price || 0,
    msrp: f.retailAvg > 0 ? f.retailAvg : undefined,
    image: "",
    inStock: f.inStock || 1,
    location: f.location.trim() || undefined,
    manufacturer: f.manufacturer.trim() || undefined,
    dimensions: f.dimensions.trim() || undefined,
  };
}

export function AddItemMarketing({
  fields,
  coverImage,
  images,
  onAddPhotos,
}: {
  fields: MarketingFields;
  coverImage: string | null;
  images: string[];
  onAddPhotos: (urls: string[]) => void;
}) {
  const [tab, setTab] = useState<Channel>("facebook");
  const item = useMemo(() => syntheticItem(fields), [fields]);

  const copy = useMemo(
    () => ({
      facebook: facebookPost(item),
      instagram: instagramCaption(item),
      ebay: ebayPost(item),
      flyer: flyerCopy(item),
      craigslist: craigslistPost(item),
    }),
    [item],
  );

  // Plain-text version of the active channel, for the Copy button.
  function activeText(): string {
    switch (tab) {
      case "facebook":
        return `${copy.facebook.title}\n\n${copy.facebook.body}`;
      case "instagram":
        return copy.instagram;
      case "ebay":
        return `${copy.ebay.title}\n\n${copy.ebay.body}`;
      case "flyer":
        return copy.flyer;
      case "craigslist":
        return `${copy.craigslist.title}\n\n${copy.craigslist.body}`;
    }
  }

  async function copyActive() {
    try {
      await navigator.clipboard.writeText(activeText());
      toast.success("Post text copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  // "Generate a post" is an explicit action so the form stays clean
  // until the staffer asks for listing copy.
  const [showPosts, setShowPosts] = useState(false);

  // Scene-image generation
  const [picked, setPicked] = useState<Set<SceneKey>>(new Set<SceneKey>(["kitchen", "front-entry"]));
  const [results, setResults] = useState<VariantResult[]>([]);
  const [running, setRunning] = useState(false);

  function toggleScene(key: SceneKey) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const hasTitle = fields.title.trim().length > 0;

  async function generate() {
    if (!coverImage) {
      toast.error("Add a real cover photo first — scenes are built from it.");
      return;
    }
    if (!hasTitle) {
      toast.error("Give the item a title first so the scene prompt knows what it is.");
      return;
    }
    if (picked.size === 0) {
      toast.error("Pick at least one scene.");
      return;
    }
    setRunning(true);
    setResults([]);
    try {
      // Keep the source small so the request body stays well under the limit.
      const src = await downscaleDataUrl(coverImage, 1280, 0.8);
      const res = await fetch("/api/marketing-variants", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          image: src,
          scenes: Array.from(picked),
          item: {
            title: fields.title,
            category: fields.category,
            subtitle: fields.subtitle,
            dimensions: fields.dimensions,
            manufacturer: fields.manufacturer,
          },
        }),
      });
      const parsed = await readJsonSafe<{ variants?: VariantResult[]; reason?: string }>(res);
      if (!parsed.ok || !parsed.data?.variants || parsed.data.variants.length === 0) {
        toast.error(`Generation failed: ${parsed.error ?? parsed.data?.reason ?? "no variants returned"}`);
        return;
      }
      setResults(parsed.data.variants);
      const ok = parsed.data.variants.filter((v) => v.image).length;
      const failed = parsed.data.variants.length - ok;
      toast.success(`${ok} variant${ok === 1 ? "" : "s"} ready${failed ? ` · ${failed} failed` : ""}`);
    } catch (err) {
      toast.error(`Request failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setRunning(false);
    }
  }

  function addOne(url: string, scene: string) {
    onAddPhotos([url]);
    setResults((r) => r.filter((v) => v.image !== url));
    toast.success(`Added ${SCENES.find((s) => s.key === scene)?.label ?? scene} variant to the item.`);
  }

  function addAll() {
    const urls = results.map((r) => r.image).filter((u): u is string => !!u);
    if (urls.length === 0) return;
    onAddPhotos(urls);
    setResults([]);
    toast.success(`Added ${urls.length} variant${urls.length === 1 ? "" : "s"} to the item.`);
  }

  return (
    <section className="admin-card p-5">
      <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
        Marketing (optional)
      </h2>

      {!hasTitle ? (
        <p className="admin-help mt-4">
          Analyze the item (or type a title) to generate listing copy and scene photos here.
        </p>
      ) : (
        <div className="mt-4 space-y-6">
          {/* Listing copy */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Generate a post
              </div>
              <button
                type="button"
                onClick={() => setShowPosts((v) => !v)}
                className={
                  showPosts
                    ? "admin-btn admin-btn-outline px-3 py-1.5 text-sm"
                    : "admin-btn admin-btn-primary px-3 py-1.5 text-sm"
                }
              >
                {showPosts ? "Hide post copy" : "Generate a post"}
              </button>
            </div>
            {!showPosts ? (
              <p className="admin-help mt-2">
                Build ready-to-post listing copy for Facebook Marketplace, Instagram, eBay,
                a floor flyer, or Craigslist from this item&apos;s details.
              </p>
            ) : (
            <>
            <nav className="mt-3 flex flex-wrap gap-1 border-b border-border">
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
            <div className="mt-4">
              {/* Live, platform-accurate preview — updates as the form fields change. */}
              <div className="rounded-lg border border-border bg-[#eef0f2] p-3 sm:p-4">
                <PostPreview item={item} images={images} channel={tab} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="admin-help">
                  Live preview — edit the fields above and it updates. SKU lands on save.
                </p>
                <button
                  type="button"
                  onClick={copyActive}
                  className="admin-btn admin-btn-outline px-3 py-1.5 text-xs"
                >
                  Copy {tab === "instagram" ? "caption" : tab === "flyer" ? "flyer text" : "post text"}
                </button>
              </div>
            </div>
            </>
            )}
          </div>

          {/* Scene images */}
          <div className="border-t border-border pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="font-mono mb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Scene photos
                </div>
                <p className="admin-help">
                  Photo-realistic renders of <strong>this exact item</strong> in real rooms, built from
                  your cover photo. Added shots save with the item; your real cover always ships first.
                </p>
              </div>
              <button
                type="button"
                onClick={generate}
                disabled={running || !coverImage || picked.size === 0}
                className="admin-btn admin-btn-primary"
              >
                {running ? `Generating ${picked.size}…` : `Generate ${picked.size} scene${picked.size === 1 ? "" : "s"}`}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {SCENES.map((s) => {
                const on = picked.has(s.key);
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggleScene(s.key)}
                    title={s.sub}
                    className={
                      "rounded-full border px-3 py-1 text-xs transition " +
                      (on
                        ? "border-[var(--brand-priceless)] bg-[var(--brand-priceless)] text-white"
                        : "border-border bg-white text-foreground hover:border-[var(--brand-priceless)]")
                    }
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {results.length > 0 ? (
              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Preview</h3>
                  <button
                    type="button"
                    onClick={addAll}
                    disabled={results.every((r) => !r.image)}
                    className="admin-btn admin-btn-outline px-2.5 py-1 text-xs"
                  >
                    Add all to item
                  </button>
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {results.map((v) => (
                    <li key={v.scene} className="overflow-hidden border border-border bg-white">
                      {v.image ? (
                        <>
                          <div className="relative aspect-[4/3] w-full bg-[#fafaf9]">
                            <Image
                              src={v.image}
                              alt={`${fields.title} in ${v.scene}`}
                              fill
                              sizes="(min-width:768px) 33vw, 50vw"
                              className="object-cover"
                              unoptimized
                            />
                            <span className="font-mono absolute right-1 top-1 bg-amber-600/95 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-white">
                              AI
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 p-2">
                            <span className="text-xs font-medium text-foreground">
                              {SCENES.find((s) => s.key === v.scene)?.label ?? v.scene}
                            </span>
                            <button
                              type="button"
                              onClick={() => addOne(v.image!, v.scene)}
                              className="admin-btn admin-btn-primary px-2.5 py-1 text-xs"
                            >
                              Add
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 bg-[#fafaf9] p-3 text-center">
                          <span className="text-xs font-semibold text-foreground">
                            {SCENES.find((s) => s.key === v.scene)?.label ?? v.scene}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Failed: {v.reason ?? "no image"}
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
