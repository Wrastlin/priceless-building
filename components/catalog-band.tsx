import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, type CatalogItem } from "@/lib/catalog";

/**
 * Catalog band on the home page. Quiet eyebrow + search at top, soft
 * category-pill row underneath, then twelve mixed product cards
 * pulled across all categories. People see real items immediately
 * instead of being told that categories exist.
 */
export function CatalogBand({ items }: { items: CatalogItem[] }) {
  return (
    <section className="bg-[var(--muted)]">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8"
          data-reveal
        >
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
            On the floor right now
          </div>
          <form
            role="search"
            action="/search"
            method="get"
            className="flex h-11 w-full items-center gap-2.5 rounded-md border border-[var(--border)] bg-white px-3.5 transition focus-within:border-[var(--brand-priceless)] hover:border-[var(--foreground)]/30 md:w-96"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-[var(--brand-priceless)]"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              name="q"
              type="search"
              placeholder="Search doors, windows, cabinets…"
              aria-label="Search the warehouse"
              className="flex-1 min-w-0 border-0 bg-transparent p-0 text-sm font-medium text-[var(--foreground)] placeholder:font-medium placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-0 md:text-base"
            />
          </form>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2" data-reveal>
          <span className="font-mono mr-1 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            Browse
          </span>
          {(Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, (typeof CATEGORIES)[keyof typeof CATEGORIES]][]).map(([key, cat]) => (
            <Link
              key={key}
              href={`/shop/${key}`}
              className="inline-flex h-9 items-center rounded-full border border-[var(--border)] bg-white px-3.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--brand-priceless)] hover:text-[var(--brand-priceless)]"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <ProductCard key={it.id} item={it} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-8">
          <p className="text-base text-[var(--foreground)] md:text-lg">
            Much more on the floor than what fits here.
          </p>
          <Link href="/shop" className="btn btn-priceless">
            Shop all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
