import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BuildersFooter } from "@/components/builders/builders-footer";
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
  { label: "Baths & vanities", img: "/real-photos/business/dark-double-vanity-bathroom-install.jpg", alt: "A custom double-vanity bath with framed mirrors and quartz tops." },
  { label: "Islands & seating", img: "/real-photos/business/white-kitchen-wood-island.jpg", alt: "A white kitchen anchored by a warm wood island with seating." },
  { label: "Cabinetry & finishes", img: "/real-photos/business/white-shaker-kitchen-cabinets.jpg", alt: "A classic white-shaker kitchen with custom cabinetry and finishes." },
];

// Story assets. A real before/after, one cinematic full-bleed moment, and
// an authentic handwritten thank-you note that even names Josh and Ty.
const BEFORE_AFTER = {
  img: "/real-photos/business/kitchen-remodel-before-after.jpg",
  alt: "Before and after of a Wausau kitchen: dated oak cabinets replaced with white custom cabinetry and stone counters, same footprint.",
};
const FEATURE_BAND = {
  img: "/real-photos/business/rustic-wood-kitchen-island.jpg",
  alt: "A warm rustic kitchen with custom wood cabinetry, a large island, and pendant lighting, built by Builder's Corner.",
};
const TESTIMONIAL = {
  quote:
    "Thank you so much for our amazing new kitchen. We couldn't be happier. Your attention to detail and craftsmanship are top notch.",
  who: "Rosalie & Noah",
  note: "/real-photos/business/customer-thank-you-note.jpg",
  noteAlt: "A handwritten thank-you note to Josh and Ty at Builder's Corner for a new kitchen.",
};

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
            {/* Mobile: a single tappable call action stands in for the nav. */}
            <a
              href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
              className="text-sm font-semibold text-white transition hover:text-white/80 md:hidden"
            >
              Call
            </a>
          </div>
        </nav>

        <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <HeroPhotoFader photos={HERO_DECK} intervalMs={6000} />
          </div>
          {/* Contrast scrim. A base darken plus a stronger centre band and
              vignette so the serif holds over any bright kitchen behind it. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 46%, rgba(14,25,44,0.28) 0%, rgba(14,25,44,0.5) 62%, rgba(14,25,44,0.66) 100%), linear-gradient(180deg, rgba(14,25,44,0.6) 0%, rgba(14,25,44,0.34) 34%, rgba(14,25,44,0.4) 62%, rgba(14,25,44,0.78) 100%)",
            }}
          />
          <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center text-white">
            <div className="eyebrow eyebrow-on-dark">Custom cabinetry &middot; Wausau, since 1983</div>
            <h1 className="font-couture mt-6 text-[clamp(2.7rem,1.35rem+5vw,5.5rem)] leading-[1.05] [text-shadow:0_1px_30px_rgba(10,18,32,0.35)]">
              Kitchens, baths, and built-ins, made by hand in Wausau.
            </h1>
            <p className="mx-auto mt-7 max-w-[46ch] text-lg font-light leading-[1.7] text-white/90 md:text-xl">
              Custom cabinetry for the whole home. Designed with you in the showroom, built in our own shop, and installed by the 4 Squared crew.
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

      {/* Intro statement. A quiet editorial line the way the reference
          remodelers open, trust carried in prose, not metric tiles. */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-4xl px-6 py-28 text-center md:py-36">
          <p className="font-couture text-[clamp(1.65rem,1.05rem+2.4vw,2.9rem)] leading-[1.34] text-[var(--brand-navy)]">
            For four decades we&rsquo;ve designed and built custom cabinetry for
            central Wisconsin homes, one room, one family at a time.
          </p>
          <p className="mx-auto mt-9 max-w-xl text-[1.05rem] leading-relaxed text-[var(--muted-foreground)] text-balance">
            Rated 4.8 on Google across all three brands. Visit the showroom Monday through Saturday, or have us come to you.
          </p>
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
                    style={{ background: "linear-gradient(180deg, rgba(14,25,44,0) 34%, rgba(14,25,44,0.35) 68%, rgba(14,25,44,0.8) 100%)" }}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-7 md:p-9">
                    <span className="font-couture text-2xl text-white md:text-[2rem] [text-shadow:0_1px_16px_rgba(10,18,32,0.5)]">{w.label}</span>
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

      {/* BEFORE / AFTER. The transformation story, big and side-by-side. */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5" data-reveal>
              <div className="eyebrow">The transformation</div>
              <h2 className="font-couture mt-4 text-[clamp(2rem,1.3rem+2.8vw,3.4rem)] leading-[1.12] text-[var(--brand-navy)]">
                From dated to timeless, without moving a wall.
              </h2>
              <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-[var(--muted-foreground)]">
                Same footprint, a brand-new kitchen. New custom cabinetry, stone counters, and lighting, drawn and built to fit the room you already have.
              </p>
            </div>
            <figure className="md:col-span-7" data-reveal data-reveal-delay="0.08">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[3px] bg-[var(--muted)] shadow-[0_30px_60px_-34px_rgba(20,40,68,0.4)]">
                <Image
                  src={BEFORE_AFTER.img}
                  alt={BEFORE_AFTER.alt}
                  fill
                  sizes="(min-width:768px) 58vw, 100vw"
                  quality={85}
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-sm text-[var(--muted-foreground)]">
                A recent Wausau remodel, before and after.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* CINEMATIC BAND. One large full-bleed moment to breathe. */}
      <section className="relative">
        <div className="relative h-[62vh] min-h-[400px] w-full overflow-hidden bg-[var(--brand-navy-deep)]">
          <Image
            src={FEATURE_BAND.img}
            alt={FEATURE_BAND.alt}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(14,25,44,0.72) 0%, rgba(14,25,44,0.4) 45%, rgba(14,25,44,0.12) 100%)" }}
          />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
            <p className="font-couture max-w-[17ch] text-[clamp(1.9rem,1.2rem+2.6vw,3.25rem)] leading-[1.16] text-white [text-shadow:0_1px_24px_rgba(10,18,32,0.4)]">
              Drawn in the showroom, built in our shop, installed by our crew.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS. Clean typographic sequence, no imagery. Big elegant
          numerals over a hairline per step reads far more premium than
          rough in-progress shop photos would. */}
      <section id="process" className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <SectionHead
            font="couture"
            kicker="How it works"
            headline="Four steps from idea to install."
            sub="One shop, one crew, one point of contact from the first sketch to the final walkthrough."
          />

          <ol className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                data-reveal
                data-reveal-delay={(i * 0.06).toFixed(2)}
                className="border-t border-[var(--border)] pt-7"
              >
                <div className="font-couture text-[2.75rem] leading-none text-[var(--brand-gold-deep)]">
                  {s.n}
                </div>
                <h3 className="font-couture mt-6 text-2xl leading-snug text-[var(--brand-navy)]">
                  {s.t}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-[1.65] text-[var(--muted-foreground)]">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TESTIMONIAL. A real handwritten note, alongside the words, so it
          reads as genuine rather than a stock pull-quote. */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-x-16 gap-y-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7" data-reveal>
              <div className="eyebrow">In their words</div>
              <blockquote className="font-couture mt-6 text-[clamp(1.7rem,1.1rem+2.5vw,2.9rem)] leading-[1.3] text-[var(--brand-navy)]">
                &ldquo;{TESTIMONIAL.quote}&rdquo;
              </blockquote>
              <div className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                {TESTIMONIAL.who}, Wausau
              </div>
            </div>
            <figure className="md:col-span-5" data-reveal data-reveal-delay="0.08">
              <div className="relative aspect-[4/3] w-full -rotate-1 overflow-hidden rounded-[3px] bg-white shadow-[0_24px_50px_-30px_rgba(20,40,68,0.5)] ring-1 ring-[var(--border)]">
                <Image
                  src={TESTIMONIAL.note}
                  alt={TESTIMONIAL.noteAlt}
                  fill
                  sizes="(min-width:768px) 40vw, 100vw"
                  quality={85}
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* CONSULT INQUIRY. Lead capture, anchored for the hero CTA. */}
      <section id="consult" className="scroll-mt-8 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-4xl px-6 py-24 md:py-32" data-reveal>
          <InquiryForm brand="builders" />
        </div>
      </section>

      <BuildersFooter />
    </>
  );
}
