import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const HERO = "/real-photos/building-exterior.webp";

const BENEFITS = [
  {
    title: "Net-30 account billing",
    body: "Roll the week&apos;s purchases onto a single invoice. Pay it at the end of the month, by check or ACH. No card swipes at the counter every morning.",
  },
  {
    title: "Contractor-only inventory drops",
    body: "First call on every Wednesday delivery: doors, windows, hardware, full vanity packages. We text the list out the Tuesday before.",
  },
  {
    title: "Will-call hold lockers",
    body: "Reserve material online or by phone. We pull it, tag it, and lock it in your dedicated bay until the job site is ready for it.",
  },
  {
    title: "After-hours load-out",
    body: "Need to grab a pre-hung door at 6 AM before your crew rolls? Book a time, we&apos;ll meet you at the bay. No charge for accounts in good standing.",
  },
  {
    title: "Jobsite delivery",
    body: "Flatbed and box-truck delivery anywhere inside a 60-mile radius of Wausau. Same-day for orders placed before 11 AM.",
  },
  {
    title: "Monthly statements",
    body: "Every invoice, every credit, organized by job code. Hand it to your bookkeeper. They&apos;ll thank you. CSV export available.",
  },
];

// Real customer review pulled from Google Business. See docs/SOURCE_OF_TRUTH.md §4.
// Do not add fabricated contractor testimonials.
const TESTIMONIALS = [
  {
    name: "Ryan T.",
    company: "Google review",
    quote:
      "Great people to deal with! Josh installed our granite island and countertops with great detail and craftsmanship. Highly recommend.",
    trade: "Verified Google review",
  },
];

export default function ContractorsPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Contractor pulling material at warehouse" fill priority className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-white md:py-36">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            Price-Less contractor program
          </div>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            BUILT FOR THE TRADES.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
            Net-30 billing, contractor-only drops, will-call lockers, and after-hours load-out for crews
            running jobs across Wausau, Schofield, Rothschild, Mosinee, Marathon and the rest of central
            Wisconsin. No application fee. No annual dues.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#signup" className="btn btn-priceless">
              Sign up today
            </a>
            <a href="tel:+17158483855" className="btn btn-outline border-white/40 bg-transparent text-white">
              (715) 848-3855
            </a>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
          What you get
        </div>
        <h2 className="font-display mt-2 text-3xl md:text-4xl">Six things you won&apos;t get at the orange or blue stores.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border bg-white p-6 shadow-card">
              <div className="font-display text-xl">{b.title}</div>
              <p
                className="mt-3 text-sm text-[var(--muted-foreground)]"
                dangerouslySetInnerHTML={{ __html: b.body }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SIGN UP */}
      <section id="signup" className="border-y bg-[var(--muted)] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
              Apply in 60 seconds
            </div>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">Open an account.</h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Most accounts open same-day after we verify your trade license and a quick reference. You can
              start charging to the account on your first visit.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex gap-2"><span className="text-[var(--brand-priceless)]">✓</span> No fees, no minimums</li>
              <li className="flex gap-2"><span className="text-[var(--brand-priceless)]">✓</span> Net-30 billing</li>
              <li className="flex gap-2"><span className="text-[var(--brand-priceless)]">✓</span> 60-mile delivery radius</li>
              <li className="flex gap-2"><span className="text-[var(--brand-priceless)]">✓</span> Will-call holds &amp; locker bays</li>
            </ul>
          </div>

          <form className="grid gap-4 rounded-2xl border bg-white p-8 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" placeholder="First and last" />
              <Field label="Company / DBA" placeholder="Your business name" />
              <Field label="Email" placeholder="you@example.com" type="email" />
              <Field label="Phone" placeholder="(715) 555-0142" type="tel" />
            </div>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                What trade?
              </span>
              <select className="rounded-md border bg-white px-4 py-3 text-base outline-none focus:border-[var(--brand-priceless)]">
                <option>General contractor</option>
                <option>Kitchen &amp; bath</option>
                <option>Window &amp; door install</option>
                <option>Finish carpentry / trim</option>
                <option>Roofing / siding</option>
                <option>Remodeler</option>
                <option>Property manager</option>
                <option>Other trade</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Anything we should know?
              </span>
              <textarea
                rows={3}
                placeholder="Average monthly spend, types of projects, anything else."
                className="rounded-md border bg-white px-4 py-3 text-base outline-none focus:border-[var(--brand-priceless)]"
              />
            </label>
            <button type="submit" className="btn btn-priceless mt-2">
              Submit application
            </button>
            <p className="text-xs text-[var(--muted-foreground)]">
              We&apos;ll call you within one business day to confirm.
            </p>
          </form>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
          From the trades
        </div>
        <h2 className="font-display mt-2 text-3xl md:text-4xl">What our contractor accounts say.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex gap-5 rounded-2xl border bg-white p-6 shadow-card">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[var(--brand-priceless)] font-display text-2xl text-white">
                {t.name.split(" ").map((p) => p[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: `&ldquo;${t.quote}&rdquo;` }} />
                <div className="mt-3 font-display text-base">{t.name}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{t.company}</div>
                <div className="mt-1 inline-flex rounded-full bg-[var(--brand-priceless)]/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
                  {t.trade}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid items-center gap-6 rounded-2xl bg-[var(--brand-priceless)] p-10 text-white md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Working a job this week?</h2>
            <p className="mt-2 text-white/85">
              Call the counter, tell us what you need. We&apos;ll have it on the dock before your truck rolls.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <a href="tel:+17158483855" className="btn bg-white text-[var(--brand-priceless)]">
              Call (715) 848-3855
            </a>
            <Link href="/shop" className="btn btn-outline border-white/50 bg-transparent text-white">
              Browse inventory
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </span>
      <input
        {...rest}
        className="rounded-md border bg-white px-4 py-3 text-base outline-none focus:border-[var(--brand-priceless)]"
      />
    </label>
  );
}
