import Image from "next/image";
import Link from "next/link";

const B = "/real-photos/business";
const F = "/real-photos/foursquared";
const P = "/real-photos";

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
 * Homepage Builders Corner block after reviews: short copy, CTAs, finished work.
 */
export function BuildersPromo() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--cream)]">
      <div className="mx-auto max-w-[1360px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <h2 className="font-display max-w-[20ch] text-[clamp(1.75rem,0.9rem+2.4vw,2.75rem)] leading-[1.05]">
              Built by <span className="font-normal italic">Builders Corner.</span>
            </h2>
            <p className="mt-2 max-w-[46ch] text-[1rem] font-light leading-[1.6] text-[var(--soft)] sm:mt-3 sm:text-[1.05rem] sm:leading-[1.65]">
              High-end brands, built in Wausau. Custom kitchens and baths designed
              in our showroom, built in our shop, and installed by the 4 Squared
              crew.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/builders-corner"
              className="bg-[var(--ink)] px-5 py-3 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white sm:px-6 sm:py-3.5 sm:text-[0.8rem]"
            >
              Explore Builders Corner ›
            </Link>
            <Link
              href="/contact"
              className="border border-[var(--ink)] px-5 py-3 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] sm:px-6 sm:py-3.5 sm:text-[0.8rem]"
            >
              Start a remodel
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 md:grid-cols-3">
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
