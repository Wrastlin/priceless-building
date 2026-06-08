import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Pricing methodology · Price-Less Building Center",
  description:
    "How we estimate retail value, how we verify it, and what 'estimated retail' means on our product pages.",
};

export default function PricingPolicy() {
  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-3xl px-6 pt-14 pb-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">
          Policies
        </div>
        <h1 className="font-display mt-3 text-5xl leading-[1.05] md:text-7xl">
          How we price.
        </h1>
        <p className="font-serif mt-5 max-w-2xl text-base italic leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          We list two numbers on most items: our price, and an estimated retail
          value. Here's exactly what those mean and how we check them.
        </p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-[var(--foreground)]">
          <section>
            <h2 className="font-display text-2xl">Our price</h2>
            <p className="mt-3">
              What we charge today, on the floor and online. Cash, card, or
              contractor account. No coupons, no membership fees, no haggling
              unless you're buying a pallet.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl">Estimated retail value</h2>
            <p className="mt-3">
              An honest estimate of what the same item, or a similar one if the
              identical SKU isn't carried by major retailers, would cost new at
              full price at a major home-improvement store (Home Depot, Menards,
              Lowe's, manufacturer-direct). It is not a price we previously
              charged. It is not a manufacturer's MSRP we made up. It is a real
              number we sourced from a real listing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl">How we verify it</h2>
            <ul className="mt-3 space-y-3 list-disc pl-5">
              <li>
                For every item, our team captures the source URL, a dated
                screenshot, and notes on the SKU or model match. We keep that
                file for as long as the item is listed.
              </li>
              <li>
                We re-verify every estimate at least every 90 days. If we can't
                re-verify, the estimated retail value comes off the listing
                until we can.
              </li>
              <li>
                When the comparison is to a similar item (not the exact SKU), we
                say so on the product page. We don't use bare "compare at"
                language because it implies an identical-product claim we
                aren't always making.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl">What we don't do</h2>
            <ul className="mt-3 space-y-3 list-disc pl-5">
              <li>
                We don't quote a "you save X%" headline. The two numbers are
                right there. You can do the math, and the math is honest.
              </li>
              <li>
                We don't inflate the retail estimate to make our price look
                better. If we can't find a higher reference, we leave the
                estimate off.
              </li>
              <li>
                We don't use the words "MSRP," "list price," or "regular
                price." Those have specific meanings we don't always know.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl">Questions or a price you want us to recheck?</h2>
            <p className="mt-3">
              Call <a href="tel:+17158483855" className="underline">(715) 848-3855</a>{" "}
              or email{" "}
              <a href="mailto:pricelessbuildingcenter@gmail.com" className="underline">
                pricelessbuildingcenter@gmail.com
              </a>
              . If we got an estimate wrong, we want to fix it.
            </p>
          </section>

          <p className="pt-6 text-sm text-[var(--muted-foreground)]">
            See also our <Link href="/policies/returns" className="underline">returns policy</Link>.
          </p>
        </div>
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}
