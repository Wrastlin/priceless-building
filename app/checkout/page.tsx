import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutForm } from "./checkout-form";
import { listCatalog } from "@/lib/catalog";

export default async function CheckoutPage() {
  const catalog = await listCatalog();
  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-16">
        <div className="grid items-end gap-x-10 gap-y-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">Checkout · Step 1 of 1</div>
            <h1 className="font-display mt-3 text-6xl leading-[1.05] md:text-8xl">
              Reserve your <span className="text-[var(--brand-priceless)]">items.</span>
            </h1>
          </div>
          <p className="font-serif text-base italic text-[var(--muted-foreground)] md:col-span-4">
            Hold + pay in store is the most popular path. Reserves the items for 48 hours, no card needed.
          </p>
        </div>
        <CheckoutForm catalog={catalog} />
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}
