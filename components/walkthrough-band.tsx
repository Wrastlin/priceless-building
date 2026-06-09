import Image from "next/image";
import { SectionHead } from "@/components/section-head";

const STEPS = [
  { n: "01", t: "Take a photo.", b: "Wall, room, doorway, or the front of the house." },
  { n: "02", t: "Pick what you want.", b: "Door, window, vanity, cabinet, siding, shelf, trim." },
  { n: "03", t: "Choose colors with us.", b: "Real swatches, side by side, before anything renders." },
  { n: "04", t: "See it in the photo.", b: "A full render placed into the picture you took." },
  { n: "05", t: "Get the price.", b: "Items we actually carry, with the cost next to each one." },
];

/**
 * Five-step walkthrough explainer for the upcoming visualization
 * process. Light band so step text is comfortable to read. The closing
 * brand-statement band sits right after for the dark-vs-light contrast.
 */
export function WalkthroughBand() {
  return (
    <section id="design-walkthrough" className="bg-[var(--muted)] scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          headline="See it in your home before you buy it."
          sub="A walkthrough we are putting together. Photo of your space, the pieces you want, the colors, a render in the same photo, real pricing."
        />

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-14">
          <ol className="md:col-span-7">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                data-reveal
                data-reveal-delay={(i * 0.06).toFixed(2)}
                className="grid grid-cols-[56px_1fr] items-start gap-x-5 border-b border-[var(--border)] py-5 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[80px_1fr] md:gap-x-8 md:py-6"
              >
                <div className="font-display text-3xl leading-none text-[var(--brand-priceless)] md:text-4xl">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-display text-xl leading-snug md:text-2xl">{s.t}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-[var(--foreground)]">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="md:col-span-5" data-reveal data-reveal-delay="0.12">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
              <Image
                src="/real-photos/install-kitchen-walnut-island-windows.webp"
                alt="A finished walnut kitchen install."
                fill
                sizes="(min-width:768px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
              A finished install. The walkthrough lets you preview something like this in your own room first.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
