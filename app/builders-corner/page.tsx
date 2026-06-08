import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { InquiryForm } from "@/components/inquiry-form";
import { ADDRESS, BUILDERS } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Builders Corner Cabinetry & Design · Custom kitchens and baths in Wausau",
  description:
    "Custom cabinets, built in Wausau since 1983. Walk into the showroom at 825 Washington Street and hold the door samples in your own hand. (715) 848-3855.",
};

// Image policy: the hero and the four big category tiles use AI renders
// from /test-images and /catalog-images (1024+ wide) because the real
// install thumbnails are 223px native and pixelate at hero / large-card
// scale. The smaller showroom-grid figures stay on real installs since
// they render at proof-tile size. The mural keeps its real photo.
const HERO = "/real-photos/install-kitchen-walnut.webp";
const TILE_KITCHENS = "/real-photos/install-kitchen-walnut-island-bar.webp";
const TILE_BATHS = "/real-photos/install-bathroom-shaker.webp";
const TILE_BUILTINS = "/real-photos/install-kitchen-floating-shelf-bowls.webp";
const TILE_MUDROOMS = "/real-photos/install-floor-grey-lvp.webp";
const SHOWROOM_GRID = [
  { src: "/real-photos/install-kitchen-walnut-marble.webp", caption: "Walnut shaker with white marble counter." },
  { src: "/real-photos/install-kitchen-island-globes.webp", caption: "White cabinetry with quartz island and globe pendants." },
  { src: "/real-photos/install-kitchen-rustic-beam.webp", caption: "Rustic kitchen with exposed ceiling beam and reclaimed wood vent shroud." },
  { src: "/real-photos/install-bathroom-yellow-green-tile.webp", caption: "Warm traditional bath, green subway wainscot, dark-stained oak vanity." },
  { src: "/real-photos/install-kitchen-galley-green-wall.webp", caption: "Galley kitchen, two-tone, slate-green accent wall." },
  { src: "/real-photos/install-kitchen-honey-oak.webp", caption: "Honey-oak shaker with white quartz." },
];
const MURAL = "/real-photos/mural-detail.webp";

export default function BuildersHome() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO. Real installed walnut shaker kitchen, big BC wordmark, one
          honest line of history. */}
      <section className="relative bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="flex flex-wrap items-center justify-between gap-4 whitespace-nowrap border-b border-white/15 pb-7">
            <div className="flex items-center gap-5">
              <BrandLogo brand="builders" size="lg" />
              <span className="font-couture hidden text-base italic text-white/70 md:inline md:text-lg">
                · Wausau, Wisconsin
              </span>
            </div>
            <div className="hidden items-baseline gap-6 md:flex">
              <span className="font-couture text-xs uppercase tracking-[0.28em] text-white/55">
                Cabinet shop est. 1983
              </span>
              <a href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`} className="text-base text-white/85 underline decoration-[var(--brand-builders-gold)] decoration-2 underline-offset-[6px] md:text-lg">
                {ADDRESS.phone}
              </a>
            </div>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden md:mt-14">
            <Image
              src={HERO}
              alt="A representative bone-white inset kitchen with island, integrated paneling, warm lighting. The kind of work Builders Corner designs."
              fill
              priority
              className="object-cover"
              sizes="(min-width:1600px) 1600px, 100vw"
              quality={85}
            />
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-6 pb-20 md:mt-14 md:grid-cols-12 md:pb-32">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              Custom cabinets, built in Wausau since 1983.
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                Walk into the showroom on Washington Street. Look at real door samples, hold a slab piece, sit down with someone who&apos;ll draw your room. Four Squared installs across the parking lot.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link
                  href="/builders-corner/consultation"
                  className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
                >
                  Book a free consultation
                </Link>
                <Link
                  href="/builders-corner/gallery"
                  className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
                >
                  See real installs
                </Link>
              </div>
            </div>
          </div>

          {/* Real address + reviews. No duplication with the hero copy. */}
          <div className="grid grid-cols-1 gap-y-6 border-t border-white/10 pt-10 pb-12 md:grid-cols-2 md:items-center md:gap-x-10 md:py-12">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--brand-builders-gold)]">Visit the showroom</div>
              <div className="font-couture mt-2 text-2xl leading-tight text-white md:text-3xl">
                825 Washington Street · Wausau, WI
              </div>
              <div className="mt-1 text-sm text-white/65">
                Open Monday through Saturday
              </div>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Price-Less+Building+Center+825+Washington+St+Wausau+WI"
              target="_blank"
              rel="noreferrer"
              className="group block md:justify-self-end md:text-right"
              aria-label="Read all 10 Google reviews"
            >
              <div className="text-2xl text-[#f5a524]" aria-hidden>★★★★★</div>
              <div className="mt-2 text-sm uppercase tracking-[0.16em] text-white/65 transition group-hover:text-white">
                4.8 on Google · 10 reviews →
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* WHAT WE MAKE. Four tiles, real install photos, honest captions. */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">What we make</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Kitchens. Baths. Built-ins for the rest of the house.
            </h2>
          </div>
          <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-5 md:text-xl">
            One bath, the whole first floor, a mudroom, a pantry. We design and build the cabinets here. Four Squared installs them.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BCTile
            tag="Kitchens"
            href="/builders-corner/kitchens"
            image={TILE_KITCHENS}
            alt="A white-oak shaker kitchen with island and quartz counters. Representative of Builders Corner kitchen work."
            caption="Custom kitchens: white-oak shaker, island with quartz, our design and our install."
          />
          <BCTile
            tag="Baths"
            href="/builders-corner/baths"
            image={TILE_BATHS}
            alt="A representative bathroom: white shaker vanity, quartz top, brushed pulls."
            caption="Custom baths: vanities, quartz tops, tile work. Designed here, installed by Four Squared."
          />
          <BCTile
            tag="Built-ins"
            href="/builders-corner/consultation"
            image={TILE_BUILTINS}
            alt="A pantry-style cabinet detail: tall doors, brushed hardware, integrated panels."
            caption="Built-ins for vanities, pantries, office walls, laundry. Same shop, same finish booth."
          />
          <BCTile
            tag="Mudrooms and details"
            href="/builders-corner/consultation"
            image={TILE_MUDROOMS}
            alt="A stack of painted trim and moulding samples, sharp and crisp from our finish booth."
            caption="Trim, panel detail, finish work. The small stuff that makes a room read finished."
          />
        </div>
      </section>

      {/* PROCESS. Four compact steps in a row at desktop, stack at mobile. */}
      <section className="border-y border-[#0b1729]/15 bg-[#0b1729] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-white/10 pb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--brand-builders-gold)]">How it works</span>
              <h2 className="font-couture text-3xl leading-none tracking-[-0.01em] md:text-4xl">
                Four steps.
              </h2>
            </div>
            <Link
              href="/builders-corner/process"
              className="text-sm text-white/80 underline decoration-[var(--brand-builders-gold)] decoration-2 underline-offset-[6px] transition hover:text-[var(--brand-builders-gold)]"
            >
              See the full process →
            </Link>
          </div>

          <ol className="mt-8 grid gap-px bg-white/10 md:grid-cols-4">
            {[
              { n: "01", t: "Free consult", c: "Showroom visit or we come to your house. Bring photos or a rough idea." },
              { n: "02", t: "Design with you", c: "We measure, draw it up. You hold the door samples and slab pieces yourself." },
              { n: "03", t: "Build in the shop", c: "Doors and drawers built and finished here in Wausau. Sprayed, sanded, sprayed again." },
              { n: "04", t: "Install with Four Squared", c: "Four Squared sets the cabinets, runs the counters, walks the punch list at the end." },
            ].map((s) => (
              <li key={s.n} className="bg-[#0b1729] p-5">
                <div className="font-couture text-2xl text-[var(--brand-builders-gold)]">{s.n}</div>
                <h3 className="font-couture mt-3 text-xl leading-snug md:text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-[1.55] text-white/80">{s.c}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FROM THE SHOWROOM. Magazine-style asymmetric grid of real installs.
          Honest descriptor captions. */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">From the showroom</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              A few directions to start from.
            </h2>
          </div>
          <Link
            href="/builders-corner/gallery"
            className="text-base text-[var(--brand-builders)] underline decoration-[var(--brand-builders-gold)] decoration-2 underline-offset-[6px] hover:text-[var(--brand-builders-gold)] md:col-span-4 md:justify-self-end md:text-lg"
          >
            See the full gallery →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
          {SHOWROOM_GRID.map((p, i) => {
            // Asymmetric magazine spans: 3-3, 2-2-2, 3-3 for variety.
            const span = i === 0 || i === 1 ? "col-span-2 md:col-span-3" : i === 5 ? "col-span-2 md:col-span-3" : "col-span-1 md:col-span-2";
            return (
              <figure key={p.src} className={`${span} group`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <Image
                    src={p.src}
                    alt={p.caption}
                    fill
                    sizes="(min-width:1024px) 33vw, 50vw"
                    className="object-cover transition duration-[900ms] group-hover:scale-[1.03]"
                    quality={80}
                  />
                </div>
                <figcaption className="font-couture mt-3 text-base italic text-[var(--brand-builders-gold)] md:text-lg">
                  {p.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* FROM THE OWNER. Real Josh quote from WSAW, with the mural photo. */}
      <section className="border-t border-[var(--brand-builders)]/10 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-x-14 gap-y-12 md:grid-cols-12">
            <figure className="md:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                <Image
                  src={MURAL}
                  alt="A detail from the Build Your Future mural on the side of the Builders Corner showroom in Wausau, painted by Stephanie Kohli in June 2023."
                  fill
                  sizes="(min-width:768px) 40vw, 100vw"
                  className="object-cover"
                  quality={85}
                />
              </div>
              <figcaption className="font-couture mt-5 text-base italic text-[var(--brand-builders-gold)] md:text-lg">
                Build Your Future mural · south wall · painted June 2023
              </figcaption>
            </figure>

            <div className="md:col-span-7 md:pt-3">
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--brand-builders-gold)]">
                From the owner
              </div>
              <blockquote className="mt-6 border-l-2 border-[var(--brand-builders-gold)] pl-6">
                <p className="font-couture text-2xl leading-[1.35] text-[var(--brand-builders)] md:text-3xl">
                  &ldquo;Trades is a dying breed. So we want to do something that represents what us hard-working guys do.&rdquo;
                </p>
                <footer className="mt-4 text-sm text-[var(--muted-foreground)]">
                  Josh Nickel, owner · to WSAW NewsChannel 7, June 2023
                </footer>
              </blockquote>
              <div className="mt-10 space-y-4 text-base leading-[1.7] text-[var(--foreground)] md:text-lg">
                <p>
                  Josh said that when the &ldquo;Build Your Future&rdquo; mural got painted on the side of the building. About fifty people from the neighborhood showed up with brushes. Stephanie Kohli designed the artwork.
                </p>
                <p>
                  The cabinet shop has been at 825 Washington Street since 1983. Josh has been running it since 2019. The showroom is open Monday through Saturday.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION INQUIRY FORM. Primary lead capture on the home
          page, paired below with the showroom visit + hours block. */}
      <section className="border-t border-[var(--brand-builders)]/10 bg-[var(--muted)]/40 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <InquiryForm brand="builders" />
        </div>
      </section>

      {/* SHOWROOM VISIT + CTA. Real address, real hours, first consult is free. */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Come see us</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1.05] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Stop by the showroom. Or call. First meeting is free.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
              825 Washington Street, Wausau. Door samples, slab pieces, hardware on the wall. Walk in any time we&apos;re open.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
              <Link
                href="/builders-corner/consultation"
                className="inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base text-[var(--brand-builders)] transition hover:text-[var(--brand-builders-gold)] md:text-lg"
              >
                Book a consultation
              </Link>
              <a
                href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                className="inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
              >
                Call {ADDRESS.phone}
              </a>
            </div>
          </div>
          <div className="border-l border-[var(--brand-builders)]/20 pl-10 md:col-span-5">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Visit us</div>
            <div className="font-couture mt-5 text-3xl leading-tight text-[var(--brand-builders)] md:text-4xl">
              {ADDRESS.street}
            </div>
            <div className="mt-1 text-base text-[var(--muted-foreground)]">
              {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
            </div>
            <ul className="mt-10 divide-y divide-[var(--brand-builders)]/15 border-t border-b border-[var(--brand-builders)]/15">
              {BUILDERS.hours.map((h) => (
                <li key={h.day} className="flex items-baseline justify-between gap-4 py-3 text-base">
                  <span className="text-[var(--foreground)]">{h.day}</span>
                  <span className="text-[var(--muted-foreground)]">{h.hours}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base text-[var(--muted-foreground)]">
              Closed Sunday through Tuesday. Evening visits by appointment.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}

function BCTile({
  tag,
  href,
  image,
  alt,
  caption,
}: {
  tag: string;
  href: string;
  image: string;
  alt: string;
  caption: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width:768px) 50vw, 100vw"
          className="object-cover transition duration-[900ms] group-hover:scale-[1.03]"
          quality={80}
        />
      </div>
      <div className="mt-5">
        <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">{tag}</div>
        <p className="mt-3 max-w-md text-base leading-[1.65] text-[var(--muted-foreground)] md:text-lg">{caption}</p>
      </div>
    </Link>
  );
}

function BCStat({ n, label, sub }: { n: string; label: string; sub?: string }) {
  return (
    <div className="border-l border-white/15 pl-5">
      <div className="font-couture flex items-baseline gap-2 leading-none">
        <span className="text-5xl text-white md:text-7xl">{n}</span>
        {sub ? <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">{sub}</span> : null}
      </div>
      <div className="font-serif mt-3 max-w-[16ch] text-[13px] italic leading-snug text-white/65">{label}</div>
    </div>
  );
}
