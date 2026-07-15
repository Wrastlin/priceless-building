import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import { DepartmentMosaic } from "@/components/department-mosaic";
import { listPublishedPage } from "@/lib/catalog";
import { FLOOR_FEATURES } from "@/lib/items/floor-features";
import { FeaturedItemsFade } from "@/components/featured-items-fade";
import { isCatalogLive } from "@/lib/catalog-live";
import { parsePage } from "@/lib/utils";

const SITE_URL = "https://pricelessbuilding.com";

export const metadata: Metadata = {
  title: "Shop discount + surplus building materials in Wausau, WI · Price-Less Building Center",
  description:
    "Browse hundreds of doors, windows, cabinets, vanities, countertops, hardware, lighting, and trim at Price-Less Building Center in Wausau, Wisconsin. Real warehouse depth — new-in-box from cancelled contractor orders.",
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    type: "website",
    title: "Shop the warehouse · Price-Less Building Center",
    description: "Hundreds of doors, windows, cabinets, vanities, hardware. Discount + surplus, Wausau, WI.",
    url: `${SITE_URL}/shop`,
    images: [{ url: "/og-mural.jpg", width: 1200, height: 512 }],
  },
};

export default async function ShopIndex({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const live = isCatalogLive();
  const { page: pageParam } = await searchParams;
  const catalog = live
    ? await listPublishedPage({ brand: "priceless", page: parsePage(pageParam) })
    : { items: [], total: 0, page: 1, totalPages: 1 };
  const { items, total, page: current, totalPages } = catalog;
  if (live && current > 1 && items.length === 0) notFound();

  return (
    <>
      <SiteHeader brand="priceless" />

      <section className="bg-white">
        <div className="px-0 md:px-5 md:pt-5">
          <div className="relative h-[52svh] w-full overflow-hidden md:h-[62svh]">
            <Image
              src="/real-photos/business/floor-barn-door-diamond-glass.jpg"
              alt="Rustic sliding barn door with diamond-pattern glass on the Price-Less warehouse floor."
              fill
              priority
              sizes="100vw"
              quality={80}
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(20,18,18,0.28), rgba(20,18,18,0.35) 50%, rgba(20,18,18,0.55))",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="eyebrow-on-dark text-[0.68rem] font-medium uppercase tracking-[0.24em]">
                Shop · 8 departments on the floor
              </p>
              <h1 className="font-display mt-4 max-w-[14ch] text-[clamp(2.4rem,1rem+4.5vw,4.8rem)] leading-[1.02]">
                The whole warehouse, <span className="font-normal italic">by department.</span>
              </h1>
              <p className="mt-5 max-w-[42ch] text-[0.95rem] font-light leading-[1.65] text-white/85">
                Doors, windows, cabinets — including 12&quot; uppers and 24&quot;
                lowers — vanities, lighting, hardware, and more. Walk it in
                person or call (715) 848-3855 to hold something.
              </p>
              <Link
                href="tel:7158483855"
                className="mt-8 border border-white/70 px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[var(--ink)]"
              >
                Call the floor ›
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DepartmentMosaic />

      {live && total > 0 ? (
        <section className="border-t border-[var(--line)] bg-[var(--cream)]">
          <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-[40ch] text-center">
              <p className="eyebrow">Tagged items</p>
              <h2 className="font-display mt-4 text-[clamp(2rem,1rem+2.6vw,3rem)] leading-[1.05]">
                {total} items with a <span className="font-normal italic">price tag.</span>
              </h2>
              <p className="mt-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
                Newest arrivals first
              </p>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
              {items.map((it, i) => (
                <ProductCard key={it.id} item={it} priority={i < 4} />
              ))}
            </div>

            <Pagination basePath="/shop" page={current} totalPages={totalPages} />
          </div>
        </section>
      ) : (
        <>
          <div className="border-t border-[var(--line)] bg-white">
            <FeaturedItemsFade
              items={FLOOR_FEATURES}
              eyebrow="Featured finds"
              title={
                <>
                  Pieces from the <span className="font-normal italic">warehouse.</span>
                </>
              }
            />
          </div>
          <section className="border-t border-[var(--line)] bg-[var(--cream)]">
            <div className="mx-auto max-w-[640px] px-6 py-14 text-center md:py-16">
              <p className="eyebrow">Come dig</p>
              <p className="mt-3 text-[1rem] font-light leading-[1.7] text-[var(--soft)]">
                Door walls, window aisles, vanity rows, trim by the foot.
                Stop by 825 Washington Street or call and we&rsquo;ll check stock
                for your size.
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
        </>
      )}

      <SiteFooter brand="priceless" />
    </>
  );
}
