import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ADDRESS, PRICELESS } from "@/lib/brands";

const HERO = "/real-photos/mural-wide.webp";
const FLOOR = "/real-photos/business/dark-base-cabinets-warehouse-row.jpg";
const JOSH = "/real-photos/josh-nickel.png";

export const metadata = {
  title: "About · Price-Less Building Center",
  description:
    "Price-Less Building Center in Wausau, WI: discount and surplus building materials since 1978. Owned by Josh Nickel. Same building on Washington Street, three brands under one roof.",
};

/**
 * Tight about page: hero, short history, Josh, visit closer.
 */
export default function AboutPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="bg-white">
        <div className="relative h-[52svh] w-full overflow-hidden md:h-[58svh]">
          <Image
            src={HERO}
            alt="The Build Your Future mural on the Price-Less warehouse wall in Wausau"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover object-[center_40%]"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(20,18,18,0.35), rgba(20,18,18,0.45) 55%, rgba(20,18,18,0.7))",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <p
              className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-white/90"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,.5)" }}
            >
              Price-Less Building Center
            </p>
            <h1
              className="font-display max-w-[14ch] text-[clamp(2.4rem,1rem+4.5vw,4.6rem)] leading-[1.02]"
              style={{ textShadow: "0 2px 22px rgba(0,0,0,.45)" }}
            >
              <span className="font-semibold">A weekend venture</span>{" "}
              <span className="font-normal italic">that never closed.</span>
            </h1>
            <p
              className="mt-5 max-w-[34ch] text-base font-light leading-relaxed text-white/90"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,.45)" }}
            >
              Surplus building materials on Washington Street since {PRICELESS.founded}.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2 md:gap-14 md:py-20">
          <div>
            <div className="eyebrow">Since {PRICELESS.founded}</div>
            <h2 className="font-display mt-3 text-[clamp(1.85rem,1rem+2.2vw,2.75rem)] leading-[1.08]">
              Same building.{" "}
              <span className="font-normal italic">Same idea.</span>
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-[var(--ink)] md:text-lg">
              Price-Less started in {PRICELESS.founded} as a weekend operation selling cancelled-order and surplus materials. It went full-time in 1982. Builders Corner, the cabinet shop, opened in 1983.
            </p>
            <p className="mt-4 text-base font-light leading-relaxed text-[var(--soft)] md:text-lg">
              Today three brands share {ADDRESS.street}: Price-Less on the warehouse floor, Builders Corner for custom kitchens and baths, and 4 Squared for the install. Walk in for a door, leave with a designer&apos;s number if you want one.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/shop" className="btn btn-priceless">
                Shop the floor
              </Link>
              <Link
                href="/builders-corner"
                className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-[var(--ink)] underline decoration-[var(--ink)]/30 underline-offset-[6px] hover:decoration-[var(--ink)]"
              >
                Builders Corner ›
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--cream)]">
            <Image
              src={FLOOR}
              alt="Surplus cabinet inventory on the Price-Less warehouse floor"
              fill
              sizes="(min-width:768px) 45vw, 100vw"
              quality={80}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* JOSH */}
      <section className="bg-[var(--taupe)]">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-12 md:gap-12 md:py-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--cream)] md:col-span-5">
            <Image
              src={JOSH}
              alt={`${PRICELESS.owner}, who runs Price-Less, Builders Corner, and 4 Squared`}
              fill
              sizes="(min-width:768px) 40vw, 100vw"
              quality={80}
              className="object-cover object-top"
            />
          </div>
          <div className="md:col-span-7">
            <div className="eyebrow">Today</div>
            <h2 className="font-display mt-3 text-[clamp(1.85rem,1rem+2.2vw,2.75rem)] leading-[1.08]">
              Meet {PRICELESS.owner}.
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-[var(--ink)] md:text-lg">
              Josh has run Price-Less since {PRICELESS.ownerSince}. He is behind all three brands at {ADDRESS.street}: the warehouse floor, the Builders Corner shop, and the 4 Squared install crew he leads with Ty.
            </p>
            <p className="mt-4 text-base font-light leading-relaxed text-[var(--soft)] md:text-lg">
              Most customers meet whoever is on the floor that day. The fastest way to meet the people here is to come walk the warehouse on a Wednesday.
            </p>
            <blockquote className="mt-8 border-l-2 border-[var(--rust)] pl-5">
              <p className="font-display text-xl font-normal italic leading-snug text-[var(--ink)] md:text-2xl">
                &ldquo;It takes a village to make small businesses successful. We couldn&apos;t do it without you. We look forward to serving the Wausau and surrounding areas.&rdquo;
              </p>
              <footer className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
                From the owners&apos; year-end letter, December 2022
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section className="border-t border-[var(--line)] bg-[var(--cream)]">
        <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-6 px-5 py-10 sm:px-8 sm:py-12 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl leading-tight md:text-3xl">
              Come walk the warehouse.
            </h2>
            <p className="mt-2 text-base font-light text-[var(--soft)]">
              {ADDRESS.street}, {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
              {" · "}
              <a
                href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
                className="text-[var(--ink)] underline decoration-[var(--ink)]/25 underline-offset-4 hover:decoration-[var(--ink)]"
              >
                {ADDRESS.phone}
              </a>
              {" · "}
              Mon–Sat
            </p>
          </div>
          <Link href="/contact" className="btn btn-outline shrink-0">
            Hours &amp; directions ›
          </Link>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
