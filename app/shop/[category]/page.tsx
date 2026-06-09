import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, byCategory, type Category } from "@/lib/catalog";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!(category in CATEGORIES)) notFound();
  const cat = CATEGORIES[category as Category];
  const items = byCategory("priceless", category as Category);
  const allKeys = Object.keys(CATEGORIES) as Category[];
  const idx = allKeys.indexOf(category as Category);

  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO. Editorial half-image / half-copy */}
      <section className="grid border-b md:grid-cols-12">
        <div className="relative aspect-[4/3] md:col-span-7 md:aspect-auto md:min-h-[420px]">
          <Image src={cat.image} alt={cat.label} fill className="object-cover" priority quality={80} sizes="(min-width:768px) 60vw, 100vw" />
          <span className="font-mono absolute left-6 top-6 bg-white px-2.5 py-1.5 text-xs uppercase tracking-[0.14em] text-[var(--foreground)]">
            Department No. {String(idx + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-6 px-6 py-12 md:col-span-5 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
            Aisle · {items.length} items in stock
          </div>
          <h1 className="font-display text-6xl leading-[1.05] md:text-8xl">
            {cat.label}.
          </h1>
          <p className="font-serif text-base italic leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {cat.blurb}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop" className="font-mono text-xs uppercase tracking-[0.14em] underline decoration-[var(--brand-priceless)] decoration-2 underline-offset-4">
              ← All departments
            </Link>
            <Link href="/contact" className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] underline decoration-[var(--muted-foreground)]/40 decoration-2 underline-offset-4">
              Ask about a specific size →
            </Link>
          </div>
        </div>
      </section>

      {/* INVENTORY */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">On the floor today</div>
              <h2 className="font-display mt-3 text-4xl leading-[1.05]">
                {items.length} <span className="text-[var(--brand-priceless)]">{items.length === 1 ? "item" : "items"}.</span>
              </h2>
            </div>
            <div className="font-mono hidden text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] md:block">
              Sort · Featured / Newest / Price ↑ / Price ↓
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mt-10 border bg-white p-16 text-center">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">Empty aisle</div>
              <p className="font-serif mt-3 text-2xl italic">Check back Wednesday. Fresh tags every week.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => <ProductCard key={it.id} item={it} />)}
            </div>
          )}
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
