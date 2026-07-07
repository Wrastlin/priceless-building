import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

/**
 * Server component — no client JS. Grids render dozens of these per page, so
 * keeping the card server-rendered is what lets a category view stay light
 * (the old cursor-tracking glow forced "use client" and hydrated every card).
 * The glow is now a pure-CSS hover effect.
 *
 * `priority` eager-loads the image (use it for the first row, above the fold);
 * every other card lazy-loads by default, so off-screen images never download
 * until the shopper scrolls to them.
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
  const savings = item.msrp && item.msrp > item.price ? Math.round((1 - item.price / item.msrp) * 100) : 0;

  return (
    <Link
      href={href ?? `/shop/item/${item.sku}`}
      className="group relative block overflow-hidden rounded-[14px] border border-[var(--border)] bg-white transition hover:border-[var(--brand-gold)] hover:-translate-y-0.5 hover:shadow-card"
    >
      {/* Hover glow — pure CSS, no per-card JS */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at 50% 0%, oklch(0.72 0.115 78 / 0.12), transparent 60%)",
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
          priority={priority}
        />
        {savings > 0 ? (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-[var(--sale-red)] px-3 py-1 text-xs font-bold tracking-tight text-white">
            {savings}% off
          </span>
        ) : null}
        {item.badges?.[0] ? (
          <span className="absolute right-3 top-3 z-20 rounded-full bg-[var(--brand-navy-deep)]/85 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--cream)]">
            {item.badges[0]}
          </span>
        ) : null}
      </div>
      {/* Tighter padding + smaller type on mobile so two cards sit side by
          side (big-box catalog density). The SKU/location meta is hidden on
          phones to keep each card short; it returns on sm+ screens. */}
      <div className="relative p-3 sm:p-5">
        <div className="font-display text-sm leading-snug line-clamp-2 sm:text-lg">{item.title}</div>
        <div className="mt-1 hidden text-xs text-[var(--muted-foreground)] sm:block">{item.subtitle}</div>
        <div className="mt-2 flex items-end justify-between gap-2 sm:mt-4">
          <div>
            <div className="font-display text-xl sm:text-2xl">
              {item.price > 0 ? formatCurrency(item.price) : <span className="text-base sm:text-lg">Call for price</span>}
            </div>
            {item.msrp && item.msrp > item.price ? (
              <div className="mt-0.5 text-[11px] text-[var(--sale-red)] line-through sm:text-xs">
                Retail {formatCurrency(item.msrp)}
              </div>
            ) : null}
          </div>
          <div className="font-sans font-semibold hidden text-right text-xs uppercase tracking-wider text-[var(--muted-foreground)] sm:block">
            <div>{item.location}</div>
            <div className="mt-0.5">SKU {item.sku}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
