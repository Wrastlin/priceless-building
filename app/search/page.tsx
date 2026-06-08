import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { CATALOG, CATEGORIES } from "@/lib/catalog";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const results = q
    ? CATALOG.filter((c) =>
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(q.toLowerCase()) ||
        c.sku.toLowerCase().includes(q.toLowerCase()) ||
        c.category.toLowerCase().includes(q.toLowerCase()),
      )
    : [];

  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">Search · all departments</div>
        <h1 className="font-display mt-3 text-5xl leading-[1.05] md:text-7xl">
          What are you <span className="text-[var(--brand-priceless)]">looking for?</span>
        </h1>

        <form className="mt-8 flex items-center border-b-2 border-[var(--brand-priceless)] pb-2">
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="doors · windows · brands · SKU"
            autoFocus
            className="font-serif flex-1 border-0 bg-transparent px-0 py-2 text-xl italic placeholder:text-[var(--muted-foreground)]/60 focus:outline-none focus:ring-0 md:text-2xl"
          />
          <button className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">Search →</button>
        </form>

        {!q ? (
          <div className="mt-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Popular searches</div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {["doors", "windows", "cabinets", "vanities", "hardware", "trim", "reclaimed", "quartz", "shaker"].map((t) => (
                <Link
                  key={t}
                  href={`/search?q=${t}`}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] underline decoration-[var(--brand-priceless)] decoration-2 underline-offset-4 hover:text-[var(--brand-priceless)]"
                >
                  {t} →
                </Link>
              ))}
            </div>

            <h2 className="font-display mt-16 text-3xl leading-tight">
              Or browse by <span className="text-[var(--brand-priceless)]">department.</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 md:grid-cols-4">
              {(Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, (typeof CATEGORIES)[keyof typeof CATEGORIES]][]).map(([key, cat], i) => (
                <Link key={key} href={`/shop/${key}`} className="group block bg-white p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">No. {String(i + 1).padStart(2, "0")}</div>
                  <div className="font-display mt-2 text-2xl">{cat.label}.</div>
                  <div className="font-serif mt-1 text-xs italic text-[var(--muted-foreground)]">{cat.blurb}</div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {results.length} result{results.length === 1 ? "" : "s"} · "{q}"
            </div>
            {results.length === 0 ? (
              <div className="mt-8 border-y py-16 text-center">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">No match</div>
                <p className="font-serif mt-3 text-2xl italic">Try a department name (doors, windows, cabinets) or a SKU.</p>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
                {results.map((it) => <ProductCard key={it.id} item={it} />)}
              </div>
            )}
          </div>
        )}
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}
