import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { BuildersFooter } from "@/components/builders/builders-footer";
import { InquiryForm } from "@/components/inquiry-form";
import { HeroPhotoFader, type HeroPhotoSource } from "@/components/hero-photo-fader";
import { SwipeCard, SwipeRail } from "@/components/swipe-rail";
import { ADDRESS, BUILDERS } from "@/lib/brands";

/**
 * Builders Corner — photo-forward cabinetry page in the shared
 * Rejuvenation language (Utopia display, Gotham UI, rust accent).
 */

export const metadata: Metadata = {
  title:
    "Builders Corner · Premium custom cabinetry, kitchens, and baths in Wausau, WI",
  description:
    "Premium custom cabinetry designed and built in Wausau since 1983. Custom kitchen design, bath remodels, built-ins, and full home renovations under one roof with our install crew.",
  alternates: { canonical: "https://pricelessbuilding.com/builders-corner" },
  openGraph: {
    title: "Builders Corner · Custom kitchens, baths, and remodels in Wausau, WI",
    description:
      "Premium custom cabinetry designed and built in Wausau. Designed with you in the showroom, built in our shop, installed by 4 Squared.",
    url: "https://pricelessbuilding.com/builders-corner",
    type: "website",
    images: [
      {
        url: "https://pricelessbuilding.com/real-photos/builders-corner-hero.jpg",
        alt: "A custom Builders Corner kitchen with dark shaker cabinetry and a marble island.",
      },
    ],
  },
};

const HERO_DECK: HeroPhotoSource[] = [
  {
    src: "/real-photos/builders-corner-hero.jpg",
    alt: "Dark charcoal shaker kitchen with marble island at Builders Corner.",
  },
  {
    src: "/real-photos/foursquared/kitchen-wood-island-black-pendants.jpg",
    alt: "Wood island kitchen with black pendant lights.",
  },
  {
    src: "/real-photos/foursquared/kitchen-white-island-shiplap.jpg",
    alt: "White island kitchen with wood pantry and shiplap.",
  },
  {
    src: "/real-photos/business/white-kitchen-wood-island.jpg",
    alt: "White kitchen with a warm wood island.",
  },
];

const WORK = [
  {
    label: "Kitchens",
    href: "#consult",
    img: "/real-photos/builders-corner-hero.jpg",
    alt: "Finished dark shaker kitchen with marble counters.",
  },
  {
    label: "Baths",
    href: "#consult",
    img: "/real-photos/business/dark-double-vanity-bathroom-install.jpg",
    alt: "Custom double vanity bath install.",
  },
  {
    label: "Islands",
    href: "#consult",
    img: "/real-photos/foursquared/kitchen-wood-island-black-pendants.jpg",
    alt: "Wood kitchen island with black pendants.",
  },
  {
    label: "White kitchens",
    href: "#consult",
    img: "/real-photos/foursquared/kitchen-white-island-shiplap.jpg",
    alt: "Bright white kitchen with shiplap backsplash.",
  },
];

const GALLERY = [
  "/real-photos/foursquared/kitchen-wood-island-black-pendants.jpg",
  "/real-photos/foursquared/kitchen-counter-marble-detail.jpg",
  "/real-photos/foursquared/kitchen-white-island-shiplap.jpg",
  "/real-photos/business/kitchen-island-wood-cabinets-range.jpg",
  "/real-photos/foursquared/kitchen-oak-mosaic-backsplash.jpg",
  "/real-photos/business/dark-double-vanity-bathroom-install.jpg",
];

const STEPS = [
  {
    n: "01",
    t: "Consult",
    b: "Showroom visit or we come to you.",
    img: "/real-photos/business/light-wood-cabinet-display.jpg",
  },
  {
    n: "02",
    t: "Design",
    b: "Measure, draw, and pick real samples.",
    img: "/real-photos/business/white-shaker-kitchen-cabinets.jpg",
  },
  {
    n: "03",
    t: "Build",
    b: "Doors, drawers, and finishes in Wausau.",
    img: "/real-photos/business/unfinished-wood-cabinet-workshop.jpg",
  },
  {
    n: "04",
    t: "Install",
    b: "4 Squared sets it and walks punch list.",
    img: "/real-photos/business/dark-cabinet-kitchen-install.jpg",
  },
];

const BC_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": "https://pricelessbuilding.com/builders-corner#org",
  name: "Builders Corner Cabinetry & Design",
  description:
    "Premium custom cabinetry, kitchen and bath design, and built-ins in Wausau, Wisconsin. Designed and built locally since 1983.",
  url: "https://pricelessbuilding.com/builders-corner",
  telephone: "+1-715-848-3855",
  priceRange: "$$$",
  foundingDate: "1983",
  image: "https://pricelessbuilding.com/real-photos/builders-corner-hero.jpg",
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
  sameAs: [BUILDERS.socials.facebook],
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05] ${className}`}>
      {children}
    </h2>
  );
}

export default function BuildersCornerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BC_JSON_LD) }}
      />
      <SiteHeader brand="builders" />

      {/* Hero */}
      <section className="bg-white">
        <div className="px-0 pb-0 md:px-5 md:pb-5">
          <div className="relative h-[74svh] w-full overflow-hidden md:h-[82svh]">
            <HeroPhotoFader photos={HERO_DECK} intervalMs={5500} />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(20,18,18,0.28), rgba(20,18,18,0.32) 55%, rgba(20,18,18,0.48))",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p
                className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.24em]"
                style={{ textShadow: "0 1px 14px rgba(0,0,0,.55)" }}
              >
                Custom cabinetry · Wausau since 1983
              </p>
              <h1
                className="font-display max-w-[16ch] text-[clamp(2.4rem,1rem+5vw,5.2rem)] leading-[1.02]"
                style={{ textShadow: "0 2px 26px rgba(0,0,0,.45)" }}
              >
                <span className="font-semibold">Kitchens &amp; baths,</span>{" "}
                <span className="font-normal italic">built by hand.</span>
              </h1>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="#consult"
                  className="btn-outline-light border px-9 py-4 text-[0.7rem] font-medium uppercase tracking-[0.22em]"
                >
                  Book a consultation ›
                </Link>
                <a
                  href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/90 underline-offset-[6px] hover:underline"
                >
                  {ADDRESS.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
        <p className="font-display mx-auto max-w-[52ch] px-6 pb-4 pt-8 text-center text-[1.1rem] font-normal italic leading-[1.45] text-[var(--ink)] sm:px-8 sm:pb-6 sm:pt-12 sm:text-[1.25rem]">
          Designed in the showroom, built in our Wausau shop, installed by 4 Squared.
        </p>
      </section>

      {/* Work — photo mosaic */}
      <section id="work" className="scroll-mt-24 bg-[var(--taupe)]">
        <div className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 sm:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Our work</Eyebrow>
              <H2 className="mt-3">
                Rooms we&rsquo;ve <span className="font-normal italic">built.</span>
              </H2>
            </div>
            <Link
              href="#consult"
              className="hidden text-[0.72rem] font-medium uppercase tracking-[0.18em] underline-offset-[6px] hover:underline sm:inline-block"
            >
              Start a project ›
            </Link>
          </div>

          <div className="mt-8 hidden gap-3 md:mt-10 md:grid md:grid-cols-2 md:gap-4">
            {WORK.map((w, i) => (
              <Link
                key={w.label}
                href={w.href}
                className={`group relative overflow-hidden bg-[var(--ink)] ${
                  i === 0 ? "md:row-span-2" : ""
                }`}
              >
                <div className={`relative w-full ${i === 0 ? "aspect-[4/5] md:h-full md:min-h-[36rem] md:aspect-auto" : "aspect-[16/10]"}`}>
                  <Image
                    src={w.img}
                    alt={w.alt}
                    fill
                    sizes="(min-width:768px) 50vw, 100vw"
                    quality={85}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(20,18,18,0) 40%, rgba(20,18,18,0.55) 100%)",
                    }}
                  />
                  <span className="absolute inset-x-0 bottom-0 p-6 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white md:p-8 md:text-[0.8rem]">
                    {w.label} ›
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile swipe */}
          <SwipeRail className="mt-8 md:hidden">
            {WORK.map((w) => (
              <SwipeCard key={w.label}>
                <Link href={w.href} className="group relative block overflow-hidden">
                  <div className="relative aspect-[4/5] w-full bg-[var(--ink)]">
                    <Image src={w.img} alt={w.alt} fill sizes="80vw" quality={90} className="object-cover" />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(20,18,18,0) 45%, rgba(20,18,18,0.6) 100%)",
                      }}
                    />
                    <span className="absolute inset-x-0 bottom-0 p-5 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white">
                      {w.label} ›
                    </span>
                  </div>
                </Link>
              </SwipeCard>
            ))}
          </SwipeRail>
        </div>
      </section>

      {/* Full-bleed feature */}
      <section className="relative">
        <div className="relative h-[52svh] min-h-[320px] w-full overflow-hidden md:h-[64svh]">
          <Image
            src="/real-photos/builders-corner-hero.jpg"
            alt="Dark charcoal kitchen with marble island, built by Builders Corner."
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(20,18,18,0.62) 0%, rgba(20,18,18,0.28) 50%, rgba(20,18,18,0.1) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center px-5 sm:px-10 md:px-16">
            <div className="max-w-[20ch]">
              <H2 className="text-white">
                Drawn here. Built here.{" "}
                <span className="font-normal italic">Installed here.</span>
              </H2>
              <Link
                href="#consult"
                className="btn-outline-light mt-8 inline-block border px-8 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.2em]"
              >
                Talk to the shop ›
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Before / after */}
      <section className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <Eyebrow>The transformation</Eyebrow>
            <H2 className="mt-3">
              Same room.{" "}
              <span className="font-normal italic">New everything.</span>
            </H2>
            <p className="mt-4 hidden max-w-[36ch] text-[1rem] font-light leading-[1.7] text-[var(--soft)] sm:block">
              Custom cabinetry, stone, and lighting, designed to fit the footprint you already have.
            </p>
            <Link
              href="#consult"
              className="mt-6 inline-block text-[0.72rem] font-medium uppercase tracking-[0.18em] underline-offset-[6px] hover:underline"
            >
              Plan a remodel ›
            </Link>
          </div>
          <figure className="md:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--taupe)]">
              <Image
                src="/real-photos/business/kitchen-remodel-before-after.jpg"
                alt="Before and after kitchen remodel with Builders Corner cabinetry."
                fill
                sizes="(min-width:768px) 58vw, 100vw"
                quality={85}
                className="object-cover"
              />
            </div>
          </figure>
        </div>
      </section>

      {/* Process — photo cards (images were unused before) */}
      <section id="process" className="scroll-mt-24 border-t border-[var(--line)] bg-[var(--cream)]">
        <div className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 sm:py-20">
          <Eyebrow>How it works</Eyebrow>
          <H2 className="mt-3">
            Four steps to a finished <span className="font-normal italic">room.</span>
          </H2>

          <div className="mt-8 hidden gap-4 md:mt-10 md:grid md:grid-cols-4">
            {STEPS.map((s) => (
              <article key={s.n} className="flex flex-col">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--taupe)]">
                  <Image src={s.img} alt="" fill sizes="25vw" quality={90} className="object-cover" />
                </div>
                <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--rust)]">
                  {s.n}
                </p>
                <h3 className="font-display mt-1.5 text-[1.35rem] leading-tight">{s.t}</h3>
                <p className="mt-2 text-[0.9rem] font-light leading-snug text-[var(--soft)]">{s.b}</p>
              </article>
            ))}
          </div>

          <SwipeRail className="mt-8 md:hidden">
            {STEPS.map((s) => (
              <SwipeCard key={s.n}>
                <article>
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--taupe)]">
                    <Image src={s.img} alt="" fill sizes="78vw" quality={90} className="object-cover" />
                  </div>
                  <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--rust)]">
                    {s.n}
                  </p>
                  <h3 className="font-display mt-1 text-[1.25rem]">{s.t}</h3>
                  <p className="mt-1.5 text-[0.88rem] font-light text-[var(--soft)]">{s.b}</p>
                </article>
              </SwipeCard>
            ))}
          </SwipeRail>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>More from the shop</Eyebrow>
            <H2 className="mt-3">
              A slice of the <span className="font-normal italic">portfolio.</span>
            </H2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-3 md:grid-cols-3">
          {GALLERY.map((src, i) => (
            <div
              key={src}
              className={`relative overflow-hidden bg-[var(--taupe)] ${
                i === 0 ? "aspect-[16/11] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-full" : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes={i === 0 ? "(min-width:768px) 66vw, 100vw" : "(min-width:768px) 33vw, 50vw"}
                quality={90}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial — tighter */}
      <section className="border-t border-[var(--line)] bg-[var(--taupe)]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 py-14 sm:gap-12 sm:px-8 sm:py-20 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>In their words</Eyebrow>
            <blockquote className="font-display mt-4 text-[clamp(1.5rem,1rem+2vw,2.4rem)] font-normal italic leading-[1.3] text-[var(--ink)]">
              &ldquo;Thank you so much for our amazing new kitchen. We couldn&rsquo;t be happier.&rdquo;
            </blockquote>
            <p className="mt-5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--soft)]">
              Rosalie &amp; Noah · Wausau
            </p>
          </div>
          <figure className="md:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
              <Image
                src="/real-photos/business/customer-thank-you-note.jpg"
                alt="Handwritten thank-you note to Builders Corner."
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                quality={90}
                className="object-cover"
              />
            </div>
          </figure>
        </div>
      </section>

      {/* Consult */}
      <section id="consult" className="scroll-mt-24 border-t border-[var(--line)] bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 text-center">
            <Eyebrow>Start here</Eyebrow>
            <H2 className="mt-3">
              Book a free <span className="font-normal italic">consultation.</span>
            </H2>
          </div>
          <InquiryForm brand="builders" />
        </div>
      </section>

      <BuildersFooter />
    </>
  );
}
