import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

/**
 * Product card — links to the department aisle (no individual product pages
 * while digital catalog checkout is deferred).
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
  const to = href ?? `/shop/${item.category}`;

  return (
    <Link
      href={to}
      className="group relative block overflow-hidden bg-white"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[var(--taupe)] sm:aspect-[4/3]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            quality={75}
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--soft)]/50">
            <span className="text-xs uppercase tracking-wider">No photo</span>
          </div>
        )}
        {savings > 0 ? (
          <span className="absolute left-2 top-2 z-20 bg-[var(--rust)] px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.65rem]">
            {savings}% off
          </span>
        ) : null}
        {item.badges?.[0] ? (
          <span className="absolute right-2 top-2 z-20 bg-[var(--ink)]/85 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-white sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.65rem]">
            {item.badges[0]}
          </span>
        ) : null}
      </div>
      <div className="relative px-3 py-3 sm:px-4 sm:py-4">
        <div className="font-display text-[0.95rem] leading-snug line-clamp-2 sm:text-lg">{item.title}</div>
        {item.subtitle ? (
          <div className="mt-0.5 hidden text-xs font-light text-[var(--soft)] line-clamp-1 sm:mt-1 sm:block">
            {item.subtitle}
          </div>
        ) : null}

        <div className="mt-2 flex items-start justify-between gap-3 sm:mt-3 sm:gap-4">
          <div className="min-w-0">
            <div className="text-base font-medium tabular-nums tracking-tight sm:text-xl">
              {item.price > 0 ? (
                formatCurrency(item.price)
              ) : (
                <span className="text-sm font-light sm:text-base">Call for price</span>
              )}
            </div>
            {hasMsrp ? (
              <div className="mt-0.5 text-[10px] tabular-nums text-[var(--rust)] line-through sm:text-xs">
                Retail {formatCurrency(item.msrp!)}
              </div>
            ) : null}
          </div>
          <div className="hidden max-w-[42%] shrink-0 text-right text-[0.62rem] font-medium uppercase leading-snug tracking-[0.1em] text-[var(--soft)] sm:block">
            <div className="line-clamp-2">{item.location || "On the floor"}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
