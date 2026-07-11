import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

/**
 * Rejuvenation-style product card: flat, no radius, no glow.
 * Price block is a fixed two-line stack so cards with/without MSRP align.
 */
export function ProductCard({
  item,
  href,
  priority = false,
}: {
  item: CatalogItem;
  href?: string;
  priority?: boolean;
}) {
  const hasMsrp = Boolean(item.msrp && item.msrp > item.price);
  const savings = hasMsrp ? Math.round((1 - item.price / item.msrp!) * 100) : 0;

  return (
    <Link
      href={href ?? `/shop/item/${item.sku}`}
      className="group relative block overflow-hidden bg-white"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--taupe)]">
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-[var(--soft)]/55">
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
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          quality={75}
          priority={priority}
        />
        {savings > 0 ? (
          <span className="absolute left-3 top-3 z-20 bg-[var(--rust)] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-white">
            {savings}% off
          </span>
        ) : null}
        {item.badges?.[0] ? (
          <span className="absolute right-3 top-3 z-20 bg-[var(--ink)]/85 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-white">
            {item.badges[0]}
          </span>
        ) : null}
      </div>
      <div className="relative py-4 pr-1">
        <div className="font-display text-base leading-snug line-clamp-2 sm:text-lg">{item.title}</div>
        <div className="mt-1 min-h-[1.15rem] text-xs font-light text-[var(--soft)] line-clamp-1">
          {item.subtitle || "\u00A0"}
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-medium tabular-nums tracking-tight sm:text-xl">
              {item.price > 0 ? (
                formatCurrency(item.price)
              ) : (
                <span className="text-base font-light">Call for price</span>
              )}
            </div>
            {/* Always reserve the compare-at line so every card shares the same rhythm */}
            <div className="mt-0.5 min-h-[1.1rem] text-[11px] tabular-nums sm:text-xs">
              {hasMsrp ? (
                <span className="text-[var(--rust)] line-through">
                  Retail {formatCurrency(item.msrp!)}
                </span>
              ) : (
                <span className="invisible" aria-hidden>
                  Retail $0
                </span>
              )}
            </div>
          </div>
          <div className="hidden max-w-[46%] shrink-0 text-right text-[0.62rem] font-medium uppercase leading-snug tracking-[0.1em] text-[var(--soft)] sm:block">
            <div className="line-clamp-2">{item.location || "On the floor"}</div>
            <div className="mt-0.5 tabular-nums">SKU {item.sku}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
