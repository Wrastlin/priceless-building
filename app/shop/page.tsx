import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import { VendorWall } from "@/components/vendor-wall";
import { StoreShowcase } from "@/components/store-showcase";
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

      {/* HEADER */}
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-12">
        <header className="max-w-3xl">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
            Shop · {total} items in stock
          </div>
          <h1 className="font-display mt-3 text-[clamp(2.5rem,1.6rem+4vw,5rem)] leading-[1.02]">
            The whole <span className="text-[var(--brand-priceless)]">warehouse,</span> by department.
          </h1>
          <p className="font-serif mt-5 max-w-2xl text-base italic text-[var(--muted-foreground)] md:text-lg">
            Pricing reflects current floor stock. Call us at (715) 848-3855 to put a hold on something you want to come pick up.
          </p>
        </header>
      </section>

      {/* DEPARTMENTS + WHAT'S ON THE FLOOR. Single department browser — a
          swipeable strip on mobile, the full walkthrough grid on desktop.
          (The old separate numbered "8 departments" strip duplicated this.) */}
      <StoreShowcase />

      {/* INVENTORY GRID */}
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-20">
        <header className="max-w-3xl">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
            Everything in stock
          </div>
          <h2 className="font-display mt-3 text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05]">
            {total} items <span className="text-[var(--brand-priceless)]">in the warehouse.</span>
          </h2>
          <div className="font-mono mt-5 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            Newest arrivals first
          </div>
        </header>

        <div className="mt-10 grid grid-cols-2 gap-px bg-[var(--border)] lg:grid-cols-4">
          {items.map((it, i) => <ProductCard key={it.id} item={it} priority={i < 4} />)}
        </div>

        <Pagination basePath="/shop" page={current} totalPages={totalPages} />
      </section>

      <VendorWall />

      <SiteFooter brand="priceless" />
    </>
  );
}
