import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHead } from "@/components/section-head";
import { ADDRESS, BUILDERS } from "@/lib/brands";

/**
 * Builders Corner article page. Lives inside the Price-Less family of
 * brands and uses the Price-Less visual language (display + sans
 * typography, brand-red accents, ink dark anchors) instead of a
 * separate couture/navy/gold system. The "premium" feel comes from
 * better photos and service cards, not from a different typeface.
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
const TILE_KITCHENS = "/real-photos/install-kitchen-walnut-island-bar.webp";
const TILE_BATHS = "/real-photos/install-bathroom-shaker.webp";
const TILE_BUILTINS = "/real-photos/install-kitchen-floating-shelf-bowls.webp";
const SERVICES = [
  {
    t: "Custom kitchens",
    b: "Cabinets, islands, integrated panels, drawn to your room and built locally.",
    img: TILE_KITCHENS,
    alt: "A custom Builders Corner kitchen with white-oak shaker doors and a quartz island.",
  },
  {
    t: "Custom baths",
    b: "Vanities, linen towers, quartz tops, full tile work — designed in the showroom.",
    img: TILE_BATHS,
    alt: "A custom bath with shaker vanity, butcher-block top, and matte black fixtures.",
  },
  {
    t: "Built-ins for the rest of the house",
    b: "Pantries, mudrooms, home offices, libraries, laundry runs. Same finish booth.",
    img: TILE_BUILTINS,
    alt: "A custom built-in pantry shelving wall with tall doors and integrated panels.",
  },
];

// Real install + showroom photos imported from the storefront's
// Facebook archive (see lib/business-photos.ts).
const SHOWROOM = [
  { src: "/real-photos/business/white-kitchen-marble-island.jpg", caption: "White kitchen with marble island." },
  { src: "/real-photos/business/white-kitchen-wood-island.jpg", caption: "White cabinetry with a warm wood island." },
  { src: "/real-photos/business/rustic-wood-kitchen-island.jpg", caption: "Rustic kitchen with a heavy wood island." },
  { src: "/real-photos/business/dark-cabinet-kitchen-install.jpg", caption: "Dark-cabinet kitchen with quartz counters." },
  { src: "/real-photos/business/white-shaker-kitchen-cabinets.jpg", caption: "Classic white-shaker kitchen build." },
  { src: "/real-photos/business/dark-double-vanity-bathroom-install.jpg", caption: "Dark double-vanity bath with white counter." },
];

const STEPS = [
  { n: "01", t: "Free consultation", b: "Showroom visit or we come to your home. Bring photos or just an idea." },
  { n: "02", t: "Design with you", b: "We measure, draw your room, and walk you through real samples." },
  { n: "03", t: "Build in the shop", b: "Doors, drawers, and finishes built locally in Wausau." },
  { n: "04", t: "Installed by Four Squared", b: "The install crew sets the cabinets and walks the punch list with you." },
];

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

      {/* HERO. Dark anchor band, Price-Less display + sans typography,
          brand-red accent. No couture/gold. */}
      <section className="relative bg-[#0b1220] text-white">
        <div className="mx-auto max-w-7xl px-6 pt-14 md:pt-20" data-reveal>
          <div className="flex items-baseline justify-between gap-6 border-b border-white/10 pb-6">
            <BrandLogo brand="builders" size="lg" />
            <a
              href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
              className="hidden text-sm font-semibold text-white/85 underline decoration-[#ff8b85] decoration-2 underline-offset-[6px] md:inline md:text-base"
            >
              {ADDRESS.phone}
            </a>
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-10 md:mt-14 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#ff8b85]">
                The premium side of Price-Less
              </div>
              <h1 className="font-display mt-4 text-[clamp(2.5rem,1.4rem+4vw,4.5rem)] leading-[1.02] tracking-tight text-white">
                Premium custom cabinetry, designed and built in Wausau.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-[1.7] text-white/90 md:text-xl">
                If you are thinking about a kitchen, a bath, or a built-in that is genuinely yours, this is where to start. We sit down with you in the showroom, draw your room out together, build the cabinets in our own shop, and the Four Squared crew installs them. There is no pressure to start big — small projects are welcome too.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="#consult"
                  className="btn btn-priceless"
                >
                  Book a free consultation
                </Link>
                <a
                  href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-base font-semibold text-white/85 underline decoration-white/30 decoration-2 underline-offset-[6px] transition hover:text-white md:text-lg"
                >
                  Or call {ADDRESS.phone}
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--muted)]">
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

      {/* WHAT WE MAKE. Service cards. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline={<>What we make. <span className="text-[var(--brand-priceless)]">Three rooms.</span></>}
            sub="One bath, a whole first floor, a mudroom, a pantry. Designed and built here, installed by Four Squared."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SERVICES.map((c, i) => (
              <article
                key={c.t}
                data-reveal
                data-reveal-delay={(i * 0.06).toFixed(2)}
                className="group overflow-hidden border border-[var(--border)] bg-white transition hover:border-[var(--brand-priceless)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                  <Image
                    src={c.img}
                    alt={c.alt}
                    fill
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    quality={80}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl leading-snug md:text-2xl">
                    {c.t}
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-[var(--foreground)]">
                    {c.b}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS. Four compact steps on a dark anchor band. */}
      <section className="bg-[#0b1220] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            invert
            headline="Four steps from idea to install."
          />

          <ol className="mt-10 grid gap-px bg-white/10 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                data-reveal
                data-reveal-delay={(i * 0.05).toFixed(2)}
                className="bg-[#0b1220] p-6"
              >
                <div className="font-display text-3xl leading-none text-[#ff8b85]">
                  {s.n}
                </div>
                <h3 className="font-display mt-3 text-xl leading-snug text-white md:text-2xl">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-[1.55] text-white/85">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SHOWROOM GRID. Magazine-style asymmetric grid of recent work. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="Recent rooms."
            sub="A few directions to start from. Every photo is a real install."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-6 sm:gap-4">
            {SHOWROOM.map((p, i) => {
              const span =
                i === 0 || i === 1
                  ? "sm:col-span-3"
                  : i === 5
                    ? "sm:col-span-3"
                    : "sm:col-span-2";
              return (
                <figure
                  key={p.src}
                  data-reveal
                  data-reveal-delay={(i * 0.04).toFixed(2)}
                  className={`${span} group`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                    <Image
                      src={p.src}
                      alt={p.caption}
                      fill
                      sizes="(min-width:1024px) 33vw, 50vw"
                      className="object-cover transition duration-[900ms] group-hover:scale-[1.03]"
                      quality={80}
                    />
                  </div>
                  <figcaption className="mt-3 text-base text-[var(--foreground)] md:text-lg">
                    {p.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONSULT INQUIRY. Lead capture, anchored for the hero CTA. */}
      <section id="consult" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20" data-reveal>
          <InquiryForm brand="builders" />
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}

function BCStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="border-l border-white/15 pl-5">
      <div className="font-display text-4xl leading-none text-white md:text-5xl">
        {n}
      </div>
      <div className="mt-3 max-w-[24ch] text-sm leading-snug text-white/85 md:text-base">
        {label}
      </div>
    </div>
  );
}
