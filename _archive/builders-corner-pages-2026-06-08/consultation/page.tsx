import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InquiryForm } from "@/components/inquiry-form";
import { ADDRESS, BUILDERS } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Book a consultation · Builders Corner Cabinetry & Design",
  description:
    "Free one-hour consultation at the Wausau showroom or at your house. Reply within a business day. No charge.",
};

// HERO uses the 640x800 storefront-signage photo (real, sharp). The
// previous 223px checkout-counter thumbnail pixelated at hero scale.
const HERO = "/real-photos/storefront-signage.webp";

export default function ConsultationPage() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/80 md:text-lg">
              Free, about an hour
            </span>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden md:mt-14">
            <Image
              src={HERO}
              alt="The Builders Corner storefront signage on the Washington Street building, Wausau."
              fill
              priority
              className="object-cover object-center"
              sizes="(min-width:1600px) 1600px, 100vw"
              quality={90}
            />
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-6 pb-20 md:mt-14 md:grid-cols-12 md:pb-28">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              Tell us about your room. We'll set up an hour.
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                We get back within a business day. Meet at the showroom on Washington Street or at your house. No charge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT IS / WHAT TO BRING / WHAT HAPPENS NEXT */}
      <section className="border-b border-[var(--border)] bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">What to expect</div>
              <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
                About an hour. In person.
              </h2>
            </div>
            <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">
              We listen, sketch, and walk the showroom. If it's a remodel, we set a date to come measure.
            </p>
          </div>

          <ol className="mt-16 divide-y divide-[var(--brand-builders)]/15 border-t border-b border-[var(--brand-builders)]/15">
            {[
              {
                n: "01",
                t: "The meeting",
                c: "About an hour. Showroom on Washington Street, or your house. Bring kids, dogs, your contractor, whoever.",
              },
              {
                n: "02",
                t: "What to bring",
                c: "Photos of the room. A rough budget if you have one. Pictures you like. None of it required.",
              },
              {
                n: "03",
                t: "At the table",
                c: "We sketch, pull door samples, finish chips, hardware. If it's a remodel, we set a date to measure.",
              },
              {
                n: "04",
                t: "After",
                c: "A line-item written estimate, usually within a week. Cabinetry, counters, install. Nothing buried.",
              },
            ].map((s) => (
              <li key={s.n} className="grid items-baseline gap-x-10 gap-y-3 py-10 md:grid-cols-12">
                <div className="font-couture text-3xl text-[var(--brand-builders-gold)] md:col-span-2 md:text-4xl">
                  {s.n}
                </div>
                <h3 className="font-couture text-3xl leading-tight text-[var(--brand-builders)] md:col-span-3 md:text-4xl">
                  {s.t}
                </h3>
                <p className="max-w-2xl text-lg leading-[1.65] text-[var(--muted-foreground)] md:col-span-7 md:text-xl">
                  {s.c}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FORM + DIRECT CONTACT. The InquiryForm is the centerpiece of
          this page; sidebar carries the call/address/hours info. */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <InquiryForm
              brand="builders"
              heading="A few details."
              intro="Only the name and a way to reach you are required. We get back within one business day."
              submitLabel="Request my consultation"
            />
          </div>

          {/* SIDEBAR */}
          <aside className="border-l border-[var(--brand-builders)]/20 pl-10 md:col-span-5">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Or just call</div>
            <div className="font-couture mt-5 text-3xl leading-tight text-[var(--brand-builders)] md:text-4xl">
              {ADDRESS.phone}
            </div>
            <p className="mt-3 text-base text-[var(--muted-foreground)]">
              Ask for the design desk.
            </p>

            <a
              href="mailto:pricelessbuildingcenter@gmail.com"
              className="font-couture mt-8 inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              pricelessbuildingcenter@gmail.com
            </a>

            <div className="mt-12">
              <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Showroom</div>
              <div className="font-couture mt-5 text-2xl leading-tight text-[var(--brand-builders)] md:text-3xl">
                {ADDRESS.street}
              </div>
              <div className="mt-1 text-base text-[var(--muted-foreground)]">
                {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
              </div>
              <ul className="mt-8 divide-y divide-[var(--brand-builders)]/15 border-t border-b border-[var(--brand-builders)]/15">
                {BUILDERS.hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-baseline justify-between gap-4 py-3 text-base"
                  >
                    <span className="text-[var(--foreground)]">{h.day}</span>
                    <span className="text-[var(--muted-foreground)]">{h.hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-base text-[var(--muted-foreground)]">
                Closed Sunday through Tuesday. Evenings by appointment.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* SUPPORTING CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--muted)]/40 py-12 md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-end">
          <div>
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">
              Not ready to book?
            </div>
            <h2 className="font-couture mt-5 text-4xl leading-[1] text-[var(--brand-builders)] md:text-5xl">
              That's fine. Have a look around first.
            </h2>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <Link
              href="/builders-corner/kitchens"
              className="font-couture inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              Browse kitchens
            </Link>
            <Link
              href="/builders-corner/gallery"
              className="font-couture inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              See the gallery
            </Link>
            <Link
              href="/builders-corner/process"
              className="font-couture inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              How we run a project
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}
