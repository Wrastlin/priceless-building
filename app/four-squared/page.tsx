import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHead } from "@/components/section-head";
import { ADDRESS } from "@/lib/brands";

/**
 * Four Squared article page. Sits inside the Price-Less family as a
 * brief explainer for the install crew, not a separate mini-site.
 * Long sections like the customer-story centerpiece, the full review
 * grid, service-area list, FAQ, and a duplicated final CTA were
 * removed because they already live on the home page. What remains is
 * just enough to explain what FS does and let people get a quote.
 */

const PHONE = ADDRESS.phone;
const PHONE_TEL = `tel:${PHONE.replace(/[^0-9+]/g, "")}`;
const EMAIL = "pricelessbuildingcenter@gmail.com";
const EMAIL_MAILTO = `mailto:${EMAIL}?subject=Four%20Squared%20estimate%20request`;

const HERO_IMAGE = "/real-photos/install-kitchen-walnut-island-windows.webp";

const WORK_TILES = [
  { img: "/real-photos/install-kitchen-walnut-marble.webp", caption: "Walnut shaker cabinets, white marble counter.", tag: "Kitchen" },
  { img: "/real-photos/install-kitchen-modern-banquette.webp", caption: "White slab kitchen with built-in banquette.", tag: "Kitchen" },
  { img: "/real-photos/install-bathroom-shaker.webp", caption: "Shaker vanity, butcher-block top, floating shelves.", tag: "Bath" },
  { img: "/real-photos/install-bathroom-blue-tile-shower.webp", caption: "Blue subway-tile shower with frameless glass.", tag: "Bath" },
  { img: "/real-photos/install-french-doors-exterior.webp", caption: "White French entry doors on a brick home.", tag: "Exterior" },
  { img: "/real-photos/install-kitchen-hickory-galley.webp", caption: "Knotty hickory galley kitchen with white quartz.", tag: "Kitchen" },
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
      <SiteHeader brand="four-squared" />

      {/* HERO. Slim dark band. What FS does + photo + two CTAs. */}
      <section className="bg-[#0a0e14] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-12 md:py-20" data-reveal>
          <div className="md:col-span-7">
            <BrandLogo brand="four-squared" size="lg" className="[&>span:last-child]:!text-white" />
            <div className="font-mono mt-7 text-xs uppercase tracking-[0.14em] text-emerald-300">
              The install side of 825 Washington Street
            </div>
            <h1 className="font-display mt-3 text-[clamp(2.5rem,1.4rem+4vw,4rem)] leading-[1.02] tracking-tight">
              The install crew that finishes the job.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-[1.7] text-white/90 md:text-xl">
              Four Squared handles the work. Kitchens, baths, doors, finish carpentry. We install cabinets from Builders Corner, materials from the Price-Less floor, or anything you bring on your own. One crew lead from demo through the final walkthrough.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={EMAIL_MAILTO} className="btn btn-priceless bg-emerald-600 hover:bg-emerald-700">
                Get a free estimate
              </a>
              <a
                href={PHONE_TEL}
                className="text-base font-semibold text-white/90 underline decoration-emerald-400 decoration-2 underline-offset-[6px] transition hover:text-white md:text-lg"
              >
                Or call {PHONE}
              </a>
            </div>
          </div>
          <aside className="md:col-span-5" data-reveal data-reveal-delay="0.08">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/15 bg-white/[0.04]">
              <Image
                src={HERO_IMAGE}
                alt="A representative finished install: white-oak shaker kitchen with island, quartz, pendants."
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
                quality={85}
              />
            </div>
          </aside>
        </div>
      </section>

      {/* RECENT WORK. Six install tiles on a light band. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            accent="emerald"
            headline="Recent installs."
            sub="A few photos from finished Builders Corner and Four Squared projects across central Wisconsin."
          />

          <div className="mt-12 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
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
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    quality={75}
                  />
                  <span className="font-mono absolute left-3 top-3 bg-emerald-600 px-2 py-1 text-xs uppercase tracking-[0.14em] text-white">
                    {t.tag}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-base leading-relaxed text-[var(--foreground)]">
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
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            invert
            accent="emerald"
            headline="How a project runs."
            sub="Plain English, no fabricated timelines."
          />

          <ol className="mt-10 grid gap-px bg-white/10 md:grid-cols-4">
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
                <p className="mt-2 text-sm leading-[1.55] text-white/85">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INQUIRY FORM. Lead capture + contact details combined. */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20" data-reveal>
          <InquiryForm brand="four-squared" />
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
