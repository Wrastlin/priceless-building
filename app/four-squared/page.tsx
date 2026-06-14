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
  title: "Four Squared Construction · Kitchen, bath, and home remodels in Wausau, WI",
  description:
    "Four Squared Construction is the install crew under the Price-Less roof. Kitchen remodels, bath remodels, doors, finish carpentry, full home renovations across central Wisconsin. One crew lead from demo through final walkthrough.",
  alternates: { canonical: `${SITE_URL}/four-squared` },
  openGraph: {
    type: "website",
    title: "Four Squared Construction · Wausau install crew",
    description: "Kitchen and bath remodels in central Wisconsin. Install crew under the Price-Less roof.",
    url: `${SITE_URL}/four-squared`,
    images: [
      {
        url: `${SITE_URL}/real-photos/business/white-kitchen-marble-island.jpg`,
        alt: "A finished kitchen install by the Four Squared crew in Wausau, WI.",
      },
    ],
  },
};

const FS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "GeneralContractor", "HomeAndConstructionBusiness"],
  "@id": `${SITE_URL}/four-squared#org`,
  name: "Four Squared Construction",
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
 * Four Squared article page. Sits inside the Price-Less family as a
 * brief explainer for the install crew, not a separate mini-site.
 * Long sections like the customer-story centerpiece, the full review
 * grid, service-area list, FAQ, and a duplicated final CTA were
 * removed because they already live on the home page. What remains is
 * just enough to explain what FS does and let people get a quote.
 */


// Recent installs grid. Nine photos, mixed kitchen / bath so visitors
// see the actual range of work rather than just kitchens.
const WORK_TILES = [
  { img: "/real-photos/business/kitchen-island-wood-cabinets-range.jpg", caption: "Custom kitchen island with wood cabinetry and gas range.", tag: "Kitchen" },
  { img: "/real-photos/business/wood-cabinets-granite-kitchen.jpg", caption: "Wood cabinets paired with granite counters.", tag: "Kitchen" },
  { img: "/real-photos/business/dark-double-vanity-bathroom-install.jpg", caption: "Dark double-vanity bath install, white counter, framed mirrors.", tag: "Bath" },
  { img: "/real-photos/business/blue-patterned-bath-sink.jpg", caption: "Blue-patterned bath vanity with stone counter.", tag: "Bath" },
  { img: "/real-photos/business/white-kitchen-rustic-island.jpg", caption: "Bright white kitchen anchored by a rustic island.", tag: "Kitchen" },
  { img: "/real-photos/business/dark-cabinet-kitchen-install.jpg", caption: "Dark-cabinet kitchen install with pendant lighting.", tag: "Kitchen" },
  { img: "/real-photos/business/double-sink-bathroom-vanity-black.webp", caption: "Double-sink bath vanity in black with framed mirrors.", tag: "Bath" },
  { img: "/real-photos/business/wood-cabinets-dark-counters.jpg", caption: "Wood cabinetry with dark counters and an island.", tag: "Kitchen" },
  { img: "/real-photos/business/white-kitchen-wood-island.jpg", caption: "White cabinetry with a warm wood island.", tag: "Kitchen" },
];

const PROCESS = [
  { n: "01", name: "Consult", body: "Free walk-through at your house, or sit down at the showroom." },
  { n: "02", name: "Estimate", body: "Line-item written estimate, broken out so nothing is buried." },
  { n: "03", name: "Build", body: "Same crew lead from demo through final. Floors and counters protected, cleaned up daily." },
  { n: "04", name: "Walkthrough", body: "We walk the punch list together. Anything not right gets fixed before final payment." },
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

      {/* RECENT WORK. Six install tiles on a light band. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
          <SectionHead
            accent="emerald"
            headline="Recent installs."
            sub="A few photos from finished Builders Corner and Four Squared projects across central Wisconsin."
          />

          <div className="mt-8 grid grid-cols-2 gap-px bg-[var(--border)] lg:grid-cols-3">
            {WORK_TILES.map((t, i) => (
              <article
                key={t.img}
                data-reveal
                data-reveal-delay={((i % 3) * 0.05).toFixed(2)}
                className="group relative bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={t.img}
                    alt={t.caption}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    quality={75}
                    loading="lazy"
                  />
                  <span className="font-mono absolute left-3 top-3 bg-emerald-600 px-2 py-1 text-xs uppercase tracking-[0.14em] text-white">
                    {t.tag}
                  </span>
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-sm leading-relaxed text-[var(--foreground)] md:text-base">
                    {t.caption}
                  </p>
                </div>
              </article>
            ))}
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
