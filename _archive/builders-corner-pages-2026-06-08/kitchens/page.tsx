import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Box,
  Sparkles,
  PaintBucket,
  Hammer,
  Ruler,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Custom kitchens · Builders Corner Cabinetry & Design",
  description:
    "Custom kitchen cabinets built in our Wausau shop. Real installs and door styles to start from. Come look at samples at 825 Washington Street.",
};

// HERO uses a high-res AI render (1376x768); the grid below uses real
// install thumbnails at proof-tile size where the 223px native resolution
// is appropriate. Each image used exactly once on this page.
const HERO = "/real-photos/install-kitchen-walnut.webp";

type Tile = {
  caption: string;
  blurb: string;
  image: string;
};

const REAL_INSTALLS: Tile[] = [
  {
    caption: "Walnut shaker with marble counter",
    blurb: "Dark walnut shaker fronts, white veined-marble counter, matte black gooseneck faucet.",
    image: "/real-photos/install-kitchen-walnut-marble.webp",
  },
  {
    caption: "Walnut with slide-in range",
    blurb: "Walnut flat-panel cabinetry, stainless slide-in gas range, white subway tile backsplash.",
    image: "/real-photos/install-kitchen-walnut-slide-range.webp",
  },
  {
    caption: "White shaker with island",
    blurb: "All-white shaker, island with range hood, LVP wood floor, sage green accent wall.",
    image: "/real-photos/install-kitchen-white-open.webp",
  },
  {
    caption: "Island with globe pendants",
    blurb: "White cabinetry, big quartz island, two globe pendants, modern bar stools.",
    image: "/real-photos/install-kitchen-island-globes.webp",
  },
  {
    caption: "Modern white with banquette",
    blurb: "All-white slab cabinets, built-in banquette under the window, pendant lights, light wood floor.",
    image: "/real-photos/install-kitchen-modern-banquette.webp",
  },
  {
    caption: "Galley with green accent wall",
    blurb: "Two-tone galley: light-wood lower cabinets, white quartz, slate-green wall around the window.",
    image: "/real-photos/install-kitchen-galley-green-wall.webp",
  },
  {
    caption: "Hickory cabin-modern",
    blurb: "Knotty hickory cabinets top and bottom, white quartz, stainless French-door fridge, slide-in range.",
    image: "/real-photos/install-kitchen-hickory-galley.webp",
  },
  {
    caption: "Honey-oak shaker",
    blurb: "Knotty light-oak shaker, white quartz, stainless slide-in gas range, LVP floor.",
    image: "/real-photos/install-kitchen-honey-oak.webp",
  },
  {
    caption: "Rustic with reclaimed beam",
    blurb: "Rustic wood cabinetry, exposed ceiling beam, oversized vent hood with reclaimed-wood shroud, gas range.",
    image: "/real-photos/install-kitchen-rustic-beam.webp",
  },
  {
    caption: "Walnut with bar seating",
    blurb: "Wider angle of a walnut island and slide-in range, white quartz top, LVP wood floor.",
    image: "/real-photos/install-kitchen-walnut-island-bar.webp",
  },
  {
    caption: "Dark soapstone island",
    blurb: "Dark soapstone island top, dark-stained shaker base, two light-wood bar stools.",
    image: "/real-photos/install-kitchen-soapstone-island.webp",
  },
  {
    caption: "Floating shelf detail",
    blurb: "Floating wood shelf, stacked black ceramic bowls, white tile backsplash, vase of greenery.",
    image: "/real-photos/install-kitchen-floating-shelf-bowls.webp",
  },
];

const INCLUDED = [
  {
    icon: <Box className="size-5" />,
    title: "Plywood boxes",
    body: "3/4-inch plywood cabinet boxes, dovetail drawers, full-extension undermount glides.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Soft-close",
    body: "Soft-close hinges and drawer glides on every door and drawer.",
  },
  {
    icon: <PaintBucket className="size-5" />,
    title: "Doors finished in our shop",
    body: "Paint and stain sprayed in our finish booth in Wausau, hand-sanded between coats.",
  },
  {
    icon: <Ruler className="size-5" />,
    title: "Field measure and drawings",
    body: "We measure your room and draw it up before anything is built. You see the layout before you sign off.",
  },
  {
    icon: <Hammer className="size-5" />,
    title: "Install by Four Squared",
    body: "The install crew is Four Squared, run by Josh. Same phone number, (715) 848-3855.",
  },
];

export default function KitchensPage() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO. Real installed walnut kitchen with island and big windows. */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/85 md:text-lg">
              Kitchens · twelve real installs to walk through
            </span>
            <span className="hidden font-couture text-xs uppercase tracking-[0.28em] text-white/55 md:inline">
              Builders Corner · Wausau
            </span>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden md:mt-14">
            <Image
              src={HERO}
              alt="A white-oak shaker kitchen with island, white quartz, and pendants. Representative of Builders Corner kitchen work."
              fill
              priority
              className="object-cover"
              sizes="(min-width:1600px) 1600px, 100vw"
              quality={85}
            />
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-6 pb-20 md:mt-14 md:grid-cols-12 md:pb-28">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              Custom kitchens, built in our Wausau shop.
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                Below are real installs. Pick the one closest to what you want, bring photos of your room, and we&apos;ll draw it up.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link href="/builders-corner/consultation" className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg">
                  Start a design
                </Link>
                <Link href="/builders-corner/gallery" className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg">
                  Full gallery
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-12">
            <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">On every kitchen</div>
            <ul className="mt-6 grid grid-cols-1 gap-y-4 text-base text-white/85 sm:grid-cols-2 md:text-lg lg:grid-cols-3">
              <li>· 3/4-inch plywood boxes</li>
              <li>· Soft-close hinges and glides</li>
              <li>· Doors finished in our shop</li>
              <li>· Field measure and drawings</li>
              <li>· Install by Four Squared</li>
              <li>· Walkthrough before final payment</li>
            </ul>
          </div>
        </div>
      </section>

      {/* REAL INSTALLS GRID. Twelve real kitchen photos with descriptive
          (not branded) captions. */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Real installs</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Twelve completed kitchens.
            </h2>
          </div>
          <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">
            Pull the page up at the showroom, point at one, and we&apos;ll pull samples to match.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_INSTALLS.map((s, i) => (
            <article key={s.image} className="group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <Image
                  src={s.image}
                  alt={s.blurb}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition duration-[900ms] group-hover:scale-[1.03]"
                  quality={75}
                />
              </div>
              <div className="mt-5">
                <div className="flex items-baseline gap-4">
                  <span className="font-couture text-xs uppercase tracking-[0.28em] text-[var(--brand-builders-gold)]/70">
                    Install {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-[var(--brand-builders)]/15" aria-hidden />
                </div>
                <h3 className="font-couture mt-3 text-2xl leading-tight text-[var(--brand-builders)] md:text-3xl">{s.caption}.</h3>
                <p className="mt-3 text-base leading-[1.65] text-[var(--muted-foreground)] md:text-lg">{s.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="border-y border-[var(--border)] bg-[var(--muted)]/40 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">On every kitchen</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              What comes standard.
            </h2>
          </div>

          <ol className="mt-14 divide-y divide-[var(--brand-builders)]/15 border-t border-b border-[var(--brand-builders)]/15">
            {INCLUDED.map((i, idx) => (
              <li key={i.title} className="grid items-baseline gap-x-10 gap-y-3 py-8 md:grid-cols-12">
                <div className="font-couture text-3xl text-[var(--brand-builders-gold)] md:col-span-2 md:text-4xl">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="font-couture text-3xl leading-tight text-[var(--brand-builders)] md:col-span-3 md:text-4xl">{i.title}</h3>
                <p className="max-w-2xl text-lg leading-[1.65] text-[var(--muted-foreground)] md:col-span-7 md:text-xl">{i.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Next step</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Bring photos. Bring a budget. Bring whatever you have.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
              About an hour at the showroom. We hand you samples and follow up with a written estimate.
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
              href="/builders-corner/process"
              className="font-couture inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              See our full process
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}
