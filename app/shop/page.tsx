import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, byBrand } from "@/lib/catalog";

export default function ShopIndex() {
  const all = byBrand("priceless");
  const entries = Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, (typeof CATEGORIES)[keyof typeof CATEGORIES]][];

  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HEADER */}
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-10">
        <div className="grid items-end gap-x-10 gap-y-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">
              Shop · {all.length} items on the floor right now
            </div>
            <h1 className="font-display mt-3 text-6xl leading-[1.05] md:text-8xl">
              The whole <span className="text-[var(--brand-priceless)]">warehouse,</span><br />by department.
            </h1>
          </div>
          <p className="font-serif text-base italic text-[var(--muted-foreground)] md:col-span-4 md:text-lg">
            Pricing reflects current floor stock. Tap "Online Hold" on any item and we'll set it aside for 48 hours.
          </p>
        </div>
      </section>

      {/* DEPARTMENTS. Horizontal scroll strip */}
      <section className="border-y bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="font-mono mb-4 text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            8 departments
          </div>
          <ul className="-mx-6 flex snap-x snap-mandatory gap-px overflow-x-auto bg-[var(--border)] px-6 pb-3">
            {entries.map(([key, cat], i) => (
              <li key={key} className="snap-start" style={{ width: "min(72vw, 320px)" }}>
                <Link href={`/shop/${key}`} className="group relative block aspect-[3/4] overflow-hidden bg-black">
                  <Image src={cat.image} alt={cat.label} fill sizes="320px" className="object-cover transition duration-700 group-hover:scale-105" quality={70} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute left-4 top-4 font-mono bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--foreground)]">
                    {String(i + 1).padStart(2, "0")} / Dept
                  </div>
                  <div className="absolute left-5 right-5 bottom-5 text-white">
                    <div className="font-display text-3xl leading-none">{cat.label}.</div>
                    <div className="mt-2 line-clamp-2 text-xs text-white/80">{cat.blurb}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* INVENTORY GRID */}
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-20">
        <div className="grid items-end gap-x-10 gap-y-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">
              Everything in stock
            </div>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">
              {all.length} items, <span className="text-[var(--brand-priceless)]">last refreshed today.</span>
            </h2>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] md:col-span-4 md:text-right">
            Sort · Featured / Newest / Price ↑ / Price ↓
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {all.map((it) => <ProductCard key={it.id} item={it} />)}
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
