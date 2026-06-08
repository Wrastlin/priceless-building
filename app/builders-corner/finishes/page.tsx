import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Paints, stains, and hardware · Builders Corner Cabinetry & Design",
  description:
    "Paint, stain, wood species, and hardware we work with. Final picks happen in person, with real samples in your hand.",
};

// HERO uses a high-res AI render. The finish-example grids below run at
// proof-tile size (4-col) where the 223px native install thumbnails are
// appropriate. Each image used exactly once across this page.
const HERO = "/real-photos/install-kitchen-walnut-marble.webp";

type FinishExample = { image: string; label: string; note: string };

const PAINT_EXAMPLES: FinishExample[] = [
  { image: "/real-photos/install-kitchen-white-open.webp", label: "Painted white", note: "All-white shaker, finished in our shop." },
  { image: "/real-photos/install-kitchen-modern-banquette.webp", label: "Painted white slab", note: "Flat slab fronts, painted, no hardware." },
  { image: "/real-photos/install-kitchen-galley-green-wall.webp", label: "Soft green accent", note: "Slate-green accent wall paired with painted cabinetry." },
];

const STAIN_EXAMPLES: FinishExample[] = [
  { image: "/real-photos/install-kitchen-walnut.webp", label: "Walnut shaker", note: "Stained walnut, white quartz, white subway tile." },
  { image: "/real-photos/install-kitchen-honey-oak.webp", label: "Honey oak", note: "Knotty light-oak shaker, warm and bright." },
  { image: "/real-photos/install-kitchen-hickory-galley.webp", label: "Hickory", note: "Knotty hickory top and bottom, cabin-modern." },
  { image: "/real-photos/install-kitchen-rustic-beam.webp", label: "Rustic stained", note: "Stained wood cabinetry with a reclaimed-wood vent shroud." },
];

const HARDWARE_EXAMPLES: FinishExample[] = [
  { image: "/real-photos/install-kitchen-walnut-slide-range.webp", label: "Bar pulls on walnut", note: "Walnut flat panel, brushed pulls, subway tile." },
  { image: "/real-photos/install-kitchen-island-globes.webp", label: "Globe pendants over island", note: "Two globe pendants, modern bar stools, quartz top." },
  { image: "/real-photos/install-kitchen-soapstone-island.webp", label: "Dark soapstone with stools", note: "Dark soapstone island, light-wood bar stools." },
  { image: "/real-photos/install-kitchen-floating-shelf-bowls.webp", label: "Open shelving", note: "Floating wood shelf with stacked black ceramic bowls." },
];

export default function FinishesPage() {
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/80 md:text-lg">
              Finishes · what paint, stain, and hardware look like on real cabinets
            </span>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden md:mt-14">
            <Image
              src={HERO}
              alt="Matte black cabinet pulls on a clean shaker drawer face. Representative of the finish-and-hardware combinations we build."
              fill
              priority
              className="object-cover"
              sizes="(min-width:1600px) 1600px, 100vw"
              quality={85}
            />
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-6 pb-20 md:mt-14 md:grid-cols-12 md:pb-28">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              Paint, stain, and hardware.
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                The combinations below all come from real Builders Corner installs. Real picks happen in person at the showroom with the actual samples in your hand.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link
                  href="/builders-corner/consultation"
                  className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
                >
                  Book a consultation
                </Link>
                <Link
                  href="/builders-corner/door-styles"
                  className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
                >
                  See door styles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAINT EXAMPLES */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <FinishSection
          label="Painted"
          headline="Painted, in our finish booth."
          intro="Sprayed in our Wausau shop and hand-sanded between coats. Bring an inspiration photo and we&apos;ll match or adapt."
          items={PAINT_EXAMPLES}
        />
      </section>

      {/* STAIN EXAMPLES */}
      <section className="border-y border-[var(--border)] bg-[var(--muted)]/40 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <FinishSection
            label="Wood species and stains"
            headline="White oak, walnut, hickory, knotty pine."
            intro="Most of the popular species. Stained, then top-coated. Matte for living spaces, satin for baths."
            items={STAIN_EXAMPLES}
          />
        </div>
      </section>

      {/* HARDWARE EXAMPLES */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <FinishSection
          label="Hardware and details"
          headline="Pulls, pendants, open shelving."
          intro="Brushed brass, matte black, polished nickel, oil-rubbed bronze. We can also order what you bring us."
          items={HARDWARE_EXAMPLES}
        />
        <p className="mt-14 max-w-2xl text-base leading-[1.7] text-[var(--muted-foreground)] md:text-lg">
          Everything here is a starting point. The final pick happens in person, with real samples in your hand.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Next step</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Come hold the samples. First visit is free.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
              Pick a few favorites from this page and we&apos;ll have them ready when you come in.
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
              Visit the showroom
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}

function FinishSection({
  label,
  headline,
  intro,
  items,
}: {
  label: string;
  headline: string;
  intro: string;
  items: FinishExample[];
}) {
  return (
    <>
      <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">{label}</div>
          <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
            {headline}
          </h2>
        </div>
        <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">{intro}</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <article key={it.image} className="group">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
              <Image
                src={it.image}
                alt={it.note}
                fill
                sizes="(min-width:1024px) 25vw, 50vw"
                className="object-cover transition duration-[700ms] group-hover:scale-[1.03]"
                quality={75}
              />
            </div>
            <div className="mt-4">
              <div className="font-couture text-2xl leading-tight text-[var(--brand-builders)]">{it.label}.</div>
              <div className="font-couture mt-2 text-base italic text-[var(--brand-builders-gold)]">{it.note}</div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
