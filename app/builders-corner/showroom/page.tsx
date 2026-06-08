import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ADDRESS, BUILDERS } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Visit the showroom · Builders Corner Cabinetry & Design",
  description:
    "The Builders Corner showroom at 825 Washington Street, Wausau. Walk in Monday through Saturday. (715) 848-3855.",
};

// HERO uses a high-res AI render (1376x768 trim-aisle vignette). Real
// store-interior thumbnails below run at proof-tile size in a 4-col grid
// where their 223px native resolution looks clean.
const HERO = "/real-photos/store-interior-chandelier-aisle.webp";

type Vignette = { image: string; title: string; body: string };

const ON_THE_FLOOR: Vignette[] = [
  {
    image: "/real-photos/store-interior-vanity-display.webp",
    title: "Vanities staged on the floor",
    body: "Single light-wood vanity, round mirror, white quartz top, slender legs. One of several vanities staged so you can see real proportions.",
  },
  {
    image: "/real-photos/store-interior-vanities.webp",
    title: "Vanities and countertops aisle",
    body: "Multiple vanities lined up, lighting fixtures hanging, white walls. The depth of what we keep on hand.",
  },
  {
    image: "/real-photos/store-interior-doors.webp",
    title: "Door aisle",
    body: "Real interior and exterior doors stacked on both sides. Real selection, real prices.",
  },
  {
    image: "/real-photos/store-interior-trim-lumber-aisle.webp",
    title: "Trim and moulding",
    body: "Raw lumber and primed trim, floor to ceiling. The kind of detail that finishes a kitchen.",
  },
  {
    image: "/real-photos/store-interior-pedestal-sink-tub.webp",
    title: "Pedestal sinks and clawfoot tubs",
    body: "Cast-iron tubs, pedestal sinks, the unusual pieces. Staged against brick and reclaimed wood.",
  },
  {
    image: "/real-photos/store-interior-jeldwen-aisle.webp",
    title: "Window and door brands",
    body: "JELD-WEN, Andersen, and other real new-construction brands in stock, with the signage to prove it.",
  },
  {
    image: "/real-photos/store-interior-checkout-counter.webp",
    title: "Front desk",
    body: "Rustic wood counter, vintage clock, soft lamp lighting. Where you actually talk to a person.",
  },
  {
    image: "/real-photos/store-interior-warehouse.webp",
    title: "Warehouse",
    body: "Cabinets stacked along the aisle, ceiling fans on display from the rafters, wood beam ceiling.",
  },
];

export default function ShowroomPage() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO. Real warehouse aisle shot. */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/80 md:text-lg">
              Showroom · 825 Washington Street, Wausau
            </span>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden md:mt-14">
            <Image
              src={HERO}
              alt="A trim-and-moulding aisle vignette: stacked profiles, warm overhead light. Representative of what you find in the warehouse."
              fill
              priority
              className="object-cover"
              sizes="(min-width:1600px) 1600px, 100vw"
              quality={85}
            />
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-6 pb-20 md:mt-14 md:grid-cols-12 md:pb-28">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              Come walk the floor. Coffee is on.
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                Kitchen and bath setups, door samples on the wall, real working warehouse behind it. Walk in Monday through Saturday.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link
                  href="/builders-corner/consultation"
                  className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
                >
                  Book a designer
                </Link>
                <a
                  href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                  className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
                >
                  Call {ADDRESS.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISIT INFO. Real hours, real address. */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Visiting</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Hours, parking, what to expect.
            </h2>
          </div>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Address</div>
            <div className="font-couture mt-4 text-3xl leading-tight text-[var(--brand-builders)] md:text-4xl">
              {ADDRESS.street}
            </div>
            <div className="mt-1 text-base text-[var(--muted-foreground)]">
              {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="font-couture mt-6 inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              Open in Google Maps →
            </a>

            <div className="mt-10">
              <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Parking</div>
              <p className="mt-4 max-w-md text-lg leading-[1.7] text-[var(--muted-foreground)]">
                Free lot in front and on the side of the building.
              </p>
            </div>

            <div className="mt-10">
              <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Do I need an appointment?</div>
              <p className="mt-4 max-w-md text-lg leading-[1.7] text-[var(--muted-foreground)]">
                No. Walk in any time we&apos;re open. If you want a guaranteed hour with a designer, or an evening, call ahead.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Hours</div>
            <ul className="mt-6 divide-y divide-[var(--brand-builders)]/15 border-t border-b border-[var(--brand-builders)]/15">
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

            <div className="mt-10">
              <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">On the floor</div>
              <ul className="mt-6 grid gap-y-3 text-base text-[var(--foreground)] md:text-lg">
                <li>· Kitchen and bath setups</li>
                <li>· Door samples</li>
                <li>· Hardware wall</li>
                <li>· Quartz, granite, butcher block</li>
                <li>· Someone to walk you through it</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S ON DISPLAY. Real store interior photos. */}
      <section className="border-y border-[var(--border)] bg-[var(--muted)]/40 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Inside the store</div>
              <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
                What you&apos;ll see when you walk in.
              </h2>
            </div>
            <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">
              Real photos of the actual showroom and warehouse. Real cabinets, counters, and hardware. Open and close the drawers.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {ON_THE_FLOOR.map((v) => (
              <article key={v.image} className="flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <Image
                    src={v.image}
                    alt={v.body}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                    quality={75}
                  />
                </div>
                <div className="mt-5">
                  <h3 className="font-couture mt-2 text-2xl leading-tight text-[var(--brand-builders)] md:text-3xl">
                    {v.title}.
                  </h3>
                  <p className="mt-3 text-base leading-[1.65] text-[var(--muted-foreground)] md:text-lg">
                    {v.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Come see us</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1.05] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Stop by this week.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
              Ten minutes or two hours, either way. No pressure to buy.
            </p>
          </div>
          <div className="flex flex-col gap-5 md:col-span-4 md:items-end">
            <Link
              href="/builders-corner/consultation"
              className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:text-[var(--brand-builders-gold)] md:text-lg"
            >
              Book a consultation
            </Link>
            <Link
              href="/builders-corner/gallery"
              className="font-couture inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              See real installs
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}
