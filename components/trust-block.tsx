import Link from "next/link";
import { ADDRESS, PRICELESS } from "@/lib/brands";

/**
 * "Visit us" block — map, address, hours, directions, and a project CTA.
 *
 * Reviews + the star rating used to live here too, but they were a
 * duplicate of the dedicated reviews section, so they were pulled out
 * (see components/reviews-section.tsx). This block is now purely about
 * finding and visiting the store.
 */
const mapsQuery = encodeURIComponent(
  `Price-Less Building Center, ${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state}`,
);
const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
const directions = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

export function TrustBlock() {
  return (
    <section id="trust" className="border-y bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="max-w-3xl">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
            Visit the store
          </div>
          <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">
            We&apos;ve been here{" "}
            <span className="text-[var(--brand-priceless)]">since 1978</span>.
          </h2>
          <p className="mt-4 max-w-xl text-base text-[var(--muted-foreground)] md:text-lg">
            {ADDRESS.street} in Wausau. Open Mon through Sat. Family owned. Come
            see the warehouse for yourself.
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          {/* Map */}
          <div className="md:col-span-7">
            <div className="aspect-[4/3] overflow-hidden border border-[var(--border)] md:aspect-[16/10]">
              <iframe
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Price-Less Building Center on Google Maps"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <div className="font-display text-2xl leading-tight">
                  {ADDRESS.street}, {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
                </div>
                <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Free parking in the lot behind the building. Loading dock on
                  the south side for pickups.
                </div>
              </div>
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="font-mono inline-flex shrink-0 items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
              >
                Get directions →
              </a>
            </div>
          </div>

          {/* Hours + phone + project CTA */}
          <div className="md:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Hours
            </div>
            <ul className="mt-3 divide-y divide-[var(--border)]/60">
              {PRICELESS.hours.map((h) => (
                <li key={h.day} className="flex items-baseline justify-between py-2 text-sm">
                  <span className="font-medium">{h.day}</span>
                  <span className="text-[var(--muted-foreground)]">{h.hours}</span>
                </li>
              ))}
            </ul>
            <a
              href={`tel:+1${ADDRESS.phone.replace(/[^0-9]/g, "")}`}
              className="font-mono mt-5 inline-flex items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
            >
              Call {ADDRESS.phone}
            </a>

            <div className="mt-10 border border-[var(--brand-priceless)] bg-white p-6">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
                Have a project in mind?
              </div>
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground)]">
                We are putting together a step-by-step walkthrough that lets you take a photo of the space, pick out the pieces, and see the finished room before any of it leaves the warehouse.
              </p>
              <Link
                href="/#design-walkthrough"
                className="font-mono mt-4 inline-flex items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
              >
                See how it works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
