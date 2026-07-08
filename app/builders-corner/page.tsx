import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHead } from "@/components/section-head";
import { HeroPhotoFader, type HeroPhotoSource } from "@/components/hero-photo-fader";
import { ADDRESS, BUILDERS } from "@/lib/brands";

/**
 * Builders Corner article page. Lives inside the Price-Less family of
 * brands and uses the shared "Showroom Warmth" language (serif display
 * + sans typography, navy anchors, brass gold accents). The "premium"
 * feel comes from better photos and service cards, not from a
 * different typeface.
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
      "Premium custom cabinetry designed and built in Wausau. Designed with you in the showroom, built and finished in our shop, installed by 4 Squared.",
    url: "https://pricelessbuilding.com/builders-corner",
    type: "website",
    images: [
      {
        url: "https://pricelessbuilding.com/real-photos/business/white-kitchen-marble-island.jpg",
        alt: "A custom Builders Corner kitchen with white cabinetry and a marble-top island.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://pricelessbuilding.com/real-photos/business/white-kitchen-marble-island.jpg"],
  },
};

const HERO = "/real-photos/builders-corner-hero.jpg";

// Hero crossfade deck. Pulled from clean Facebook-archive install
// photos rather than the older low-res webp thumbnails.
const HERO_DECK: HeroPhotoSource[] = [
  { src: "/real-photos/builders-corner-hero.jpg", alt: "A custom Builders Corner kitchen with dark shaker cabinetry and a marble waterfall island." },
  { src: "/real-photos/business/white-kitchen-marble-island.jpg", alt: "A custom Builders Corner kitchen with white cabinetry and a marble-top island." },
  { src: "/real-photos/business/kitchen-island-wood-cabinets-range.jpg", alt: "Custom wood-cabinet kitchen with a large island and gas range." },
  { src: "/real-photos/business/dark-cabinet-kitchen-install.jpg", alt: "Dark-cabinet kitchen with pendant lighting and quartz counters." },
  { src: "/real-photos/business/rustic-wood-kitchen-island.jpg", alt: "Rustic kitchen with heavy wood cabinetry and an island." },
  { src: "/real-photos/business/white-kitchen-wood-island.jpg", alt: "White kitchen with a warm wood island and panelled appliances." },
];

const SERVICES = [
  {
    t: "Custom kitchens",
    b: "Cabinets, islands, integrated panels, drawn to your room and built locally.",
    img: "/real-photos/business/white-kitchen-rustic-island.jpg",
    alt: "A bright white custom kitchen anchored by a rustic island, built by Builders Corner in Wausau.",
  },
  {
    t: "Custom baths",
    b: "Vanities, linen towers, quartz tops, full tile work. Designed in the showroom.",
    img: "/real-photos/business/dark-double-vanity-bathroom-install.jpg",
    alt: "A custom dark double-vanity bath install with white counters and black hardware.",
  },
  {
    t: "Built-ins for the rest of the house",
    b: "Pantries, mudrooms, home offices, libraries, laundry runs. Same finish booth.",
    img: "/real-photos/business/wood-cabinets-dark-counters.jpg",
    alt: "Custom wood cabinetry paired with dark counters, finished in the shop.",
  },
];

// Real install + showroom photos imported from the storefront's
// Facebook archive (see lib/business-photos.ts).
const SHOWROOM = [
  { src: "/real-photos/business/white-kitchen-marble-island.jpg", caption: "White kitchen with a marble-top island.", tag: "Kitchen" },
  { src: "/real-photos/business/white-kitchen-wood-island.jpg", caption: "White cabinetry with a warm wood island.", tag: "Kitchen" },
  { src: "/real-photos/business/rustic-wood-kitchen-island.jpg", caption: "Rustic kitchen with a heavy wood island.", tag: "Kitchen" },
  { src: "/real-photos/business/dark-cabinet-kitchen-install.jpg", caption: "Dark-cabinet kitchen with quartz counters.", tag: "Kitchen" },
  { src: "/real-photos/business/white-shaker-kitchen-cabinets.jpg", caption: "Classic white-shaker kitchen build.", tag: "Kitchen" },
  { src: "/real-photos/business/dark-double-vanity-bathroom-install.jpg", caption: "Dark double-vanity bath with white counter.", tag: "Bath" },
  { src: "/real-photos/business/kitchen-island-wood-cabinets-range.jpg", caption: "Wood-cabinet kitchen with a center island and gas range.", tag: "Kitchen" },
  { src: "/real-photos/business/double-sink-bathroom-vanity-black.webp", caption: "Double-sink bath vanity, black cabinetry, framed mirrors.", tag: "Bath" },
  { src: "/real-photos/business/wood-cabinets-granite-kitchen.jpg", caption: "Wood cabinetry paired with granite countertops.", tag: "Kitchen" },
];

const STEPS = [
  { n: "01", t: "Free consultation", b: "Showroom visit or we come to your home. Bring photos or just an idea.", img: "/real-photos/business/staff-member-showroom-display.webp" },
  { n: "02", t: "Design with you", b: "We measure, draw your room, and walk you through real samples.", img: "/real-photos/business/light-wood-cabinet-display.jpg" },
  { n: "03", t: "Build in the shop", b: "Doors, drawers, and finishes built locally in Wausau.", img: "/real-photos/business/unfinished-wood-cabinet-workshop.jpg" },
  { n: "04", t: "Installed by 4 Squared", b: "The install crew sets the cabinets and walks the punch list with you.", img: "/real-photos/business/dark-cabinet-kitchen-install.jpg" },
];

const BC_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "GeneralContractor"],
  "@id": "https://pricelessbuilding.com/builders-corner#org",
  name: "Builders Corner Cabinetry & Design",
  description:
    "Premium custom cabinetry, kitchen and bath design, and built-ins in Wausau, Wisconsin. Designed and built locally since 1983, installed by 4 Squared.",
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

      {/* HERO. Light and airy, the Sicora lane: warm stone ground, elegant
          Marcellus display, one large calm photograph. Navy is ink and
          accent, not a dark band. */}
      <section className="bg-[var(--stone)]">
        <div className="mx-auto max-w-7xl px-6 pt-10 md:pt-14">
          <div className="flex items-center justify-between gap-6 border-b border-[var(--stone-deep)] pb-6">
            <BrandLogo brand="builders" size="lg" />
            <a
              href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
              className="hidden text-sm font-semibold text-[var(--brand-navy)] underline decoration-[var(--brand-gold)] decoration-2 underline-offset-[6px] md:inline md:text-base"
            >
              {ADDRESS.phone}
            </a>
          </div>

          <div className="grid items-center gap-x-14 gap-y-10 py-14 md:grid-cols-12 md:py-20">
            <div className="md:col-span-6" data-reveal>
              <div className="eyebrow">Custom cabinetry &middot; Wausau, since 1983</div>
              <h1 className="font-couture mt-5 text-[clamp(2.6rem,1.5rem+4.4vw,5rem)] leading-[1.08] text-[var(--brand-navy)]">
                Designed with you, built in our own shop.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-[1.75] text-[var(--muted-foreground)]">
                Kitchens, baths, and built-ins for central Wisconsin homes. We
                draw it with you in the showroom, build it here in Wausau, and
                the 4 Squared crew installs it. Big project or small, this is
                where to start.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link href="#consult" className="btn btn-builders">
                  Book a free consultation
                </Link>
                <a
                  href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-base font-semibold text-[var(--brand-navy)] underline decoration-[var(--brand-gold)]/50 decoration-2 underline-offset-[6px] transition hover:decoration-[var(--brand-gold)]"
                >
                  Or call {ADDRESS.phone}
                </a>
              </div>
            </div>
            <div className="md:col-span-6" data-reveal data-reveal-delay="0.1">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[var(--muted)] shadow-[0_30px_60px_-30px_rgba(20,40,68,0.45)]">
                <HeroPhotoFader photos={HERO_DECK} intervalMs={5500} />
              </div>
            </div>
          </div>

          {/* Trust row. Calm, hairline-separated, no side stripes. */}
          <div className="grid grid-cols-1 gap-8 border-t border-[var(--stone-deep)] py-10 sm:grid-cols-3 md:gap-12">
            <BCStat n="1983" label="Designing and building cabinetry in Wausau." />
            <BCStat n="4.8★" label="On Google across all three brands." />
            <BCStat n="Mon–Sat" label="Showroom open six days a week." />
          </div>
        </div>
      </section>

      {/* WHAT WE MAKE. Editorial, image-forward. Photos carry the section;
          minimal chrome, caption below. */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <SectionHead
            font="couture"
            kicker="What we make"
            headline="Cabinetry for the whole house."
            sub="Designed and built here in Wausau, installed by the 4 Squared crew."
          />

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            {SERVICES.map((c, i) => (
              <article key={c.t} data-reveal data-reveal-delay={(i * 0.08).toFixed(2)} className="group">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-[var(--muted)]">
                  <Image
                    src={c.img}
                    alt={c.alt}
                    fill
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
                    quality={80}
                  />
                </div>
                <h3 className="font-couture mt-6 text-2xl leading-snug text-[var(--brand-navy)] md:text-[1.7rem]">
                  {c.t}
                </h3>
                <p className="mt-2.5 text-base leading-relaxed text-[var(--muted-foreground)]">
                  {c.b}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS. Light stone band, elegant numbered steps. */}
      <section className="bg-[var(--stone)]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <SectionHead
            font="couture"
            kicker="How it works"
            headline="Four steps from idea to install."
          />

          <ol className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.n} data-reveal data-reveal-delay={(i * 0.06).toFixed(2)}>
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[16px]">
                  <Image
                    src={s.img}
                    alt={s.t}
                    fill
                    className="object-cover object-top"
                    sizes="(min-width:768px) 25vw, 100vw"
                    quality={74}
                  />
                </div>
                <div className="font-couture text-3xl leading-none text-[var(--brand-gold-deep)]">
                  {s.n}
                </div>
                <h3 className="font-couture mt-3 text-xl leading-snug text-[var(--brand-navy)] md:text-2xl">
                  {s.t}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-[var(--muted-foreground)]">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RECENT ROOMS. Magazine-style asymmetric gallery. */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <SectionHead
            font="couture"
            kicker="Recent rooms"
            headline="A few directions to start from."
            sub="Every photo is a real install by our shop and crew."
          />

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-6 sm:gap-5">
            {SHOWROOM.map((p, i) => {
              const span =
                i === 0 || i === 1
                  ? "sm:col-span-3"
                  : i === 7 || i === 8
                    ? "sm:col-span-3"
                    : "sm:col-span-2";
              return (
                <figure
                  key={p.src}
                  data-reveal
                  data-reveal-delay={((i % 4) * 0.05).toFixed(2)}
                  className={`${span} group`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[var(--muted)]">
                    <Image
                      src={p.src}
                      alt={p.caption}
                      fill
                      sizes="(min-width:1024px) 33vw, 50vw"
                      className="object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
                      quality={78}
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[var(--background)]/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-navy)] shadow-sm">
                      {p.tag}
                    </span>
                  </div>
                  <figcaption className="mt-3.5 text-base text-[var(--muted-foreground)]">
                    {p.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONSULT INQUIRY. Lead capture, anchored for the hero CTA. */}
      <section id="consult" className="scroll-mt-24 bg-[var(--stone)]">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28" data-reveal>
          <InquiryForm brand="builders" />
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}

/** Calm trust stat: elegant Marcellus numeral over a small label, no
 *  side-stripe (the layout spacing does the separating). */
function BCStat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-couture text-[2.75rem] leading-none text-[var(--brand-navy)] md:text-[3.25rem]">
        {n}
      </div>
      <div className="mt-3 max-w-[26ch] text-sm leading-snug text-[var(--muted-foreground)] md:text-base">
        {label}
      </div>
    </div>
  );
}
