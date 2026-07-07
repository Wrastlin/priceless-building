"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { createDraftFromFormAction } from "@/lib/actions/staging";
import { fileToCompressedDataUrl, readJsonSafe } from "@/lib/client/media";
import { AddItemMarketing } from "./add-item-marketing";
import type { Comparable, Suggestion, TrackedPhoto } from "./types";
import { Disclosure, Field, Group, Panel } from "./form-ui";
import { PhotoGrid } from "./photo-grid";
import { ComparablesList } from "./comparables-list";
import { TagPreview } from "./tag-preview";

const CATEGORIES = [
  "doors",
  "windows",
  "cabinets",
  "vanities",
  "countertops",
  "hardware",
  "lighting",
  "trim",
];

export function NewItemForm() {
  // Photos — each tagged with provenance so we can enforce the
  // "at least one real photo" rule.
  const [photos, setPhotos] = useState<TrackedPhoto[]>([]);

  // Optional free-text context staff can type before analysis.
  const [context, setContext] = useState("");

  // Item fields (AI auto-fills these; staffer can override).
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("doors");
  const [manufacturer, setManufacturer] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [location, setLocation] = useState("");
  const [qty, setQty] = useState(1);
  // Private (never public) — what we paid + which liquidation buy it came from.
  const [cost, setCost] = useState("");
  const [sourceLot, setSourceLot] = useState("");

  // Pricing
  const [comparables, setComparables] = useState<Comparable[]>([]);
  const [retailAvg, setRetailAvg] = useState(0);
  const [tagPrice, setTagPrice] = useState<number | "">("");

  // Broaden the comparable reach beyond the big-four retailers — for
  // unique / specialty / special-value items the big boxes don't carry.
  const [broaden, setBroaden] = useState(false);

  // UI state
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [saving, startSaving] = useTransition();
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  // Read + downscale each file in the browser. Full-resolution phone
  // photos base64-encode to several MB each; sending a few of them blew
  // past Vercel's request-body limit and the analyze call came back as
  // plain-text "Request Entity Too Large" (the old `Unexpected token 'R'`
  // crash). Shrinking here also keeps the saved item JSON small, since
  // photos persist as data URLs.
  async function readFiles(files: FileList): Promise<string[]> {
    return Promise.all(Array.from(files).map((f) => fileToCompressedDataUrl(f)));
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const data = await readFiles(files);
    const tracked = data.map<TrackedPhoto>((url) => ({ url, source: "real" }));
    setPhotos((prev) => [...prev, ...tracked]);
    e.target.value = "";
  }

  function removePhoto(i: number) {
    setPhotos((p) => p.filter((_, idx) => idx !== i));
  }

  function setAsCover(i: number) {
    setPhotos((p) => {
      if (p[i]?.source !== "real") {
        toast.error("Cover photo must be a real photo of the actual item.");
        return p;
      }
      const copy = [...p];
      const [picked] = copy.splice(i, 1);
      return picked ? [picked, ...copy] : copy;
    });
  }

  // Optional bg cleanup — adds a new photo, doesn't replace the original.
  const [cleaningIdx, setCleaningIdx] = useState<number | null>(null);
  async function cleanPhoto(i: number) {
    const src = photos[i]?.url;
    if (!src) return;
    setCleaningIdx(i);
    try {
      const res = await fetch("/api/clean-background", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: src }),
      });
      const parsed = await readJsonSafe<{ image?: string | null; reason?: string }>(res);
      if (!parsed.ok || !parsed.data?.image) {
        toast.error(`Cleanup failed: ${parsed.error ?? parsed.data?.reason ?? "unknown"}`);
        return;
      }
      const data = parsed.data;
      setPhotos((p) => [...p, { url: data.image!, source: "ai-cleaned" }]);
      toast.success("Background cleaned. Original kept.");
    } catch (err) {
      toast.error(`Cleanup failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setCleaningIdx(null);
    }
  }

  // The one button that does it all: vision + comparables + pricing.
  async function analyzeAndPrice() {
    const realPhotos = photos.filter((p) => p.source === "real").map((p) => p.url);
    if (realPhotos.length === 0 && !context.trim()) {
      toast.error("Add at least one real photo or some context text first.");
      return;
    }
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-and-price", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ images: realPhotos, context: context.trim(), broaden }),
      });
      const parsed = await readJsonSafe<{
        suggestion?: Suggestion | null;
        comparables?: Comparable[];
        retailAverage?: number;
        suggestedTagPrice?: number;
        reason?: string;
      }>(res);
      if (!parsed.ok && parsed.error) {
        toast.error(`Analyze failed: ${parsed.error}`);
        return;
      }
      const data = parsed.data ?? {};
      const s = data.suggestion ?? null;
      if (s) {
        if (s.title && !title) setTitle(s.title);
        if (s.subtitle && !subtitle) setSubtitle(s.subtitle);
        if (s.category && CATEGORIES.includes(s.category)) setCategory(s.category);
        if (s.manufacturer && !manufacturer) setManufacturer(s.manufacturer);
        if (s.dimensions && !dimensions) setDimensions(s.dimensions);
      }
      const comps = data.comparables ?? [];
      setComparables(comps);
      setRetailAvg(data.retailAverage ?? 0);
      if (data.suggestedTagPrice && data.suggestedTagPrice > 0) {
        setTagPrice(data.suggestedTagPrice);
      } else if (s?.estimatedRetail && (!data.retailAverage || data.retailAverage === 0)) {
        // Fall back to AI's retail estimate if SerpAPI returned nothing.
        const fallbackAvg = s.estimatedRetail;
        setRetailAvg(fallbackAvg);
        setTagPrice(Math.round(fallbackAvg * 0.7)); // 30% off when we have no real comps
      }
      setAnalyzed(true);
      if (s || comps.length > 0) {
        toast.success(
          `Analyzed${s ? "" : " (no vision result)"} · ${comps.length} comparable${comps.length === 1 ? "" : "s"} found`,
        );
      } else {
        toast.error(`No results: ${data.reason ?? "try a better photo or more context"}`);
      }
    } catch (err) {
      toast.error(`Analyze failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setAnalyzing(false);
    }
  }

  // Re-search comparables only (no vision re-run). Used when the
  // staffer edits the AI-suggested title to be more specific and wants
  // fresh comparables for the new query.
  const [reSearching, setReSearching] = useState(false);
  async function reSearchComparables() {
    const q = title.trim();
    if (q.length < 3) {
      toast.error("Add at least 3 characters in the title first.");
      return;
    }
    setReSearching(true);
    try {
      const res = await fetch(
        `/api/comparables?q=${encodeURIComponent(q)}${broaden ? "&broaden=1" : ""}`,
      );
      const parsed = await readJsonSafe<{ comparables: Comparable[]; average: number; suggested: number }>(res);
      if (!parsed.ok || !parsed.data) {
        throw new Error(parsed.error ?? `HTTP ${res.status}`);
      }
      const data = parsed.data;
      setComparables(data.comparables ?? []);
      setRetailAvg(data.average ?? 0);
      if (data.suggested && data.suggested > 0) setTagPrice(data.suggested);
      toast.success(`${data.comparables?.length ?? 0} comparables · avg $${data.average}`);
    } catch (err) {
      toast.error(`Search failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setReSearching(false);
    }
  }

  // Live discount calculations for the slider UI.
  const tagPriceNum = typeof tagPrice === "number" ? tagPrice : 0;
  const pctOfRetail = retailAvg > 0 ? Math.round((tagPriceNum / retailAvg) * 100) : 0;
  const customerSaves = retailAvg > tagPriceNum ? retailAvg - tagPriceNum : 0;
  const sliderMax = retailAvg > 0 ? retailAvg : tagPriceNum * 2;

  function commit() {
    if (!title || !category || !tagPrice) {
      toast.error("Need a title, category and tag price.");
      return;
    }
    if (photos.length === 0) {
      toast.error("Add at least one photo before saving.");
      return;
    }
    const hasReal = photos.some((p) => p.source === "real");
    if (!hasReal) {
      toast.error("At least one real photo of the actual item is required.");
      return;
    }
    if (photos[0]?.source !== "real") {
      toast.error("Cover photo (first) must be a real photo.");
      return;
    }
    const topComp = comparables[0];

    const fd = new FormData();
    fd.set("title", title);
    fd.set("subtitle", subtitle);
    fd.set("category", category);
    fd.set("manufacturer", manufacturer);
    fd.set("dimensions", dimensions);
    fd.set("price", String(tagPrice));
    if (retailAvg > 0) fd.set("msrp", String(retailAvg));
    if (topComp) {
      fd.set("comparable_retailer", topComp.source);
      fd.set("comparable_price", String(topComp.price));
      fd.set("comparable_url", topComp.url);
    }
    if (comparables.length > 0) {
      fd.set("comparables", JSON.stringify(comparables));
    }
    fd.set("location", location);
    fd.set("inStock", String(qty));
    if (cost.trim()) fd.set("cost", cost.trim());
    if (sourceLot.trim()) fd.set("source_lot", sourceLot.trim());
    fd.set("image", photos[0]!.url);
    if (photos.length > 1) {
      fd.set("gallery", JSON.stringify(photos.slice(1).map((p) => p.url)));
    }

    startSaving(async () => {
      try {
        await createDraftFromFormAction(fd);
      } catch (err) {
        if (err instanceof Error && /NEXT_REDIRECT/.test(err.message)) throw err;
        toast.error(`Save failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  const canAnalyze = useMemo(
    () => photos.some((p) => p.source === "real") || context.trim().length > 0,
    [photos, context],
  );

  const realCount = photos.filter((p) => p.source === "real").length;

  return (
    <div className="mx-auto max-w-6xl pb-24">
      {/* Two-column workspace. LEFT = capture the item and let AI price it.
          RIGHT = the listing you're building. On phones the columns stack in
          this same order, so floor entry stays a clean top-to-bottom path. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        {/* ───────── LEFT: capture + AI ───────── */}
        <div className="space-y-6">
          <Panel>
            <Group title="Photos" hint={`${photos.length} added`}>
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="admin-btn admin-btn-primary"
                >
                  📷 Take photo
                </button>
                <button
                  type="button"
                  onClick={() => libraryRef.current?.click()}
                  className="admin-btn admin-btn-outline"
                >
                  + Add from library
                </button>
                {photos.length === 0 ? (
                  <span className="self-center text-xs text-muted-foreground">
                    At least one real photo required. Multiple angles + a tag close-up help the AI.
                  </span>
                ) : null}
              </div>

              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onFiles}
                className="hidden"
              />
              <input
                ref={libraryRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFiles}
                className="hidden"
              />

              {photos.length === 0 ? (
                <button
                  type="button"
                  onClick={() => libraryRef.current?.click()}
                  aria-label="Add a photo"
                  className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-[oklch(0.975_0.008_85)] text-muted-foreground transition hover:border-[var(--brand-navy)] hover:bg-white"
                >
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Add a photo</span>
                  <span className="text-xs">Tap to choose, or use Take photo above</span>
                </button>
              ) : (
                <PhotoGrid
                  photos={photos}
                  cleaningIdx={cleaningIdx}
                  onSetCover={setAsCover}
                  onClean={cleanPhoto}
                  onRemove={removePhoto}
                />
              )}
            </Group>

            <Group title="Identify & price with AI" hint={analyzed ? "done" : undefined} divided>
              <p className="admin-help mb-2">
                Optional context, then one click: AI reads the photos, identifies the item, runs
                live retail comparables (Home Depot / Lowe&apos;s / Menards / Amazon) and suggests
                a tag price from our tiered pricing rules.
              </p>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder='Optional context — e.g. "32-inch hollow-core interior door, slight scuff bottom right. Tag says Masonite Cheyenne."'
                rows={2}
                className="admin-input mb-3 w-full resize-y"
              />
              <label className="mb-3 flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-[oklch(0.975_0.008_85)] px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={broaden}
                  onChange={(e) => setBroaden(e.target.checked)}
                  className="mt-0.5 accent-[var(--brand-navy)]"
                />
                <span className="text-xs leading-relaxed text-foreground">
                  <strong>Broaden the search</strong> — look beyond the big-four retailers to
                  specialty stores, manufacturers, and online sellers. Use for unique or
                  special-value items (antique hardware, designer fixtures, discontinued lines)
                  the big boxes don&apos;t carry.
                </span>
              </label>
              <button
                type="button"
                onClick={analyzeAndPrice}
                disabled={analyzing || !canAnalyze}
                className="admin-btn admin-btn-primary w-full"
              >
                {analyzing
                  ? "Analyzing…"
                  : analyzed
                    ? "Re-analyze with current photos + context"
                    : "Analyze and price"}
              </button>
            </Group>
          </Panel>

          <Panel>
            <Group
              title="Live retail comparables"
              hint={comparables.length > 0 ? `${comparables.length} found` : undefined}
            >
              <ComparablesList comparables={comparables} retailAvg={retailAvg} analyzing={analyzing} />
            </Group>
          </Panel>
        </div>

        {/* ───────── RIGHT: the listing you're building ───────── */}
        <div className="space-y-6">
          <Panel>
            <Group title="Details">
              <div className="space-y-4">
                <Field label="Title">
                  <div className="flex gap-2">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='e.g. "Pre-hung 6-panel interior door 32×80"'
                      className="admin-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={reSearchComparables}
                      disabled={reSearching || title.trim().length < 3}
                      title="Re-search live retail using this exact title"
                      className="admin-btn admin-btn-outline whitespace-nowrap px-2.5 text-xs"
                    >
                      {reSearching ? "Searching…" : "Re-search"}
                    </button>
                  </div>
                </Field>
                <Field label="Subtitle / spec">
                  <input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder='e.g. "Right-hand · Primed white · Hollow core"'
                    className="admin-input"
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Manufacturer">
                    <input
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder='e.g. "Masonite", "JELD-WEN"'
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Dimensions">
                    <input
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder='e.g. "32×80×1-3/4"'
                      className="admin-input"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Category">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c[0].toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Aisle / bin">
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Aisle D · Bay 4" className="admin-input" />
                  </Field>
                  <Field label="Qty">
                    <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="admin-input" />
                  </Field>
                </div>
              </div>
            </Group>

            <Group title="Internal · not shown to customers" divided>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Our cost">
                  <input
                    inputMode="decimal"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="What we paid, e.g. 18.50"
                    className="admin-input"
                  />
                </Field>
                <Field label="Source / lot">
                  <input
                    value={sourceLot}
                    onChange={(e) => setSourceLot(e.target.value)}
                    placeholder="e.g. HD closeout · Mar 2026"
                    className="admin-input"
                  />
                </Field>
              </div>
            </Group>

            <Group title="Tag price" divided>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-muted-foreground">$</span>
                <input
                  type="number"
                  min={0}
                  value={tagPrice}
                  onChange={(e) => setTagPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="0"
                  className="admin-input font-mono text-3xl font-semibold tabular-nums"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {qty > 1 ? `× ${qty} units` : "per unit"}
                </span>
              </div>

              {sliderMax > 0 ? (
                <div className="mt-4">
                  <div className="mb-2 flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">Margin slider — drag to override</span>
                    <span className="font-mono tabular-nums text-foreground">{pctOfRetail}% of retail</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.round(sliderMax)}
                    step={1}
                    value={typeof tagPrice === "number" ? tagPrice : 0}
                    onChange={(e) => setTagPrice(Number(e.target.value))}
                    className="block w-full accent-[var(--brand-navy)]"
                  />
                  <div className="mt-1 flex items-baseline justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    <span>$0</span>
                    <span>${Math.round(sliderMax).toLocaleString()}</span>
                  </div>
                </div>
              ) : null}

              {retailAvg > 0 && tagPriceNum > 0 ? (
                <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg border border-[var(--brand-navy)]/20 bg-[var(--brand-navy)]/5 p-3 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Tag</div>
                    <div className="font-mono mt-0.5 text-base font-semibold tabular-nums">{formatCurrency(tagPriceNum)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Retail avg</div>
                    <div className="font-mono mt-0.5 text-base tabular-nums">{formatCurrency(retailAvg)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Customer saves</div>
                    <div className="font-mono mt-0.5 text-base font-semibold tabular-nums text-[var(--sale-red)]">
                      {customerSaves > 0 ? `${formatCurrency(customerSaves)} (${Math.round((customerSaves / retailAvg) * 100)}%)` : "—"}
                    </div>
                  </div>
                </div>
              ) : null}
            </Group>
          </Panel>

          {/* Save — the primary action, anchored at the bottom of the listing column. */}
          <Panel>
            <p className="admin-help mb-3">
              Generates a SKU and saves a draft. A manager approves it in{" "}
              <Link href="/admin/staging" className="underline hover:no-underline">Staging</Link>{" "}
              before it appears on the storefront.
            </p>
            <button
              type="button"
              onClick={commit}
              disabled={saving}
              className="admin-btn admin-btn-primary w-full"
            >
              {saving ? "Saving…" : `Save to staging (${photos.length} photo${photos.length === 1 ? "" : "s"})`}
            </button>
            {realCount === 0 && photos.length > 0 ? (
              <p className="mt-2 text-xs text-[var(--sale-red)]">
                At least one real photo of the actual item is required to save.
              </p>
            ) : null}
          </Panel>
        </div>
      </div>

      {/* OPTIONAL TOOLS — full width below the workspace, behind disclosures so
          they never clutter the primary path but stay one click away. */}
      <div className="mt-6 space-y-3">
        <div className="font-mono px-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Optional tools
        </div>

        <Disclosure summary="Floor tag preview" hint="how the printed tag will look">
          <p className="admin-help mb-3">
            Live mock of the 4×3&quot; thermal tag the floor printer will produce. Updates as
            you edit. The barcode lands after the SKU is generated on Save.
          </p>
          <TagPreview
            title={title}
            subtitle={subtitle}
            price={tagPriceNum}
            retailAvg={retailAvg}
            dimensions={dimensions}
            location={location}
          />
        </Disclosure>

        <Disclosure summary="Marketing copy & scene photos" hint="listing posts + AI room shots">
          <AddItemMarketing
            fields={{
              title,
              subtitle,
              category,
              manufacturer,
              dimensions,
              location,
              price: tagPriceNum,
              retailAvg,
              inStock: qty,
            }}
            coverImage={photos.find((p) => p.source === "real")?.url ?? null}
            images={photos.map((p) => p.url)}
            onAddPhotos={(urls) =>
              setPhotos((prev) => [...prev, ...urls.map<TrackedPhoto>((url) => ({ url, source: "ai-variant" }))])
            }
          />
        </Disclosure>
      </div>

      {/* Sticky mobile Save bar — keeps the primary action reachable without
          scrolling on phones, where the two columns stack tall. Desktop uses
          the in-column Save button instead. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={commit}
          disabled={saving}
          className="admin-btn admin-btn-primary w-full"
        >
          {saving ? "Saving…" : `Save to staging (${photos.length} photo${photos.length === 1 ? "" : "s"})`}
        </button>
      </div>
    </div>
  );
}
