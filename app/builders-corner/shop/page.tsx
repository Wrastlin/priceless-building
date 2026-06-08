import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { byBrand } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Showroom inventory · Builders Corner Cabinetry & Design",
  description:
    "Pieces ready to pick up at the Wausau showroom: slab remnants, display cabinets, one-off vanities. (715) 848-3855.",
};

// HERO uses a high-res AI countertop render (1376x768). The EXAMPLES grid
// below (3-col) keeps the real install thumbnails at proof-tile size where
// their 223px native resolution is fine. Each image used exactly once.
const HERO = "/real-photos/store-interior-doors.webp";

const EXAMPLES = [
  {
    name: "Walnut shaker kitchen",
    img: "/real-photos/install-kitchen-walnut-marble.webp",
    blurb: "Dark walnut shaker, marble counter, matte black gooseneck.",
  },
  {
    name: "White shaker with sage wall",
    img: "/real-photos/install-kitchen-white-open.webp",
    blurb: "All-white shaker with island and range hood.",
  },
  {
    name: "Modern white slab kitchen",
    img: "/real-photos/install-kitchen-modern-banquette.webp",
    blurb: "Flat slab fronts, built-in banquette under the window.",
  },
  {
    name: "Shaker vanity bath",
    img: "/real-photos/install-bathroom-shaker.webp",
    blurb: "Shaker vanity with butcher-block top and floating shelves.",
  },
  {
    name: "Honey-oak shaker kitchen",
    img: "/real-photos/install-kitchen-honey-oak.webp",
    blurb: "Knotty light-oak shaker, white quartz, stainless slide-in range.",
  },
  {
    name: "Hickory cabin-modern galley",
    img: "/real-photos/install-kitchen-hickory-galley.webp",
    blurb: "Knotty hickory top and bottom, white quartz, cabin-modern.",
  },
];

export default function BuildersShop() {
  const showroom = byBrand("builders");
  return (
    <>
      <SiteHeader brand="builders" />

      {/* HERO. Real walnut kitchen with island and bar seating. */}
      <section className="bg-[#0b1729] text-white">
        <div className="mx-auto max-w-[1600px] px-6 pt-10 md:px-12 md:pt-14">
          <div className="border-b border-white/15 pb-7">
            <span className="font-couture text-base italic text-white/80 md:text-lg">
              Showroom inventory · pieces ready to pick up
            </span>
          </div>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden md:mt-14">
            <Image
              src={HERO}
              alt="A countertop slab on display, representative of the remnants and showroom pieces ready to pick up."
              fill
              priority
              className="object-cover"
              sizes="(min-width:1600px) 1600px, 100vw"
              quality={85}
            />
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-6 pb-20 md:mt-14 md:grid-cols-12 md:pb-28">
            <h1 className="font-couture text-5xl leading-[1.05] tracking-[-0.02em] text-white md:col-span-7 md:text-6xl">
              Pieces in the showroom you can take home today.
            </h1>
            <div className="md:col-span-5 md:pt-3">
              <p className="max-w-md text-base leading-[1.7] text-white/90 md:text-lg">
                Custom work is always custom. But if you&apos;re after a remnant slab, a display vanity, or a one-off cabinet, there&apos;s usually something on the floor.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link
                  href="/builders-corner/consultation"
                  className="font-couture inline-block border-b-2 border-[var(--brand-builders-gold)] pb-1.5 text-base italic text-white transition hover:text-[var(--brand-builders-gold)] md:text-lg"
                >
                  Start a custom design
                </Link>
                <Link
                  href="/builders-corner/build-your-kitchen"
                  className="font-couture inline-block border-b border-white/30 pb-1.5 text-base italic text-white/85 transition hover:border-white hover:text-white md:text-lg"
                >
                  Build your kitchen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLES OF CUSTOM WORK. No fabricated price floors. */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">For reference</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              A few real customs.
            </h2>
          </div>
          <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">
            Pricing is by project. Door style, wood species, finish, and counter all change the number. We give you a real quote in person.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((p, i) => (
            <article key={p.img} className="group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <Image
                  src={p.img}
                  alt={p.blurb}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition duration-[900ms] group-hover:scale-[1.03]"
                  quality={80}
                />
              </div>
              <div className="mt-5">
                <div className="font-couture text-base italic text-[var(--brand-builders-gold)] md:text-lg">
                  No. {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-couture mt-2 text-2xl leading-tight text-[var(--brand-builders)] md:text-3xl">
                  {p.name}.
                </h3>
                <p className="mt-3 text-base leading-[1.65] text-[var(--muted-foreground)] md:text-lg">
                  {p.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SHOWROOM INVENTORY (catalog-backed) */}
      {showroom.length > 0 ? (
        <section className="border-y border-[var(--border)] bg-[var(--muted)]/40 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-end gap-x-10 gap-y-5 md:grid-cols-12">
              <div className="md:col-span-8">
                <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Showroom inventory</div>
                <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
                  Pieces ready to pick up.
                </h2>
              </div>
              <p className="text-lg leading-[1.7] text-[var(--muted-foreground)] md:col-span-4 md:text-xl">
                Slab remnants, display cabinets, one-off vanities. In-store pickup at 825 Washington Street.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {showroom.map((s) => (
                <Link key={s.id} href={`/shop/item/${s.sku}`} className="group block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover transition duration-[900ms] group-hover:scale-[1.03]"
                      sizes="(min-width:1024px) 33vw, 50vw"
                      quality={75}
                    />
                  </div>
                  <div className="mt-5">
                    <div className="font-couture text-base italic text-[var(--brand-builders-gold)] md:text-lg">
                      {s.subtitle}
                    </div>
                    <h3 className="font-couture mt-2 text-2xl leading-tight text-[var(--brand-builders)] md:text-3xl">
                      {s.title}.
                    </h3>
                    <div className="mt-3 flex items-baseline justify-between border-t border-[var(--brand-builders)]/15 pt-4">
                      <span className="font-couture text-2xl leading-none text-[var(--brand-builders)] md:text-3xl">
                        {formatCurrency(s.price)}
                      </span>
                      <span className="font-couture text-base italic text-[var(--brand-builders-gold)]">
                        {s.location}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-couture text-2xl italic text-[var(--brand-builders-gold)]">Or talk through a custom</div>
            <h2 className="font-couture mt-5 text-5xl leading-[1] tracking-[-0.015em] text-[var(--brand-builders)] md:text-6xl">
              Bring photos and an idea.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl">
              We&apos;ll walk the showroom, pull samples, and follow up with a written estimate.
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
              href="/builders-corner/gallery"
              className="font-couture inline-block border-b border-[var(--brand-builders)]/30 pb-1.5 text-base italic text-[var(--brand-builders)] transition hover:border-[var(--brand-builders)] md:text-lg"
            >
              See real installs
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="builders" />
    </>
  );
}
