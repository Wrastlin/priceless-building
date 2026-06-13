import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SectionHead } from "@/components/section-head";

interface FamilyCardSpec {
  href: string;
  logoBrand: "priceless" | "builders" | "four-squared";
  headline: string;
  body: string;
  tags: string[];
  cta: string;
  hero: { src: string; alt: string };
  thumbs: { src: string; alt: string }[];
}

const CARDS: FamilyCardSpec[] = [
  {
    href: "/builders-corner",
    logoBrand: "builders",
    headline: "Builders Corner.",
    body: "Premium custom cabinetry. Kitchens, baths, and built-ins designed in the showroom and built in our own shop in Wausau.",
    tags: ["Custom kitchens", "Custom baths", "Built-ins"],
    cta: "Read the Builders Corner story",
    hero: {
      src: "/real-photos/business/white-kitchen-marble-island.jpg",
      alt: "A custom Builders Corner kitchen with white cabinetry and a marble-top island.",
    },
    thumbs: [
      { src: "/real-photos/business/white-kitchen-wood-island.jpg", alt: "Custom white kitchen with a wood island." },
      { src: "/real-photos/business/dark-double-vanity-bathroom-install.jpg", alt: "Custom dark double-vanity bath install." },
      { src: "/real-photos/business/white-kitchen-rustic-island.jpg", alt: "White custom kitchen with a rustic wood island." },
    ],
  },
  {
    href: "/four-squared",
    logoBrand: "four-squared",
    headline: "Four Squared.",
    body: "The install crew. Demo, plumbing, electrical, tile, finish carpentry, start to final walkthrough. Installs cabinets from Builders Corner or anything you bring.",
    tags: ["Kitchen remodels", "Bath remodels", "Cabinet install", "Built-ins", "Tile + trim", "Doors + windows"],
    cta: "Meet the install crew",
    hero: {
      src: "/real-photos/business/kitchen-island-wood-cabinets-range.jpg",
      alt: "A finished kitchen install by the Four Squared crew: wood cabinets, large center island, gas range.",
    },
    thumbs: [
      { src: "/real-photos/business/dark-cabinet-kitchen-install.jpg", alt: "Dark-cabinet kitchen install by the crew." },
      { src: "/real-photos/business/wood-cabinets-granite-kitchen.jpg", alt: "Wood-cabinet kitchen with granite counters." },
      { src: "/real-photos/business/double-sink-bathroom-vanity-black.webp", alt: "Black double-vanity bath install with framed mirrors." },
    ],
  },
];

export function FamilyBand() {
  return (
    <section className="bg-[#0b1220] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          invert
          headline="The rest of the family."
          sub="Two more local brands across the parking lot. Use just one, or have all three work on the same project."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {CARDS.map((c) => (
            <FamilyCard key={c.href} card={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FamilyCard({ card }: { card: FamilyCardSpec }) {
  return (
    <Link
      href={card.href}
      data-reveal
      className="group flex flex-col overflow-hidden border border-white/10 bg-white transition hover:border-white/30"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--muted)]">
        <Image
          src={card.hero.src}
          alt={card.hero.alt}
          fill
          sizes="(min-width:768px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          quality={80}
        />
        <div className="absolute left-4 top-4 inline-flex items-center bg-white px-3 py-2 shadow-sm">
          <BrandLogo brand={card.logoBrand} size="sm" />
        </div>
      </div>

      {/* Thumb strip. Three more real install photos so the card reads
          as a collection rather than a single picture. */}
      <div className="grid grid-cols-3 gap-px bg-[var(--border)]">
        {card.thumbs.map((t) => (
          <div key={t.src} className="relative aspect-[4/3] bg-[var(--muted)]">
            <Image
              src={t.src}
              alt={t.alt}
              fill
              sizes="(min-width:768px) 17vw, 33vw"
              className="object-cover"
              quality={75}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl leading-snug text-[var(--foreground)] md:text-3xl">
          {card.headline}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
          {card.body}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {card.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--foreground)]"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="font-mono mt-5 inline-block text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">
          {card.cta} →
        </span>
      </div>
    </Link>
  );
}
