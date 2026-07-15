import Image from "next/image";
import Link from "next/link";
import { vendorLogo } from "@/lib/vendor-logos";

const B = "/real-photos/business";
const F = "/real-photos/foursquared";
const P = "/real-photos";

/** Premium cabinetry / fixture brands from the Builders Corner walkthrough. */
const BUILDERS_BRANDS = [
  "Showplace Cabinetry",
  "Koch Cabinets",
  "Blum",
  "Kohler",
  "Delta",
  "Amerock",
  "Schlage",
  "JELD-WEN",
  "Andersen",
  "Marvin",
  "Duravit",
  "Newport Brass",
];

const WORK = [
  {
    src: `${P}/builders-corner-hero.jpg`,
    alt: "Dark shaker kitchen with marble island — Builders Corner.",
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
 * Homepage Builders Corner promo — finished high-end rooms + walkthrough
 * brand logos, encouraging premium remodel inquiries.
 */
export function BuildersPromo() {
  const logos = BUILDERS_BRANDS.map((name) => ({
    name,
    src: vendorLogo(name),
  })).filter((v): v is { name: string; src: string } => v.src !== null);

  return (
    <section className="border-y border-[var(--line)] bg-[var(--cream)]">
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
              shop, and installed by the 4 Squared crew. The brands on our
              boards are the ones we specify for premium remodels — come see
              real samples, not just catalogs.
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
            {WORK.map((w, i) => (
              <div
                key={w.src}
                className={`relative overflow-hidden bg-[var(--line)] ${
                  i === 0 ? "aspect-[4/5] sm:aspect-[3/4]" : "aspect-[4/5] sm:aspect-[3/4]"
                }`}
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

        {logos.length > 0 ? (
          <div className="mt-12 border-t border-[var(--line)] pt-10 sm:mt-14 sm:pt-12">
            <p className="text-center text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--rust)]">
              Brands we specify · from the Builders Corner showroom
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14">
              {logos.map((v) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={v.name}
                  src={v.src}
                  alt={v.name}
                  loading="lazy"
                  className="h-10 w-auto max-w-[140px] object-contain opacity-80 sm:h-12 sm:max-w-[160px]"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
