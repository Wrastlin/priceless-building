import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Droplets, Sparkles, Ruler, Sun, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom baths · Builders Corner Cabinetry & Design",
  description:
    "Real installed bathrooms. Vanities, showers, tile. Designed at Builders Corner, installed by Four Squared. 825 Washington Street, Wausau.",
};

// HERO uses a high-res AI render (1200x896). Real install thumbnails
// below are used at proof-tile size where their 223px native resolution
// is appropriate.
const HERO = "/real-photos/install-bathroom-shaker.webp";

// Real installed bath photos from completed Builders Corner / Four Squared
// projects. Each image used exactly once on this page.
type Tile = { caption: string; blurb: string; image: string };

const REAL_INSTALLS: Tile[] = [
  {
    caption: "Blue subway-tile shower",
    blurb: "Vertical deep-blue subway tile, frameless sliding glass door, marble pebble shower pan, blue bird wall art.",
    image: "/real-photos/install-bathroom-blue-tile-shower.webp",
  },
  {
    caption: "Warm traditional with green tile",
    blurb: "Sunny yellow walls, dark green subway-tile wainscot, dark-stained oak vanity with black soapstone top, oil-rubbed bronze sconces.",
    image: "/real-photos/install-bathroom-yellow-green-tile.webp",
  },
  {
    caption: "Yellow with framed butterflies",
    blurb: "Same project, different angle: green tile half-wall, framed butterfly prints on the yellow wall, sage towel.",
    image: "/real-photos/install-bathroom-yellow-butterflies.webp",
  },
];

const INCLUDED = [
  {
    icon: <Droplets className="size-5" />,
    title: "Plumbing fixtures",
    body: "We carry fixtures from the same manufacturers the big stores stock. Pick from what&apos;s on the wall or we can order in.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Quartz or stone tops",
    body: "Templated after the vanity is set, then fabricated and installed.",
  },
  {
    icon: <Sun className="size-5" />,
    title: "Heated floors if you want them",
    body: "Electric in-floor heat under tile. Easy add at the design stage.",
  },
  {
    icon: <Ruler className="size-5" />,
    title: "Accessible layouts",
    body: "Comfort-height vanities, wider clear floor space, curbless showers. Available on any bath, not just aging-in-place.",
  },
  {
    icon: <Wrench className="size-5" />,
    title: "Install by Four Squared",
    body: "Same crew from demo through punch list. (715) 848-3855.",
  },
];

export default function BathsPage() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO. Real installed shaker bathroom with butcher-block vanity. */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/85 md:text-lg">
              Baths · real installs, vanities, showers, tile
            </span>
            <span className="hidden font-couture text-xs uppercase tracking-[0.28em] text-white/55 md:inline">
              Builders Corner · Wausau
            </span>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden md:mt-14">
            <Image
              src={HERO}
              alt="A representative white shaker vanity with quartz top and brushed pulls. The kind of bath Builders Corner designs."
              fill
              priority
              className="object-cover"
              sizes="(min-width:1600px) 1600px, 100vw"
              quality={85}
            />
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-6 pb-20 md:mt-14 md:grid-cols-12 md:pb-28">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              Bathrooms, designed and installed.
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                Vanities and tile by Builders Corner. Plumbing, waterproofing, and install by Four Squared. Same phone number for both.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link href="/builders-corner/consultation" className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg">
                  Start a bath design
                </Link>
                <Link href="/builders-corner/gallery" className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg">
                  Full gallery
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-12">
            <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">On every bath</div>
            <ul className="mt-6 grid grid-cols-1 gap-y-4 text-base text-white/85 sm:grid-cols-2 md:text-lg lg:grid-cols-3">
              <li>· Quartz or stone tops</li>
              <li>· Heated floors if you want them</li>
              <li>· Accessible layouts available</li>
              <li>· Tile and plumbing in-house</li>
              <li>· Install by Four Squared</li>
              <li>· Walkthrough before final payment</li>
            </ul>
          </div>
        </div>
      </section>

      {/* REAL INSTALLS GRID. Three real photos with honest captions. */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Real installs</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              From recent baths.
            </h2>
          </div>
          <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">
            More baths are queued up as we get permission to post them. For now: a few real ones.
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
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">On every bath</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              What comes standard.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
              Tile&apos;s the easy part. The drainage and the venting are where it matters.
            </p>
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
              Tell us the room. We&apos;ll quote it.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
              Bring photos and a wish list. We&apos;ll come back with a written number and a timeline.
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
              href="/builders-corner/kitchens"
              className="font-couture inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              Doing the kitchen too?
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}
