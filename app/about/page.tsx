import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TimelineRail, type TimelineEvent } from "@/components/timeline-rail";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { GOOGLE_RATING } from "@/lib/google-reviews";

const P = "/real-photos";
const B = "/real-photos/business";

const HERO = `${P}/storefront-signage.webp`;
const MURAL = `${P}/mural-wide.webp`;

const TIMELINE: TimelineEvent[] = [
  {
    year: "1978",
    title: "A weekend venture on Washington Street.",
    body: "Price-Less Building Center opened as a weekend operation, selling discounted and surplus building materials out of the same Wausau address it still occupies today. Cancelled-order, surplus, and overstock material — sold for what the big-box wouldn't.",
    image: `${P}/mural-from-field.webp`,
    imageAlt: "The Price-Less warehouse and Build Your Future mural from across the field",
  },
  {
    year: "1982",
    title: "Demand made it full-time.",
    body: "By 1982 the floor was busy enough to open six days a week. The warehouse model stuck: same manufacturers as the national chains, warehouse prices for central Wisconsin.",
    image: `${P}/building-exterior.webp`,
    imageAlt: "The warehouse exterior on Washington Street",
  },
  {
    year: "1983",
    title: "Builders Corner opens in the same building.",
    body: "The cabinet-manufacturing arm, Builders Corner Cabinetry & Design, started next door in the same building. Custom kitchens and baths, designed and built in Wausau.",
    image: `${P}/builders-corner-hero.jpg`,
    imageAlt: "A custom Builders Corner kitchen with dark cabinetry and a marble island",
  },
  {
    year: "2019",
    month: "May",
    title: "Josh Nickel takes the reins.",
    body: "Josh kept the storefront, the buying relationships, and the focus on surplus inventory. Sales grew roughly 40% through the pandemic year that followed, as central Wisconsin homeowners and contractors leaned harder on local supply.",
    image: `${P}/josh-nickel.png`,
    imageAlt: "Josh Nickel, who runs Price-Less, Builders Corner, and 4 Squared",
    source: {
      label: "The Business News, May 2021",
      url: "https://www.readthebusinessnews.com/features/growth_strategies/they-re-building-something/article_70b4788e-a8e3-11eb-ba26-e3a990b7c281.html",
    },
  },
  {
    year: "2023",
    month: "June",
    title: "Build Your Future.",
    body: "More than 50 community volunteers painted the mural on the warehouse wall with artist Stephanie Kohli of Stephanie Kohli Art LLC. A public reminder that the trades are worth showing up for.",
    image: `${P}/paint-day-rainbow.webp`,
    imageAlt: "Community volunteers painting the Build Your Future mural",
    source: {
      label: "WSAW NewsChannel 7",
      url: "https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/",
    },
  },
];

const FAMILY = [
  {
    name: "Price-Less Building",
    href: "/shop",
    cta: "Shop the warehouse",
    body: "Discount and surplus doors, windows, cabinets, and lighting — new stock every Wednesday.",
    img: `${B}/floor-door-aisle-light-and-dark.jpg`,
    logo: `${P}/logo-priceless-clean.webp`,
    logoW: 120,
    logoH: 120,
  },
  {
    name: "Builders Corner",
    href: "/builders-corner",
    cta: "Design a kitchen",
    body: "Custom cabinetry and full kitchen & bath design, built in our own Wausau shop.",
    img: `${P}/builders-corner-hero.jpg`,
    logo: `${P}/logo-builders-corner@2x.webp`,
    logoW: 446,
    logoH: 320,
  },
  {
    name: "4 Squared",
    href: "/four-squared",
    cta: "Start a remodel",
    body: "Our own crew handles the whole remodel, from demo to the final walkthrough.",
    img: `${P}/foursquared/kitchen-white-island-shiplap.jpg`,
    logo: `${P}/logo-4squared.jpg`,
    logoW: 140,
    logoH: 140,
  },
];

const COMMUNITY = [
  {
    src: `${P}/grocery-giveaway-waow.webp`,
    alt: "Great Grocery Giveaway in partnership with WAOW NewsChannel 9",
    caption: "Great Grocery Giveaway with WAOW 9 — free groceries for a year.",
  },
  {
    src: `${P}/santa-at-storefront.webp`,
    alt: "Santa visiting the Price-Less storefront during Santa's Workshop",
    caption: "Santa's Workshop, two years running.",
  },
  {
    src: `${P}/mural-detail.webp`,
    alt: "Detail of the Build Your Future mural",
    caption: "Build Your Future mural, June 2023.",
  },
  {
    src: `${P}/school-food-drive.webp`,
    alt: "Middle school food and clothing drive at the store",
    caption: "Food and clothing drives with Horace Mann and John Muir.",
  },
];

export const metadata = {
  title: "About · Price-Less Building Center",
  description:
    "Price-Less Building Center in Wausau, WI — a discount and surplus building supply warehouse founded in 1978, owned by Josh Nickel since 2019. Same building on Washington Street, three brands under one roof.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO — full-bleed photo, brand-first, one job */}
      <section className="bg-white">
        <div className="relative h-[78svh] w-full overflow-hidden md:h-[86svh]">
          <Image
            src={HERO}
            alt="The Price-Less Building Center storefront on Washington Street in Wausau"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover object-center about-hero-kb"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(20,18,18,0.28), rgba(20,18,18,0.34) 50%, rgba(20,18,18,0.58))",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <p
              className="mb-5 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-white/90"
              style={{ textShadow: "0 1px 14px rgba(0,0,0,.55)" }}
            >
              Price-Less Building Center
            </p>
            <h1
              className="font-display max-w-[14ch] text-[clamp(2.6rem,1rem+5.2vw,5.4rem)] leading-[1.02]"
              style={{ textShadow: "0 2px 26px rgba(0,0,0,.45)" }}
            >
              <span className="font-semibold">A weekend venture</span>{" "}
              <span className="font-normal italic">that never closed.</span>
            </h1>
            <p
              className="mt-6 max-w-[36ch] text-base font-light leading-relaxed text-white/90 md:text-lg"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,.5)" }}
            >
              Surplus building materials on Washington Street since {PRICELESS.founded}. Same building. Same idea.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="btn-outline-light border px-10 py-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] transition"
              >
                Plan a visit ›
              </Link>
              <Link
                href="/shop"
                className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white underline decoration-white/40 underline-offset-[6px] transition hover:decoration-white"
              >
                Shop the floor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — below the hero, not inside it */}
      <section className="border-b border-[var(--line)] bg-[var(--cream)]">
        <div className="mx-auto grid max-w-[1360px] grid-cols-2 gap-y-8 px-5 py-10 sm:px-8 md:grid-cols-4 md:gap-x-6 md:py-12">
          <AboutStat n="1978" label="Founded as a weekend venture" />
          <AboutStat n="1983" label="Builders Corner cabinet shop opens" />
          <AboutStat n="2019" label={`${PRICELESS.owner} takes ownership`} />
          <AboutStat n={`${GOOGLE_RATING.average}★`} label={`${GOOGLE_RATING.count} Google reviews`} />
        </div>
      </section>

      {/* Opening statement */}
      <section className="bg-white">
        <div className="mx-auto max-w-[720px] px-6 py-14 text-center sm:py-20 md:py-24">
          <p
            data-reveal
            className="font-display text-[clamp(1.35rem,0.9rem+1.6vw,1.85rem)] font-normal italic leading-[1.45] text-[var(--ink)]"
          >
            Decades later, the same building still does the same thing: surplus and cancelled-order building materials at warehouse prices — plus custom cabinetry and a crew that finishes the install.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y border-[var(--line)] bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-20 md:py-24">
          <div data-reveal className="max-w-[28ch]">
            <div className="eyebrow">Our story</div>
            <h2 className="font-display mt-4 text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05]">
              From weekend hours{" "}
              <span className="font-normal italic">to a Wausau fixture.</span>
            </h2>
          </div>
          <TimelineRail events={TIMELINE} />
        </div>
      </section>

      {/* Who runs it */}
      <section className="bg-[var(--taupe)]">
        <div className="mx-auto grid max-w-[1360px] items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-12 md:gap-14 md:py-24">
          <div data-reveal className="relative aspect-[4/5] overflow-hidden md:col-span-5">
            <Image
              src={`${P}/josh-nickel.png`}
              alt="Josh Nickel, who runs Price-Less, Builders Corner, and 4 Squared"
              fill
              sizes="(min-width:768px) 40vw, 100vw"
              className="object-cover object-top"
              quality={80}
            />
          </div>
          <div data-reveal className="md:col-span-7">
            <div className="eyebrow">Today</div>
            <h2 className="font-display mt-4 text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05]">
              Meet {PRICELESS.owner}.
            </h2>
            <p className="mt-5 max-w-[48ch] text-lg font-light leading-relaxed text-[var(--ink)]">
              Josh is behind all three brands at {ADDRESS.street}: Price-Less, Builders Corner, and 4 Squared. On the install side he runs the crew with Ty. Most customers meet whoever&apos;s on the floor that day.
            </p>
            <blockquote className="mt-10 border-l-2 border-[var(--rust)] pl-5">
              <p className="font-display text-xl font-normal italic leading-snug text-[var(--ink)] md:text-2xl">
                &ldquo;It takes a village to make small businesses successful. We couldn&apos;t do it without you. We look forward to serving the Wausau and surrounding areas.&rdquo;
              </p>
              <footer className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
                From the owners&apos; year-end letter, December 2022
              </footer>
            </blockquote>
            <p className="mt-8 text-base text-[var(--soft)]">
              The fastest way to meet the people on the floor is to come walk the warehouse on a Wednesday.
            </p>
          </div>
        </div>
      </section>

      {/* Three brands */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1360px] px-5 py-14 text-center sm:px-8 sm:py-20 md:py-24">
          <div data-reveal>
            <div className="eyebrow">One address</div>
            <h2 className="font-display mx-auto mt-4 max-w-[22ch] text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05]">
              Three businesses{" "}
              <span className="font-normal italic">under one roof.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[42ch] text-base font-light leading-relaxed text-[var(--soft)] md:text-lg">
              Walk in for a vanity, leave with a designer&apos;s number. Walk in for a quote, leave with a stack of doors. Most projects use more than one.
            </p>
          </div>
          <div className="mt-10 grid gap-2.5 md:mt-14 md:grid-cols-3 md:gap-3">
            {FAMILY.map((s, i) => (
              <Link
                key={s.name}
                href={s.href}
                data-reveal
                data-reveal-delay={(i * 0.06).toFixed(2)}
                className="group relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]"
              >
                <Image
                  src={s.img}
                  alt={s.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  quality={85}
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
                <div className="absolute left-5 top-5 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/75">
                  0{i + 1}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center bg-white p-1 sm:size-11">
                      <Image
                        src={s.logo}
                        alt=""
                        width={s.logoW}
                        height={s.logoH}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <h3 className="font-display text-[1.35rem] leading-tight sm:text-[1.5rem]">
                      {s.name}
                    </h3>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[0.95rem] font-light leading-[1.5] text-white/85">
                    {s.body}
                  </p>
                  <span className="mt-4 inline-block text-[0.8rem] font-medium uppercase tracking-[0.16em]">
                    {s.cta} ›
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mural + community */}
      <section className="bg-[var(--ink)] text-white">
        <div className="relative">
          <div className="relative aspect-[21/9] min-h-[280px] w-full overflow-hidden md:min-h-[420px]">
            <Image
              src={MURAL}
              alt="The Build Your Future community mural on the side of the warehouse"
              fill
              sizes="100vw"
              quality={80}
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(26,24,24,0.92) 0%, rgba(26,24,24,0.35) 45%, rgba(26,24,24,0.2) 100%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-[900px] px-5 pb-6 pt-10 sm:px-8 sm:pt-14 md:-mt-28 md:relative md:z-10">
            <div data-reveal>
              <div className="eyebrow eyebrow-on-dark">Community</div>
              <h2 className="font-display mt-4 text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05]">
                Beyond the doors{" "}
                <span className="font-normal italic">and cabinets.</span>
              </h2>
              <blockquote className="mt-8 max-w-[52ch] border-l border-white/35 pl-5">
                <p className="font-display text-xl font-normal italic leading-snug text-white/95 md:text-2xl">
                  &ldquo;Trades is a dying breed. So we want to do something that represents what us hard-working guys do.&rdquo;
                </p>
                <footer className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/70">
                  WSAW NewsChannel 7 · June 2023
                </footer>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1360px] px-5 pb-14 sm:px-8 sm:pb-20 md:pb-24">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-3">
            {COMMUNITY.map((c, i) => (
              <figure
                key={c.src}
                data-reveal
                data-reveal-delay={(i * 0.05).toFixed(2)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(min-width:768px) 25vw, 50vw"
                    className="object-cover"
                    quality={75}
                  />
                </div>
                <figcaption className="mt-3 text-sm font-light leading-snug text-white/75">
                  {c.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/press"
              className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white underline decoration-[var(--rust)]/70 underline-offset-[6px] transition hover:decoration-[var(--rust)]"
            >
              See press coverage ›
            </Link>
          </div>
        </div>
      </section>

      {/* Closer */}
      <section className="bg-[var(--cream)]">
        <div className="mx-auto grid max-w-[1360px] items-stretch gap-0 md:grid-cols-12">
          <div className="relative min-h-[320px] md:col-span-7 md:min-h-[480px]">
            <Image
              src={`${P}/paint-day-flyer.webp`}
              alt="A community mural paint day at the warehouse"
              fill
              sizes="(min-width:768px) 60vw, 100vw"
              className="object-cover"
              quality={80}
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-14 sm:px-10 md:col-span-5 md:py-20 lg:px-14">
            <div data-reveal>
              <div className="eyebrow">Drop in</div>
              <h2 className="font-display mt-4 text-[clamp(2.2rem,1.2rem+2.8vw,3.5rem)] leading-[1.05]">
                Come walk the{" "}
                <span className="font-normal italic">warehouse.</span>
              </h2>
              <p className="mt-5 max-w-[34ch] text-base font-light leading-relaxed text-[var(--soft)] md:text-lg">
                Open Monday through Saturday. Easy parking out front, contractor load bay around back.
              </p>
              <p className="mt-4 text-sm text-[var(--soft)]">
                {ADDRESS.street} · {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
                <br />
                <a
                  href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                  className="font-medium text-[var(--ink)] underline decoration-[var(--ink)]/25 underline-offset-4 hover:decoration-[var(--ink)]"
                >
                  {ADDRESS.phone}
                </a>
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href="/shop" className="btn btn-priceless">
                  Shop the surplus floor
                </Link>
                <Link
                  href="/contact"
                  className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-[var(--ink)] underline decoration-[var(--ink)]/30 underline-offset-[6px] hover:decoration-[var(--ink)]"
                >
                  Hours &amp; directions ›
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes aboutHeroKb {
          0% { transform: scale(1.02) translate(0, 0); }
          100% { transform: scale(1.1) translate(-1.2%, -0.8%); }
        }
        .about-hero-kb {
          animation: aboutHeroKb 18s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .about-hero-kb { animation: none; }
        }
      `}</style>

      <SiteFooter brand="priceless" />
    </>
  );
}

function AboutStat({ n, label }: { n: string; label: string }) {
  return (
    <div data-reveal>
      <div className="font-display text-4xl leading-[1.05] text-[var(--rust)] md:text-5xl">
        {n}
      </div>
      <div className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--soft)]">
        {label}
      </div>
    </div>
  );
}
