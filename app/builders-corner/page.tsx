import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { InquiryForm } from "@/components/inquiry-form";
import { ADDRESS, BUILDERS } from "@/lib/brands";

/**
 * Builders Corner. Single premium-positioning article inside the
 * Price-Less family of brands. The old multi-page mini-site has been
 * archived; this one page now covers the entire BC story: who it is,
 * what it makes, how it works, how to come visit. SEO-loaded with the
 * remodeling + custom-cabinetry + Wausau keywords search engines (and
 * LLMs) need to surface the operation.
 */

export const metadata: Metadata = {
  title:
    "Builders Corner · Premium custom cabinetry, kitchens, and baths in Wausau, WI",
  description:
    "Premium custom cabinetry designed and built in Wausau since 1983. Custom kitchen design, bath remodels, built-ins, and full home renovations under one roof with our install crew. The upscale side of Price-Less Building Center.",
  alternates: { canonical: "https://pricelessbuilding.com/builders-corner" },
  openGraph: {
    title:
      "Builders Corner · Custom kitchens, baths, and remodels in Wausau, WI",
    description:
      "Premium custom cabinetry designed and built in Wausau. Designed with you in the showroom, built and finished in our shop, installed by Four Squared.",
    url: "https://pricelessbuilding.com/builders-corner",
    type: "website",
  },
};

const HERO = "/real-photos/install-kitchen-walnut.webp";
const PAIRING_IMAGE = "/real-photos/install-kitchen-walnut-island-bar.webp";
const TILE_KITCHENS = "/real-photos/install-kitchen-walnut-island-bar.webp";
const TILE_BATHS = "/real-photos/install-bathroom-shaker.webp";
const TILE_BUILTINS = "/real-photos/install-kitchen-floating-shelf-bowls.webp";
const MURAL = "/real-photos/mural-detail.webp";

const SHOWROOM = [
  { src: "/real-photos/install-kitchen-walnut-marble.webp", caption: "Walnut shaker with white marble counter." },
  { src: "/real-photos/install-kitchen-island-globes.webp", caption: "White cabinetry, quartz island, globe pendants." },
  { src: "/real-photos/install-kitchen-rustic-beam.webp", caption: "Rustic kitchen with exposed beam and reclaimed wood vent shroud." },
  { src: "/real-photos/install-bathroom-yellow-green-tile.webp", caption: "Warm traditional bath, green wainscot, dark-stained oak vanity." },
  { src: "/real-photos/install-kitchen-galley-green-wall.webp", caption: "Galley kitchen, two-tone, slate-green accent." },
  { src: "/real-photos/install-kitchen-honey-oak.webp", caption: "Honey-oak shaker with white quartz." },
];

const STEPS = [
  { n: "01", t: "Free consultation", b: "Showroom visit or we come to your home. Bring photos, sketches, or just an idea." },
  { n: "02", t: "Design with you", b: "We measure, draw your room, and walk you through real door and finish samples." },
  { n: "03", t: "Build in the shop", b: "Doors, drawers, and finishes built locally in Wausau. Sprayed, sanded, sprayed again." },
  { n: "04", t: "Installed by Four Squared", b: "The install crew sets the cabinets, runs the counters, and walks the punch list with you." },
];

// JSON-LD structured data. Tells Google and LLMs exactly who this
// business is, what it offers, where it is, and how it relates to
// Price-Less Building Center and Four Squared. Critical for local
// remodeling + custom cabinetry search visibility in central WI.
const BC_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "GeneralContractor"],
  "@id": "https://pricelessbuilding.com/builders-corner#org",
  name: "Builders Corner Cabinetry & Design",
  description:
    "Premium custom cabinetry, kitchen and bath design, and built-ins in Wausau, Wisconsin. Designed and built locally since 1983, installed by Four Squared.",
  url: "https://pricelessbuilding.com/builders-corner",
  telephone: "+1-715-848-3855",
  priceRange: "$$$",
  foundingDate: "1983",
  image: `https://pricelessbuilding.com${HERO}`,
  parentOrganization: {
    "@type": "LocalBusiness",
    "@id": "https://pricelessbuilding.com#org",
    name: "Price-Less Building Center",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.state,
    postalCode: ADDRESS.zip,
    addressCountry: "US",
  },
  areaServed: [
    "Wausau, WI",
    "Schofield, WI",
    "Weston, WI",
    "Rib Mountain, WI",
    "Rothschild, WI",
    "Mosinee, WI",
    "Marathon County, WI",
  ],
  makesOffer: [
    { "@type": "Offer", name: "Custom kitchen cabinetry design and build" },
    { "@type": "Offer", name: "Custom bathroom cabinetry design and build" },
    { "@type": "Offer", name: "Built-in cabinetry for pantries, mudrooms, and home offices" },
    { "@type": "Offer", name: "Full kitchen remodel design and project management" },
    { "@type": "Offer", name: "Bath remodel design and project management" },
  ],
  sameAs: ["https://pricelessbuilding.com"],
  openingHoursSpecification: BUILDERS.hours
    .filter((h) => h.hours !== "Closed")
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      ...(h.hours.includes("–")
        ? {
            opens: h.hours.split("–")[0]?.trim(),
            closes: h.hours.split("–")[1]?.trim(),
          }
        : {}),
    })),
};

export default function BuildersCornerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BC_JSON_LD) }}
      />
      <SiteHeader brand="builders" />

      {/* HERO. Dark premium band. Headline, sub, two CTAs, hero photo. */}
      <section className="relative bg-[#0b1729] text-white">
        <div className="mx-auto max-w-7xl px-6 pt-14 md:pt-20" data-reveal>
          <div className="flex items-baseline justify-between gap-6 border-b border-white/10 pb-6">
            <BrandLogo brand="builders" size="lg" />
            <a
              href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
              className="hidden text-sm text-white/80 underline decoration-[var(--brand-builders-gold)] decoration-2 underline-offset-[6px] md:inline md:text-base"
            >
              {ADDRESS.phone}
            </a>
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-10 md:mt-14 md:grid-cols-12">
            <div className="md:col-span-7">
              <h1 className="font-couture text-[clamp(2.5rem,1.4rem+4vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-white">
                Premium custom cabinetry, designed and built in Wausau.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-[1.7] text-white/85 md:text-xl">
                The upscale side of 825 Washington Street. We design your kitchen, bath, or built-in with you in the showroom, build the cabinets in our own shop, and install with the Four Squared crew.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="#consult"
                  className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
                >
                  Book a free consultation
                </Link>
                <a
                  href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                  className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
                >
                  Call {ADDRESS.phone}
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                <Image
                  src={HERO}
                  alt="A custom Builders Corner kitchen: walnut shaker cabinetry, white marble counter, natural light."
                  fill
                  priority
                  sizes="(min-width:768px) 42vw, 100vw"
                  className="object-cover"
                  quality={85}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 pb-16 md:grid-cols-3 md:gap-10 md:pb-20">
            <BCStat n="1983" label="Designing and building cabinetry in Wausau." />
            <BCStat n="4.8★" label="On Google across all three brands." />
            <BCStat n="MON–SAT" label="Showroom open six days a week." />
          </div>
        </div>
      </section>

      {/* THE PAIRING. Positions BC as the premium counterpart to PL. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <figure className="md:col-span-6" data-reveal>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src={PAIRING_IMAGE}
                  alt="A premium Builders Corner kitchen with island and bar seating, the kind of custom design you cannot pick off the surplus floor."
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                  quality={82}
                />
              </div>
            </figure>
            <div className="md:col-span-6" data-reveal data-reveal-delay="0.08">
              <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
                When the surplus floor isn&apos;t the project.
              </div>
              <h2 className="font-couture mt-4 text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05] tracking-[-0.015em] text-[var(--brand-builders)]">
                Style and class at every price point.
              </h2>
              <p className="mt-5 text-lg leading-[1.7] text-[var(--foreground)] md:text-xl">
                Price-Less keeps the budget room in materials. Builders Corner picks up where the surplus floor stops, with cabinetry, counters, and built-ins designed and built specifically for your house.
              </p>
              <p className="mt-4 text-base leading-[1.7] text-[var(--muted-foreground)] md:text-lg">
                Same building. Different tier. Both ours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE MAKE. Three image cards: kitchens, baths, built-ins. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <header className="max-w-3xl" data-reveal>
            <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
              What we make
            </div>
            <h2 className="font-couture mt-4 text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05] tracking-[-0.015em] text-[var(--brand-builders)]">
              Kitchens, baths, and built-ins for the rest of the house.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
              One bath, a whole first floor, a mudroom, a pantry. Designed and built here, installed by Four Squared.
            </p>
          </header>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { tag: "Kitchens", image: TILE_KITCHENS, alt: "Custom kitchen with white-oak shaker doors and a quartz island.", body: "Custom kitchens: white-oak shaker, painted inset, hidden fridge panels, slab-front islands. Drawn to your room." },
              { tag: "Baths", image: TILE_BATHS, alt: "Custom bath with shaker vanity and tile shower.", body: "Vanities, linen towers, quartz tops, custom tile work. Designed in the showroom, finished in the shop." },
              { tag: "Built-ins", image: TILE_BUILTINS, alt: "Built-in pantry shelving with tall doors and brushed hardware.", body: "Mudrooms, pantries, home offices, libraries, laundry rooms. Same finish booth, same crew." },
            ].map((c, i) => (
              <article
                key={c.tag}
                data-reveal
                data-reveal-delay={(i * 0.06).toFixed(2)}
                className="group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    quality={80}
                  />
                </div>
                <div className="mt-5">
                  <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
                    {c.tag}
                  </div>
                  <p className="mt-2.5 text-base leading-[1.65] text-[var(--foreground)] md:text-lg">
                    {c.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS. Compact four-step flow on a dark band. */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <header className="max-w-3xl" data-reveal>
            <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
              How it works
            </div>
            <h2 className="font-couture mt-4 text-[clamp(2rem,1.4rem+2.8vw,3rem)] leading-[1.05] tracking-[-0.01em]">
              Four steps from idea to install.
            </h2>
          </header>

          <ol className="mt-10 grid gap-px bg-white/10 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                data-reveal
                data-reveal-delay={(i * 0.05).toFixed(2)}
                className="bg-[#0b1729] p-6"
              >
                <div className="font-couture text-3xl text-[var(--brand-builders-gold)]">
                  {s.n}
                </div>
                <h3 className="font-couture mt-3 text-xl leading-snug md:text-2xl">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-[1.55] text-white/80">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SHOWROOM. Magazine-style asymmetric grid of recent work. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <header className="max-w-3xl" data-reveal>
            <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
              From the showroom
            </div>
            <h2 className="font-couture mt-4 text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05] tracking-[-0.015em] text-[var(--brand-builders)]">
              Recent rooms.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-[1.7] text-[var(--muted-foreground)] md:text-lg">
              A few directions to start from. Every photo is a real install.
            </p>
          </header>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
            {SHOWROOM.map((p, i) => {
              const span =
                i === 0 || i === 1
                  ? "col-span-2 md:col-span-3"
                  : i === 5
                    ? "col-span-2 md:col-span-3"
                    : "col-span-1 md:col-span-2";
              return (
                <figure
                  key={p.src}
                  data-reveal
                  data-reveal-delay={(i * 0.04).toFixed(2)}
                  className={`${span} group`}
                >
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
        </div>
      </section>

      {/* PRESS / MURAL. Quote from the WSAW story, paired with the mural. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-x-14 gap-y-10 md:grid-cols-12">
            <figure className="md:col-span-5" data-reveal>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                <Image
                  src={MURAL}
                  alt="A detail from the Build Your Future mural on the south wall of the building, painted by fifty Wausau volunteers in June 2023."
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

            <div className="md:col-span-7 md:pt-3" data-reveal data-reveal-delay="0.08">
              <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
                In the press
              </div>
              <blockquote className="mt-6 border-l-2 border-[var(--brand-builders-gold)] pl-6">
                <p className="font-couture text-2xl leading-[1.35] text-[var(--brand-builders)] md:text-3xl">
                  &ldquo;Trades is a dying breed. So we want to do something that represents what us hard-working guys do.&rdquo;
                </p>
                <footer className="mt-4 text-sm text-[var(--muted-foreground)]">
                  <a
                    href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-[var(--brand-builders-gold)] decoration-2 underline-offset-4"
                  >
                    WSAW NewsChannel 7, June 2023
                  </a>
                </footer>
              </blockquote>
              <p className="mt-8 text-base leading-[1.7] text-[var(--foreground)] md:text-lg">
                The mural was painted on the side of the building by about fifty volunteers from across Wausau. The cabinet shop has been at 825 Washington Street since 1983, and Builders Corner has been the in-house custom side of the operation since the 2019 partnership took over.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULT INQUIRY. Lead capture, anchored for the hero CTA. */}
      <section id="consult" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20" data-reveal>
          <InquiryForm brand="builders" />
        </div>
      </section>

      {/* VISIT. Address, hours, and a second call CTA. */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7" data-reveal>
            <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
              Come walk the showroom
            </div>
            <h2 className="font-couture mt-4 text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05] tracking-[-0.015em]">
              First meeting is free.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-[1.7] text-white/85 md:text-xl">
              Door samples on the wall, slab pieces on the table, hardware to hold. Walk in any time we are open, or call ahead and we will save you a seat with a designer.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4">
              <Link
                href="#consult"
                className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
              >
                Book a consultation
              </Link>
              <a
                href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
              >
                Call {ADDRESS.phone}
              </a>
            </div>
          </div>

          <div className="md:col-span-5" data-reveal data-reveal-delay="0.08">
            <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
              Visit us
            </div>
            <div className="font-couture mt-3 text-3xl leading-tight md:text-4xl">
              {ADDRESS.street}
            </div>
            <div className="mt-1 text-base text-white/70">
              {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
            </div>
            <ul className="mt-8 divide-y divide-white/10 border-t border-b border-white/10">
              {BUILDERS.hours.map((h) => (
                <li
                  key={h.day}
                  className="flex items-baseline justify-between gap-4 py-3 text-base"
                >
                  <span className="text-white">{h.day}</span>
                  <span className="text-white/70">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}

function BCStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="border-l border-white/15 pl-5">
      <div className="font-couture text-4xl leading-none text-white md:text-5xl">
        {n}
      </div>
      <div className="font-serif mt-3 max-w-[24ch] text-sm italic leading-snug text-white/70 md:text-base">
        {label}
      </div>
    </div>
  );
}
