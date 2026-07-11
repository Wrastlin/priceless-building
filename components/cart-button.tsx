"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

export function CartButton() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} item${count === 1 ? "" : "s"})`}
      className="inline-flex h-9 items-center gap-2 border border-[var(--line)] bg-white px-2.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--ink)] hover:bg-[var(--cream)]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      <span className="inline-flex h-5 min-w-5 items-center justify-center bg-[var(--ink)] px-1 text-[0.65rem] font-medium text-white">
        {count}
      </span>
    </Link>
  );
}
