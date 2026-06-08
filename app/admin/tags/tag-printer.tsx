"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

/**
 * Real Code 128 barcode pulled from the SVG endpoint so the floor iPad
 * can scan it. The endpoint is `force-static` so each SKU's barcode is
 * cached forever.
 */
function Barcode({ value }: { value: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/api/barcode/${value}.svg`} alt={`Barcode ${value}`} className="h-12 w-auto" />;
}

export function TagPrinter({ initialItems, all }: { initialItems: CatalogItem[]; all: CatalogItem[] }) {
  const [selected, setSelected] = useState<CatalogItem[]>(initialItems);
  const [query, setQuery] = useState("");
  const results = query ? all.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.sku.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [];

  function add(item: CatalogItem) {
    if (selected.find((s) => s.sku === item.sku)) return;
    setSelected((s) => [...s, item]);
    setQuery("");
  }

  function remove(sku: string) {
    setSelected((s) => s.filter((c) => c.sku !== sku));
  }

  function print() {
    toast.success(`${selected.length} tag${selected.length === 1 ? "" : "s"} sent to thermal printer · Floor #1`);
    setTimeout(() => window.print(), 250);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
      <div className="admin-card p-5">
        <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">Queue</h2>

        <div className="relative mt-4">
          <label className="admin-label">Add item</label>
          <input
            type="search"
            placeholder="Search SKU or title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="admin-input"
          />
          {results.length > 0 ? (
            <ul className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-md border border-border bg-white shadow-lg">
              {results.map((r) => (
                <li key={r.sku} className="border-b border-border last:border-0">
                  <button onClick={() => add(r)} className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f4f4f3]">
                    <span className="font-mono text-xs text-muted-foreground">{r.sku}</span> · {r.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <ul className="mt-4 divide-y divide-border border-y border-border">
          {selected.length === 0 ? (
            <li className="rounded-md border-2 border-dashed border-border bg-[#fafaf9] p-6 text-center text-sm text-muted-foreground">
              Empty queue · add an item to print
            </li>
          ) : selected.map((c, i) => (
            <li key={c.sku} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 py-2.5">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <div className="font-mono text-xs text-muted-foreground">{c.sku}</div>
                <div className="truncate text-sm font-medium">{c.title}</div>
              </div>
              <button onClick={() => remove(c.sku)} className="admin-btn admin-btn-ghost px-2 py-1 text-xs text-rose-700">
                remove
              </button>
            </li>
          ))}
        </ul>

        <button onClick={print} disabled={selected.length === 0} className="admin-btn admin-btn-primary mt-5 w-full">
          Print {selected.length} tag{selected.length === 1 ? "" : "s"}
        </button>
      </div>

      <div className="admin-card p-5">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold text-foreground">Preview</h2>
          <span className="text-xs text-muted-foreground">4 × 3&quot; thermal</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {selected.map((c) => <Tag key={c.sku} item={c} />)}
        </div>
      </div>
    </div>
  );
}

function Tag({ item }: { item: CatalogItem }) {
  const savings = item.msrp && item.msrp > item.price ? Math.round((1 - item.price / item.msrp) * 100) : 0;
  return (
    <div className="rounded-md border-2 border-black bg-white p-3" style={{ aspectRatio: "4 / 3" }}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-wider">PRICE-LESS BUILDING</div>
        <div className="font-mono text-[10px]">{item.sku}</div>
      </div>
      <div className="mt-1 line-clamp-2 text-sm font-bold leading-tight">{item.title}</div>
      <div className="mt-0.5 text-[10px] text-muted-foreground">{item.subtitle}</div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="font-mono text-2xl font-bold tabular-nums">{formatCurrency(item.price)}</div>
          {item.msrp ? (
            <div className="text-[10px]">
              <span className="line-through">{formatCurrency(item.msrp)}</span>
              {savings > 0 ? <span className="ml-1 font-bold text-[var(--brand-priceless)]">SAVE {savings}%</span> : null}
            </div>
          ) : null}
        </div>
        <div className="text-right">
          <Barcode value={item.sku} />
        </div>
      </div>
      <div className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">{item.location}</div>
    </div>
  );
}
