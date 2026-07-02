"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import type { CatalogItem } from "@/lib/items/types";
import { ItemThumbZoom } from "@/components/item-thumb-zoom";
import { updateStockAction } from "@/lib/actions/staging";

type SortKey = "title" | "sku" | "category" | "price" | "msrp" | "inStock" | "createdAt";

interface SortState {
  key: SortKey;
  dir: "asc" | "desc";
}

/**
 * Sortable + searchable inventory.
 *
 * Desktop: a dense table. Phones: a photo-led card grid (md:hidden) so the
 * image is the dominant element for floor scanning. Both share inline +/-
 * stock steppers (optimistic, persisted via updateStockAction) and a
 * category-icon fallback when an item has no real photo.
 */
export function InventoryTable({ items }: { items: CatalogItem[] }) {
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortState>({ key: "createdAt", dir: "desc" });

  // Optimistic stock overrides keyed by SKU; falls back to the item's value.
  const [qtyOverrides, setQtyOverrides] = useState<Record<string, number>>({});
  const [, startSaving] = useTransition();

  const qtyOf = (c: CatalogItem) => qtyOverrides[c.sku] ?? c.inStock;

  function adjust(c: CatalogItem, delta: number) {
    const prev = qtyOf(c);
    const next = Math.max(0, prev + delta);
    if (next === prev) return;
    setQtyOverrides((m) => ({ ...m, [c.sku]: next }));
    startSaving(async () => {
      try {
        await updateStockAction(c.sku, next);
      } catch {
        setQtyOverrides((m) => ({ ...m, [c.sku]: prev }));
        toast.error(`Stock update failed for ${c.sku}`);
      }
    });
  }

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items],
  );
  const brands = useMemo(
    () => Array.from(new Set(items.map((i) => i.brand))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => {
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      if (brandFilter !== "all" && i.brand !== brandFilter) return false;
      if (!needle) return true;
      return [i.sku, i.title, i.subtitle, i.category, i.manufacturer ?? "", i.location ?? ""].some((s) =>
        s.toLowerCase().includes(needle),
      );
    });
  }, [items, q, categoryFilter, brandFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const { key, dir } = sort;
    const mult = dir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      const av = (a[key] ?? "") as string | number;
      const bv = (b[key] ?? "") as string | number;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * mult;
      return String(av).localeCompare(String(bv)) * mult;
    });
    return copy;
  }, [filtered, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  return (
    <>
      <div className="admin-card mb-4 flex flex-wrap items-center gap-2 p-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search SKU, title, location, manufacturer…"
          className="admin-input flex-1 min-w-[220px]"
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="admin-input w-auto">
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c[0].toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="admin-input w-auto">
          <option value="all">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b === "priceless" ? "Price-Less" : "Builders Corner"}
            </option>
          ))}
        </select>
        <span className="font-mono ml-auto text-xs text-muted-foreground tabular-nums">
          {sorted.length} of {items.length}
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="admin-card p-8 text-center text-sm text-muted-foreground">
          No items match the current filters.
        </div>
      ) : (
        <>
          {/* MOBILE: photo-led card grid. */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {sorted.map((c) => {
              const savings = c.msrp && c.msrp > c.price ? Math.round((1 - c.price / c.msrp) * 100) : 0;
              return (
                <div key={c.id} className="admin-card overflow-hidden">
                  <ItemThumbZoom item={c} className="aspect-[4/3] w-full" iconClass="h-10 w-10" />
                  <div className="p-3">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{c.category}</div>
                    <Link
                      href={`/admin/inventory/${c.sku}`}
                      className="mt-0.5 line-clamp-2 block text-sm font-medium leading-tight text-foreground hover:text-[var(--brand-priceless)]"
                    >
                      {c.title}
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-base font-semibold tabular-nums">{formatCurrency(c.price)}</span>
                      {savings > 0 ? (
                        <span className="font-mono text-[10px] text-[var(--brand-priceless)] tabular-nums">–{savings}%</span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                      <span className="text-xs text-muted-foreground">In stock</span>
                      <StockStepper qty={qtyOf(c)} onDec={() => adjust(c, -1)} onInc={() => adjust(c, 1)} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP: dense table. */}
          <div className="admin-card hidden overflow-x-auto md:block">
            <table className="admin-table">
              <thead>
                <tr>
                  <SortableTH label="Item" sortKey="title" sort={sort} onToggle={toggleSort} />
                  <SortableTH label="SKU" sortKey="sku" sort={sort} onToggle={toggleSort} className="hidden lg:table-cell" />
                  <SortableTH label="Category" sortKey="category" sort={sort} onToggle={toggleSort} className="hidden lg:table-cell" />
                  <SortableTH label="Tag" sortKey="price" align="right" sort={sort} onToggle={toggleSort} />
                  <SortableTH label="Retail" sortKey="msrp" align="right" sort={sort} onToggle={toggleSort} className="hidden lg:table-cell" />
                  <SortableTH label="Qty" sortKey="inStock" align="center" sort={sort} onToggle={toggleSort} />
                  <SortableTH label="Added" sortKey="createdAt" align="right" sort={sort} onToggle={toggleSort} className="hidden xl:table-cell" />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => {
                  const savings = c.msrp && c.msrp > c.price ? Math.round((1 - c.price / c.msrp) * 100) : 0;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <ItemThumbZoom item={c} className="h-12 w-16 shrink-0 rounded" iconClass="h-6 w-6" />
                          <div className="min-w-0">
                            <div className="font-medium text-foreground">{c.title}</div>
                            <div className="text-xs text-muted-foreground">{c.subtitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden font-mono text-xs text-muted-foreground lg:table-cell">{c.sku}</td>
                      <td className="hidden text-xs capitalize text-muted-foreground lg:table-cell">{c.category}</td>
                      <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(c.price)}</td>
                      <td className="hidden text-right lg:table-cell">
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {c.msrp ? formatCurrency(c.msrp) : "–"}
                        </span>
                        {savings > 0 ? (
                          <span className="font-mono ml-1 text-[10px] text-[var(--brand-priceless)] tabular-nums">–{savings}%</span>
                        ) : null}
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <StockStepper qty={qtyOf(c)} onDec={() => adjust(c, -1)} onInc={() => adjust(c, 1)} />
                        </div>
                      </td>
                      <td className="hidden text-right text-xs text-muted-foreground tabular-nums xl:table-cell">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "–"}
                      </td>
                      <td className="text-right">
                        <Link href={`/admin/inventory/${c.sku}`} className="text-sm text-[var(--brand-priceless)] hover:underline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

/** Inline +/- stepper for on-hand quantity. */
function StockStepper({ qty, onDec, onInc }: { qty: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={onDec}
        aria-label="Decrease stock"
        className="admin-btn admin-btn-outline h-7 w-7 justify-center p-0 text-base leading-none"
      >
        −
      </button>
      <span className="font-mono w-7 text-center text-sm font-semibold tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={onInc}
        aria-label="Increase stock"
        className="admin-btn admin-btn-outline h-7 w-7 justify-center p-0 text-base leading-none"
      >
        +
      </button>
    </div>
  );
}

function SortableTH({
  label,
  sortKey,
  align = "left",
  sort,
  onToggle,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  align?: "left" | "right" | "center";
  sort: SortState;
  onToggle: (k: SortKey) => void;
  className?: string;
}) {
  const active = sort.key === sortKey;
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "";
  return (
    <th className={`${alignClass} ${className}`.trim()}>
      <button
        type="button"
        onClick={() => onToggle(sortKey)}
        className={
          "inline-flex items-center gap-1 transition hover:text-foreground " +
          (active ? "text-foreground" : "text-muted-foreground")
        }
      >
        {label}
        <span className="font-mono text-[9px]">{active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}</span>
      </button>
    </th>
  );
}
