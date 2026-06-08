"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

type Line = { item: CatalogItem; qty: number };

const TAX_RATE = 0.055; // Marathon County, WI

export function PosRegister({ items }: { items: CatalogItem[] }) {
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [tender, setTender] = useState<"cash" | "card" | "finance" | null>(null);
  const [received, setReceived] = useState<string>("");

  const matches = useMemo(() => {
    if (!query.trim()) return items.slice(0, 12);
    const q = query.toLowerCase();
    return items.filter((c) => c.sku.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)).slice(0, 12);
  }, [items, query]);

  const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;
  const change = received ? Math.max(0, Number(received) - total) : 0;

  function add(item: CatalogItem) {
    setLines((prev) => {
      const existing = prev.find((l) => l.item.sku === item.sku);
      if (existing) return prev.map((l) => l.item.sku === item.sku ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { item, qty: 1 }];
    });
  }

  function setQty(sku: string, qty: number) {
    if (qty <= 0) {
      setLines((prev) => prev.filter((l) => l.item.sku !== sku));
      return;
    }
    setLines((prev) => prev.map((l) => l.item.sku === sku ? { ...l, qty } : l));
  }

  function complete() {
    if (lines.length === 0) {
      toast.error("Add something to the cart first.");
      return;
    }
    if (!tender) {
      toast.error("Pick a payment method.");
      return;
    }
    toast.success(`Sale ${formatCurrency(total)} complete · receipt printing`);
    setLines([]);
    setTender(null);
    setReceived("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      {/* LEFT: scan / search / pick */}
      <div>
        <div className="admin-card mb-4 p-3">
          <label className="admin-label">Scan or search</label>
          <input
            autoFocus
            type="search"
            placeholder="SKU · barcode auto-adds"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              const hit = items.find((c) => c.sku.toLowerCase() === v.trim().toLowerCase());
              if (hit) {
                add(hit);
                setQuery("");
              }
            }}
            className="admin-input font-mono text-lg"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Quick add · {matches.length} items</span>
            <button onClick={() => setLines([])} className="admin-btn admin-btn-ghost px-2 py-1 text-xs">Clear cart</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {matches.map((it) => (
            <button
              key={it.sku}
              type="button"
              onClick={() => add(it)}
              className="group admin-card overflow-hidden text-left transition hover:border-[var(--brand-priceless)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f4f4f3]">
                <Image src={it.image} alt={it.title} fill className="object-cover transition duration-300 group-hover:scale-[1.04]" sizes="200px" quality={50} />
              </div>
              <div className="p-2">
                <div className="line-clamp-1 text-xs font-medium leading-tight">{it.title}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">{it.sku}</span>
                  <span className="font-mono text-sm font-semibold tabular-nums">{formatCurrency(it.price)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: cart + tender */}
      <aside className="admin-card p-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold text-foreground">Cart</h2>
          <span className="text-xs text-muted-foreground">{lines.length} item{lines.length === 1 ? "" : "s"}</span>
        </div>
        <ul className="divide-y divide-border">
          {lines.length === 0 ? (
            <li className="rounded-md border-2 border-dashed border-border bg-[#fafaf9] px-3 py-8 text-center text-sm text-muted-foreground">
              Scan a tag or pick an item
            </li>
          ) : lines.map((l) => (
            <li key={l.item.sku} className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-3 py-2.5">
              <div className="relative aspect-square overflow-hidden rounded bg-[#f4f4f3]">
                <Image src={l.item.image} alt="" fill className="object-cover" sizes="40px" quality={50} />
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-sm font-medium leading-tight">{l.item.title}</div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-mono">{l.item.sku}</span> · {formatCurrency(l.item.price)} ea
                </div>
              </div>
              <div className="inline-flex items-center rounded border border-border">
                <button onClick={() => setQty(l.item.sku, l.qty - 1)} className="h-7 w-7 hover:bg-[#f4f4f3]">−</button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                <button onClick={() => setQty(l.item.sku, l.qty + 1)} className="h-7 w-7 hover:bg-[#f4f4f3]">+</button>
              </div>
              <div className="w-16 text-right font-mono text-sm font-semibold tabular-nums">{formatCurrency(l.item.price * l.qty)}</div>
            </li>
          ))}
        </ul>

        {lines.length > 0 ? (
          <div className="mt-4">
            <dl className="space-y-1.5 border-y border-border py-3 text-sm">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              <Row label={`Sales tax (${(TAX_RATE * 100).toFixed(1)}%)`} value={formatCurrency(tax)} />
            </dl>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">{formatCurrency(total)}</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {(["cash", "card", "finance"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTender(t)}
                  className={
                    "admin-btn " + (tender === t ? "admin-btn-primary" : "admin-btn-outline")
                  }
                >
                  {t === "finance" ? "Synchrony" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {tender === "cash" ? (
              <div className="mt-4">
                <label className="admin-label">Cash received</label>
                <input
                  type="number"
                  step="0.01"
                  value={received}
                  onChange={(e) => setReceived(e.target.value)}
                  placeholder="0.00"
                  className="admin-input font-mono text-2xl tabular-nums"
                />
                {Number(received) > 0 ? (
                  <div className="mt-3 flex items-center justify-between rounded-md border-l-4 border-emerald-500 bg-emerald-50/60 px-3 py-2 text-sm text-emerald-800">
                    <span className="font-medium">Change due</span>
                    <span className="font-mono text-lg font-semibold tabular-nums">{formatCurrency(change)}</span>
                  </div>
                ) : null}
              </div>
            ) : null}

            <button onClick={complete} className="admin-btn admin-btn-primary mt-4 w-full">
              Complete sale · {formatCurrency(total)}
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono tabular-nums">{value}</dd>
    </div>
  );
}
