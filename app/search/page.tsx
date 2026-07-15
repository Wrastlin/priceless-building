import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import { listCatalog, CATEGORIES, DEFAULT_PAGE_SIZE, FLOOR_SAMPLES } from "@/lib/catalog";
import { DEPARTMENT_DEPTH } from "@/lib/department-depth";
import { isCatalogLive } from "@/lib/catalog-live";
import { parsePage } from "@/lib/utils";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const pool = isCatalogLive() ? await listCatalog() : FLOOR_SAMPLES;
  const matches = q
    ? pool.filter(
        (c) =>
          c.title.toLowerCase().includes(q.toLowerCase()) ||
          (c.subtitle ?? "").toLowerCase().includes(q.toLowerCase()) ||
          c.sku.toLowerCase().includes(q.toLowerCase()) ||
          c.category.toLowerCase().includes(q.toLowerCase()),
      )
    : [];
  const totalPages = Math.max(1, Math.ceil(matches.length / DEFAULT_PAGE_SIZE));
  const current = Math.min(parsePage(sp.page), totalPages);
  const results = matches.slice((current - 1) * DEFAULT_PAGE_SIZE, current * DEFAULT_PAGE_SIZE);

  // Also map search terms to departments for browse shortcuts.
  const deptHits = q
    ? (Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).filter((key) => {
        const cat = CATEGORIES[key];
        const depth = DEPARTMENT_DEPTH[key];
        const hay = `${key} ${cat.label} ${cat.blurb} ${depth.headline} ${depth.detail}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      })
    : [];

  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-16">
        <div className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--brand-gold-deep)]">Search · all departments</div>
        <h1 className="font-display mt-3 text-5xl leading-[1.05] md:text-7xl">
          What are you <span className="text-[var(--brand-priceless)]">looking for?</span>
        </h1>

        <form className="mt-8 flex items-center border-b-2 border-[var(--brand-priceless)] pb-2">
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search doors, windows, cabinets, brands…"
            aria-label="Search the warehouse"
            autoFocus
            className="flex-1 border-0 bg-transparent px-0 py-2 text-xl font-medium text-[var(--foreground)] placeholder:font-medium placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-0 md:text-2xl"
          />
          <button className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--brand-gold-deep)] underline decoration-2 underline-offset-4">Search →</button>
        </form>

        {!q ? (
          <div className="mt-12">
            <div className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Browse by department</div>
            <div className="mt-6 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 md:grid-cols-4">
              {(Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, (typeof CATEGORIES)[keyof typeof CATEGORIES]][]).map(([key, cat], i) => (
                <Link key={key} href={`/shop/${key}`} className="group block bg-white p-5">
                  <div className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">No. {String(i + 1).padStart(2, "0")}</div>
                  <div className="font-display mt-2 text-2xl">{cat.label}.</div>
                  <div className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
                    {DEPARTMENT_DEPTH[key].headline}
                  </div>
                  <div className="font-serif mt-1 text-xs italic text-[var(--muted-foreground)]">{cat.blurb}</div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {results.length > 0 ? (
              <div>
                <div className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {matches.length} result{matches.length === 1 ? "" : "s"} · &ldquo;{q}&rdquo;
                </div>
                <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
                  {results.map((it) => (
                    <ProductCard key={it.id} item={it} />
                  ))}
                </div>
                <Pagination basePath="/search" page={current} totalPages={totalPages} query={{ q }} />
              </div>
            ) : null}

            {deptHits.length > 0 ? (
              <div>
                <div className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Departments matching &ldquo;{q}&rdquo;
                </div>
                <div className="mt-6 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 md:grid-cols-3">
                  {deptHits.map((key, i) => {
                    const cat = CATEGORIES[key];
                    return (
                      <Link key={key} href={`/shop/${key}`} className="group block bg-white p-5">
                        <div className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                          No. {String(i + 1).padStart(2, "0")}
                        </div>
                        <div className="font-display mt-2 text-2xl">{cat.label}.</div>
                        <div className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
                          {DEPARTMENT_DEPTH[key].headline}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {results.length === 0 && deptHits.length === 0 ? (
              <p className="font-display mt-8 text-2xl italic text-[var(--muted-foreground)]">
                No match — try doors, windows, cabinets, vanities, hardware, lighting, or trim.
                Or call (715) 848-3855 and we&rsquo;ll check the floor.
              </p>
            ) : (
              <p className="text-[0.95rem] font-light leading-[1.65] text-[var(--soft)]">
                Wide selection on the floor every week. Call (715) 848-3855 with a
                size and we&rsquo;ll hold what fits.
              </p>
            )}
          </div>
        )}
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}
