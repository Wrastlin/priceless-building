import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SECTIONS = [
  { id: "glance", title: "At a glance" },
  { id: "window", title: "Standard return window" },
  { id: "exceptions", title: "Items we can't take back" },
  { id: "damaged", title: "Damaged or defective items" },
  { id: "custom", title: "Custom Builders Corner work" },
  { id: "start", title: "How to start a return" },
  { id: "refund", title: "Refund timeline" },
  { id: "contractor", title: "Contractor accounts" },
];

export default function ReturnsPolicy() {
  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-5xl px-6 pt-14 pb-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">Policies</div>
        <h1 className="font-display mt-3 text-5xl leading-[1.05] md:text-7xl">
          Returns & <span className="text-[var(--brand-priceless)]">exchanges.</span>
        </h1>
        <p className="font-serif mt-5 max-w-2xl text-base italic leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          We sell surplus and overstock at warehouse pricing, so a few rules keep things fair for everyone. Below is the policy in plain English. Questions? Call (715) 848-3855.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[200px_1fr]">
          <aside className="md:sticky md:top-20 md:self-start">
            <nav className="rounded-xl border bg-white p-4 shadow-card">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">On this page</div>
              <ul className="mt-2 space-y-1.5 text-sm">
                {SECTIONS.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`} className="hover:underline">{s.title}</a></li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="space-y-10">
            <Block id="glance" title="At a glance">
              <ul className="space-y-2 text-sm">
                <li><strong>30 days</strong> · most items, with receipt, unused, original packaging.</li>
                <li><strong>Full refund</strong> if we mis-tagged or mis-described the item.</li>
                <li><strong>Reclaimed and one-of-one items</strong> are final sale unless damaged in transit.</li>
                <li><strong>Custom Builders Corner work</strong> is non-returnable once production starts.</li>
                <li><strong>Refunds</strong> hit the original payment method within 5 business days.</li>
              </ul>
            </Block>

            <Block id="window" title="Standard return window">
              <p>You have <strong>30 days from the day of pickup or delivery</strong> to bring an item back. The item should be:</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
                <li>Unused and uninstalled (we can tell; installed doors and trim show it).</li>
                <li>In its original packaging if it came packaged.</li>
                <li>Accompanied by the original receipt or order number (looking it up by name works too if your number is lost).</li>
              </ul>
              <p className="mt-3">Bring it to the front counter during open hours. We'll inspect it on the spot and process the refund or exchange before you leave.</p>
            </Block>

            <Block id="exceptions" title="Items we can't take back">
              <p>The following are <strong>final sale</strong>:</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
                <li>Reclaimed items (any item with a "Reclaimed" badge or sold from the Reclaim Loft).</li>
                <li>Cut-to-order trim and millwork.</li>
                <li>Countertop slabs already cut for your installation.</li>
                <li>Special-order Builders Corner cabinetry (see the Custom section below).</li>
                <li>Clearance items marked "AS-IS" on the price tag.</li>
              </ul>
            </Block>

            <Block id="damaged" title="Damaged or defective items">
              <p>If something arrives damaged or you find a defect after pickup, we make it right:</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
                <li>Photograph the damage on the spot, especially if it's a delivery.</li>
                <li>Call us within <strong>48 hours</strong> so we can document it before the trail goes cold.</li>
                <li>We'll arrange a swap, repair, or full refund. Your choice.</li>
              </ul>
              <p className="mt-3">This applies even to items normally in the "final sale" list.</p>
            </Block>

            <Block id="custom" title="Custom Builders Corner work">
              <p>Cabinet runs, custom door styles, and made-to-order finishes through Builders Corner Cabinetry & Design are <strong>non-returnable once production starts</strong>. Production starts when you sign the spec sheet and pay the 50% deposit.</p>
              <p className="mt-3">If you change your mind <strong>before</strong> production starts, your deposit is fully refundable within 7 days of signing. After that, it offsets design-team time and is non-refundable.</p>
            </Block>

            <Block id="start" title="How to start a return">
              <p>Three ways to kick off a return:</p>
              <ol className="mt-3 list-inside list-decimal space-y-1 text-sm">
                <li><strong>Walk in</strong> during open hours with the item and receipt. Fastest.</li>
                <li><strong>Call (715) 848-3855</strong> and we'll start a return ticket and tell you when to bring it in.</li>
                <li><strong>Email returns@pricelessbuilding.com</strong> with your order number and a photo if it's damaged.</li>
              </ol>
            </Block>

            <Block id="refund" title="Refund timeline">
              <p>Once we receive and inspect the return:</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
                <li><strong>Card payments</strong> · refunded same day; the card processor typically posts within 3-5 business days.</li>
                <li><strong>Cash payments</strong> · refunded in cash at the counter.</li>
                <li><strong>Synchrony financing</strong> · we file the refund the same day; Synchrony posts the credit within 7 business days.</li>
                <li><strong>Store credit</strong> · available on the spot if you'd prefer.</li>
              </ul>
            </Block>

            <Block id="contractor" title="Contractor accounts">
              <p>Net-30 contractor accounts can return unused items <strong>up to 60 days</strong> from invoice date. Restocks credit the next monthly statement. Contact your account rep at (715) 848-3855.</p>
            </Block>

            <div className="rounded-xl bg-[var(--muted)] p-5 text-sm text-[var(--muted-foreground)]">
              <strong>Last updated:</strong> {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Questions? <Link href="/contact" className="underline">Reach out</Link> any time.
            </div>
          </div>
        </div>
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 space-y-2 text-[var(--foreground)]">{children}</div>
    </section>
  );
}
