"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

export function CartButton() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} item${count === 1 ? "" : "s"})`}
      className="font-mono inline-flex h-11 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-[11px] uppercase tracking-[0.22em] text-[var(--foreground)] transition hover:border-[var(--foreground)]/30 hover:bg-[var(--muted)]"
    >
      <span className="hidden sm:inline">Cart</span>
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-[var(--brand-priceless)] px-1.5 text-[10px] font-bold text-white">
        {count}
      </span>
    </Link>
  );
}
