import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
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

// Hero crossfade deck. Brightest, most finished rooms first so the
// full-bleed hero reads bright and airy (white theme).
const HERO_DECK: HeroPhotoSource[] = [
  { src: "/real-photos/business/white-kitchen-marble-island.jpg", alt: "A custom Builders Corner kitchen with white cabinetry and a marble-top island." },
  { src: "/real-photos/business/white-kitchen-wood-island.jpg", alt: "White kitchen with a warm wood island and panelled appliances." },
  { src: "/real-photos/business/white-kitchen-rustic-island.jpg", alt: "Bright white kitchen anchored by a rustic wood island." },
  { src: "/real-photos/business/kitchen-island-wood-cabinets-range.jpg", alt: "Custom wood-cabinet kitchen with a large island and gas range." },
];

// Large project tiles for the "Explore our work" section: big 2-up
// imagery with the category overlaid, the way the reference remodeler
// sites merchandise their portfolio.
const WORK = [
  { label: "Kitchens", img: "/real-photos/business/white-kitchen-marble-island.jpg", alt: "A bright white custom kitchen with a marble-topped island." },
  { label: "Baths", img: "/real-photos/business/dark-double-vanity-bathroom-install.jpg", alt: "A custom double-vanity bath with framed mirrors and quartz tops." },
  { label: "Islands & millwork", img: "/real-photos/business/kitchen-island-wood-cabinets-range.jpg", alt: "A large wood-cabinet island beneath pendant lighting." },
  { label: "Built-ins", img: "/real-photos/business/wood-cabinets-dark-counters.jpg", alt: "Custom wood cabinetry with dark stone counters." },
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
      {/* ===== HERO. Full-bleed photograph, minimal transparent nav,
           elegant serif overlaid in white. The room fills the viewport and
           the type sits on it, radical restraint, in the manner of the
           reference remodeler sites. ===== */}
      <div className="relative bg-[var(--brand-navy-deep)]">
        <nav className="absolute inset-x-0 top-0 z-30">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-white md:px-10">
            <Link href="/builders-corner" className="font-couture text-xl tracking-[0.01em]">
              Builder&rsquo;s Corner
            </Link>
            <div className="hidden items-center gap-10 text-xs font-semibold uppercase tracking-[0.16em] md:flex">
              <a href="#work" className="text-white/80 transition hover:text-white">Our work</a>
              <a href="#process" className="text-white/80 transition hover:text-white">Process</a>
              <a href="#consult" className="text-white/80 transition hover:text-white">Contact</a>
              <a
                href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                className="text-white/80 transition hover:text-white"
              >
                {ADDRESS.phone}
              </a>
            </div>
            <Link
              href="/"
              className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55 transition hover:text-white lg:block"
            >
              Price-Less ↗
            </Link>
          </div>
        </nav>

        <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <HeroPhotoFader photos={HERO_DECK} intervalMs={6000} />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(16,28,48,0.55) 0%, rgba(16,28,48,0.16) 30%, rgba(16,28,48,0.22) 60%, rgba(16,28,48,0.74) 100%)",
            }}
          />
          <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center text-white">
            <div className="eyebrow eyebrow-on-dark">Custom cabinetry &middot; Wausau, since 1983</div>
            <h1 className="font-couture mt-6 text-[clamp(2.7rem,1.35rem+5vw,5.5rem)] leading-[1.05]">
              Custom kitchens, built by hand in Wausau.
            </h1>
            <p className="mx-auto mt-7 max-w-[46ch] text-lg font-light leading-[1.7] text-white/85 md:text-xl">
              Designed with you in the showroom, built in our own shop, and installed by the 4 Squared crew.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Link
                href="#consult"
                className="inline-flex items-center rounded-full bg-white px-9 py-[1.05rem] text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-[var(--stone)]"
              >
                Book a free consultation
              </Link>
              <a
                href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                className="text-sm font-semibold text-white underline decoration-white/40 underline-offset-[6px] transition hover:decoration-white"
              >
                Or call {ADDRESS.phone}
              </a>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">Scroll</span>
          </div>
        </section>
      </div>

      {/* Trust strip on white. Calm, hairline-separated, no side stripes. */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-3 md:gap-14 md:px-10 md:py-16">
          <BCStat n="Since 1983" label="Designing and building cabinetry in Wausau." />
          <BCStat n="4.8★" label="On Google across all three brands." />
          <BCStat n="Mon–Sat" label="Showroom open six days a week." />
        </div>
      </section>

      {/* OUR WORK. Large 2-up image tiles with the category overlaid, the
          way the reference remodelers merchandise their portfolio. Big
          photography carries it; crisp rectangles, no card chrome. */}
      <section id="work" className="scroll-mt-8 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <SectionHead
            font="couture"
            kicker="Our work"
            headline="A few directions to start from."
            sub="Every room is designed and built here in Wausau, then installed by the 4 Squared crew."
          />

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
            {WORK.map((w, i) => (
              <figure
                key={w.label}
                data-reveal
                data-reveal-delay={((i % 2) * 0.08).toFixed(2)}
                className="group relative overflow-hidden rounded-[3px]"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[var(--muted)]">
                  <Image
                    src={w.img}
                    alt={w.alt}
                    fill
                    sizes="(min-width:768px) 50vw, 100vw"
                    quality={85}
                    className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.045]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(16,28,48,0) 45%, rgba(16,28,48,0.6) 100%)" }}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-7 md:p-9">
                    <span className="font-couture text-2xl text-white md:text-[2rem]">{w.label}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85 opacity-0 transition group-hover:opacity-100">
                      View →
                    </span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS. Near-white band, elegant numbered steps. */}
      <section id="process" className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
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

      {/* CONSULT INQUIRY. Lead capture, anchored for the hero CTA. */}
      <section id="consult" className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-4xl px-6 py-24 md:py-32" data-reveal>
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
