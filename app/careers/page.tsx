import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ADDRESS } from "@/lib/brands";

const APPLY_EMAIL = "pricelessbuildingcenter@gmail.com";

const POSITIONS = [
  {
    title: "Retail Sales",
    type: "Full-time",
    location: `${ADDRESS.city}, ${ADDRESS.state} · On-site`,
    body:
      "Front-of-house customer help: greet walk-ins, walk the floor, pull will-call orders, answer questions about doors, windows, cabinets, hardware. The first face most customers see.",
    bullets: [
      "Comfortable on your feet and with a hand truck",
      "Counter POS and basic computer skills",
      "Patient, plain-spoken, no high-pressure sales",
    ],
  },
  {
    title: "Front of House Management",
    type: "Full-time",
    location: `${ADDRESS.city}, ${ADDRESS.state} · On-site`,
    body:
      "Lead the floor. Schedule the retail team, own the customer experience, run end-of-day close, work with Josh on weekly priorities. The person who keeps the front of the store moving.",
    bullets: [
      "Leadership experience and a collaboration mindset",
      "Strong communication and problem-solving",
      "Computer efficiency (POS, scheduling, email)",
      "Retail or trades-counter background a plus",
    ],
  },
];

const WHAT_WERE_LOOKING_FOR = [
  "Computer efficiency",
  "Leadership experience",
  "Communication skills",
  "Collaboration mindset",
  "Problem-solving ability",
];

export const metadata = {
  title: "Careers · Price-Less Building Center",
  description:
    "Open positions at Price-Less Building Center in Wausau, WI. Family-owned since 1978. Email pricelessbuildingcenter@gmail.com to apply.",
};

export default function CareersPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO. Real hiring flyer + simple text */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-14 pb-12 md:grid-cols-12 md:gap-12 md:pt-20 md:pb-20">
          <div className="md:col-span-7">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
              Hiring in {ADDRESS.city}, {ADDRESS.state}
            </div>
            <h1 className="font-display mt-4 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
              We're looking for <span className="text-[var(--brand-priceless)]">you.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-[var(--muted-foreground)] md:text-lg">
              Two open roles at the Wausau store: Retail Sales and Front of House Management. Email your resume to{" "}
              <a href={`mailto:${APPLY_EMAIL}`} className="font-medium text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)]">
                {APPLY_EMAIL}
              </a>
              {" "}or stop by 825 Washington Street.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a href={`mailto:${APPLY_EMAIL}?subject=Application%20%E2%80%94%20Price-Less%20Building%20Center`} className="btn btn-priceless">
                Email your resume
              </a>
              <Link
                href="#positions"
                className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg"
              >
                See the roles ↓
              </Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--border)] bg-[var(--muted)]">
              <Image
                src="/real-photos/hiring-flyer.webp"
                alt="Price-Less Building Center hiring flyer: We Are Looking For You. Retail Sales. Front of House Management. Apply at pricelessbuildingcenter@gmail.com."
                fill
                priority
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              From our recent hiring flyer, posted to Facebook.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE'RE LOOKING FOR */}
      <section className="border-b bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="grid items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
                Do you have…
              </div>
              <h2 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
                The kind of person we hire.
              </h2>
            </div>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
            {WHAT_WERE_LOOKING_FOR.map((item) => (
              <li
                key={item}
                className="border border-[var(--border)] bg-white p-5 text-base font-medium text-[var(--foreground)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section id="positions" className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="grid items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
                Open positions
              </div>
              <h2 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
                Two roles, on the floor.
              </h2>
            </div>
            <p className="text-base text-[var(--muted-foreground)] md:col-span-5 md:text-lg">
              Apply by email; we usually reply within a couple of business days.
            </p>
          </div>
          <ul className="mt-10 space-y-6">
            {POSITIONS.map((p) => (
              <li key={p.title} className="border border-[var(--border)] bg-white p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-3xl leading-tight md:text-4xl">{p.title}</h3>
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    {p.type} · {p.location}
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--foreground)]">
                  {p.body}
                </p>
                <ul className="mt-5 grid gap-2 text-sm text-[var(--muted-foreground)] sm:grid-cols-2">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-baseline gap-2">
                      <span className="text-[var(--brand-priceless)]">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Application: ${p.title}`)}`}
                  className="btn btn-priceless mt-6 inline-flex"
                >
                  Apply for {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-b bg-[var(--muted)]">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
          <h2 className="font-display text-3xl leading-tight md:text-4xl">
            Send your resume, or just stop by.
          </h2>
          <p className="mt-4 text-base text-[var(--muted-foreground)] md:text-lg">
            Email <a href={`mailto:${APPLY_EMAIL}`} className="font-medium text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)]">{APPLY_EMAIL}</a>{" "}
            or come to {ADDRESS.street} in {ADDRESS.city}. We're open Monday through Saturday and happy to talk.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href={`mailto:${APPLY_EMAIL}`} className="btn btn-priceless">Email us</a>
            <a href={`tel:+1${ADDRESS.phone.replace(/[^0-9]/g, "")}`} className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)]">
              Call {ADDRESS.phone}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
