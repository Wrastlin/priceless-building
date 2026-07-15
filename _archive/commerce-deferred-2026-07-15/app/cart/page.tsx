import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartView } from "./cart-view";
import { listCatalog } from "@/lib/catalog";

export default async function CartPage() {
  const catalog = await listCatalog();
  // Floor samples stay visible in cart even when the full catalog is gated.
  const { FLOOR_SAMPLES } = await import("@/lib/items/floor-samples");
  const bySku = new Map([...catalog, ...FLOOR_SAMPLES].map((it) => [it.sku, it]));
  const merged = [...bySku.values()];

  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-16">
        <div className="grid items-end gap-x-10 gap-y-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[var(--brand-gold-deep)]">Your cart · Wausau pickup or local delivery</div>
            <h1 className="font-display mt-3 text-6xl leading-[1.05] md:text-8xl">
              Ready to <span className="text-[var(--brand-priceless)]">roll?</span>
            </h1>
          </div>
          <p className="font-serif text-base italic text-[var(--muted-foreground)] md:col-span-4">
            Pickup is free at the back load-bay. Local delivery within Marathon County starts at $79.
          </p>
        </div>

        <div className="mt-8 border border-dashed border-[var(--border)] bg-[var(--cream)] px-5 py-4 md:px-6">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--brand-gold-deep)]">
            Coming soon
          </p>
          <p className="mt-2 text-[0.95rem] font-light leading-[1.65] text-[var(--soft)]">
            Online checkout and card pay aren&rsquo;t live yet. Call (715) 848-3855 and
            we&rsquo;ll hold what&rsquo;s in your cart for warehouse pickup.
          </p>
        </div>

        <CartView catalog={merged} />
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}
