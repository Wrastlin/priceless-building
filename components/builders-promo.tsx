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
 * Homepage Builders Corner promo: finished high-end rooms + CTA.
 * Brand logos live in the VendorWall scroll banner below (one place only).
 */
export function BuildersPromo() {
  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Builders Corner</p>
            <h2 className="font-display mt-3 text-[clamp(2rem,1rem+2.6vw,3.2rem)] leading-[1.05]">
              High-end brands. Built in{" "}
              <span className="font-normal italic">Wausau.</span>
            </h2>
            <p className="mt-4 max-w-[40ch] text-[1rem] font-light leading-[1.7] text-[var(--soft)]">
              Custom kitchens and baths designed in our showroom, built in our
              shop, and installed by the 4 Squared crew. Come see the real
              samples in the showroom.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/builders-corner"
                className="bg-[var(--ink)] px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white"
              >
                Explore Builders Corner ›
              </Link>
              <Link
                href="/contact"
                className="border border-[var(--ink)] px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.2em]"
              >
                Start a remodel
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-span-7">
            {WORK.map((w) => (
              <div
                key={w.src}
                className="relative aspect-[4/5] overflow-hidden bg-[var(--line)] sm:aspect-[3/4]"
              >
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(min-width:1024px) 28vw, 50vw"
                  quality={78}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
