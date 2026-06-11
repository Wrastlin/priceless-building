"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { CatalogItem } from "@/lib/items/types";

type SortKey = "title" | "sku" | "category" | "price" | "msrp" | "inStock" | "createdAt";

interface SortState {
  key: SortKey;
  dir: "asc" | "desc";
}

/**
 * Sortable + searchable inventory table.
 *
 * Search matches across SKU, title, subtitle, category, manufacturer
 * and location. Category and brand dropdowns narrow the visible set.
 * Click a column header to toggle ascending / descending sort.
 *
 * Mock cost / margin / days-on-shelf columns are gone — we don't track
 * cost basis or shelf age yet, and pretending we do was misleading.
 */
export function InventoryTable({ items }: { items: CatalogItem[] }) {
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortState>({ key: "createdAt", dir: "desc" });

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
      return [
        i.sku,
        i.title,
        i.subtitle,
        i.category,
        i.manufacturer ?? "",
        i.location ?? "",
      ]
        .some((s) => s.toLowerCase().includes(needle));
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
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="admin-input w-auto"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c[0].toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="admin-input w-auto"
        >
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

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <SortableTH label="Item" sortKey="title" sort={sort} onToggle={toggleSort} />
              <SortableTH label="SKU" sortKey="sku" sort={sort} onToggle={toggleSort} />
              <SortableTH label="Category" sortKey="category" sort={sort} onToggle={toggleSort} />
              <SortableTH label="Tag" sortKey="price" align="right" sort={sort} onToggle={toggleSort} />
              <SortableTH label="Retail" sortKey="msrp" align="right" sort={sort} onToggle={toggleSort} />
              <SortableTH label="Qty" sortKey="inStock" align="right" sort={sort} onToggle={toggleSort} />
              <SortableTH label="Added" sortKey="createdAt" align="right" sort={sort} onToggle={toggleSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No items match the current filters.
                </td>
              </tr>
            ) : (
              sorted.map((c) => {
                const savings = c.msrp && c.msrp > c.price ? Math.round((1 - c.price / c.msrp) * 100) : 0;
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-[#f4f4f3]">
                          <Image
                            src={c.image}
                            alt={c.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                            quality={50}
                            unoptimized={c.image.startsWith("data:")}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground">{c.title}</div>
                          <div className="text-xs text-muted-foreground">{c.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-muted-foreground">{c.sku}</td>
                    <td className="text-xs capitalize text-muted-foreground">{c.category}</td>
                    <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(c.price)}</td>
                    <td className="text-right">
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {c.msrp ? formatCurrency(c.msrp) : "–"}
                      </span>
                      {savings > 0 ? (
                        <span className="font-mono ml-1 text-[10px] text-[var(--brand-priceless)] tabular-nums">
                          –{savings}%
                        </span>
                      ) : null}
                    </td>
                    <td className="text-right tabular-nums">{c.inStock}</td>
                    <td className="text-right text-xs text-muted-foreground tabular-nums">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "–"}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/admin/inventory/${c.sku}`}
                        className="text-sm text-[var(--brand-priceless)] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SortableTH({
  label,
  sortKey,
  align = "left",
  sort,
  onToggle,
}: {
  label: string;
  sortKey: SortKey;
  align?: "left" | "right";
  sort: SortState;
  onToggle: (k: SortKey) => void;
}) {
  const active = sort.key === sortKey;
  return (
    <th className={align === "right" ? "text-right" : ""}>
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
