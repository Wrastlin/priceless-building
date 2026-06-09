import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHead } from "@/components/section-head";
import { ADDRESS } from "@/lib/brands";

/**
 * Four Squared Construction. Josh Nickel's high-end install crew for the
 * 825 Washington Street operation (Price-Less materials side, Builders Corner
 * design side, Four Squared swings the hammers on the finish work).
 *
 * Voice: plain Wausau English, no marketing speak. Every claim grounded in
 * docs/SOURCE_OF_TRUTH.md.
 */

const PHONE = ADDRESS.phone;
const PHONE_TEL = `tel:${PHONE.replace(/[^0-9+]/g, "")}`;
const EMAIL = "pricelessbuildingcenter@gmail.com";
const EMAIL_MAILTO = `mailto:${EMAIL}?subject=Four%20Squared%20estimate%20request`;

// Each image used at most once across this page. Verified against the
// dedup grep in the page-build checklist.
// HERO and large-card photos use AI catalog renders (1024+ wide). The
// real install thumbnails (223px native) are reserved for small proof
// tiles in the 3-col WORK_TILES grid. The mid-install BEFORE_IMAGE is
// kept because it is a real 640px shot whose painters-tape/kraft-paper
// content cannot be substituted by an AI render.
const HERO_IMAGE = "/real-photos/install-kitchen-walnut-island-windows.webp";
const QUOTE_PORTRAIT = "/real-photos/team-josh-jamus-portrait.webp";
const BEFORE_IMAGE = "/real-photos/install-before-kitchen.webp";
const AFTER_IMAGE = "/real-photos/install-kitchen-white-open.webp";
const THANK_YOU_CARD = "/real-photos/thank-you-card-rosalie-noah.webp";
const BUILDING_IMAGE = "/real-photos/building-exterior.webp";

const WORK_TILES = [
  {
    img: "/real-photos/install-kitchen-walnut-marble.webp",
    caption: "Walnut shaker cabinets, white marble counter, matte black gooseneck.",
    tag: "Kitchen",
  },
  {
    img: "/real-photos/install-kitchen-modern-banquette.webp",
    caption: "White slab kitchen with built-in banquette under the window.",
    tag: "Kitchen",
  },
  {
    img: "/real-photos/install-bathroom-shaker.webp",
    caption: "Shaker vanity with butcher-block top, matte black faucet, floating wood shelves.",
    tag: "Bath",
  },
  {
    img: "/real-photos/install-bathroom-blue-tile-shower.webp",
    caption: "Vertical deep-blue subway-tile shower with frameless glass and marble pebble pan.",
    tag: "Bath",
  },
  {
    img: "/real-photos/install-french-doors-exterior.webp",
    caption: "White-framed exterior French entry on a brick home with flanking sconces.",
    tag: "Exterior",
  },
  {
    img: "/real-photos/install-kitchen-hickory-galley.webp",
    caption: "Knotty hickory galley kitchen with white quartz and stainless French-door fridge.",
    tag: "Kitchen",
  },
];

type Review = {
  quote: string;
  name: string;
  source: string;
  image?: string;
  imageAlt?: string;
};
const REVIEWS: Review[] = [
  {
    quote:
      "Great people to deal with! Josh installed our granite island and countertops with great detail and craftsmanship. Highly recommend.",
    name: "Ryan T.",
    source: "Google review, 5 stars",
  },
  {
    quote:
      "My wife and I bought our quartz counter tops from Price-Less Building Center and couldn't be happier! From the expertise in the store to the installation, they were top notch! Thanks guys!",
    name: "Gary G.",
    source: "Google review, 5 stars",
  },
];

const PROCESS = [
  {
    n: "01",
    name: "Consult",
    body: "Free walk-through at your house, or sit down at the showroom. We listen, take photos, and ask what you actually want.",
  },
  {
    n: "02",
    name: "Estimate",
    body: "Line-item written estimate, broken out so nothing is buried. Materials at Price-Less pricing if you want them.",
  },
  {
    n: "03",
    name: "Build",
    body: "Same crew lead from demo through final. Floors and counters protected, cleaned up at the end of every day.",
  },
  {
    n: "04",
    name: "Walkthrough",
    body: "We walk the punch list together. Anything not right gets fixed before final payment.",
  },
];

const SERVICE_AREA = [
  "Wausau",
  "Schofield",
  "Weston",
  "Rib Mountain",
  "Rothschild",
  "Mosinee",
  "Marathon",
  "Kronenwetter",
  "Edgar",
  "Athens",
  "Hatley",
  "Merrill",
];

const FAQ = [
  {
    q: "How long does a kitchen take?",
    a: "Every project is different. Cabinet lead time, counter templating, and how much demo is involved all change the schedule. We give you a real timeline at the estimate, then update you in person as the project runs.",
  },
  {
    q: "Do you pull permits?",
    a: "Yes. Structural, electrical, plumbing, and egress work goes through the City of Wausau or the right township. We schedule inspections and meet the inspector on-site.",
  },
  {
    q: "Where do the materials come from?",
    a: "From Price-Less and Builders Corner across the parking lot if you want, or you can bring your own. You get our pricing on anything we stock; if you already have a designer, we'll install what you bring.",
  },
  {
    q: "What kind of work do you take on?",
    a: "High-end kitchens, baths, and finish carpentry are most of what we do. Cabinet install, counters, tile, trim, doors, exterior entries. If we're not the right crew for the job, we'll tell you on the call.",
  },
  {
    q: "How do I reach you?",
    a: `Call (715) 848-3855 or email ${EMAIL}. A crew lead gets back the same week.`,
  },
];

export default function FourSquaredPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* PHONE BAR. Persistent top bar with the real contact info, no
          fabricated "now booking" copy. */}
      <div className="hidden border-b bg-[#0a0e14] text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-sm">
          <div className="flex items-center gap-4 text-white/85">
            <span className="inline-flex size-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-[0.14em]">
              Wausau and Marathon County
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href={EMAIL_MAILTO} className="font-mono text-xs uppercase tracking-[0.14em] text-white/80 hover:text-white">
              {EMAIL}
            </a>
            <a href={PHONE_TEL} className="font-mono text-[13px] font-semibold tracking-tight text-emerald-300 hover:text-emerald-200">
              Call {PHONE}
            </a>
          </div>
        </div>
      </div>

      {/* HERO. Josh's real quote as the headline, real install photo on the
          right. Two CTAs (email estimate, phone) and a real trust strip. */}
      <section className="border-b bg-[#0a0e14] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-16 pb-20 md:grid-cols-12 md:pt-24 md:pb-28">
          <div className="md:col-span-7">
            <div className="font-mono flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-white/85">
              <span>Finish carpentry and install crew</span>
              <span className="opacity-50">/</span>
              <span>Wausau, Wisconsin</span>
            </div>

            <div className="mt-7">
              <BrandLogo brand="four-squared" size="lg" className="[&>span:last-child]:!text-white" />
            </div>

            <h1 className="font-display mt-8 max-w-[18ch] text-[3rem] leading-[0.95] sm:text-[3.75rem] md:text-[4.5rem]">
              Install crew for 825 Washington Street.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Four Squared is the install side of the 825 Washington Street operation. Kitchens,
              Kitchens, baths, doors, finish carpentry. A local crew with decades of combined experience in the trades.
            </p>

            <div className="mt-10 max-w-xl">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-300">
                From the owner
              </div>
              <blockquote className="mt-4 border-l-2 border-emerald-400 pl-6">
                <p className="text-xl leading-[1.4] text-white md:text-2xl">
                  &ldquo;Trades is a dying breed. So we want to do something that represents what us hard-working guys do.&rdquo;
                </p>
                <footer className="mt-3 text-sm text-white/85">
                  Josh Nickel, owner · to WSAW NewsChannel 7, June 2023
                </footer>
              </blockquote>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href={EMAIL_MAILTO} className="btn btn-priceless bg-emerald-600 hover:bg-emerald-700">
                Get an estimate
              </a>
              <a
                href={PHONE_TEL}
                className="inline-flex items-center gap-3 rounded-sm border border-white/30 px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:border-emerald-400 hover:text-emerald-300"
              >
                <span aria-hidden className="text-emerald-400">●</span>
                Call {PHONE}
              </a>
            </div>
          </div>

          <aside className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/15 bg-white/[0.04]">
              <Image
                src={HERO_IMAGE}
                alt="White-oak shaker kitchen with island, white quartz counters, and pendants over a long bank of cabinetry. Representative of Four Squared finish work."
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
                quality={85}
              />
            </div>
            <div className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-white/80">
              Representative kitchen. White-oak shaker, island, quartz, pendants.
            </div>
          </aside>
        </div>
      </section>

      {/* TRUST STRIP. Only real, sourced numbers. */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[var(--border)] md:grid-cols-4 md:divide-y-0">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Price-Less+Building+Center+825+Washington+St+Wausau+WI"
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-1 px-6 py-7"
            aria-label="Read all 9 Google reviews"
          >
            <div className="text-2xl text-[#f5a524]" aria-hidden>★★★★★</div>
            <div className="mt-1 text-base font-semibold text-[var(--foreground)]">4.8 on Google</div>
            <div className="text-sm text-[var(--muted-foreground)] transition group-hover:text-emerald-700">9 reviews →</div>
          </a>
          <div className="flex flex-col gap-1 px-6 py-7">
            <div className="font-display text-4xl leading-none text-emerald-700">5.0</div>
            <div className="text-base font-semibold text-[var(--foreground)]">Facebook rating</div>
            <div className="text-sm text-[var(--muted-foreground)]">From 7 reviews</div>
          </div>
          <div className="flex flex-col gap-1 px-6 py-7">
            <div className="font-display text-4xl leading-none text-emerald-700">28</div>
            <div className="text-base font-semibold text-[var(--foreground)]">Years in the trades</div>
            <div className="text-sm text-[var(--muted-foreground)]">Josh Nickel, owner</div>
          </div>
          <div className="flex flex-col gap-1 px-6 py-7">
            <div className="font-display text-4xl leading-none text-emerald-700">825</div>
            <div className="text-base font-semibold text-[var(--foreground)]">Washington Street</div>
            <div className="text-sm text-[var(--muted-foreground)]">Wausau, WI 54403</div>
          </div>
        </div>
      </section>

      {/* THE WORK. 6 real install tiles with honest, descriptive captions. */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            accent="emerald"
            headline="Recent installs."
            sub="Photos from completed Builders Corner / Four Squared projects. Small resolution on a few comes from the original posts; we are getting higher-res shots from the homeowners."
          />

          <div className="mt-14 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {WORK_TILES.map((t, i) => (
              <article key={t.img} className="group relative bg-white">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={t.img}
                    alt={t.caption}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    quality={75}
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="font-mono bg-white px-2 py-1 text-xs uppercase tracking-[0.14em] text-[var(--foreground)]">
                      No. {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono bg-emerald-600 px-2 py-1 text-xs uppercase tracking-[0.14em] text-white">
                      {t.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-[var(--foreground)]">{t.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER. Honest pairing using the real mid-install BEFORE
          (painter's tape and kraft paper) next to a real installed kitchen. */}
      <section className="border-b bg-[var(--muted)] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            accent="emerald"
            headline="The middle and the end."
            sub="The before is from a different project than the after. Showing both because one captures the work, the other captures the room."
          />

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <figure className="relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={BEFORE_IMAGE}
                  alt="A real Four Squared install in progress. White shaker uppers, grey backsplash, kraft paper protecting the counters, blue painter's tape, clearly mid-renovation."
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  quality={80}
                />
                <span className="font-mono absolute left-3 top-3 bg-white px-2 py-1 text-xs uppercase tracking-[0.14em] text-[var(--foreground)]">
                  Mid-install
                </span>
              </div>
              <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Kraft paper, painter's tape, surfaces protected.
              </figcaption>
            </figure>
            <figure className="relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={AFTER_IMAGE}
                  alt="A finished kitchen comparable to Four Squared work: bone-white inset cabinetry, island, integrated paneling, soft warm lighting."
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  quality={80}
                />
                <span className="font-mono absolute left-3 top-3 bg-emerald-600 px-2 py-1 text-xs uppercase tracking-[0.14em] text-white">
                  Finished
                </span>
              </div>
              <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Bone-white inset cabinetry, island, integrated paneling.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* CUSTOMER STORY CENTERPIECE. The handwritten thank-you card from
          Rosalie + Noah, side-by-side with the transcribed quote. This is
          the strongest content we have. */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-12">
            <figure className="md:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--muted)]">
                <Image
                  src={THANK_YOU_CARD}
                  alt="A handwritten thank-you card from Rosalie and Noah to Josh and Ty, thanking them for an amazing new kitchen."
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  quality={85}
                />
              </div>
              <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                A handwritten thank-you card.
              </figcaption>
            </figure>

            <div className="md:col-span-6">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-700">
                From a recent kitchen
              </div>
              <blockquote className="mt-5">
                <p className="font-display text-3xl leading-[1.15] text-[var(--foreground)] md:text-4xl">
                  &ldquo;Josh, thank you (and Ty) so much for our amazing new kitchen.{" "}
                  <span className="text-emerald-700">We couldn&apos;t be happier!</span> Your attention to detail and craftsmanship are top notch.&rdquo;
                </p>
                <footer className="mt-7 text-base text-[var(--muted-foreground)]">
                  Rosalie and Noah, in their own handwriting, to Josh and Ty.
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* REAL GOOGLE REVIEWS. Three quotes that explicitly mention the
          install work, with attribution. Peggy's review gets paired with
          the photo of the actual blue door. */}
      <section className="border-b bg-[#0a0e14] py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-300">From Google</div>
          <h2 className="font-display mt-3 max-w-3xl text-5xl leading-[1.02] md:text-6xl">
            From our customers.
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="flex flex-col border border-white/15 bg-white/[0.04]">
                {r.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.imageAlt ?? r.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                      quality={75}
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-7">
                  <div className="text-emerald-400" aria-label="Five stars">★★★★★</div>
                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-white/90">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-white/10 pt-4">
                    <div className="text-sm font-semibold text-white">{r.name}</div>
                    <div className="font-mono mt-1 text-xs uppercase tracking-[0.14em] text-white/80">
                      {r.source}
                    </div>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>

          <div className="mt-10 text-center text-sm text-white/80">
            Want to leave one?{" "}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Price-Less+Building+Center+825+Washington+St+Wausau+WI"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-emerald-400 decoration-2 underline-offset-4 hover:text-white"
            >
              Find us on Google →
            </a>
          </div>
        </div>
      </section>

      {/* PROCESS. Four steps, plain English, no fabricated timelines. */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-700">How a project runs</div>
          <h2 className="font-display mt-3 max-w-3xl text-5xl leading-[1.02] md:text-6xl">
            Four steps.
          </h2>

          <div className="mt-14 grid gap-px bg-[var(--border)] md:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.n} className="bg-white p-7">
                <div className="font-display text-5xl leading-none text-emerald-700">{p.n}</div>
                <div className="font-mono mt-4 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  Step {p.n}
                </div>
                <div className="mt-2 text-xl font-semibold text-[var(--foreground)]">{p.name}</div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE CREW. One caption from Josh, otherwise the section is
          about the crew and the install operation in general. */}
      <section className="border-b bg-[var(--muted)] py-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0e14]">
              <Image
                src={QUOTE_PORTRAIT}
                alt="Inside the Four Squared install workshop."
                fill
                className="object-cover object-right"
                sizes="(min-width: 768px) 40vw, 100vw"
                quality={80}
              />
            </div>
            <div className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              At the 825 Washington Street workshop
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-700">
              The crew
            </div>
            <h2 className="font-display mt-3 text-5xl leading-[1.05] md:text-6xl">
              Local install crew, finish-carpentry first.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--foreground)]">
              The Four Squared crew has worked together on kitchens, baths, and finish carpentry across central Wisconsin for years. Cabinets from Builders Corner, materials from the Price-Less floor, or anything you bring on your own.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
              Same phone number as Price-Less, same parking lot as Builders Corner. One number to call for the whole project.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE AREA. Real cities, no fabricated radius. */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-700">Where we work</div>
            <h2 className="font-display mt-3 text-5xl leading-[1.02]">
              Wausau and the surrounding towns.
            </h2>
            <p className="mt-5 max-w-xl text-base text-[var(--muted-foreground)]">
              Marathon County and a short reach into the towns next door. If your project is
              farther out, ask us; we&apos;ll be straight with you about whether the schedule
              and the windshield time make sense.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-base sm:grid-cols-3">
              {SERVICE_AREA.map((city) => (
                <li key={city} className="flex items-center gap-2">
                  <span aria-hidden className="inline-block size-1.5 rounded-full bg-emerald-600" />
                  <span>{city}, WI</span>
                </li>
              ))}
            </ul>

            <div className="relative mt-10 aspect-[16/8] overflow-hidden border border-[var(--border)] bg-[var(--muted)]">
              <Image
                src={BUILDING_IMAGE}
                alt="The back of the 825 Washington Street building in Wausau, white-painted block wall, train tracks in front."
                fill
                className="object-cover"
                sizes="(min-width: 768px) 60vw, 100vw"
                quality={75}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-300">Home base</div>
                <div className="mt-1 text-xl font-semibold">{ADDRESS.street}, {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}</div>
              </div>
            </div>
          </div>

          <aside className="md:col-span-5">
            <div className="border border-[var(--border)] bg-[var(--muted)] p-7">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Call us
              </div>
              <a href={PHONE_TEL} className="font-display mt-2 block text-5xl text-[var(--foreground)] hover:text-emerald-700">
                {PHONE}
              </a>
              <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                Mon through Thu 8:30 AM to 5:30 PM, Fri 8:30 AM to 4:30 PM, Sat 8:30 AM to 12:30 PM. Closed Sun.
              </div>
              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  Email
                </div>
                <a href={EMAIL_MAILTO} className="mt-2 block text-base text-[var(--foreground)] hover:text-emerald-700">
                  {EMAIL}
                </a>
              </div>
              <a
                href={EMAIL_MAILTO}
                className="btn btn-priceless mt-6 w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Send a message
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ. Only questions we can honestly answer. No certification or
          warranty claims that aren't in the source-of-truth doc. */}
      <section className="border-b bg-[var(--muted)] py-12">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-700">Common questions</div>
            <h2 className="font-display mt-3 text-5xl leading-[1.02]">
              Before you call.
            </h2>
            <p className="mt-5 text-base text-[var(--muted-foreground)]">
              If your question isn&apos;t here, call {PHONE}. A crew lead answers.
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)] bg-white">
              {FAQ.map((f) => (
                <details key={f.q} className="group px-5 py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                    <span className="text-lg font-semibold text-[var(--foreground)]">{f.q}</span>
                    <span
                      aria-hidden
                      className="font-mono shrink-0 text-emerald-700 transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT INTAKE FORM. Primary lead capture; sits above the
          phone-first final CTA so visitors can commit without dialing. */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          <InquiryForm brand="four-squared" />
        </div>
      </section>

      {/* FINAL CTA. Phone-first close. */}
      <section className="bg-[#0a0e14] py-12 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-300">When you&apos;re ready</div>
          <h2 className="font-display mt-4 text-5xl leading-[0.98] md:text-7xl">
            Bring the room, a budget, some photos.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            First estimate is free. Email or call and we&apos;ll set a time.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href={EMAIL_MAILTO} className="btn btn-priceless bg-emerald-600 hover:bg-emerald-700">
              Get an estimate
            </a>
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-3 border border-white/30 px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:border-emerald-400 hover:text-emerald-300"
            >
              <span aria-hidden className="text-emerald-400">●</span>
              Call {PHONE}
            </a>
          </div>
          <div className="mt-8 text-sm text-white/80">
            Four Squared Construction · {ADDRESS.street}, {ADDRESS.city}, {ADDRESS.state}
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
