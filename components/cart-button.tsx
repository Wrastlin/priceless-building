"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

export function CartButton() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} item${count === 1 ? "" : "s"})`}
      className="inline-flex h-11 items-center gap-2.5 rounded-md border border-[var(--border)] bg-white px-3.5 text-base font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/30 hover:bg-[var(--muted)]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[var(--brand-priceless)] px-1.5 text-xs font-bold text-white">
        {count}
      </span>
    </Link>
  );
}
