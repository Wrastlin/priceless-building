import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Compass, PencilRuler, FileText, Hammer, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "How it works · Builders Corner Cabinetry & Design",
  description:
    "Five steps from the first conversation to install. Honest timelines, in the order they happen.",
};

// HERO is a full-bleed background image; needs to be high-res. Each STEP
// also uses a 4:3 image at ~50% viewport width, so those also use high-res
// AI renders and the storefront-signage photo. Real 223px thumbnails are
// reserved for proof grids elsewhere on the site.
const HERO = "/real-photos/install-kitchen-walnut.webp";

type Step = {
  n: string;
  label: string;
  title: string;
  duration: string;
  icon: React.ReactNode;
  image: string;
  paragraphs: string[];
};

const STEPS: Step[] = [
  {
    n: "01",
    label: "First meeting",
    title: "We start with a conversation.",
    duration: "About an hour, at the showroom",
    icon: <Compass className="size-5" />,
    image: "/real-photos/storefront-signage.webp",
    paragraphs: [
      "Come by the showroom on Washington Street. Bring photos of your room, a rough idea of what you want, and a budget if you have one.",
      "We sit down and talk through it. Free, no commitment.",
      "If we're a fit, we set a date to come measure.",
    ],
  },
  {
    n: "02",
    label: "Design",
    title: "Field measure, draw it up, hand you samples.",
    duration: "A few weeks, with revisions",
    icon: <PencilRuler className="size-5" />,
    image: "/real-photos/install-kitchen-walnut-slide-range.webp",
    paragraphs: [
      "One of us comes to your house with a laser measure, captures every wall and rough-in, and takes reference photos.",
      "Back at the shop we draw it up. You see the layout before anything is built. Two rounds of revisions is standard.",
      "You walk out with real door samples, paint chips, slab pieces, hardware. No Pinterest screenshots.",
    ],
  },
  {
    n: "03",
    label: "Quote",
    title: "A line-item written estimate.",
    duration: "Usually within a week",
    icon: <FileText className="size-5" />,
    image: "/real-photos/install-kitchen-walnut-marble.webp",
    paragraphs: [
      "Cabinetry, counters, plumbing, tile, demo, install. Each line broken out so nothing is buried.",
      "Anything we can't lock to a fixed number gets called out as an allowance with a cap.",
      "Once you sign, we order materials and put the install on the schedule.",
    ],
  },
  {
    n: "04",
    label: "Build",
    title: "Doors built and finished in our shop.",
    duration: "Cabinetry lead time varies",
    icon: <Hammer className="size-5" />,
    image: "/real-photos/install-before-kitchen.webp",
    paragraphs: [
      "Doors and drawers are built and finished here in Wausau. Sprayed, sanded between coats, sprayed again.",
      "While the cabinetry is in production, Four Squared sequences the rest: demo, plumbing, electrical, drywall, floors.",
      "Counters get templated on-site after the cabinets are set, then fabricated and installed.",
    ],
  },
  {
    n: "05",
    label: "Install",
    title: "Install by Four Squared.",
    duration: "Install plus punch list",
    icon: <KeyRound className="size-5" />,
    image: "/real-photos/install-kitchen-white-open.webp",
    paragraphs: [
      "Four Squared sets the boxes, hangs the doors, runs the trim, installs the tops, plumbs in the fixtures.",
      "Punch-list walkthrough together at the end. Anything on the list gets fixed before final payment.",
      "Manufacturer warranties pass through on the materials. Anything we install that we got wrong, we come back and make right.",
    ],
  },
];

export default function ProcessPage() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO. Editorial asymmetric */}
      <section className="relative overflow-hidden bg-[#0b1729]">
        <div className="absolute inset-0">
          <Image src={HERO} alt="A Builders Corner designer reviewing plans" fill priority className="object-cover opacity-85" quality={80} />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(11,23,41,0.9)_0%,_rgba(11,23,41,0.55)_45%,_transparent_75%)]" />
        </div>
        <div className="relative mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/80 md:text-lg">
              How it works · five steps
            </span>
          </div>
          <div className="grid gap-x-12 gap-y-10 py-12 text-white md:grid-cols-12 md:py-16">
            <div className="md:col-span-8">
              <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:text-6xl">
                From the first meeting to install.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-[1.7] text-white/90 md:text-lg">
                Five steps, in the order they happen. Timelines depend on the room and the cabinet lead time.
              </p>
            </div>
            <aside className="md:col-span-4 md:pt-3">
              <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">Five steps</div>
              <ol className="mt-6 divide-y divide-white/15 border-t border-b border-white/15">
                {STEPS.map((s) => (
                  <li key={s.n}>
                    <a
                      href={`#step-${s.n}`}
                      className="font-couture flex items-baseline gap-4 py-3 text-base italic text-white/85 transition hover:text-white md:text-lg"
                    >
                      <span className="text-[var(--brand-builders-gold)]">{s.n}</span>
                      <span>{s.label}</span>
                      <span className="ml-auto text-sm text-white/55">{s.duration}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </div>
      </section>

      {/* STEPS. Editorial numbered rows, single typeface */}
      {STEPS.map((s, i) => (
        <section
          key={s.n}
          id={`step-${s.n}`}
          className={"border-t border-[var(--border)] " + (i % 2 === 0 ? "bg-white" : "bg-[var(--muted)]/40")}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-12 md:py-16">
            <div className={"md:col-span-6 " + (i % 2 === 0 ? "" : "md:order-2 md:col-start-7")}>
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                  quality={85}
                />
              </div>
            </div>
            <div className={"md:col-span-6 " + (i % 2 === 0 ? "md:col-start-7" : "md:order-1 md:col-start-1")}>
              <div className="font-couture flex items-baseline gap-4 text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">
                <span>Step {s.n}</span>
                <span className="text-base text-[var(--muted-foreground)]">{s.duration}</span>
              </div>
              <h2 className="font-couture mt-5 text-5xl leading-[1.05] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
                {s.title}.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-[1.7] text-[var(--muted-foreground)] md:text-lg">
                {s.paragraphs.map((p, j) => (
                  <p key={j} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CLOSING CTA */}
      <section className="bg-[var(--brand-builders)] py-12 text-white md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">When you're ready</div>
          <h2 className="font-couture mt-5 text-5xl leading-[1.05] tracking-[-0.015em] text-white md:text-6xl">
            Step one is a free hour at the showroom.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-[1.7] text-white/90 md:text-lg">
            Bring photos, sketches, or an idea.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
            <Link
              href="/builders-corner/consultation"
              className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
            >
              Book a consultation
            </Link>
            <Link
              href="/builders-corner/gallery"
              className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
            >
              See finished projects
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}
