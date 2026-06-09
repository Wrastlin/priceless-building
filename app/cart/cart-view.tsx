"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/lib/cart";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

const TAX_RATE = 0.055;

export function CartView({ catalog }: { catalog: CatalogItem[] }) {
  const { lines, setQty, remove, clear } = useCart();

  const rows = useMemo(() => {
    return lines
      .map((l) => {
        const item = catalog.find((c) => c.sku === l.sku);
        return item ? { item, qty: l.qty } : null;
      })
      .filter(Boolean) as { item: CatalogItem; qty: number }[];
  }, [lines, catalog]);

  const subtotal = rows.reduce((s, r) => s + r.item.price * r.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  if (rows.length === 0) {
    return (
      <div className="mt-12 border-y border-[var(--border)] py-16 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">Empty cart</div>
        <p className="font-serif mt-4 text-3xl italic md:text-4xl">Find something on the floor and we'll hold it for pickup.</p>
        <Link href="/shop" className="btn btn-priceless mt-8">Shop the warehouse</Link>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-12 md:grid-cols-12">
      <div className="md:col-span-8">
        <div className="font-mono flex items-center justify-between border-b pb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          <span>{rows.length} item{rows.length === 1 ? "" : "s"}</span>
          <button onClick={clear} className="underline decoration-[var(--muted-foreground)]/30 decoration-2 underline-offset-4 hover:text-[var(--brand-priceless)]">
            Clear cart
          </button>
        </div>
        <ul className="divide-y">
          {rows.map((r) => (
            <li key={r.item.sku} className="grid grid-cols-[80px_1fr_auto_auto] items-center gap-5 py-5">
              <Link href={`/shop/item/${r.item.sku}`} className="relative aspect-square overflow-hidden bg-[var(--muted)]">
                <Image src={r.item.image} alt="" fill className="object-cover" sizes="80px" quality={60} />
              </Link>
              <div className="min-w-0">
                <Link href={`/shop/item/${r.item.sku}`} className="font-display text-xl leading-tight hover:text-[var(--brand-priceless)]">{r.item.title}</Link>
                <div className="font-serif mt-0.5 text-xs italic text-[var(--muted-foreground)]">{r.item.subtitle}</div>
                <div className="font-mono mt-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  SKU {r.item.sku} · {r.item.location}
                </div>
              </div>
              <div className="font-mono inline-flex items-center gap-1 text-[12px]">
                <button onClick={() => setQty(r.item.sku, r.qty - 1)} className="h-8 w-8 border hover:bg-[var(--muted)]">−</button>
                <span className="w-8 text-center text-sm font-bold">{r.qty}</span>
                <button onClick={() => setQty(r.item.sku, r.qty + 1)} className="h-8 w-8 border hover:bg-[var(--muted)]">+</button>
              </div>
              <div className="text-right">
                <div className="font-display text-xl">{formatCurrency(r.item.price * r.qty)}</div>
                <button onClick={() => remove(r.item.sku)} className="font-mono mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] underline decoration-2 underline-offset-2 hover:text-[var(--brand-priceless)]">remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit border-l border-[var(--border)] pl-8 md:col-span-4">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">Order summary</div>
        <dl className="mt-6 space-y-3">
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          <Row label={`Sales tax (${(TAX_RATE * 100).toFixed(1)}%)`} value={formatCurrency(tax)} />
          <Row label="Pickup at warehouse" value="Free" />
        </dl>
        <div className="mt-6 flex items-end justify-between border-t pt-4">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Total</span>
          <span className="font-display text-4xl">{formatCurrency(total)}</span>
        </div>
        <Link href="/checkout" className="btn btn-priceless mt-6 w-full">Checkout</Link>
        <p className="font-serif mt-4 text-xs italic text-[var(--muted-foreground)]">
          Pickup is free at 825 Washington St. Local delivery within Marathon County starts at $79.
        </p>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{label}</dt>
      <dd className="font-display text-base">{value}</dd>
    </div>
  );
}
