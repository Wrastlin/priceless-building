import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Real installs · Builders Corner Cabinetry & Design",
  description:
    "Real installed kitchens, baths, and doors from Builders Corner and Four Squared. Honest captions, real photos. 825 Washington Street, Wausau.",
};

// Real photos only. Each image used exactly once on this page.
// Captions describe what the photo shows; nothing fabricated.
type Project = {
  caption: string;
  scene: string;
  image: string;
  span?: "tall" | "wide" | "square";
};

const PROJECTS: Project[] = [
  { caption: "Walnut shaker with island and big windows", scene: "Kitchen", image: "/real-photos/install-kitchen-walnut-island-windows.webp", span: "wide" },
  { caption: "Walnut shaker with marble counter", scene: "Kitchen detail", image: "/real-photos/install-kitchen-walnut-marble.webp", span: "tall" },
  { caption: "White shaker with island and sage wall", scene: "Kitchen", image: "/real-photos/install-kitchen-white-open.webp" },
  { caption: "Modern white with built-in banquette", scene: "Kitchen", image: "/real-photos/install-kitchen-modern-banquette.webp", span: "square" },
  { caption: "Walnut with bar seating and quartz", scene: "Kitchen", image: "/real-photos/install-kitchen-walnut-island-bar.webp" },
  { caption: "Honey-oak shaker with white quartz", scene: "Kitchen", image: "/real-photos/install-kitchen-honey-oak.webp", span: "wide" },
  { caption: "Walnut subway-tile backsplash and open shelving", scene: "Kitchen", image: "/real-photos/install-kitchen-walnut.webp", span: "tall" },
  { caption: "Globes pendant island, white cabinetry", scene: "Kitchen", image: "/real-photos/install-kitchen-island-globes.webp" },
  { caption: "Walnut flat-panel with slide-in range", scene: "Kitchen", image: "/real-photos/install-kitchen-walnut-slide-range.webp", span: "square" },
  { caption: "Rustic kitchen with reclaimed-wood vent shroud", scene: "Kitchen", image: "/real-photos/install-kitchen-rustic-beam.webp" },
  { caption: "Galley kitchen with slate-green accent wall", scene: "Kitchen", image: "/real-photos/install-kitchen-galley-green-wall.webp", span: "tall" },
  { caption: "Hickory cabin-modern galley", scene: "Kitchen", image: "/real-photos/install-kitchen-hickory-galley.webp" },
  { caption: "Dark soapstone island, light-wood stools", scene: "Kitchen detail", image: "/real-photos/install-kitchen-soapstone-island.webp", span: "wide" },
  { caption: "Floating shelf with stacked black bowls", scene: "Kitchen detail", image: "/real-photos/install-kitchen-floating-shelf-bowls.webp" },
  { caption: "Shaker vanity with butcher-block top", scene: "Bath", image: "/real-photos/install-bathroom-shaker.webp", span: "tall" },
  { caption: "Blue subway-tile shower with frameless glass", scene: "Bath", image: "/real-photos/install-bathroom-blue-tile-shower.webp" },
  { caption: "Yellow walls with green subway wainscot", scene: "Bath", image: "/real-photos/install-bathroom-yellow-green-tile.webp", span: "square" },
  { caption: "Same yellow bath, framed butterflies", scene: "Bath", image: "/real-photos/install-bathroom-yellow-butterflies.webp" },
  { caption: "Peggy&apos;s dark teal front entry door", scene: "Exterior", image: "/real-photos/install-blue-door-peggy.webp" },
  { caption: "White-framed French exterior entry", scene: "Exterior", image: "/real-photos/install-french-doors-exterior.webp", span: "wide" },
  { caption: "Arched mahogany craftsman entry with sidelights", scene: "Exterior", image: "/real-photos/install-door-arched-mahogany.webp", span: "tall" },
  { caption: "Yellow stucco home with arched front entry", scene: "Exterior", image: "/real-photos/install-home-stucco-arched.webp" },
  { caption: "Fresh grey LVP flooring, open concept", scene: "Flooring", image: "/real-photos/install-floor-grey-lvp.webp" },
];

function GStat({ n, label, sub }: { n: string; label: string; sub?: string }) {
  return (
    <div className="border-l border-white/15 pl-5">
      <div className="font-couture flex items-baseline gap-2 leading-none">
        <span className="text-5xl text-white">{n}</span>
        {sub ? <span className="text-sm italic text-white/65">{sub}</span> : null}
      </div>
      <div className="mt-3 max-w-[18ch] text-base italic text-white/70">{label}</div>
    </div>
  );
}

function spanClass(span?: Project["span"]) {
  if (span === "tall") return "row-span-2 aspect-[3/4]";
  if (span === "wide") return "col-span-2 aspect-[16/10]";
  if (span === "square") return "aspect-square";
  return "aspect-[4/3]";
}

export default function GalleryPage() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO */}
      <section className="bg-[var(--brand-builders)] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/85 md:text-lg">
              Real installs · Builders Corner and Four Squared
            </span>
            <span className="hidden font-couture text-xs uppercase tracking-[0.28em] text-white/55 md:inline">
              Wausau, Wisconsin
            </span>
          </div>
          <div className="grid gap-x-12 gap-y-10 py-12 md:grid-cols-12 md:py-16">
            <div className="md:col-span-8">
              <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:text-6xl">
                Real photos from completed projects.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-[1.7] text-white/90 md:text-lg">
                Every image below is a real Builders Corner / Four Squared install. Small file sizes on some come from the original posts; we are working on getting higher-res shots from the homeowners.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link
                  href="/builders-corner/consultation"
                  className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
                >
                  Start a design
                </Link>
                <Link
                  href="/builders-corner/process"
                  className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
                >
                  How it works
                </Link>
              </div>
            </div>
            <aside className="md:col-span-4 md:pt-3">
              <div className="font-couture text-xl italic text-[var(--brand-builders-gold)] md:text-2xl">Real facts</div>
              <dl className="mt-6 space-y-6">
                <GStat n="1978" label="Price-Less Building Center founded" />
                <GStat n="1983" label="Builders Corner cabinet shop opened" />
                <GStat n="825" label="Washington Street, Wausau" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Price-Less+Building+Center+825+Washington+St+Wausau+WI"
                  target="_blank"
                  rel="noreferrer"
                  className="group block border-l border-white/15 pl-5"
                  aria-label="Read all 9 Google reviews"
                >
                  <div className="text-2xl text-[#f5a524]" aria-hidden>★★★★★</div>
                  <div className="mt-3 text-sm uppercase tracking-[0.16em] text-white/65 transition group-hover:text-white">
                    4.8 on Google · 9 reviews →
                  </div>
                </a>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* MASONRY. Real install photos with honest captions. */}
      <section className="mx-auto max-w-[1600px] px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto mb-12 max-w-7xl md:mb-16">
          <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">
                Recent installs
              </div>
              <h2 className="font-couture mt-5 text-5xl leading-[1.05] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
                Kitchens, baths, and doors.
              </h2>
            </div>
            <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">
              Each caption describes what the photo shows. Nothing fabricated.
            </p>
          </div>
        </div>
        <div className="grid auto-rows-[200px] grid-cols-2 gap-2 md:auto-rows-[240px] md:grid-cols-4 md:gap-3">
          {PROJECTS.map((p, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <figure
                key={p.image}
                className={"group relative overflow-hidden bg-black " + spanClass(p.span)}
              >
                <Image
                  src={p.image}
                  alt={p.caption}
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  className="object-cover transition duration-[900ms] group-hover:scale-[1.03]"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className="font-couture absolute right-4 top-4 text-xs uppercase tracking-[0.28em] text-white/65">
                  No. {num}
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="font-couture text-base italic text-[var(--brand-builders-gold)]">
                    {p.scene}
                  </div>
                  <div className="font-couture mt-2 text-xl leading-tight">
                    {p.caption.replace(/&apos;/g, "’")}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--muted)]/40 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Next step</div>
          <h2 className="font-couture mt-5 text-5xl leading-[1.05] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
            Come walk the showroom.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
            We&apos;ll pull doors, finishes, and stone samples in whatever direction you&apos;re leaning.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
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
              Browse kitchen styles
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}
