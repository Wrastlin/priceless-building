"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ item, href }: { item: CatalogItem; href?: string }) {
  const savings = item.msrp && item.msrp > item.price ? Math.round((1 - item.price / item.msrp) * 100) : 0;
  const ref = useRef<HTMLAnchorElement>(null);

  // Cursor-tracking light. Two CSS vars (--mx, --my) feed a radial
  // gradient on a sibling absolute span so the rest of the card stays
  // GPU-friendly (no re-render per mousemove).
  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <Link
      ref={ref}
      onMouseMove={onMove}
      href={href ?? `/shop/item/${item.sku}`}
      className="group relative block overflow-hidden border border-[var(--border)] bg-white transition hover:border-[var(--brand-priceless)] hover:-translate-y-0.5"
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      {/* Cursor-tracking light */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), rgba(185, 28, 28, 0.10), transparent 60%)",
        }}
      />
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
        {/* Fallback placeholder so a missing image reads as "photo
            coming soon" instead of empty gray space. The real Image
            sits on top and covers the placeholder when it loads. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-[var(--muted-foreground)]/55">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-xs uppercase tracking-wider">Photo coming soon</span>
        </div>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          quality={75}
        />
        {savings > 0 ? (
          <span className="font-mono absolute left-0 top-3 bg-[var(--brand-priceless)] px-3 py-1 text-xs font-bold tracking-tight text-white">
            {savings}% OFF
          </span>
        ) : null}
        {item.badges?.[0] ? (
          <span className="font-mono absolute right-3 top-3 bg-black/75 px-2.5 py-1 text-xs uppercase tracking-wider text-white">
            {item.badges[0]}
          </span>
        ) : null}
      </div>
      <div className="relative p-5">
        <div className="font-display text-lg leading-tight tracking-[0.01em]">{item.title}</div>
        <div className="mt-1 text-xs text-[var(--muted-foreground)]">{item.subtitle}</div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="font-display text-2xl">
              {item.price > 0 ? formatCurrency(item.price) : <span className="text-lg">Call for price</span>}
            </div>
            {item.msrp && item.msrp > item.price ? (
              <div className="font-mono mt-0.5 text-xs text-[var(--muted-foreground)] line-through">
                Retail {formatCurrency(item.msrp)}
              </div>
            ) : null}
          </div>
          <div className="font-mono text-right text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            <div>{item.location}</div>
            <div className="mt-0.5">SKU {item.sku}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
