import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import { DepartmentMosaic } from "@/components/department-mosaic";
import { listPublishedPage } from "@/lib/catalog";
import { parsePage } from "@/lib/utils";

const SITE_URL = "https://pricelessbuilding.com";

export const metadata: Metadata = {
  title: "Shop discount + surplus building materials in Wausau, WI · Price-Less Building Center",
  description:
    "Browse doors, windows, cabinets, vanities, countertops, hardware, lighting, and trim at Price-Less Building Center in Wausau, Wisconsin. New-in-box from cancelled contractor orders at a fraction of big-box retail.",
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    type: "website",
    title: "Shop the warehouse · Price-Less Building Center",
    description: "Doors, windows, cabinets, vanities, hardware. Discount + surplus, Wausau, WI.",
    url: `${SITE_URL}/shop`,
    images: [{ url: "/og-mural.jpg", width: 1200, height: 512 }],
  },
};

export default async function ShopIndex({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const { items, total, page: current, totalPages } = await listPublishedPage({
    brand: "priceless",
    page: parsePage(pageParam),
  });
  if (current > 1 && items.length === 0) notFound();

  return (
    <>
      <SiteHeader brand="priceless" />

      {/* Image-forward shop hero — white inset frame on desktop (rejuvenation) */}
      <section className="bg-white">
        <div className="px-0 md:px-5 md:pt-5">
          <div className="relative h-[52svh] w-full overflow-hidden md:h-[62svh]">
            <Image
              src="/real-photos/business/dark-base-cabinets-warehouse-row.jpg"
              alt="Rows of surplus cabinets on the Price-Less warehouse floor."
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
                Shop · {total} items in stock
              </p>
              <h1 className="font-display mt-4 max-w-[14ch] text-[clamp(2.4rem,1rem+4.5vw,4.8rem)] leading-[1.02]">
                The whole warehouse, <span className="font-normal italic">by department.</span>
              </h1>
              <p className="mt-5 max-w-[42ch] text-[0.95rem] font-light leading-[1.65] text-white/85">
                Pricing reflects current floor stock. Call (715) 848-3855 to hold something for pickup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DepartmentMosaic />

      {/* Inventory grid — airy, image-led cards */}
      <section className="border-t border-[var(--line)] bg-[var(--cream)]">
        <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-8 md:py-24">
          <div className="mx-auto max-w-[40ch] text-center">
            <p className="eyebrow">Everything in stock</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,1rem+2.6vw,3rem)] leading-[1.05]">
              {total} items on the <span className="font-normal italic">floor.</span>
            </h2>
            <p className="mt-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
              Newest arrivals first
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {items.map((it, i) => (
              <ProductCard key={it.id} item={it} priority={i < 4} />
            ))}
          </div>

          <Pagination basePath="/shop" page={current} totalPages={totalPages} />
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
