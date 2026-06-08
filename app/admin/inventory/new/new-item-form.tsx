"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { createDraftFromFormAction } from "@/lib/actions/staging";

type Comparable = {
  source: string;
  title: string;
  price: number;
  url: string;
  image: string;
};

export function NewItemForm() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("doors");
  const [manufacturer, setManufacturer] = useState("");
  const [location, setLocation] = useState("");
  const [qty, setQty] = useState(1);
  const [tagPrice, setTagPrice] = useState<number | "">("");
  const [comparables, setComparables] = useState<Comparable[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, startSaving] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function pickFile() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(f);
  }

  async function runCompare() {
    if (!title.trim()) {
      toast.error("Add a short description first so we know what to search.");
      return;
    }
    setSearching(true);
    setComparables([]);
    try {
      const res = await fetch(`/api/comparables?q=${encodeURIComponent(title.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { comparables: Comparable[]; average: number; suggested: number };
      setComparables(data.comparables);
      setTagPrice(data.suggested);
      toast.success(`Found ${data.comparables.length} comparables · suggesting ${formatCurrency(data.suggested)}`);
    } catch (err) {
      toast.error(`Search failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setSearching(false);
    }
  }

  function commit() {
    if (!title || !category || !tagPrice) {
      toast.error("Need a title, category and tag price.");
      return;
    }
    if (!photo) {
      toast.error("Add a photo before saving.");
      return;
    }
    const avg =
      comparables.length > 0
        ? Math.round(comparables.reduce((s, c) => s + c.price, 0) / comparables.length)
        : 0;
    const topComp = comparables[0];

    const fd = new FormData();
    fd.set("title", title);
    fd.set("subtitle", subtitle);
    fd.set("category", category);
    fd.set("manufacturer", manufacturer);
    fd.set("price", String(tagPrice));
    if (topComp) {
      fd.set("msrp", String(topComp.price));
      fd.set("comparable_retailer", topComp.source);
      fd.set("comparable_price", String(topComp.price));
      fd.set("comparable_url", topComp.url);
    } else if (avg > 0) {
      fd.set("msrp", String(avg));
    }
    fd.set("location", location);
    fd.set("inStock", String(qty));
    fd.set("image", photo);

    startSaving(async () => {
      try {
        await createDraftFromFormAction(fd);
        // server action redirects to /admin/staging on success
      } catch (err) {
        // NEXT_REDIRECT is how the redirect surfaces — let it bubble.
        if (err instanceof Error && /NEXT_REDIRECT/.test(err.message)) throw err;
        toast.error(`Save failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* LEFT: capture + describe */}
      <div className="space-y-5">
        <Section title="Photograph">
          <p className="admin-help mb-3">Tap to capture on iPad, or pick a file from the camera roll.</p>
          <button
            type="button"
            onClick={pickFile}
            className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-border bg-[#fafaf9] text-sm text-muted-foreground transition hover:border-[var(--brand-priceless)] hover:text-foreground"
          >
            {photo ? (
              <Image src={photo} alt="captured" width={800} height={600} className="h-full w-full object-cover" />
            ) : (
              <span>+ Tap to capture</span>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
        </Section>

        <Section title="Describe">
          <div className="space-y-4">
            <Field label="Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g. "Pre-hung 6-panel interior door 32×80"'
                className="admin-input"
              />
            </Field>
            <Field label="Subtitle / spec">
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder='e.g. "Right-hand · Primed white · Hollow core"'
                className="admin-input"
              />
            </Field>
            <Field label="Manufacturer">
              <input
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder='e.g. "Masonite", "JELD-WEN"'
                className="admin-input"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Category">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
                  <option value="doors">Doors</option>
                  <option value="windows">Windows</option>
                  <option value="cabinets">Cabinets</option>
                  <option value="vanities">Vanities</option>
                  <option value="countertops">Countertops</option>
                  <option value="hardware">Hardware</option>
                  <option value="lighting">Lighting</option>
                  <option value="trim">Trim</option>
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
        </Section>
      </div>

      {/* RIGHT: comparables + price + commit */}
      <div className="space-y-5">
        <Section title="Find comparables">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="admin-help">Live SerpApi search · Home Depot · Menards · Lowe&apos;s · Amazon.</p>
            <button type="button" onClick={runCompare} disabled={searching} className="admin-btn admin-btn-primary">
              {searching ? "Searching…" : "Search live retail"}
            </button>
          </div>
          {comparables.length === 0 ? (
            <div className="mt-4 rounded-md border-2 border-dashed border-border bg-[#fafaf9] p-6 text-center text-sm text-muted-foreground">
              {searching ? "Searching retailers…" : "No search yet"}
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {comparables.map((c, i) => (
                <li key={i} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 py-2.5">
                  <div className="relative aspect-square overflow-hidden rounded bg-[#f4f4f3]">
                    <Image src={c.image} alt={c.source} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[var(--brand-priceless)]">{c.source}</div>
                    <div className="truncate text-sm">{c.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold tabular-nums">{formatCurrency(c.price)}</div>
                    <a href={c.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground hover:underline">view</a>
                  </div>
                </li>
              ))}
              <li className="flex items-center justify-between py-2.5">
                <span className="text-sm font-medium text-muted-foreground">Retail average</span>
                <span className="font-mono text-sm font-semibold tabular-nums">{formatCurrency(Math.round(comparables.reduce((s, c) => s + c.price, 0) / comparables.length))}</span>
              </li>
            </ul>
          )}
        </Section>

        <Section title="Set tag price">
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
          {comparables.length > 0 && typeof tagPrice === "number" && tagPrice > 0 ? (
            <p className="mt-3 border-l-2 border-[var(--brand-priceless)] pl-3 text-sm text-foreground">
              Priced at <strong>{Math.round((tagPrice / (comparables.reduce((s, c) => s + c.price, 0) / comparables.length)) * 100)}%</strong> of retail. Saving customers <strong>{formatCurrency(Math.round(comparables.reduce((s, c) => s + c.price, 0) / comparables.length) - tagPrice)}</strong> vs. the big-box average.
            </p>
          ) : null}
        </Section>

        <Section title="Save to staging">
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
            {saving ? "Saving…" : "Save to staging"}
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-card p-5">
      <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}
