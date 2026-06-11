import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { ADDRESS } from "@/lib/brands";

const HERO = "/real-photos/storefront-signage.webp";
const ORIGIN = "/real-photos/mural-wide.webp";
const CONTRACTOR = "/real-photos/building-exterior.webp";
const FAMILY = "/real-photos/community-county-fair.webp";
const AISLE = "/real-photos/paint-day-flyer.webp";

export const metadata = {
  title: "About · Price-Less Building Center",
  description:
    "A Wausau, Wisconsin discount and surplus building supply warehouse, founded in 1978 and acquired in 2019 by three local partners.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO. Editorial asymmetric */}
      <section className="relative overflow-hidden bg-[var(--muted)]">
        <div className="absolute inset-0">
          <Image src={HERO} alt="The Price-Less storefront on Washington St" fill priority className="object-cover opacity-75" quality={80} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_transparent_0%,_rgba(0,0,0,0.65)_55%,_rgba(0,0,0,0.9)_100%)]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pt-28 pb-20 text-white md:grid-cols-12 md:pt-40 md:pb-28">
          <div className="md:col-span-8">
            <div className="font-mono flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-white/85">
              <span className="size-1.5 rounded-full bg-[var(--brand-priceless)]" />
              <span>Origin</span>
              <span className="opacity-50">/</span>
              <span>Since 1978</span>
              <span className="opacity-50">/</span>
              <span>{ADDRESS.city}, {ADDRESS.state}</span>
            </div>
            <h1 className="font-display mt-8 max-w-[18ch] text-[3.5rem] leading-[0.88] text-white sm:text-[5rem] md:text-[7.5rem]">
              A weekend venture that <span className="text-[var(--brand-priceless)]">never closed.</span>
            </h1>
            <p className="font-serif mt-8 max-w-xl text-lg italic leading-snug text-white/85 md:text-xl">
              Price-Less Building Center started in 1978 as a weekend operation and went full-time in 1982. The cabinet-manufacturing arm, Builders Corner, opened in 1983. Decades later, the same building on Washington Street still does the same thing: surplus and cancelled-order building materials at warehouse prices.
            </p>
          </div>
          <aside className="md:col-span-4 md:pt-16">
            <div className="border-l border-white/20 pl-5">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-white/80">In numbers</div>
              <dl className="mt-5 space-y-5 text-white">
                <AboutStat n="1978" label="founded as a weekend venture" />
                <AboutStat n="1982" label="went full-time" />
                <AboutStat n="1983" label="Builders Corner cabinet shop opened" />
                <AboutStat n="2019" label="new ownership took over" />
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* SECTION 1. THE FOUNDING */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
            <Image src={ORIGIN} alt="The Build Your Future mural on the warehouse" fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" quality={75} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">Chapter One · 1978</div>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">A weekend operation on Washington Street.</h2>
            <p className="mt-5 text-[var(--muted-foreground)]">
              Price-Less Building Center opened in 1978 as a weekend venture, selling discounted and surplus building materials out of the same Wausau address it still occupies today. The model from day one was simple: cancelled-order, surplus, and overstock material from the same manufacturers supplying the national chains, sold for what the big-box wouldn&apos;t.
            </p>
            <p className="mt-4 text-[var(--muted-foreground)]">
              By 1982 the demand was steady enough to go full-time. A year later, in 1983, the cabinet-manufacturing arm, Builders Corner, opened in the same building.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2. THE 2019 HANDOFF */}
      <section className="bg-[var(--muted)] py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">Chapter Two · 2019</div>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">New ownership, same building, same idea.</h2>
            <p className="mt-5 text-[var(--muted-foreground)]">
              In May 2019, the business was acquired by three partners: Jamus Baumgardt, Josh Nickel, and Justin Jolin. They kept the storefront, the buying relationships, and the focus on surplus inventory.
            </p>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Sales grew roughly 40% through the pandemic year that followed, as central Wisconsin homeowners and contractors leaned harder on local supply. (Source: The Business News, May 2021.)
            </p>
          </div>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl shadow-card md:order-2">
            <Image src={CONTRACTOR} alt="The warehouse exterior" fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" quality={75} />
          </div>
        </div>
      </section>

      {/* SECTION 3. THE SISTER BRAND */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
            <Image src={FAMILY} alt="A community day at the building" fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" quality={75} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">Chapter Three · The cluster</div>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">Three brands, one address.</h2>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4 border-y border-[var(--border)] py-5">
              <BrandLogo brand="priceless" size="sm" />
              <BrandLogo brand="builders" size="sm" />
              <BrandLogo brand="four-squared" size="sm" />
            </div>
            <p className="mt-5 text-[var(--muted-foreground)]">
              At 825 Washington Street you&apos;ll find three related brands: Price-Less Building Center for discount and surplus retail; Builders Corner Cabinetry &amp; Design for premium custom kitchens and baths; and Four Squared Construction, the install crew that handles full remodels.
            </p>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Most projects use more than one. Walk in for a vanity, leave with a designer&apos;s number. Walk in for a quote, leave with a stack of doors.
            </p>
            <div className="mt-6">
              <Link href="/builders-corner" className="btn btn-outline">Visit Builders Corner →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4. THE MURAL + COMMUNITY */}
      <section className="bg-[var(--brand-priceless-dark)] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/85">Chapter Four · 2023 onward</div>
          <h2 className="font-display mt-3 max-w-3xl text-3xl md:text-5xl">
            Build Your Future.
          </h2>
          <p className="mt-6 max-w-3xl text-white/85">
            In June 2023, more than 50 community volunteers painted the &ldquo;Build Your Future&rdquo; mural on the warehouse wall. The artist behind it is Stephanie Kohli of Stephanie Kohli Art LLC.
          </p>
          <blockquote className="mt-8 max-w-3xl border-l-2 border-white/40 pl-5 text-white/90">
            <p className="font-serif text-lg italic leading-snug md:text-xl">
              &ldquo;Trades is a dying breed. So we want to do something that represents what us hard-working guys do.&rdquo;
            </p>
            <footer className="mt-3 text-xs uppercase tracking-wider text-white/85">
              Josh Nickel · WSAW NewsChannel 7, June 2023
            </footer>
          </blockquote>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Differentiator
              kicker="WAOW NewsChannel 9"
              title="Great Grocery Giveaway."
              body="Partnered with WAOW 9 to give a local family free groceries for a year. It&apos;s the kind of thing a building supply company shouldn&apos;t have a reason to do, and exactly the reason we did it."
            />
            <Differentiator
              kicker="December 2024"
              title="First Santa&apos;s Workshop."
              body="After a customer dressed as Santa came in for a front door, the team built out a full holiday workshop in the showroom. WSAW covered it."
            />
            <Differentiator
              kicker="April 2025"
              title="Easter Bunny visit."
              body="The first Easter Bunny visit, also covered by WSAW. As Josh told the station: &ldquo;It&apos;s pure joy. It&apos;s not a staged smile.&rdquo;"
            />
            <Differentiator
              kicker="December 2025"
              title="Second annual Santa&apos;s Workshop."
              body="The holiday workshop returned, with families coming in from across central Wisconsin."
            />
          </div>
        </div>
      </section>

      {/* OWNERSHIP + owner-voice letter */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">Today</div>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">Run by the partners.</h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Price-Less Building Center, Builders Corner Cabinetry &amp; Design, and Four Squared Construction share the building at 825 Washington and are run by the partner group. Most customers meet whoever&apos;s on the floor that day, not the same person every time.
            </p>
            <blockquote className="mt-8 border-l-2 border-[var(--brand-priceless)] pl-5">
              <p className="font-serif text-lg italic leading-snug text-[var(--foreground)] md:text-xl">
                &ldquo;It takes a village to make small businesses successful. We couldn&apos;t do it without you. We look forward to serving the Wausau and surrounding areas.&rdquo;
              </p>
              <footer className="mt-3 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                From the owners&apos; year-end letter, December 2022
              </footer>
            </blockquote>
            <p className="mt-6 text-sm text-[var(--muted-foreground)]">
              The fastest way to meet the people on the floor is to come walk the warehouse on a Wednesday.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--border)] bg-[var(--muted)]">
              <Image
                src="/real-photos/letter-new-year-2023.webp"
                alt="The owners' year-end thank-you letter posted on Facebook, December 2022"
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY photo strip */}
      <section className="border-y border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
            With our community
          </div>
          <h2 className="font-display mt-3 text-3xl leading-tight md:text-4xl">Beyond the doors and cabinets.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <figure className="overflow-hidden border border-[var(--border)] bg-white">
              <div className="relative aspect-[16/9] w-full bg-[var(--muted)]">
                <Image src="/real-photos/grocery-giveaway-waow.webp" alt="Great Grocery Giveaway in partnership with WAOW NewsChannel 9" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="p-4 text-sm text-[var(--muted-foreground)]">
                The Great Grocery Giveaway, in partnership with WAOW NewsChannel 9. Win free groceries for a year.
              </figcaption>
            </figure>
            <figure className="overflow-hidden border border-[var(--border)] bg-white">
              <div className="relative aspect-[16/9] w-full bg-[var(--muted)]">
                <Image src="/real-photos/santa-at-storefront.webp" alt="Santa visiting the Price-Less storefront during the annual Santa's Workshop" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="p-4 text-sm text-[var(--muted-foreground)]">
                Santa&apos;s Workshop, two years running. Free photos, free hot chocolate, building materials still half off.
              </figcaption>
            </figure>
            <figure className="overflow-hidden border border-[var(--border)] bg-white">
              <div className="relative aspect-[16/9] w-full bg-[var(--muted)]">
                <Image src="/real-photos/mural-from-field.webp" alt="The Build Your Future mural on the side of the warehouse" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="p-4 text-sm text-[var(--muted-foreground)]">
                The Build Your Future mural, painted June 2023 by 50+ volunteers with artist Stephanie Kohli.
              </figcaption>
            </figure>
            <figure className="overflow-hidden border border-[var(--border)] bg-white">
              <div className="relative aspect-[16/9] w-full bg-[var(--muted)]">
                <Image src="/real-photos/school-food-drive.webp" alt="Middle school food and clothing drive promotional flyer" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="p-4 text-sm text-[var(--muted-foreground)]">
                Middle school food and clothing drives with Horace Mann and John Muir. Drop bins are by the front counter.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* CLOSER */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid items-center gap-px bg-[var(--border)] md:grid-cols-12">
          <div className="relative aspect-[4/3] md:col-span-7 md:aspect-auto md:h-full">
            <Image src={AISLE} alt="A community mural paint day at the warehouse" fill className="object-cover" sizes="(min-width:768px) 60vw, 100vw" quality={75} />
          </div>
          <div className="bg-white p-8 md:col-span-5 md:p-12">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">Drop in</div>
            <h2 className="font-display mt-3 text-5xl leading-[1.05]">
              Come walk the <span className="text-[var(--brand-priceless)]">warehouse.</span>
            </h2>
            <p className="font-serif mt-5 text-base italic leading-relaxed text-[var(--muted-foreground)]">
              Open Monday through Saturday. The coffee pot is on and the load bay is open.
            </p>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              {ADDRESS.street} · {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip} · {ADDRESS.phone}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-priceless">Shop the surplus floor</Link>
              <Link href="/contact" className="btn btn-outline">Plan your visit</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}

function Differentiator({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-white/85">{kicker}</div>
      <div className="font-display mt-2 text-2xl" dangerouslySetInnerHTML={{ __html: title }} />
      <p className="mt-3 text-sm text-white/80" dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}

function AboutStat({ n, label, sub }: { n: string; label: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl leading-none text-white md:text-5xl">{n}</span>
        {sub ? <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/80">{sub}</span> : null}
      </div>
      <div className="font-mono mt-1 text-xs uppercase tracking-[0.14em] text-white/85">{label}</div>
    </div>
  );
}
