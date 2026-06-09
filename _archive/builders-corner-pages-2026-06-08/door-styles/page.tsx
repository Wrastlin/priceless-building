import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Cabinet door styles · Builders Corner Cabinetry & Design",
  description:
    "The cabinet door styles we build. Shaker, slab, recessed panel, beaded inset. Bring an inspiration photo and we&apos;ll match or adapt.",
};

// HERO uses a high-res AI render. The DOORS grid below uses real install
// thumbnails at proof-tile size where the 223px native resolution is fine.
// Each image used exactly once across this page.
const HERO = "/real-photos/install-door-arched-mahogany.webp";

type Door = {
  name: string;
  family: string;
  image: string;
  blurb: string;
};

const DOORS: Door[] = [
  {
    name: "Shaker",
    family: "Framed, full-overlay",
    image: "/real-photos/install-kitchen-white-open.webp",
    blurb: "Five-piece frame with a recessed flat center panel. Reads modern in white, classic in a stain. Our most-built door.",
  },
  {
    name: "Slab",
    family: "Frameless, contemporary",
    image: "/real-photos/install-kitchen-modern-banquette.webp",
    blurb: "A single flat face. Quiet and contemporary. Works with finger-pull edges, integrated pulls, or push-to-open.",
  },
  {
    name: "Walnut flat panel",
    family: "Stained, full-overlay",
    image: "/real-photos/install-kitchen-walnut-slide-range.webp",
    blurb: "Flat-panel cabinetry in stained walnut. Clean modern, lets the wood grain do the work.",
  },
  {
    name: "Open shelving",
    family: "Open, accent",
    image: "/real-photos/install-kitchen-floating-shelf-bowls.webp",
    blurb: "Floating wood shelves in place of upper cabinets. Lightens a wall and shows off the stuff you actually use.",
  },
  {
    name: "Two-tone",
    family: "Mixed finish",
    image: "/real-photos/install-kitchen-walnut-island-bar.webp",
    blurb: "Different finishes on the perimeter and the island. Adds depth without changing door style.",
  },
  {
    name: "Galley two-tone",
    family: "Mixed wood and paint",
    image: "/real-photos/install-kitchen-galley-green-wall.webp",
    blurb: "Light-wood lower cabinets with painted accents. Compact-kitchen friendly.",
  },
];

export default function DoorStylesPage() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/80 md:text-lg">
              Door styles · the doors and finishes we build
            </span>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden md:mt-14">
            <Image
              src={HERO}
              alt="A clean five-piece shaker interior door, painted, our most-built door style."
              fill
              priority
              className="object-cover"
              sizes="(min-width:1600px) 1600px, 100vw"
              quality={85}
            />
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-6 pb-20 md:mt-14 md:grid-cols-12 md:pb-28">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              The cabinet doors we build.
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                We do most of the popular door styles. Shaker, slab, recessed panel, beaded inset. Painted or stained in any species we stock. Bring an inspiration photo to the consult and we&apos;ll match or adapt.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link
                  href="/builders-corner/consultation"
                  className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
                >
                  Start a design
                </Link>
                <Link
                  href="/builders-corner/finishes"
                  className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
                >
                  See finishes and hardware
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOOR GRID. Real install photos, descriptive copy. */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">A few directions</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Real installs, real doors.
            </h2>
          </div>
          <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">
            Door style drives the look and a lot of the cost. Pick one closest to what you want and the rest of the room follows.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {DOORS.map((d) => (
            <article key={d.image} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                <Image
                  src={d.image}
                  alt={`${d.name}: ${d.blurb}`}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition duration-[700ms] group-hover:scale-[1.03]"
                  quality={75}
                />
              </div>
              <div className="mt-5">
                <div className="font-couture text-base italic text-[var(--brand-builders-gold)] md:text-lg">
                  {d.family}
                </div>
                <h3 className="font-couture mt-2 text-3xl leading-tight text-[var(--brand-builders)] md:text-4xl">
                  {d.name}.
                </h3>
                <p className="mt-3 text-base leading-[1.65] text-[var(--muted-foreground)] md:text-lg">
                  {d.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NOTE / CTA */}
      <section className="border-y border-[var(--border)] bg-[var(--muted)]/40 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-end gap-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">A note on cost</div>
              <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
                Door style is one piece. Wood species and inset add up too.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
                Painted shaker runs less than stained walnut shaker. Inset doors take more time than full-overlay because each door is hand-fit to its opening. We&apos;ll walk you through the trade-offs at the showroom.
              </p>
            </div>
            <div className="flex flex-col gap-5 md:col-span-4 md:items-end">
              <Link
                href="/builders-corner/consultation"
                className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:text-[var(--brand-builders-gold)] md:text-lg"
              >
                Book a consultation
              </Link>
              <Link
                href="/builders-corner/showroom"
                className="font-couture inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
              >
                Touch the samples on the wall
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}
