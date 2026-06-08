"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { findItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

const HERO = "/real-photos/building-exterior.webp";

export default function TrackPage() {
  const [orderNo, setOrderNo] = useState("");
  const [email, setEmail] = useState("");
  const [tracked, setTracked] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const item1 = findItem("PL-000201");
  const item2 = findItem("PL-000501");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!orderNo.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setTracked(orderNo.trim().toUpperCase());
      setLoading(false);
    }, 650);
  }

  return (
    <>
      <SiteHeader brand="priceless" />

      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Warehouse aisle" fill className="object-cover" quality={70} priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-white md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            Order tracking
          </div>
          <h1 className="font-display mt-4 text-4xl leading-tight md:text-6xl">Where&apos;s my order?</h1>
          <p className="mt-3 max-w-xl text-white/85">
            Enter your order number and the email you used at checkout. Pickups happen at our back load-bay
            door, seven days from when you placed your order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border bg-white p-8 shadow-card md:p-10">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Order number
              </span>
              <input
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="PL-ORD-XXXXX"
                className="rounded-md border bg-white px-4 py-3 font-mono text-base tracking-wider outline-none focus:border-[var(--brand-priceless)]"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Email on file
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-md border bg-white px-4 py-3 text-base outline-none focus:border-[var(--brand-priceless)]"
              />
            </label>
            <button type="submit" disabled={loading} className="btn btn-priceless mt-2">
              {loading ? "Looking up…" : "Track order"}
            </button>
            <p className="text-xs text-[var(--muted-foreground)]">
              Lost your number? Call (715) 848-3855 and we&apos;ll dig it out of the day&apos;s tickets.
            </p>
          </form>
        </div>

        {tracked ? (
          <div className="mt-10 overflow-hidden rounded-2xl border bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-[var(--muted)] px-6 py-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Order</div>
                <div className="font-mono text-base font-semibold">{tracked}</div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className="size-2 rounded-full bg-emerald-500" /> Ready for pickup
              </span>
            </div>

            <div className="px-6 py-8">
              {/* Progress */}
              <ol className="grid grid-cols-3 gap-3">
                {[
                  { k: "Placed", on: true, when: "Mon 8:42 AM" },
                  { k: "Picked", on: true, when: "Mon 11:05 AM" },
                  { k: "Ready", on: true, when: "Mon 2:18 PM" },
                ].map((s, i) => (
                  <li key={s.k} className="flex flex-col items-center text-center">
                    <div
                      className={
                        "flex size-9 items-center justify-center rounded-full text-sm font-bold " +
                        (s.on
                          ? "bg-[var(--brand-priceless)] text-white"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]")
                      }
                    >
                      {i + 1}
                    </div>
                    <div className="mt-2 font-display text-base">{s.k}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{s.when}</div>
                  </li>
                ))}
              </ol>

              {/* Items */}
              <div className="mt-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  In your order
                </div>
                <ul className="mt-3 divide-y rounded-xl border">
                  {[item1, item2].filter(Boolean).map((it) => (
                    <li key={it!.sku} className="flex items-center gap-4 p-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-[var(--muted)]">
                        <Image src={it!.image} alt={it!.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{it!.title}</div>
                        <div className="truncate text-xs text-[var(--muted-foreground)]">
                          {it!.subtitle} · {it!.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(it!.price)}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">SKU {it!.sku}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pickup */}
              <div className="mt-8 rounded-xl bg-[var(--brand-priceless)]/5 p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
                  Pickup instructions
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  Pull around to the <strong>back load-bay door at 825 Washington St</strong>. Bring this
                  order number and a photo ID. We&apos;ll forklift it to your trailer or strap it down in
                  your truck bed. After-hours? Call ahead. We keep keys to the will-call locker on hand.
                </p>
              </div>

              {/* Contact strip */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white px-5 py-4 text-sm">
                <div>
                  Questions about this pickup?{" "}
                  <a href="tel:+17158483855" className="font-semibold underline">
                    (715) 848-3855
                  </a>
                </div>
                <Link href="/contact" className="btn btn-outline">
                  Send us a note
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
