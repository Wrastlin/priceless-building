import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import { DepartmentInventory } from "@/components/department-inventory";
import { CATEGORIES, listPublishedPage, type Category } from "@/lib/catalog";
import { DEPARTMENT_DEPTH, depthCollections } from "@/lib/department-depth";
import { isCatalogLive } from "@/lib/catalog-live";
import { parsePage } from "@/lib/utils";

const SITE_URL = "https://pricelessbuilding.com";

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  if (!(category in CATEGORIES)) return { title: "Category not found" };
  const cat = CATEGORIES[category as Category];
  const depth = DEPARTMENT_DEPTH[category as Category];
  const title = `${cat.label} · ${depth.headline} at Price-Less Building Center Wausau, WI`;
  const description = `${cat.label}: ${depth.detail} ${cat.blurb} At Price-Less Building Center in Wausau, Wisconsin.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/shop/${category}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_URL}/shop/${category}`,
      images: [{ url: cat.image.startsWith("http") ? cat.image : `${SITE_URL}${cat.image}`, alt: cat.label }],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  if (!(category in CATEGORIES)) notFound();
  const cat = CATEGORIES[category as Category];
  const depth = DEPARTMENT_DEPTH[category as Category];
  const collections = depthCollections(category as Category);
  const live = isCatalogLive();
  const { page: pageParam } = await searchParams;
  const catalog = live
    ? await listPublishedPage({
        brand: "priceless",
        category: category as Category,
        page: parsePage(pageParam),
      })
    : { items: [], total: 0, page: 1, totalPages: 1 };
  const { items, total, page: current, totalPages } = catalog;
  if (live && current > 1 && items.length === 0) notFound();
  const allKeys = Object.keys(CATEGORIES) as Category[];

  return (
    <>
      <SiteHeader brand="priceless" />

      <section className="bg-white">
        <div className="px-0 md:px-5 md:pt-5">
          <div className="relative h-[48svh] w-full overflow-hidden md:h-[58svh]">
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              className="object-cover"
              priority
              quality={80}
              sizes="100vw"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(20,18,18,0.30), rgba(20,18,18,0.38) 55%, rgba(20,18,18,0.55))",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-white/85">
                Floor · {depth.headline}
              </p>
              <h1 className="font-display mt-4 text-[clamp(2.8rem,1rem+5vw,5.5rem)] leading-[1.02]">
                {cat.label}.
              </h1>
              <p className="mt-5 max-w-[42ch] text-[0.95rem] font-light leading-[1.65] text-white/85">
                {depth.detail}
              </p>
              <Link
                href="/shop"
                className="mt-8 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white/90 underline-offset-[6px] hover:underline"
              >
                ← All departments
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-[1360px] gap-1 overflow-x-auto px-4 py-3 md:justify-center md:px-8">
          {allKeys.map((key) => (
            <Link
              key={key}
              href={`/shop/${key}`}
              className={`shrink-0 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition ${
                key === category
                  ? "bg-[var(--ink)] text-white"
                  : "text-[var(--ink)] hover:bg-[var(--cream)]"
              }`}
            >
              {CATEGORIES[key].label}
            </Link>
          ))}
        </div>
      </nav>

      {collections.length > 0 && (
        <section className="border-b border-[var(--line)] bg-[var(--cream)]">
          <div className="mx-auto max-w-[1360px] px-6 py-10 md:px-8">
            <p className="eyebrow">Depth on the floor</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((c) => (
                <li key={c.name} className="border border-[var(--line)] bg-white px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight">{c.name}</h3>
                    {c.approx ? (
                      <span className="font-mono shrink-0 text-sm text-[var(--brand-priceless)]">
                        {c.approx}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--soft)]">
                    {c.tier}
                    {c.kind ? ` · ${c.kind}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <DepartmentInventory category={category} />

      {live && total > 0 ? (
        <section className="bg-[var(--cream)]">
          <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-[36ch] text-center">
              <p className="eyebrow">Tagged items</p>
              <h2 className="font-display mt-4 text-[clamp(1.8rem,1rem+2vw,2.6rem)] leading-[1.05]">
                {total}{" "}
                <span className="font-normal italic">{total === 1 ? "with a tag." : "with tags."}</span>
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-6 md:gap-y-10">
              {items.map((it, i) => (
                <ProductCard key={it.id} item={it} priority={i < 4} />
              ))}
            </div>
            <Pagination basePath={`/shop/${category}`} page={current} totalPages={totalPages} />
          </div>
        </section>
      ) : (
        <section className="bg-[var(--cream)]">
          <div className="mx-auto max-w-[640px] px-6 py-16 text-center md:py-20">
            <p className="eyebrow">Visit or call</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,1rem+2vw,2.4rem)] leading-[1.05]">
              See the {cat.label.toLowerCase()} in person.
            </h2>
            <p className="mt-4 text-[1rem] font-light leading-[1.7] text-[var(--soft)]">
              Individual tags aren&rsquo;t all online yet. Walk the aisle at 825
              Washington Street, or call (715) 848-3855 with a size and we&rsquo;ll
              check what&rsquo;s on the floor.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="tel:7158483855"
                className="bg-[var(--ink)] px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white"
              >
                (715) 848-3855
              </Link>
              <Link
                href="/contact"
                className="border border-[var(--ink)] px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.2em]"
              >
                Ask about a size ›
              </Link>
            </div>
          </div>
        </section>
      )}

      <SiteFooter brand="priceless" />
    </>
  );
}
