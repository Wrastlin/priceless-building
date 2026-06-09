import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/section-head";

/**
 * Before/after install pair on a dark anchor band so the kitchen
 * photos read like a portfolio spread.
 */
export function BeforeAfterBand() {
  return (
    <section className="bg-[#0b1220] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          invert
          headline="Before and after."
          link={{ href: "/four-squared", label: "Meet the install crew" }}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <figure>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0b1220]">
              <Image
                src="/real-photos/install-kitchen-white-open.webp"
                alt="A finished real kitchen install: white shaker cabinetry, island, vent hood, LVP floor."
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline gap-2 text-sm">
              <span className="font-semibold uppercase tracking-[0.14em] text-[#ff8b85]">
                After
              </span>
              <span className="text-white/85">
                Finished install by the Four Squared crew.
              </span>
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0b1220]">
              <Image
                src="/real-photos/install-before-kitchen.webp"
                alt="A Wausau kitchen mid-install: white shaker uppers in, kraft paper on the counters, painter's tape edging the floor."
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline gap-2 text-sm">
              <span className="font-semibold uppercase tracking-[0.14em] text-white/80">
                Mid-install
              </span>
              <span className="text-white/85">
                Paper down, tape up, new shaker uppers going in.
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="text-sm text-white/85">
            The surplus floor changes often. Come walk it any day we are open.
          </div>
          <Link href="/shop" className="btn btn-priceless">
            Shop all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
