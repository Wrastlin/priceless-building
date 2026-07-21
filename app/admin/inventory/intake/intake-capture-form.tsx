"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, X } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/lib/intake/taxonomy";

/**
 * Photo-first floor intake. One photo is enough to Save.
 * AI description + comps run after save (never block the camera loop).
 */
export function IntakeCaptureForm() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [category, setCategory] = useState("doors");
  const [dimensions, setDimensions] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [printAfter, setPrintAfter] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ sku: string; n: number } | null>(null);
  const [enriching, setEnriching] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const next: string[] = [];
    for (const file of Array.from(files).slice(0, 8)) {
      next.push(await readAsDataUrl(file));
    }
    setPhotos((p) => [...p, ...next].slice(0, 12));
  }

  async function save() {
    if (photos.length === 0) {
      setError("Add at least one photo.");
      return;
    }
    setBusy(true);
    setError(null);
    const catLabel = DEFAULT_CATEGORIES.find((c) => c.id === category)?.label ?? category;
    const body = {
      title: title.trim() || `Untitled · ${catLabel}`,
      category,
      subcategory: undefined,
      price: Number(price) || 0,
      dimensions: dimensions.trim() || undefined,
      note: note.trim() || undefined,
      quantity: 1,
      photos,
      print: printAfter,
      comparables: [],
    };
    try {
      const res = await fetch("/api/admin/intake/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.sku) {
        throw new Error(json.error || `Save failed (${res.status})`);
      }
      const sku = String(json.sku);
      // Soft count from sessionStorage for celebrate Nth
      let n = 1;
      try {
        const key = "pbc_week_saves";
        const raw = sessionStorage.getItem(key);
        n = (raw ? Number(raw) : 0) + 1;
        sessionStorage.setItem(key, String(n));
      } catch {
        /* ignore */
      }
      setSaved({ sku, n });
      setBusy(false);

      // Background enrich — never blocks Add another
      setEnriching(true);
      fetch("/api/admin/intake/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, images: photos.slice(0, 4) }),
      })
        .catch(() => null)
        .finally(() => setEnriching(false));
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  function resetForAnother() {
    setPhotos([]);
    setDimensions("");
    setPrice("");
    setNote("");
    setTitle("");
    setShowMore(false);
    setSaved(null);
    setError(null);
  }

  if (saved) {
    return (
      <div className="mx-auto max-w-md rounded-[16px] border border-[var(--border)] bg-white p-6 text-center shadow-sm">
        <p className="inv-eyebrow mb-2">Saved</p>
        <h2 className="font-[family-name:var(--font-display)] text-[1.5rem] font-medium tracking-tight">
          That&apos;s your {ordinal(saved.n)} this session
        </h2>
        <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
          {saved.sku}
          {enriching ? " · Adding description and retail comps…" : " · Details updating in the background"}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" className="inv-btn inv-btn-primary w-full py-3" onClick={resetForAnother}>
            Add another item
          </button>
          <button
            type="button"
            className="inv-btn inv-btn-secondary w-full"
            onClick={() => router.push(`/admin/inventory/${saved.sku}`)}
          >
            View item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      {/* Camera / photos */}
      <section>
        <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] transition hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]">
          <Camera size={32} strokeWidth={1.75} />
          <span className="text-[15px] font-semibold text-[var(--foreground)]">Take or add photos</span>
          <span className="px-6 text-center text-[12px]">
            One is enough. Add angles, tags, and labels when you can.
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="sr-only"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {photos.length > 0 ? (
          <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {photos.map((src, i) => (
              <li key={i} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                  onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                >
                  <X size={12} />
                </button>
              </li>
            ))}
            <li>
              <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-[12px] font-medium">
                + Add
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="sr-only"
                  onChange={(e) => onFiles(e.target.files)}
                />
              </label>
            </li>
          </ul>
        ) : null}
      </section>

      {/* Category — no subcats */}
      <section>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={
                "rounded-full px-3 py-1.5 text-[13px] font-medium " +
                (category === c.id
                  ? "bg-[var(--brand-navy)] text-white"
                  : "bg-[var(--surface)] text-[var(--foreground)]")
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Measurements */}
      <section>
        <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Measurements
        </label>
        <input
          className="inv-input w-full text-[16px]"
          placeholder='e.g. 36 × 80 × 1¾"'
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          inputMode="text"
        />
      </section>

      {/* Private note */}
      <section>
        <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Private note · damage / context
        </label>
        <textarea
          className="inv-input min-h-[72px] w-full text-[15px]"
          placeholder="Scratch on hinge side, missing screws, from lot B…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">Not shown on the storefront.</p>
      </section>

      <button
        type="button"
        className="text-[13px] font-medium text-[var(--brand-navy)] underline-offset-2 hover:underline"
        onClick={() => setShowMore((v) => !v)}
      >
        {showMore ? "Hide optional" : "Optional: our price / title"}
      </button>
      {showMore ? (
        <div className="space-y-3 rounded-[12px] border border-[var(--border)] p-3">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[var(--muted-foreground)]">
              Our price
            </label>
            <input
              className="inv-input w-full"
              inputMode="decimal"
              placeholder="Leave blank — set later"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[var(--muted-foreground)]">
              Title override
            </label>
            <input
              className="inv-input w-full"
              placeholder="AI will draft after save"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-[13px]">
        <input type="checkbox" checked={printAfter} onChange={(e) => setPrintAfter(e.target.checked)} />
        Print QR sticker after save (store printer)
      </label>

      {error ? (
        <p className="rounded-[10px] bg-[color-mix(in_oklch,var(--sale-red)_12%,white)] px-3 py-2 text-[13px] text-[var(--sale-red)]">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={busy || photos.length === 0}
        onClick={save}
        className="inv-btn inv-btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-[16px]"
      >
        {busy ? <Loader2 className="animate-spin" size={18} /> : null}
        {busy ? "Saving…" : "Save item"}
      </button>
      <p className="text-center text-[12px] text-[var(--muted-foreground)]">
        Description and retail comps fill in after save — you can keep photographing.
      </p>
    </div>
  );
}

function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read photo"));
    r.readAsDataURL(file);
  });
}
