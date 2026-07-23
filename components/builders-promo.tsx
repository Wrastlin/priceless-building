import Image from "next/image";
import Link from "next/link";

const B = "/real-photos/business";
const F = "/real-photos/foursquared";
const P = "/real-photos";

const WORK = [
  {
    src: `${P}/builders-corner-hero.jpg`,
    alt: "Dark shaker kitchen with marble island at Builders Corner.",
  },
  {
    src: `${F}/kitchen-white-island-shiplap.jpg`,
    alt: "White island kitchen with wood pantry and shiplap.",
  },
  {
    src: `${F}/kitchen-wood-island-black-pendants.jpg`,
    alt: "Wood island kitchen with black pendant lights.",
  },
  {
    src: `${B}/dark-double-vanity-bathroom-install.jpg`,
    alt: "Custom double vanity bath install.",
  },
];

/**
 * Homepage Builders Corner promo: finished work first, then CTAs.
 * Brand logos live higher on the home page (after the three businesses).
 */
export function BuildersPromo() {
  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="max-w-[40ch]">
          <h2 className="font-display text-[clamp(2rem,1rem+2.6vw,3.2rem)] leading-[1.05]">
            Builders <span className="font-normal italic">Corner.</span>
          </h2>
          <p className="mt-3 text-[1.05rem] font-light leading-[1.65] text-[var(--soft)]">
            High-end brands, built in Wausau. Custom kitchens and baths designed
            in our showroom, built in our shop, and installed by the 4 Squared
            crew. Come see the real samples in the showroom.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3">
          {WORK.map((w) => (
            <div
              key={w.src}
              className="relative aspect-[4/5] overflow-hidden bg-[var(--line)] sm:aspect-[3/4] md:aspect-[16/11]"
            >
              <Image
                src={w.src}
                alt={w.alt}
                fill
                sizes="(min-width:768px) 50vw, 50vw"
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
      </div>
    </section>
  );
}
