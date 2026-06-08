"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

export function CartButton() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      className="font-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:text-[var(--brand-priceless)]"
    >
      <span>Cart</span>
      <span className="font-mono inline-flex h-5 min-w-5 items-center justify-center bg-[var(--brand-priceless)] px-1.5 text-[10px] font-bold text-white">
        {count}
      </span>
    </Link>
  );
}
