import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import { DepartmentInventory } from "@/components/department-inventory";
import { CATEGORIES, listPublishedPage, countPublished, type Category } from "@/lib/catalog";
import { parsePage } from "@/lib/utils";

const SITE_URL = "https://pricelessbuilding.com";

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  if (!(category in CATEGORIES)) return { title: "Category not found" };
  const cat = CATEGORIES[category as Category];
  const count = await countPublished({ brand: "priceless", category: category as Category });
  const title = `${cat.label} · ${count} in stock at Price-Less Building Center Wausau, WI`;
  const description = `${cat.label}: ${cat.blurb} ${count} in stock at Price-Less Building Center in Wausau, Wisconsin. New-in-box from cancelled contractor orders. Ships nationally; pickup or local delivery in central WI.`;
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
  const { page: pageParam } = await searchParams;
  const { items, total, page: current, totalPages } = await listPublishedPage({
    brand: "priceless",
    category: category as Category,
    page: parsePage(pageParam),
  });
  if (current > 1 && items.length === 0) notFound();
  const allKeys = Object.keys(CATEGORIES) as Category[];

  return (
    <>
      <SiteHeader brand="priceless" />

      {/* Full-bleed category hero — image first, type centered */}
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
                Floor · {total} {total === 1 ? "item" : "items"} in stock
              </p>
              <h1 className="font-display mt-4 text-[clamp(2.8rem,1rem+5vw,5.5rem)] leading-[1.02]">
                {cat.label}.
              </h1>
              <p className="mt-5 max-w-[42ch] text-[0.95rem] font-light leading-[1.65] text-white/85">
                {cat.blurb}
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

      {/* Sibling department strip */}
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

      <DepartmentInventory category={category} />

      <section className="bg-[var(--cream)]">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-[36ch] text-center">
            <p className="eyebrow">On the floor</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,1rem+2vw,2.6rem)] leading-[1.05]">
              {total}{" "}
              <span className="font-normal italic">{total === 1 ? "item." : "items."}</span>
            </h2>
          </div>

          {total === 0 ? (
            <div className="mx-auto mt-12 max-w-xl border border-[var(--line)] bg-white p-14 text-center">
              <p className="eyebrow">Nothing here yet</p>
              <p className="font-display mt-4 text-2xl italic">
                Check back Wednesday. Fresh tags every week.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
                {items.map((it, i) => (
                  <ProductCard key={it.id} item={it} priority={i < 4} />
                ))}
              </div>
              <Pagination basePath={`/shop/${category}`} page={current} totalPages={totalPages} />
            </>
          )}
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
