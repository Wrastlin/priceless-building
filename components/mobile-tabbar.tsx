import Link from "next/link";

/**
 * Sticky bottom tab bar for storefront (mobile). Renders inside the
 * Price-Less storefront only. Builders Corner keeps a single-column
 * footer and doesn't need this. Five slots: Shop, Map, Tour, Cart, Help.
 */
export function MobileTabbar() {
  const tabs = [
    { href: "/shop", label: "Shop", icon: "🛒" },
    { href: "/reviews", label: "Reviews", icon: "★" },
    { href: "/builders-corner", label: "Premier", icon: "✦" },
    { href: "/cart", label: "Cart", icon: "🧾" },
    { href: "/contact", label: "Help", icon: "📞" },
  ];
  return (
    <div className="pointer-events-none sticky bottom-0 z-30 mt-12 md:hidden">
      <div className="pointer-events-auto mx-3 mb-3 flex items-center justify-between gap-1 rounded-2xl border bg-white/95 p-1 shadow-lg backdrop-blur">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          >
            <span aria-hidden className="text-base">{t.icon}</span>
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
