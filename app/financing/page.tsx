import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const HERO = "/real-photos/storefront-signage.webp";

const TIERS = [
  {
    badge: "Most popular",
    title: "90 days same-as-cash",
    rate: "0% APR",
    line: "Pay it off inside 90 days. No interest, no fees, no math.",
    detail: "Great for fast remodels and small projects under $2,500.",
    cta: "Best for: weekend projects",
  },
  {
    badge: "Big-project favorite",
    title: "12 months, 0% APR",
    rate: "0% APR",
    line: "Spread the cost of a full kitchen or window package across a year, interest free.",
    detail: "On purchases of $1,500 or more, with approved credit.",
    cta: "Best for: kitchens & full windows",
  },
  {
    badge: "Long term",
    title: "24–60 months extended",
    rate: "from 7.99% APR",
    line: "Lock in a fixed monthly payment on jobs $5,000 and up.",
    detail: "Available through GreenSky for qualifying contractors and homeowners.",
    cta: "Best for: gut remodels & additions",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Apply in minutes",
    body: "Soft credit check, no impact to your score until you accept an offer. Takes about 90 seconds from your phone.",
  },
  {
    n: 2,
    title: "Get a decision on the spot",
    body: "Most applicants hear back inside 60 seconds. Show approval at the counter. No paperwork to print.",
  },
  {
    n: 3,
    title: "Use it like a card",
    body: "Approved? Your credit line works for every Price-Less purchase, in-store or for jobsite delivery. Use it once or use it for the whole project.",
  },
];

const FAQS = [
  {
    q: "Will applying hurt my credit score?",
    a: "No. Both Synchrony and GreenSky run a soft inquiry up front (the kind that doesn&apos;t show on your credit report). Only if you accept an offer and the line is opened does a hard pull happen.",
  },
  {
    q: "How fast does approval come back?",
    a: "Almost always under a minute. If something needs a manual review, you&apos;ll typically hear back the same business day.",
  },
  {
    q: "What&apos;s the minimum purchase?",
    a: "$299 for the 90-day same-as-cash plan, $1,500 for the 12-month 0% APR plan, and $5,000 for the extended 24–60 month plans.",
  },
  {
    q: "Can I use financing for delivery and labor?",
    a: "Yes. Anything that lands on your Price-Less invoice qualifies. That includes jobsite delivery, will-call holds, and Builders Corner install fees if you&apos;re bundling cabinetry.",
  },
  {
    q: "Do contractors get a different program?",
    a: "Yes. Licensed contractors signed up through our contractor program get net-30 account billing and a separate revolving line that doesn&apos;t touch personal credit. Ask at the counter or sign up on the contractors page.",
  },
  {
    q: "What if I&apos;m self-employed or new to credit?",
    a: "Synchrony looks at more than just FICO. Income and tradelines matter. Most central-Wisconsin self-employed contractors get approved. If you don&apos;t, we&apos;ll help you set up a layaway hold instead.",
  },
  {
    q: "Can I pay it off early?",
    a: "Always. There&apos;s never an early-payoff penalty on any of our financing options.",
  },
  {
    q: "What types of projects qualify?",
    a: "Anything you can buy at Price-Less or Builders Corner: doors, windows, full kitchens, vanities, hardware, countertops, lighting, trim. We&apos;ve financed everything from a single front door to a $42,000 whole-home remodel package.",
  },
];

export default function FinancingPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Contractor working on a project" fill priority className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-white md:py-36">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            Financing · Synchrony & GreenSky
          </div>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            BUY THE WHOLE PROJECT. PAY IT LIKE A BILL.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
            90 days same-as-cash on doors and hardware. 12 months 0% APR on full kitchens. Extended 24–60
            month plans for the big remodels. Apply from your phone, get a decision in under a minute.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="https://www.mysynchrony.com/" target="_blank" rel="noreferrer" className="btn btn-priceless">
              Apply now
            </a>
            <a href="tel:+17158483855" className="btn btn-outline border-white/40 bg-transparent text-white">
              Talk to a person
            </a>
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
          Three plans, every project
        </div>
        <h2 className="font-display mt-2 text-3xl md:text-4xl">Pick a payment shape that fits the job.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <div
              key={t.title}
              className={
                "relative flex flex-col rounded-2xl border bg-white p-7 shadow-card " +
                (i === 0 ? "ring-2 ring-[var(--brand-priceless)]" : "")
              }
            >
              <span className="inline-flex w-fit rounded-full bg-[var(--brand-priceless)]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
                {t.badge}
              </span>
              <h3 className="font-display mt-4 text-2xl">{t.title}</h3>
              <div className="mt-1 text-sm font-semibold text-[var(--brand-priceless)]">{t.rate}</div>
              <p className="mt-3 text-sm">{t.line}</p>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">{t.detail}</p>
              <div className="mt-auto pt-6">
                <div className="text-xs text-[var(--muted-foreground)]">{t.cta}</div>
                <a
                  href="https://www.mysynchrony.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline mt-3 w-full justify-center"
                >
                  Apply for this plan
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[var(--brand-priceless-dark)] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/70">How it works</div>
          <h2 className="font-display mt-2 text-3xl md:text-4xl">From your phone to the load bay in one afternoon.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white/5 p-7 backdrop-blur">
                <div className="font-display text-5xl text-white/40">{String(s.n).padStart(2, "0")}</div>
                <div className="font-display mt-3 text-2xl">{s.title}</div>
                <p className="mt-3 text-sm text-white/80">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">
          Frequently asked
        </div>
        <h2 className="font-display mt-2 text-3xl md:text-4xl">Common questions, real answers.</h2>
        <div className="mt-10 divide-y rounded-2xl border bg-white">
          {FAQS.map((f) => (
            <details key={f.q} className="group p-6 open:bg-[var(--muted)]/40">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                <span className="font-display text-lg leading-snug">{f.q}</span>
                <span className="mt-1 text-xl text-[var(--brand-priceless)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid items-center gap-6 rounded-2xl bg-[var(--brand-priceless)] p-10 text-white md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Ready to apply?</h2>
            <p className="mt-2 text-white/85">
              Most decisions in under 60 seconds. No impact to your credit to check.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <a
              href="https://www.mysynchrony.com/"
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-[var(--brand-priceless)]"
            >
              Start application
            </a>
            <Link href="/contact" className="btn btn-outline border-white/50 bg-transparent text-white">
              Talk to us first
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
