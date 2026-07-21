"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, X } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/lib/intake/taxonomy";

type Draft = {
  title: string;
  category: string;
  subcategory: string;
  price: string;
  compareAt: string;
  manufacturer: string;
  dimensions: string;
  quantity: string;
  note: string;
};

type ComparableRow = {
  source: string;
  title: string;
  price: number;
  url: string;
  image?: string;
};

export function IntakeCaptureForm() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft>({
    title: "",
    category: "doors",
    subcategory: "exterior",
    price: "",
    compareAt: "",
    manufacturer: "",
    dimensions: "",
    quantity: "1",
    note: "",
  });
  const [comparables, setComparables] = useState<ComparableRow[]>([]);
  const [busy, setBusy] = useState<"idle" | "cleaning" | "analyzing" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);
  const [printAfter, setPrintAfter] = useState(true);
  const [cleanProvider, setCleanProvider] = useState<string | null>(null);

  const subs = useMemo(
    () => DEFAULT_CATEGORIES.find((c) => c.id === draft.category)?.subcategories ?? [],
    [draft.category],
  );

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const next: string[] = [];
    for (const file of Array.from(files).slice(0, 6)) {
      const dataUrl = await readAsDataUrl(file);
      next.push(dataUrl);
    }
    setPhotos((p) => [...p, ...next].slice(0, 8));
  }

  /** Clean each photo (Photoroom → remove.bg → Gemini), then analyze + price. */
  async function analyze() {
    if (photos.length === 0) {
      setError("Add at least one photo first.");
      return;
    }
    setBusy("cleaning");
    setError(null);
    setCleanProvider(null);
    try {
      const cleaned: string[] = [];
      let provider: string | null = null;
      for (const src of photos) {
        const res = await fetch("/api/clean-background", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: src }),
        });
        const json = await res.json().catch(() => ({}));
        if (json.image) {
          cleaned.push(String(json.image));
          if (json.provider) provider = String(json.provider);
        } else {
          // Keep the original if a single clean fails so valuing still runs.
          cleaned.push(src);
        }
      }
      setPhotos(cleaned);
      setCleanProvider(provider);

      setBusy("analyzing");
      const res = await fetch("/api/analyze-and-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: cleaned,
          context: [draft.category, draft.manufacturer, draft.title].filter(Boolean).join(" "),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.reason || json.error || `Analyze failed (${res.status})`);

      const suggestion = json.suggestion ?? {};
      const comps: ComparableRow[] = Array.isArray(json.comparables)
        ? json.comparables.map(
            (c: {
              source?: string;
              title?: string;
              price?: number;
              url?: string;
              image?: string;
            }) => ({
              source: String(c.source || "Retail"),
              title: String(c.title || ""),
              price: Number(c.price) || 0,
              url: String(c.url || ""),
              image: c.image ? String(c.image) : undefined,
            }),
          )
        : [];
      setComparables(comps);

      const tag =
        json.suggestedTagPrice > 0
          ? json.suggestedTagPrice
          : suggestion.estimatedRetail > 0
            ? Math.round(Number(suggestion.estimatedRetail) * 0.45)
            : undefined;
      const compare =
        json.retailAverage > 0
          ? Math.round(json.retailAverage)
          : suggestion.estimatedRetail > 0
            ? Math.round(Number(suggestion.estimatedRetail))
            : undefined;

      setDraft((d) => ({
        ...d,
        title: String(suggestion.title || d.title),
        price: tag != null ? String(tag) : d.price,
        compareAt: compare != null ? String(compare) : d.compareAt,
        manufacturer: String(suggestion.manufacturer || d.manufacturer),
        dimensions: String(suggestion.dimensions || d.dimensions),
        category: String(suggestion.category || d.category),
        subcategory:
          suggestion.category && suggestion.category !== d.category
            ? DEFAULT_CATEGORIES.find((c) => c.id === suggestion.category)?.subcategories[0]?.id ??
              d.subcategory
            : d.subcategory,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analyze failed");
    } finally {
      setBusy("idle");
    }
  }

  async function save() {
    if (!draft.title.trim()) {
      setError("Title is required.");
      return;
    }
    setBusy("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/intake/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title.trim(),
          category: draft.category,
          subcategory: draft.subcategory || undefined,
          price: Number(draft.price) || 0,
          compareAt: draft.compareAt ? Number(draft.compareAt) : undefined,
          manufacturer: draft.manufacturer || undefined,
          dimensions: draft.dimensions || undefined,
          quantity: Math.max(1, Number(draft.quantity) || 1),
          note: draft.note || undefined,
          photos,
          print: printAfter,
          comparables,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || json.error || `Save failed (${res.status})`);
      if (json.print?.ok === false && printAfter) {
        router.push(
          `/admin/inventory/${json.sku}?printMsg=${encodeURIComponent(json.print.message || "Print failed")}`,
        );
        return;
      }
      router.push(`/admin/inventory/${json.sku}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setBusy("idle");
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <section>
        <label className="inv-eyebrow mb-2 block">Photos</label>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-[12px] bg-[var(--surface)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white"
                onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[12px] border border-dashed border-[var(--border)] bg-white text-[var(--muted-foreground)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]">
            <Camera size={20} />
            <span className="text-[11px] font-medium">Add</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>
        </div>
        <button
          type="button"
          className="inv-btn inv-btn-outline mt-3 w-full"
          onClick={analyze}
          disabled={busy !== "idle" || photos.length === 0}
        >
          {busy === "cleaning" || busy === "analyzing" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : null}
          {busy === "cleaning"
            ? "Removing backgrounds…"
            : busy === "analyzing"
              ? "Pricing…"
              : "Clean bg + auto-fill + price"}
        </button>
        {cleanProvider ? (
          <p className="mt-2 text-[12px] text-[var(--muted-foreground)]">
            Backgrounds cleaned via {cleanProvider}
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <label className="inv-eyebrow block">Details</label>
        <input
          className="inv-input"
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            className="inv-input"
            value={draft.category}
            onChange={(e) => {
              const cat = e.target.value;
              const first = DEFAULT_CATEGORIES.find((c) => c.id === cat)?.subcategories[0]?.id ?? "";
              setDraft({ ...draft, category: cat, subcategory: first });
            }}
          >
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            className="inv-input"
            value={draft.subcategory}
            onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })}
          >
            {subs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="inv-input"
            inputMode="decimal"
            placeholder="Price"
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: e.target.value })}
          />
          <input
            className="inv-input"
            inputMode="decimal"
            placeholder="Compare at"
            value={draft.compareAt}
            onChange={(e) => setDraft({ ...draft, compareAt: e.target.value })}
          />
        </div>
        <input
          className="inv-input"
          placeholder="Manufacturer"
          value={draft.manufacturer}
          onChange={(e) => setDraft({ ...draft, manufacturer: e.target.value })}
        />
        <input
          className="inv-input"
          placeholder="Dimensions"
          value={draft.dimensions}
          onChange={(e) => setDraft({ ...draft, dimensions: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            className="inv-input"
            inputMode="numeric"
            placeholder="Qty"
            value={draft.quantity}
            onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
          />
          <input
            className="inv-input"
            placeholder="Note"
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          />
        </div>
      </section>

      {comparables.length > 0 ? (
        <section className="rounded-[14px] border border-[var(--border)] bg-white p-4">
          <p className="inv-eyebrow mb-2">Comparables ({comparables.length})</p>
          <ul className="max-h-48 space-y-2 overflow-y-auto text-[13px]">
            {comparables.slice(0, 8).map((c, i) => (
              <li key={i} className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 truncate text-[var(--muted-foreground)]">
                  <span className="font-medium text-[var(--brand-navy)]">{c.source}</span> · {c.title}
                </span>
                <span className="shrink-0 font-mono font-semibold tabular-nums">
                  ${c.price.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <label className="flex items-center gap-2 text-[14px]">
        <input
          type="checkbox"
          checked={printAfter}
          onChange={(e) => setPrintAfter(e.target.checked)}
          className="size-4 accent-[var(--brand-navy)]"
        />
        Print QR label after save
      </label>

      {error ? (
        <p className="rounded-[12px] bg-[color-mix(in_oklch,var(--sale-red)_12%,white)] px-3 py-2 text-[13px] text-[var(--sale-red)]">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="inv-btn inv-btn-primary w-full py-3 text-[15px]"
        onClick={save}
        disabled={busy !== "idle"}
      >
        {busy === "saving" ? <Loader2 className="animate-spin" size={16} /> : null}
        Save to inventory
      </button>
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
