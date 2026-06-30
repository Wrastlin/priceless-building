import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FourSquaredHero } from "@/components/four-squared/fs-hero";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHead } from "@/components/section-head";
import { ADDRESS } from "@/lib/brands";

const SITE_URL = "https://pricelessbuilding.com";

export const metadata: Metadata = {
  title: "4 Squared · Kitchen, bath, and home remodels in Wausau, WI",
  description:
    "4 Squared is the install crew under the Price-Less roof. Kitchen remodels, bath remodels, doors, finish carpentry, full home renovations across central Wisconsin. One crew lead from demo through final walkthrough.",
  alternates: { canonical: `${SITE_URL}/four-squared` },
  openGraph: {
    type: "website",
    title: "4 Squared · Wausau install crew",
    description: "Kitchen and bath remodels in central Wisconsin. Install crew under the Price-Less roof.",
    url: `${SITE_URL}/four-squared`,
    images: [
      {
        url: `${SITE_URL}/real-photos/business/white-kitchen-marble-island.jpg`,
        alt: "A finished kitchen install by the 4 Squared crew in Wausau, WI.",
      },
    ],
  },
};

const FS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "GeneralContractor", "HomeAndConstructionBusiness"],
  "@id": `${SITE_URL}/four-squared#org`,
  name: "4 Squared",
  description:
    "Professional installation crew for custom kitchen remodels, bath remodels, and full home renovations in central Wisconsin. Operates under the Price-Less Building Center roof.",
  url: `${SITE_URL}/four-squared`,
  telephone: "+1-715-848-3855",
  image: `${SITE_URL}/real-photos/business/white-kitchen-marble-island.jpg`,
  parentOrganization: {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}#org`,
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
    "Central Wisconsin",
  ],
  makesOffer: [
    { "@type": "Offer", name: "Full kitchen remodel design and installation" },
    { "@type": "Offer", name: "Bath remodel design and installation" },
    { "@type": "Offer", name: "Cabinet installation" },
    { "@type": "Offer", name: "Finish carpentry, tile, and trim" },
    { "@type": "Offer", name: "Doors and windows install" },
    { "@type": "Offer", name: "Home renovation general contracting" },
  ],
};

/**
 * 4 Squared article page. Sits inside the Price-Less family as a
 * brief explainer for the install crew, not a separate mini-site.
 * Long sections like the customer-story centerpiece, the full review
 * grid, service-area list, FAQ, and a duplicated final CTA were
 * removed because they already live on the home page. What remains is
 * just enough to explain what FS does and let people get a quote.
 */


// 4 Squared's real Facebook page. The Page Plugin embeds the live feed
// (mostly project photos); the button links straight to the photos tab.
const FB_PAGE = "https://www.facebook.com/4squaredconstruction";
const FB_PHOTOS = "https://www.facebook.com/4squaredconstruction/photos_by";
const FB_PLUGIN = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FB_PAGE)}&tabs=timeline&width=500&height=720&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

const PROCESS = [
  { n: "01", name: "Consult", body: "Free walk-through at your house, or sit down at the showroom.", img: "/real-photos/business/staff-member-showroom-display.webp" },
  { n: "02", name: "Estimate", body: "Line-item written estimate, broken out so nothing is buried.", img: "/real-photos/business/kitchen-remodel-before-after.jpg" },
  { n: "03", name: "Build", body: "Same crew lead from demo through final. Floors and counters protected, cleaned up daily.", img: "/real-photos/business/kitchen-island-wood-cabinets-range.jpg" },
  { n: "04", name: "Walkthrough", body: "We walk the punch list together. Anything not right gets fixed before final payment.", img: "/real-photos/business/white-kitchen-marble-island.jpg" },
];

export default function FourSquaredPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FS_JSON_LD) }}
      />
      <SiteHeader brand="four-squared" />

      <FourSquaredHero />

      {/* MEET JOSH + TOP 5. The face behind all three businesses. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-[minmax(0,400px)_1fr] md:items-center">
            <div data-reveal className="relative overflow-hidden rounded-2xl border border-[var(--border)] shadow-sm">
              <Image
                src="/real-photos/josh-nickel.png"
                alt="Josh Nickel, co-owner and the face behind Price-Less, Builders Corner, and 4 Squared."
                width={760}
                height={960}
                className="h-auto w-full object-cover object-top"
                priority
              />
            </div>
            <div data-reveal>
              <div className="font-mono text-base font-bold uppercase tracking-[0.22em] text-emerald-700 md:text-lg">
                Voted Top 5 in Marathon County
              </div>
              <h2 className="font-display mt-5 text-4xl leading-tight text-[var(--foreground)] md:text-5xl">
                Meet Josh Nickel.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[var(--foreground)]">
                Josh is the face behind all three businesses under one roof, Price-Less, Builders Corner, and 4 Squared, with over 27 years in construction. He started his own company in Winona, Minnesota while training as an aviation mechanic, and has spent his career turning spaces into finished kitchens and baths that people love.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-[var(--foreground)]">
                On the install side he runs the crew with Ty, from demo, plumbing, electrical, tile, and finish carpentry through the final walkthrough. His goal at Price-Less is simple: beautiful, affordable, quality kitchens and bathrooms for Marathon County and beyond. The work has been recognized as a Top 5 remodeler in the county.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FACEBOOK. The crew's real project photos, embedded + linked. */}
      <section className="border-y border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <SectionHead
            accent="emerald"
            headline="See the work on Facebook."
            sub="Real finished 4 Squared projects, straight from the crew's own page."
          />
          {/* Constrain to the plugin's render width and let it fill the
              container (adapt_container_width=true) so the right edge never
              clips on narrow screens. loading="lazy" keeps the heavy embed
              from blocking first paint. */}
          <div className="mx-auto mt-8 w-full max-w-[500px]">
            <iframe
              title="4 Squared on Facebook"
              src={FB_PLUGIN}
              loading="eager"
              width={500}
              height={720}
              className="w-full"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
          <div className="mt-7 text-center">
            <a
              href={FB_PHOTOS}
              target="_blank"
              rel="noreferrer"
              className="font-mono inline-flex items-center bg-emerald-600 px-7 py-4 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-emerald-700"
            >
              See all photos on Facebook →
            </a>
          </div>
        </div>
      </section>

      {/* PROCESS. Four steps on a dark band. */}
      <section className="bg-[#0a0e14] text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
          <SectionHead
            invert
            accent="emerald"
            headline="How a project runs."
            sub="Plain English, no fabricated timelines."
          />

          <ol className="mt-8 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
            {PROCESS.map((p, i) => (
              <li
                key={p.n}
                data-reveal
                data-reveal-delay={(i * 0.05).toFixed(2)}
                className="bg-[#0a0e14] p-6"
              >
                <div className="relative mb-5 aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    className="object-cover object-top"
                    sizes="(min-width:768px) 25vw, 100vw"
                    quality={72}
                  />
                </div>
                <div className="font-display text-4xl leading-none text-emerald-400">
                  {p.n}
                </div>
                <h3 className="font-display mt-3 text-xl leading-snug text-white md:text-2xl">
                  {p.name}
                </h3>
                <p className="mt-2 text-base leading-[1.6] text-white/90">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INQUIRY FORM. Lead capture + contact details combined. */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-16" data-reveal>
          <InquiryForm brand="four-squared" />
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
