import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/section-head";

const CARDS = [
  {
    src: "/real-photos/storefront-sign-on-brick.webp",
    alt: "Hand-painted Price-Less sign on the brick exterior",
    t: "The inventory",
    b: "Brand-new in-the-box stock from cancelled contractor orders, mis-shipments, and factory overstock. Same brands as the big-box stores.",
  },
  {
    src: "/real-photos/storefront-signage.webp",
    alt: "Storefront sign with everyday pricing",
    t: "The pricing",
    b: "Every tag shows our price next to current retail at Home Depot, Lowe's, or Menards. Bring your phone and check.",
  },
  {
    src: "/real-photos/building-exterior.webp",
    alt: "825 Washington Street, Wausau",
    t: "Where to find us",
    b: "825 Washington Street, Wausau. In the same building since 1978. Open Monday through Saturday.",
  },
];

/**
 * Three image cards that frame what a first visit looks like. Plain
 * full-sentence copy, no choppy fragments.
 */
export function WhatToExpectBand() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          headline="A few things worth knowing before you visit."
          sub="We have built this place to be welcoming to anyone looking to liven up their home, at any price range. Here is what is actually going on inside the warehouse."
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <li
              key={c.t}
              data-reveal
              data-reveal-delay={(i * 0.06).toFixed(2)}
              className="overflow-hidden border border-[var(--border)] bg-white"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl leading-snug">{c.t}</h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
                  {c.b}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 border-t border-[var(--border)] pt-10">
          <Link href="/shop" className="btn btn-priceless">
            Shop everything →
          </Link>
          <Link
            href="/reviews"
            className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg"
          >
            Read our 9 Google reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
