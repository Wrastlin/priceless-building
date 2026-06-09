"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

const TAX_RATE = 0.055;

export function CheckoutForm({ catalog }: { catalog: CatalogItem[] }) {
  const { lines, clear } = useCart();
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [pay, setPay] = useState<"hold" | "card">("hold");
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const rows = useMemo(() => lines.map((l) => {
    const item = catalog.find((c) => c.sku === l.sku);
    return item ? { item, qty: l.qty } : null;
  }).filter(Boolean) as { item: CatalogItem; qty: number }[], [lines, catalog]);

  const subtotal = rows.reduce((s, r) => s + r.item.price * r.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const delivery = fulfillment === "delivery" ? 79 : 0;
  const total = subtotal + tax + delivery;

  function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rows.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    const id = `PL-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    setConfirmed(id);
    clear();
    toast.success(`Order ${id} confirmed`);
  }

  if (confirmed) {
    return (
      <div className="mt-8 rounded-xl border bg-white p-10 text-center shadow-card">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</div>
        <h2 className="font-display mt-4 text-2xl">Order {confirmed} confirmed</h2>
        <p className="mt-2 text-[var(--muted-foreground)]">
          We've emailed you a receipt. Pickup at the rear load-bay door, 825 Washington St. Usually
          ready in 60 minutes during open hours.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn btn-priceless">Back to home</Link>
          <Link href="/shop" className="btn btn-outline">Keep shopping</Link>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mt-8 rounded-xl border bg-white p-12 text-center shadow-card">
        <p className="text-[var(--muted-foreground)]">Add something to your cart first.</p>
        <Link href="/shop" className="btn btn-priceless mt-5">Shop the warehouse</Link>
      </div>
    );
  }

  return (
    <form onSubmit={placeOrder} className="mt-12 grid gap-12 md:grid-cols-12">
      <div className="space-y-12 md:col-span-7">
        <Section index="01" title="Your info">
          <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
            <Input name="name" label="Name" required />
            <Input name="phone" label="Phone" type="tel" required />
            <Input name="email" label="Email" type="email" required wide />
          </div>
        </Section>

        <Section index="02" title="Fulfillment">
          <div className="grid gap-px bg-[var(--border)] md:grid-cols-2">
            {(["pickup", "delivery"] as const).map((f) => {
              const active = fulfillment === f;
              return (
                <label key={f} className={"flex cursor-pointer items-start gap-4 bg-white p-5 " + (active ? "ring-2 ring-inset ring-[var(--brand-priceless)]" : "")}>
                  <input type="radio" name="fulfillment" checked={active} onChange={() => setFulfillment(f)} className="mt-1" />
                  <div>
                    <div className="font-display text-xl leading-tight">{f === "pickup" ? "Pickup" : "Local delivery"}</div>
                    <div className="font-mono mt-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {f === "pickup" ? "Free · usually 60 min" : "$79 flat · 25 mi · 1–3 day"}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          {fulfillment === "delivery" ? (
            <div className="mt-6 grid gap-x-6 gap-y-5 md:grid-cols-2">
              <Input name="addr1" label="Street address" required wide />
              <Input name="city" label="City" defaultValue="Wausau" required />
              <Input name="state" label="State" defaultValue="WI" required />
              <Input name="zip" label="ZIP" defaultValue="54403" required />
            </div>
          ) : null}
        </Section>

        <Section index="03" title="Payment">
          <div className="grid gap-px bg-[var(--border)] md:grid-cols-2">
            {(["hold", "card"] as const).map((p) => {
              const active = pay === p;
              return (
                <label key={p} className={"flex cursor-pointer items-start gap-4 bg-white p-5 " + (active ? "ring-2 ring-inset ring-[var(--brand-priceless)]" : "")}>
                  <input type="radio" checked={active} onChange={() => setPay(p)} className="mt-1" />
                  <div>
                    <div className="font-display text-xl leading-tight">{p === "hold" ? "Hold + pay in store" : "Card · Stripe"}</div>
                    <div className="font-mono mt-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {p === "hold" ? "No card needed · reserved 48 hours" : "Charged when we confirm stock"}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </Section>
      </div>

      <aside className="h-fit border-l border-[var(--border)] pl-8 md:col-span-5">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
          Order · {rows.length} item{rows.length === 1 ? "" : "s"}
        </div>
        <ul className="mt-6 divide-y">
          {rows.map((r) => (
            <li key={r.item.sku} className="grid grid-cols-[40px_1fr_auto] items-center gap-4 py-3">
              <div className="relative aspect-square overflow-hidden bg-[var(--muted)]">
                <Image src={r.item.image} alt="" fill className="object-cover" sizes="40px" quality={50} />
              </div>
              <div className="min-w-0">
                <div className="font-display line-clamp-1 text-base leading-tight">{r.item.title}</div>
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">× {r.qty}</div>
              </div>
              <div className="font-display text-base">{formatCurrency(r.item.price * r.qty)}</div>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-3">
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          <Row label={`Tax (${(TAX_RATE * 100).toFixed(1)}%)`} value={formatCurrency(tax)} />
          <Row label={fulfillment === "pickup" ? "Pickup" : "Delivery"} value={delivery === 0 ? "Free" : formatCurrency(delivery)} />
        </dl>
        <div className="mt-6 flex items-end justify-between border-t pt-4">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Total</span>
          <span className="font-display text-4xl">{formatCurrency(total)}</span>
        </div>
        <button type="submit" className="btn btn-priceless mt-6 w-full">Place order</button>
        <p className="font-serif mt-4 text-xs italic text-[var(--muted-foreground)]">
          By placing this order you agree to a 48-hour pickup window and our return policy.
        </p>
      </aside>
    </form>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 border-b pb-3">
        <span className="font-mono text-xs tracking-tighter text-[var(--brand-priceless)]">{index}</span>
        <h2 className="font-display text-2xl">{title}.</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Input({ label, wide, ...rest }: { label: string; wide?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={"block " + (wide ? "md:col-span-2" : "")}>
      <span className="font-mono mb-2 block text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{label}</span>
      <input className="w-full border-0 border-b border-[var(--border)] bg-transparent px-0 py-2 text-base focus:border-[var(--brand-priceless)] focus:outline-none focus:ring-0" {...rest} />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{label}</dt>
      <dd className="font-display text-base">{value}</dd>
    </div>
  );
}
