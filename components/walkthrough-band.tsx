import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/section-head";

const STEPS = [
  {
    n: "01",
    t: "Take a photo.",
    b: "Wall, room, doorway, or the front of the house. Anything we can build around.",
    img: "/real-photos/business/decorative-bath-vanity-sinks.jpg",
    imgAlt: "Decorative blue-and-white patterned sinks with polished gold faucets on a dark wood vanity at Price-Less.",
  },
  {
    n: "02",
    t: "Pick what you want.",
    b: "Door, window, vanity, cabinet, siding, shelf, trim. Pulled from what is actually on the floor.",
    img: "/real-photos/business/copper-sink-wood-counter-display.jpg",
    imgAlt: "A hammered copper vessel sink with an oil-rubbed bronze faucet on a butcher-block counter at Price-Less.",
  },
  {
    n: "03",
    t: "Choose colors with us.",
    b: "Real swatches, side by side, before anything renders.",
    img: "/real-photos/business/paint-stain-caulk-inventory-shelves.webp",
    imgAlt: "Shelves of paint and stain at the Price-Less paint station.",
  },
  {
    n: "04",
    t: "See it in the photo.",
    b: "A full render placed back into the picture you took.",
    img: "/real-photos/business/kitchen-remodel-before-after.jpg",
    imgAlt: "A before-and-after split image of a remodeled kitchen.",
  },
  {
    n: "05",
    t: "Get the price.",
    b: "Items we actually carry, with the cost next to each one.",
    img: "/real-photos/business/customer-thank-you-note.jpg",
    imgAlt: "A customer thank-you note left on a finished install.",
  },
];

/**
 * Five-step walkthrough as a row of real-photo cards. Replaces the
 * separate what-to-expect band that sat above it. Each step shows a
 * real photo that maps to that step, so the page feels visual instead
 * of text-heavy. Mural sits at the bottom as the section's anchor
 * photo since the old "where to find us" card lived here.
 */
export function WalkthroughBand() {
  return (
    <section id="design-walkthrough" className="bg-[var(--muted)] scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <SectionHead
          headline="See it in your home before you buy."
          sub="A walkthrough we are putting together. Photo of your space, the pieces you want, the colors, a render in the same photo, real pricing."
        />

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              data-reveal
              data-reveal-delay={(i * 0.06).toFixed(2)}
              className="flex flex-col overflow-hidden border border-[var(--border)] bg-white"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src={s.img}
                  alt={s.imgAlt}
                  fill
                  sizes="(min-width:1024px) 20vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                  quality={78}
                />
                <span className="font-display absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center bg-white text-base text-[var(--brand-priceless)] shadow-sm">
                  {s.n}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl leading-snug">{s.t}</h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--foreground)]">
                  {s.b}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Where-to-find anchor. Full mural image since the old
            text-only "Where to find us" card was the weak link. */}
        <div className="mt-10 overflow-hidden border border-[var(--border)] bg-white">
          <div className="relative w-full overflow-hidden bg-[var(--muted)]">
            <Image
              src="/real-photos/business/exterior-mural-build-your-future.webp"
              alt="Build Your Future mural wrapping the Price-Less Building Center at 825 Washington Street, Wausau."
              width={2400}
              height={1200}
              loading="lazy"
              sizes="100vw"
              className="block h-auto w-full object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
            <div>
              <div className="font-display text-xl">825 Washington Street, Wausau.</div>
              <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                Same building since 1978. Open Monday through Saturday.
              </div>
            </div>
            <Link href="/contact" className="btn btn-priceless">
              See our store →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
