import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartView } from "./cart-view";
import { CATALOG } from "@/lib/catalog";

export default function CartPage() {
  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-16">
        <div className="grid items-end gap-x-10 gap-y-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">Your cart · Wausau pickup or local delivery</div>
            <h1 className="font-display mt-3 text-6xl leading-[1.05] md:text-8xl">
              Ready to <span className="text-[var(--brand-priceless)]">roll?</span>
            </h1>
          </div>
          <p className="font-serif text-base italic text-[var(--muted-foreground)] md:col-span-4">
            Pickup is free at the back load-bay. Local delivery within Marathon County starts at $79.
          </p>
        </div>
        <CartView catalog={CATALOG} />
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}
