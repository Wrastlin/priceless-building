import Image from "next/image";
import Link from "next/link";

const B = "/real-photos/business";
const F = "/real-photos/foursquared";
const P = "/real-photos";
const M = "/real-photos/mood-stills";

const KITCHEN_BEFORE_AFTER = {
  src: `${B}/kitchen-remodel-before-after.jpg`,
  label: "Kitchen remodel",
  body: "Dated oak galley to a bright white-cabinet kitchen with stone counters, designed, supplied, and installed under one roof.",
};

/** Atmosphere from Detail & Mood Stills deliverables — before the finished-work grid. */
const MOOD = [
  {
    src: `${M}/detail-craftsman-dusk.jpg`,
    alt: "Craftsman door detail at dusk.",
  },
  {
    src: `${M}/detail-arched8-dusk.jpg`,
    alt: "Arched glass door lit at dusk.",
  },
  {
    src: `${M}/detail-globe-macro.jpg`,
    alt: "Globe pendant light detail.",
  },
];

const GALLERY = [
  {
    src: `${P}/builders-corner-hero.jpg`,
    alt: "Dark shaker kitchen with marble island at Builders Corner.",
  },
  {
    src: `${F}/kitchen-wood-island-black-pendants.jpg`,
    alt: "Wood island kitchen with black pendant lights.",
  },
  {
    src: `${F}/kitchen-white-island-shiplap.jpg`,
    alt: "White island kitchen with wood pantry and shiplap.",
  },
  {
    src: `${B}/white-kitchen-wood-island.jpg`,
    alt: "White kitchen with wood island.",
  },
  {
    src: `${B}/dark-double-vanity-bathroom-install.jpg`,
    alt: "Custom double vanity bath install.",
  },
  {
    src: `${F}/pergola-patio-daylight.jpg`,
    alt: "Outdoor pergola and patio in daylight.",
  },
];

/**
 * Homepage Builders Corner block (after reviews): intro, kitchen before/after,
 * mood stills, CTAs, then finished-work gallery.
 */
export function BuildersPromo() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--cream)]">
      <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display max-w-[20ch] text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05]">
              Built by <span className="font-normal italic">Builders Corner.</span>
            </h2>
            <p className="mt-3 max-w-[46ch] text-[1.05rem] font-light leading-[1.65] text-[var(--soft)]">
              High-end brands, built in Wausau. Custom kitchens and baths designed
              in our showroom, built in our shop, and installed by the 4 Squared
              crew. Come see the real samples in the showroom.
            </p>
          </div>
          <Link
            href="/builders-corner"
            className="hidden shrink-0 border-b border-[var(--ink)] pb-1 text-[0.8rem] font-medium uppercase tracking-[0.16em] sm:inline-block"
          >
            See more work ›
          </Link>
        </div>

        <figure className="mt-6 sm:mt-8">
          <div className="relative w-full overflow-hidden bg-[var(--line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={KITCHEN_BEFORE_AFTER.src}
              alt={KITCHEN_BEFORE_AFTER.label}
              className="h-auto w-full object-contain"
            />
          </div>
          <figcaption className="mt-3 sm:mt-4">
            <h3 className="font-display text-[1.2rem] font-semibold sm:text-[1.4rem]">
              {KITCHEN_BEFORE_AFTER.label}
            </h3>
            <p className="mt-1.5 max-w-[52ch] text-[0.95rem] font-light leading-[1.7] text-[var(--soft)] sm:mt-2">
              {KITCHEN_BEFORE_AFTER.body}
            </p>
          </figcaption>
        </figure>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
          {MOOD.map((m) => (
            <div
              key={m.src}
              className="relative aspect-[3/4] overflow-hidden bg-[var(--line)] sm:aspect-[4/5]"
            >
              <Image
                src={m.src}
                alt={m.alt}
                fill
                sizes="(max-width:768px) 33vw, 22vw"
                quality={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
          <Link
            href="/builders-corner"
            className="bg-[var(--ink)] px-6 py-3.5 text-center text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white"
          >
            Explore Builders Corner ›
          </Link>
          <Link
            href="/contact"
            className="border border-[var(--ink)] px-6 py-3.5 text-center text-[0.8rem] font-medium uppercase tracking-[0.18em]"
          >
            Start a remodel
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-3 md:grid-cols-3">
          {GALLERY.map((g) => (
            <div
              key={g.src}
              className="relative aspect-[4/5] min-w-0 overflow-hidden bg-[var(--line)]"
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width:768px) 45vw, 30vw"
                quality={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
