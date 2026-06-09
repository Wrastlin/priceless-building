import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { NewsletterBar } from "@/components/newsletter-bar";
import { TrustBlock } from "@/components/trust-block";
import { BrandLogo } from "@/components/brand-logo";
import { SectionHead } from "@/components/section-head";
import { TimelineRail, type TimelineEvent } from "@/components/timeline-rail";
import { GOOGLE_RATING } from "@/lib/google-reviews";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { CATEGORIES, byBrand } from "@/lib/catalog";

const MURAL_HERO = "/real-photos/mural-wide.webp";

const TIMELINE: TimelineEvent[] = [
  {
    year: "1978",
    title: "Price-Less Building Center opens in Wausau.",
    body: "A discount and surplus building-materials warehouse on Washington Street, focused on cancelled contractor orders and factory overstock.",
    image: "/real-photos/storefront-sign-on-brick.webp",
    imageAlt: "Hand-painted PRICE-LESS BUILDING CENTER sign on the brick exterior of the original storefront.",
  },
  {
    year: "1983",
    title: "Builders Corner Cabinetry & Design founded.",
    body: "A custom cabinet shop opens in Wausau, specializing in kitchens, baths, and built-ins designed and finished locally.",
    image: "/catalog-images/PL-000404-hero.jpg",
    imageAlt: "A representative Builders Corner kitchen install.",
  },
  {
    year: "2019",
    month: "May",
    title: "A partner group acquires both businesses.",
    body: "A three-person partnership buys Price-Less Building Center and Builders Corner Cabinetry & Design. The two storefronts keep their separate identities.",
    image: "/real-photos/building-exterior.webp",
    imageAlt: "The exterior of the building that houses Price-Less and Builders Corner.",
    source: {
      label: "Read the 2021 Business News profile",
      url: "https://www.readthebusinessnews.com/features/growth_strategies/they-re-building-something/article_70b4788e-a8e3-11eb-ba26-e3a990b7c281.html",
    },
  },
  {
    year: "2023",
    month: "Jun",
    title: "The Build Your Future community mural is painted.",
    body: "Designed by Stephanie Kohli and painted by fifty volunteers from across Wausau, the mural now wraps the side of the building facing Washington Street.",
    image: "/real-photos/mural-wide.webp",
    imageAlt: "The Build Your Future mural on the side of the Price-Less Building Center.",
    source: {
      label: "Read the WSAW story",
      url: "https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/",
    },
  },
  {
    year: "2025",
    month: "Apr",
    title: "First Easter Bunny visit at the storefront.",
    body: "A community day at the store, with the Easter Bunny visiting kids from across central Wisconsin. The first of what became a recurring seasonal event.",
    image: "/real-photos/community-county-fair.webp",
    imageAlt: "Kids holding a Price-Less sign at a community event.",
    source: {
      label: "Read the WSAW story",
      url: "https://www.wsaw.com/2025/04/13/easter-bunny-visits-local-wausau-business/",
    },
  },
  {
    year: "2025",
    month: "Dec",
    title: "Second annual Santa's Workshop at the showroom.",
    body: "Santa visits the Builders Corner showroom for the second year. WSAW covered both the decorations and the volunteer hours that went into setting it up.",
    image: "/real-photos/santa-at-storefront.webp",
    imageAlt: "Santa at the Price-Less storefront for the holiday workshop.",
    source: {
      label: "Read the WSAW story",
      url: "https://www.wsaw.com/2025/12/11/wausau-business-transforms-shop-into-santas-workshop/",
    },
  },
];

export default function HomePage() {
  const items = byBrand("priceless").slice(0, 8);
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO. Two clean columns: text on the left, looping FB video on the right */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-12 md:pt-20 md:pb-20">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 text-base text-[var(--muted-foreground)] md:text-lg">
                <span className="size-2 rounded-full bg-emerald-500" />
                <OpenToday />
                <span className="text-[var(--muted-foreground)]/50">·</span>
                <span>Wausau, WI</span>
              </div>
              <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
                Discount building materials.<br /><span className="text-[var(--brand-priceless)]">Half off retail.</span>
              </h1>
              <p className="mt-6 max-w-md text-base text-[var(--muted-foreground)] md:text-lg">
                Same brands as the big-box stores, at warehouse prices. 825 Washington Street, Wausau.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link href="/shop" className="btn btn-priceless">Shop everything</Link>
                <Link href="/tour" className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg">Walk the warehouse →</Link>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0b1220] shadow-sm">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/real-photos/storefront-bg-poster.jpg"
                  aria-hidden="true"
                >
                  <source src="/real-photos/storefront-bg.webm" type="video/webm" />
                  <source src="/real-photos/storefront-bg.mp4" type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Live walkthrough
                </div>
              </div>
            </div>
          </div>
        </div>
        <figure className="border-t border-[var(--border)]">
          <div className="relative w-full overflow-hidden bg-[var(--muted)]">
            <Image
              src={MURAL_HERO}
              alt="Build Your Future community mural on the side of the Price-Less Building Center, painted by 50 Wausau volunteers in June 2023"
              width={2400}
              height={750}
              priority
              className="block h-auto w-full object-contain"
              sizes="100vw"
            />
          </div>
          <figcaption className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border)] px-6 py-3 text-sm">
            <span className="text-[var(--muted-foreground)]">
              "Build Your Future" mural · designed by Stephanie Kohli · painted by 50 Wausau volunteers · June 2023
            </span>
            <a
              href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
              target="_blank"
              rel="noreferrer"
              className="font-mono shrink-0 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
            >
              WSAW story →
            </a>
          </figcaption>
        </figure>
      </section>

      {/* STATS STRIP. Only verifiable facts. Unverified numbers replaced
          with honest qualitative claims per user direction. */}
      <section className="border-b bg-[#0b1220] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-6 py-8 md:grid-cols-4 md:gap-x-6 md:py-10">
          <NumStat n="HUGE" label="savings vs. big-box retail" />
          <NumStat n="1978" label="serving central Wisconsin since" />
          <NumStat n="4.8★" label="on Google · 9 reviews" />
          <NumStat n="MON-SAT" label="open six days a week" />
        </div>
      </section>

      {/* QUICK TRUST BAR. Real ratings + press + tenure, above the fold-ish */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-4 px-6 py-5">
          <a
            href={PRICELESS.socials.googleMaps}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-baseline gap-2 text-sm"
          >
            <span className="text-[#f5a524]" aria-hidden>★★★★★</span>
            <span className="font-semibold text-[var(--foreground)]">{GOOGLE_RATING.average.toFixed(1)}</span>
            <span className="text-[var(--muted-foreground)]">on Google · {GOOGLE_RATING.count} reviews</span>
            <span className="text-[var(--brand-priceless)] opacity-0 transition group-hover:opacity-100">→</span>
          </a>
          <a
            href={PRICELESS.socials.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-baseline gap-2 text-sm"
          >
            <span className="text-[#f5a524]" aria-hidden>★★★★★</span>
            <span className="font-semibold text-[var(--foreground)]">5/5</span>
            <span className="text-[var(--muted-foreground)]">on Facebook</span>
          </a>
          <a
            href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-baseline gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <span className="font-medium text-[var(--foreground)]">Featured by WSAW NewsChannel 7</span>
          </a>
          <span className="inline-flex items-baseline gap-2 text-sm">
            <span className="font-medium text-[var(--foreground)]">Family-owned in Wausau since 1978</span>
          </span>
        </div>
      </section>

      {/* CATEGORY STRIP. Editorial split: one feature tile + an indexed list. Moved up so the catalog hits early. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline={<>Eight departments. <span className="text-[var(--brand-priceless)]">One warehouse.</span></>}
            link={{ href: "/shop", label: "See everything" }}
          />

          <div className="mt-12 grid gap-x-10 gap-y-6 md:grid-cols-12">
          {(() => {
            const entries = Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, (typeof CATEGORIES)[keyof typeof CATEGORIES]][];
            const [featKey, feat] = entries[0];
            const rest = entries.slice(1);
            return (
              <>
                <Link
                  href={`/shop/${featKey}`}
                  className="group relative col-span-12 block aspect-[4/3] overflow-hidden bg-black md:col-span-7 md:aspect-[16/10]"
                >
                  <Image src={feat.image} alt={feat.label} fill sizes="(min-width:768px) 60vw, 100vw" className="object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100" quality={75} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute left-6 right-6 bottom-6 text-white">
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">Department 01 / Aisle D</div>
                    <div className="font-display mt-2 text-5xl md:text-6xl">{feat.label}.</div>
                    <p className="font-serif mt-2 max-w-md text-base italic text-white/85">{feat.blurb}</p>
                  </div>
                </Link>

                <ol className="col-span-12 divide-y border-y md:col-span-5">
                  {rest.map(([key, cat], i) => (
                    <li key={key}>
                      <Link href={`/shop/${key}`} className="group flex items-center gap-5 py-4">
                        <span className="font-mono w-10 shrink-0 text-[11px] tracking-tight text-[var(--muted-foreground)]">{String(i + 2).padStart(2, "0")}</span>
                        <div className="relative aspect-square w-16 shrink-0 overflow-hidden bg-[var(--muted)]">
                          <Image src={cat.image} alt={cat.label} fill sizes="64px" className="object-cover transition duration-500 group-hover:scale-110" quality={60} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-display text-2xl leading-none">{cat.label}.</div>
                          <div className="mt-1 line-clamp-1 text-xs text-[var(--muted-foreground)]">{cat.blurb}</div>
                        </div>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brand-priceless)] opacity-0 transition group-hover:opacity-100">Browse →</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </>
            );
          })()}
        </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS. On-the-floor catalog showcase. Now sits high so items present early. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="New stock arrives every Wednesday."
            link={{ href: "/shop", label: "Shop everything" }}
          />
          <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => <ProductCard key={it.id} item={it} />)}
          </div>
        </div>
      </section>

      {/* THREE-BRAND CALLOUT. Moved earlier so the brand spectrum
          (discount → premier → install) is visible before the social
          proof and history sections. Dark band makes the logos pop and
          gives the page its second anchor after the stat strip. */}
      <section className="bg-[#0b1220] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            align="center"
            invert
            headline="Three different ways to get a project done."
            sub="Most people come for the discount surplus at Price-Less. Some go premier and have Builders Corner design the cabinetry custom. Others hand the whole project to the Four Squared install crew. Each one runs on its own."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <BrandCard
              href="/shop"
              logoBrand="priceless"
              image="/real-photos/storefront-signage.webp"
              imageAlt="The Price-Less Building Center storefront on Washington Street"
              headline="Affordable, brand-new building materials."
              body="A surprisingly cool, wide-open warehouse of doors, windows, cabinets, vanities, hardware, and trim. Same factories as the big-box stores, usually for about half retail. Worth a walk through even if you are just looking for ideas."
              cta="Shop the surplus floor"
            />
            <BrandCard
              href="/builders-corner"
              logoBrand="builders"
              image="/catalog-images/PL-000404-hero.jpg"
              imageAlt="A finished Builders Corner showroom kitchen in white shaker with island and quartz"
              headline="Premier custom cabinetry, designed in Wausau."
              body="The premium side. If you want a kitchen, bath, or built-in designed and built specifically for your house, this is the shop. We measure at your place, draw the room, walk you through finish samples, and build the cabinets locally. Custom installs handled by Four Squared."
              cta="Visit the cabinet showroom"
            />
            <BrandCard
              href="/four-squared"
              logoBrand="four-squared"
              image="/real-photos/install-kitchen-walnut-island-windows.webp"
              imageAlt="A finished walnut kitchen installed by the Four Squared crew, with island, windows, and pendant lights"
              headline="A professional install crew."
              body="An independent finish-carpentry and install company. They handle demo, plumbing, electrical, tile, and trim — start to final walkthrough. They install Builders Corner cabinetry, and they install anything you bring home from Price-Less."
              cta="Meet the install crew"
            />
          </div>
        </div>
      </section>

      {/* CUSTOMER STORIES. Handwritten card + Google reviews. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="What our customers have said about us."
            sub="Every quote on the page links back to the original Google or Facebook review, so you can read it in context if you want."
          />

        {/* Handwritten card + 3 review tiles */}
        <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-12">
          <figure className="md:col-span-6">
            <div className="relative w-full overflow-hidden bg-[var(--muted)]">
              <Image
                src="/real-photos/thank-you-card-rosalie-noah.webp"
                alt="Handwritten thank-you card from Rosalie and Noah to Josh, on a new kitchen install"
                width={640}
                height={760}
                className="block h-auto w-full object-contain"
                sizes="(min-width:768px) 50vw, 100vw"
              />
            </div>
            <figcaption className="mt-3 text-sm text-[var(--muted-foreground)]">
              A handwritten card from Rosalie and Noah after Josh and Ty wrapped their kitchen install. We get a lot of these.
            </figcaption>
          </figure>
          <ul className="space-y-5 md:col-span-6">
            <li className="border-l-2 border-[var(--brand-priceless)] pl-5">
              <div className="text-[#f5a524]" aria-hidden>★★★★★</div>
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground)] md:text-lg">
                &ldquo;Great people to deal with! Josh installed our granite island and countertops with great detail and craftsmanship. Highly recommend.&rdquo;
              </p>
              <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                <span className="font-medium text-[var(--foreground)]">Ryan T.</span> · Google · a year ago
              </div>
            </li>
            <li className="border-l-2 border-[var(--brand-priceless)] pl-5">
              <div className="text-[#f5a524]" aria-hidden>★★★★★</div>
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground)] md:text-lg">
                &ldquo;Contacted the staff to see if they had a countertop size we were having trouble finding. They searched for our measurements, sent us updates and went above and beyond to help. The best part? We found one in great condition for $25!&rdquo;
              </p>
              <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                <span className="font-medium text-[var(--foreground)]">Pamela M.</span> · Google · a year ago
              </div>
            </li>
            <li className="border-l-2 border-[var(--brand-priceless)] pl-5">
              <div className="text-[#f5a524]" aria-hidden>★★★★★</div>
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground)] md:text-lg">
                &ldquo;My wife and I bought our quartz counter tops from Price-Less and couldn&apos;t be happier. From the expertise in the store to the installation, they were top notch.&rdquo;
              </p>
              <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                <span className="font-medium text-[var(--foreground)]">Gary G.</span> · Google · a year ago
              </div>
            </li>
            <Link
              href="/reviews"
              className="font-mono inline-flex items-center text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
            >
              Read all reviews →
            </Link>
          </ul>
        </div>
        </div>
      </section>

      {/* TIMELINE. Combines the old "look around 825 Washington" photo
          grid with the in-the-news press cards. One compact chronology
          of milestones from 1978 through the most recent press coverage,
          each linked to the original article. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="What has happened along the way."
            sub="The two storefronts have a few decades of history between them, and local press has covered most of it. The milestones below link back to the original articles."
          />
          <TimelineRail events={TIMELINE} />
        </div>
      </section>


      {/* BEFORE/AFTER. Install pair where the product grid used to live. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="Before and after."
            link={{ href: "/four-squared", label: "Meet the install crew" }}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <figure>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src="/real-photos/install-kitchen-white-open.webp"
                  alt="A finished real kitchen install: white shaker cabinetry, island, vent hood, LVP floor"
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-2 text-sm">
                <span className="font-semibold uppercase tracking-[0.18em] text-[var(--brand-priceless)]">After</span>
                <span className="text-[var(--muted-foreground)]">Finished install by the Four Squared crew.</span>
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src="/real-photos/install-before-kitchen.webp"
                  alt="A real Wausau kitchen mid-install: white shaker uppers in, kraft paper on the counters, painter's tape edging the floor"
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-2 text-sm">
                <span className="font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Mid-install</span>
                <span className="text-[var(--muted-foreground)]">Paper down, tape up, new shaker uppers going in.</span>
              </figcaption>
            </figure>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
            <div className="text-sm text-[var(--muted-foreground)]">
              New surplus inventory hits the floor every Wednesday.
            </div>
            <Link href="/shop" className="btn btn-priceless">Shop everything →</Link>
          </div>
        </div>
      </section>

      {/* LATEST FROM FACEBOOK. Compact 2-col block: live Page Plugin on the
          left, short paragraph + social outbound links on the right. Sits
          just above the WHY callout so it acts as a live-pulse signal. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="What we have been up to this week."
            sub="Our Facebook page is the most current view of what is going on at the store. New stock photos, holiday hours, customer thank-you cards, mural updates. We post a few times a week."
          />
          <div className="mt-12 grid items-start gap-10 md:grid-cols-12">
            <div className="flex justify-center md:col-span-6 md:justify-end">
              <div className="w-full max-w-[500px] overflow-hidden border border-[var(--border)] bg-white">
                <iframe
                  src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                    PRICELESS.socials.facebook,
                  )}&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                  className="block h-[600px] w-full sm:h-[680px] md:h-[700px]"
                  style={{ border: 0 }}
                  scrolling="no"
                  allow="encrypted-media"
                  loading="lazy"
                  title="Price-Less Building Center on Facebook"
                />
              </div>
            </div>
            <div className="md:col-span-6">
              <p className="text-base leading-relaxed text-[var(--foreground)] md:text-lg">
                If you would rather follow along between visits, the easiest way is one of the platforms below. Yelp is mostly older reviews; Instagram and Facebook get the day-to-day photos.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <a
                  href={PRICELESS.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono inline-flex w-fit items-center border border-[var(--border)] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  Follow on Facebook →
                </a>
                <a
                  href={PRICELESS.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono inline-flex w-fit items-center border border-[var(--border)] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  Follow on Instagram →
                </a>
                <a
                  href={PRICELESS.socials.yelp}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono inline-flex w-fit items-center border border-[var(--border)] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  Read us on Yelp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT. Replaces the old 3-card grid of choppy fragments
          with three image cards. Each card uses a real photo so the cards
          differentiate visually, and the copy reads as plain prose. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="A few things worth knowing before you visit."
            sub="If you have not been to a surplus warehouse before, the floor can look chaotic. Here is what is actually going on, and how the prices work."
          />

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            <li className="overflow-hidden border border-[var(--border)] bg-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src="/real-photos/storefront-sign-on-brick.webp"
                  alt="The hand-painted Price-Less Building Center sign on the brick exterior"
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl leading-snug">Where the inventory comes from</h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
                  Most of what we sell is brand-new in the box, sourced from cancelled contractor orders, mis-shipments, and factory overstock. The brands are the same ones you would find at the big-box stores down the road.
                </p>
              </div>
            </li>
            <li className="overflow-hidden border border-[var(--border)] bg-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src="/real-photos/storefront-signage.webp"
                  alt="The Price-Less Building Center storefront, with everyday pricing displayed"
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl leading-snug">How the pricing works</h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
                  Every tag shows our price next to the current retail at Home Depot, Lowe&apos;s, or Menards. Bring your phone and check it yourself. We would rather you compare than wonder.
                </p>
              </div>
            </li>
            <li className="overflow-hidden border border-[var(--border)] bg-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src="/real-photos/building-exterior.webp"
                  alt="The Price-Less Building Center at 825 Washington Street, Wausau"
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl leading-snug">Where to find us</h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
                  We have been at 825 Washington Street in Wausau since 1978. A group of partners bought the business in 2019 and still runs it. We are open Monday through Saturday if you want to walk the floor.
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5 border-t border-[var(--border)] pt-10">
            <Link href="/shop" className="btn btn-priceless">Shop everything →</Link>
            <Link href="/reviews" className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg">
              Read our 9 Google reviews
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <NewsletterBar />
      </section>

      <TrustBlock />

      <SiteFooter brand="priceless" />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-white">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function BrandCard({
  href, logoBrand, image, imageAlt, headline, body, cta,
}: {
  href: string;
  logoBrand: "priceless" | "builders" | "four-squared";
  image: string;
  imageAlt: string;
  headline: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden border border-white/10 bg-white transition hover:border-white/30"
    >
      {/* PHOTO with logo chip in upper-left. The chip is a white pad
          around the brand mark so it stays legible over any photo. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width:768px) 33vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          quality={78}
        />
        <div className="absolute left-4 top-4 inline-flex items-center bg-white px-3 py-2 shadow-sm">
          <BrandLogo brand={logoBrand} size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl leading-snug text-[var(--foreground)] md:text-[1.625rem]">
          {headline}
        </h3>
        <p className="mt-3 flex-1 text-base leading-relaxed text-[var(--muted-foreground)]">
          {body}
        </p>
        <span className="font-mono mt-5 inline-block text-[11px] uppercase tracking-[0.22em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">
          {cta} →
        </span>
      </div>
    </Link>
  );
}

function NumStat({ n, label, sub }: { n: string; label: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl leading-none text-white md:text-5xl">{n}</span>
        {sub ? <span className="font-mono text-xs uppercase tracking-wider text-white/60">{sub}</span> : null}
      </div>
      <div className="mt-1 text-xs leading-snug text-white/70">{label}</div>
    </div>
  );
}

function OpenToday() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayHours = PRICELESS.hours.find((h) => h.day === today)?.hours ?? "Closed";
  if (todayHours === "Closed") {
    return <span className="text-[var(--foreground)]">Closed today · Open Mon 8:30 AM</span>;
  }
  return <span className="text-[var(--foreground)]">Open today, {todayHours}</span>;
}
