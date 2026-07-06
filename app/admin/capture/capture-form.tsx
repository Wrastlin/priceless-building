"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { fileToCompressedDataUrl, readJsonSafe } from "@/lib/client/media";
import type { TagExtract } from "@/lib/items/types";

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

const LAST_CATEGORY_KEY = "capture:lastCategory";
const NEXT_TAG_KEY = "capture:nextTag";

type QueueEntry = {
  id: string;
  category: string;
  count: number;
  tagStart?: number;
  dimensions?: string;
  price?: number;
  note?: string;
  photos: string[];
  status: "saving" | "saved" | "failed";
  sku?: string;
  extract?: TagExtract | null;
  error?: string;
};

function rangeLabel(start: number, count: number): string {
  return count === 1 ? `#${start}` : `#${start}–#${start + count - 1}`;
}

export function CaptureForm() {
  // Category and the sticker-roll counter are sticky between items (and
  // visits), so a run of 40 doors never re-asks for either.
  const [category, setCategory] = useState("doors");
  const [tagStart, setTagStart] = useState<number | "">(1);
  useEffect(() => {
    const savedCat = window.localStorage.getItem(LAST_CATEGORY_KEY);
    if (savedCat && CATEGORIES.includes(savedCat)) setCategory(savedCat);
    const savedTag = Number(window.localStorage.getItem(NEXT_TAG_KEY));
    if (Number.isInteger(savedTag) && savedTag > 0) setTagStart(savedTag);
  }, []);
  function pickCategory(c: string) {
    setCategory(c);
    window.localStorage.setItem(LAST_CATEGORY_KEY, c);
  }

  // Per-entry fields
  const [count, setCount] = useState(1);
  const [dimensions, setDimensions] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [reading, setReading] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const dimensionsRef = useRef<HTMLInputElement>(null);

  // Entries already sent off — each saves in the background while the
  // staffer keeps stickering. Newest first.
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setReading(true);
    try {
      const data = await Promise.all(
        Array.from(files).map((f) => fileToCompressedDataUrl(f)),
      );
      setPhotos((prev) => [...prev, ...data]);
    } finally {
      setReading(false);
      e.target.value = "";
    }
  }

  function patchEntry(id: string, patch: Partial<QueueEntry>) {
    setQueue((q) => q.map((en) => (en.id === id ? { ...en, ...patch } : en)));
  }

  async function submitEntry(entry: QueueEntry) {
    try {
      const res = await fetch("/api/capture-item", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          category: entry.category,
          count: entry.count,
          tagStart: entry.tagStart,
          dimensions: entry.dimensions,
          price: entry.price,
          note: entry.note,
          images: entry.photos,
        }),
      });
      const parsed = await readJsonSafe<{
        sku?: string;
        extract?: TagExtract | null;
        reason?: string;
      }>(res);
      if (!parsed.ok || !parsed.data?.sku) {
        patchEntry(entry.id, {
          status: "failed",
          error: parsed.error ?? parsed.data?.reason ?? `HTTP ${res.status}`,
        });
        return;
      }
      patchEntry(entry.id, {
        status: "saved",
        sku: parsed.data.sku,
        extract: parsed.data.extract ?? null,
        error: parsed.data.reason,
      });
    } catch (err) {
      patchEntry(entry.id, {
        status: "failed",
        error: err instanceof Error ? err.message : "network error",
      });
    }
  }

  // Queue the current entry and reset for the next one. The save runs in
  // the background — the floor loop never waits on the network. The tag
  // counter advances by however many units this entry covered.
  function saveAndNext() {
    const start = typeof tagStart === "number" ? tagStart : undefined;
    if (!start) {
      toast.error("Set the next sticker number first.");
      return;
    }
    const entry: QueueEntry = {
      id: `C${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      category,
      count,
      tagStart: start,
      dimensions: dimensions.trim() || undefined,
      price: price.trim() ? Number(price) : undefined,
      note: note.trim() || undefined,
      photos,
      status: "saving",
    };
    setQueue((q) => [entry, ...q]);
    void submitEntry(entry);

    const nextTag = start + count;
    setTagStart(nextTag);
    window.localStorage.setItem(NEXT_TAG_KEY, String(nextTag));
    setCount(1);
    setDimensions("");
    setPrice("");
    setNote("");
    setPhotos([]);
    dimensionsRef.current?.focus();
  }

  function retry(id: string) {
    const entry = queue.find((en) => en.id === id);
    if (!entry) return;
    patchEntry(id, { status: "saving", error: undefined });
    void submitEntry({ ...entry, status: "saving" });
  }

  const savedCount = queue.filter((en) => en.status === "saved").length;
  const startNum = typeof tagStart === "number" ? tagStart : 0;

  return (
    <div className="mx-auto max-w-xl space-y-4 pb-32">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={onFiles}
        className="hidden"
      />

      {/* Category + sticker counter — both sticky between entries */}
      <div className="admin-card space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="admin-label">Category (sticks)</span>
            <select
              value={category}
              onChange={(e) => pickCategory(e.target.value)}
              className="admin-input w-full text-base"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c[0].toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="admin-label">Next sticker #</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={tagStart}
              onChange={(e) =>
                setTagStart(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))
              }
              className="admin-input w-full font-mono text-base tabular-nums"
            />
          </label>
        </div>

        <div>
          <span className="admin-label">How many identical units?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              aria-label="Fewer units"
              className="admin-btn admin-btn-outline h-12 w-12 justify-center p-0 text-xl"
            >
              −
            </button>
            <span className="font-mono w-12 text-center text-2xl font-semibold tabular-nums">
              {count}
            </span>
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(500, c + 1))}
              aria-label="More units"
              className="admin-btn admin-btn-outline h-12 w-12 justify-center p-0 text-xl"
            >
              +
            </button>
            {startNum > 0 ? (
              <span className="ml-auto rounded bg-[#fff5f4] px-3 py-2 text-sm font-semibold text-[var(--brand-priceless)]">
                Sticker {rangeLabel(startNum, count)}
              </span>
            ) : null}
          </div>
          <p className="admin-help mt-1.5">
            Put one numbered sticker on EACH unit. 7 matching doors = 7 stickers, one entry.
          </p>
        </div>
      </div>

      {/* Quick measured facts — all optional, no guessing */}
      <div className="admin-card space-y-3 p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="admin-label">Width / size</span>
            <input
              ref={dimensionsRef}
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder={'e.g. 24" or 32×80'}
              className="admin-input w-full text-base"
            />
          </label>
          <label className="block">
            <span className="admin-label">Price on old tag ($)</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="158"
              className="admin-input w-full font-mono text-base tabular-nums"
            />
          </label>
        </div>
        <label className="block">
          <span className="admin-label">Note (optional)</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. oak 10-lite, aisle 3, scuffed corner"
            className="admin-input w-full text-base"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={reading}
            className="admin-btn admin-btn-outline"
          >
            {reading ? "Loading…" : photos.length === 0 ? "📷 Photos (optional)" : `📷 Add more (${photos.length})`}
          </button>
          {photos.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              Skip for speed — a tag close-up gets auto-transcribed if you add one.
            </span>
          ) : null}
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {photos.map((p, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded bg-[#f4f4f3]">
                <Image src={p} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" unoptimized />
                <button
                  type="button"
                  onClick={() => setPhotos((ph) => ph.filter((_, idx) => idx !== i))}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Queue of entries already captured this session */}
      {queue.length > 0 ? (
        <div className="admin-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold text-foreground">This session</h2>
            <span className="text-xs text-muted-foreground">
              {savedCount}/{queue.length} saved ·{" "}
              {queue.reduce((n, en) => n + en.count, 0)} units
            </span>
          </div>
          <ul className="divide-y divide-border">
            {queue.map((en) => (
              <li key={en.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="font-mono min-w-[64px] text-xs font-semibold tabular-nums text-foreground">
                  {en.tagStart ? rangeLabel(en.tagStart, en.count) : "—"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {[en.dimensions, en.category].filter(Boolean).join(" ")}
                    {en.count > 1 ? ` × ${en.count}` : ""}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {en.status === "saved" ? (
                      <>
                        <span className="font-mono">{en.sku}</span>
                        {en.extract?.productName ? ` · ${en.extract.productName}` : ""}
                      </>
                    ) : en.status === "failed" ? (
                      en.error ?? "unknown error"
                    ) : (
                      "Saving…"
                    )}
                  </div>
                </div>
                {en.status === "saving" ? (
                  <span className="admin-pill bg-amber-50 text-amber-700">Saving…</span>
                ) : en.status === "saved" ? (
                  <Link
                    href={`/admin/inventory/${en.sku}`}
                    className="admin-btn admin-btn-ghost px-2 py-1 text-xs text-[var(--brand-priceless)]"
                  >
                    Open
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => retry(en.id)}
                    className="admin-btn admin-btn-outline px-2.5 py-1 text-xs"
                  >
                    Retry
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Sticky save bar — sticker the units, punch in the facts, Save & next */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-3 backdrop-blur">
        <div className="mx-auto max-w-xl">
          <button
            type="button"
            onClick={saveAndNext}
            disabled={typeof tagStart !== "number"}
            className="admin-btn admin-btn-primary w-full py-4 text-base"
          >
            {startNum > 0
              ? `Save ${rangeLabel(startNum, count)} · next starts #${startNum + count}`
              : "Save & next"}
          </button>
        </div>
      </div>
    </div>
  );
}
