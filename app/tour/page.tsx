import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { byCategory, CATEGORIES, type Category } from "@/lib/catalog";
import { InteractiveTour } from "./interactive-tour";

const HERO = "/real-photos/storefront-signage.webp";

type Department = {
  key: Category;
  aisle: string;
  hero: string;
  headline: string;
  paragraph: string;
};

const DEPARTMENTS: Department[] = [
  {
    key: "doors",
    aisle: "Aisle D",
    hero: "/test-images/01-interior-door-shaker.jpg",
    headline: "Doors stacked four-high, floor to ceiling.",
    paragraph:
      "Step into Aisle D and you're walking past roughly four hundred doors at any given time. Pre-hung interiors on the left, smooth-skin exteriors on the right, and the reclaim loft at the far end stocked with one-of-one solid wood pulls from old Wausau farmhouses.",
  },
  {
    key: "windows",
    aisle: "Aisle W",
    hero: "/test-images/06-double-hung-window.jpg",
    headline: "Vinyl, casement, picture and slider.",
    paragraph:
      "Surplus Energy Star windows in the most-requested rough-opening sizes, plus a steady supply of cancelled-order custom units waiting for the right project. Black frame casements move fastest. They don't sit on the rack long.",
  },
  {
    key: "cabinets",
    aisle: "Aisle C",
    hero: "/test-images/03-base-cabinet-white-shaker.jpg",
    headline: "Stock kitchen runs, ready to load.",
    paragraph:
      "Soft-close, full-overlay, solid wood face frames in whites, espressos and naturals. Need furniture-grade inset or a custom layout? Walk through the doorway into the Builders Corner showroom. Same building, different aisle.",
  },
  {
    key: "vanities",
    aisle: "Showroom · West Wall",
    hero: "/test-images/14-white-vanity-quartz.jpg",
    headline: "Thirty-inch to seventy-two-inch, tops included.",
    paragraph:
      "The west wall of the showroom is wall-to-wall vanities, each one staged with the quartz top it ships with. Brushed nickel and matte black hardware. No assembly, no hunting for a top that fits.",
  },
  {
    key: "countertops",
    aisle: "Slab Yard",
    hero: "/test-images/19-calacatta-quartz-slab.jpg",
    headline: "Remnants and full slabs in the back yard.",
    paragraph:
      "Out the back roll-up door is the slab yard. Quartz remnants priced by the square foot for islands and baths, plus a rotating selection of full slabs in calacatta, carrara and warm warm-veined granites.",
  },
  {
    key: "hardware",
    aisle: "Bin Wall",
    hero: "/test-images/07-cabinet-hardware-brushed-brass.jpg",
    headline: "Bin after bin of pulls, hinges and latches.",
    paragraph:
      "The hardware wall is a working contractor's snack aisle. Matte black, brushed brass, polished nickel, antique bronze: all new-in-box, mostly sold by the ten-pack, all priced to leave the building today.",
  },
  {
    key: "lighting",
    aisle: "Aisle L",
    hero: "/test-images/10-flush-mount-light.jpg",
    headline: "Pendants, sconces and vanity bars.",
    paragraph:
      "Lighting hangs from a custom grid above Aisle L so you can actually see what you're buying lit up. Vanity bars in brushed brass move fastest. Designers pull them for half the small-bath jobs in town.",
  },
  {
    key: "trim",
    aisle: "Trim Rack",
    hero: "/test-images/08-painted-trim-stack.jpg",
    headline: "Primed MDF and solid pine by the bundle.",
    paragraph:
      "Eight-foot bundles of primed casing, base and crown stacked along the south wall, plus a rotating selection of solid pine and poplar for paint-grade jobs that need a little more body.",
  },
];

export const metadata = {
  title: "Virtual Store Tour · Price-Less Building Center",
  description:
    "Walk the aisles of Price-Less Building Center in Wausau, WI: eight departments, one warehouse.",
};

export default function TourPage() {
  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO. Editorial, asymmetric */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Inside the Price-Less warehouse" fill priority className="object-cover opacity-75" quality={80} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_transparent_0%,_rgba(0,0,0,0.65)_55%,_rgba(0,0,0,0.9)_100%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pt-28 pb-20 text-white md:grid-cols-12 md:pt-40 md:pb-28">
          <div className="md:col-span-8">
            <div className="font-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/70">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span>Live floor</span>
              <span className="opacity-50">/</span>
              <span>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</span>
              <span className="opacity-50">/</span>
              <span>Updated weekly</span>
            </div>
            <h1 className="font-display mt-8 max-w-[18ch] text-[3.5rem] leading-[0.88] text-white sm:text-[5rem] md:text-[7.5rem]">
              Walk the warehouse <span className="text-[var(--brand-priceless)]">from anywhere.</span>
            </h1>
            <p className="font-serif mt-8 max-w-xl text-lg italic leading-snug text-white/85 md:text-xl">
              Eighteen thousand square feet, eight departments, three thousand-plus SKUs on the floor at any time. The interactive walkthrough below lets you click into the actual aisles.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/shop" className="btn btn-priceless">Skip and just shop</Link>
              <Link href="/aisle-map" className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/85 underline decoration-[var(--brand-priceless)] decoration-2 underline-offset-4">
                Aisle map →
              </Link>
              <Link href="/contact" className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 underline decoration-white/30 decoration-2 underline-offset-4">
                Plan a visit →
              </Link>
            </div>
          </div>
          <aside className="md:col-span-4 md:pt-16">
            <div className="border-l border-white/20 pl-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Open today</div>
              <div className="font-display mt-3 text-4xl text-white md:text-5xl">8 AM – 5 PM</div>
              <p className="font-serif mt-3 text-sm italic text-white/75">
                Wednesdays land fresh inventory. Saturday is half-day, close at 12:30 PM.
              </p>
              <Link href="/contact" className="font-mono mt-5 inline-block text-[11px] uppercase tracking-[0.18em] text-white/80 underline decoration-[var(--brand-priceless)] decoration-2 underline-offset-4">
                See full hours →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* INTERACTIVE WALKTHROUGH */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-end gap-x-10 gap-y-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">Interactive walkthrough · 6 viewpoints</div>
            <h2 className="font-display mt-3 text-5xl leading-[1.05] md:text-6xl">
              Pick a viewpoint. <span className="text-[var(--brand-priceless)]">Walk</span> to the next.
            </h2>
          </div>
          <p className="font-serif text-base italic text-[var(--muted-foreground)] md:col-span-4">
            Tap the white markers to walk to the next aisle or open the product you're looking at.
          </p>
        </div>
        <div className="mt-8">
          <Suspense fallback={null}>
            <InteractiveTour />
          </Suspense>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-y bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid items-end gap-x-10 gap-y-4 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">The walk-through</div>
              <h2 className="font-display mt-3 text-5xl leading-[1.05] md:text-6xl">
                Eight stops. <span className="text-[var(--brand-priceless)]">One warehouse.</span>
              </h2>
            </div>
            <p className="font-serif text-base italic text-[var(--muted-foreground)] md:col-span-4 md:text-lg">
              We mapped the building the way you'd walk it on a Saturday morning. Doors first, windows next, kitchen-side, then the back yard for slabs.
            </p>
          </div>
        </div>
      </section>

      {/* DEPARTMENT SECTIONS */}
      <section className="space-y-20 pb-24">
        {DEPARTMENTS.map((dept, i) => {
          const items = byCategory("priceless", dept.key).slice(0, 3);
          const cat = CATEGORIES[dept.key];
          const reversed = i % 2 === 1;
          return (
            <div key={dept.key} className="mx-auto max-w-7xl px-6">
              <div className={"grid items-center gap-10 md:grid-cols-2"}>
                <div className={"relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card " + (reversed ? "md:order-2" : "")}>
                  <Image src={dept.hero} alt={cat.label} fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" quality={75} />
                  <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] uppercase tracking-wider text-white backdrop-blur">
                    Stop {String(i + 1).padStart(2, "0")} · {dept.aisle}
                  </div>
                </div>
                <div className={reversed ? "md:order-1" : ""}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-priceless)]">{cat.label}</div>
                  <h3 className="font-display mt-2 text-3xl md:text-4xl">{dept.headline}</h3>
                  <p className="mt-4 text-[var(--muted-foreground)]">{dept.paragraph}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/shop/${dept.key}`} className="btn btn-priceless">Shop {cat.label.toLowerCase()}</Link>
                    <Link href="/contact" className="btn btn-outline">Ask about stock</Link>
                  </div>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="mt-8">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      On the floor in this aisle right now
                    </div>
                    <Link href={`/shop/${dept.key}`} className="hidden text-sm font-semibold underline md:inline">
                      See all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((it) => <ProductCard key={it.id} item={it} />)}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[var(--brand-priceless-dark)] py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/70">End of the tour</div>
            <div className="font-display mt-2 text-3xl md:text-4xl">Pictures don't sell pre-hung doors.</div>
            <p className="mt-3 max-w-2xl text-sm text-white/80">
              Come walk the floor. We'll meet you at the front counter and help you find exactly
              the size, swing and finish your job needs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn bg-white text-[var(--brand-priceless)]">Plan your visit</Link>
            <Link href="/shop" className="btn btn-outline border-white/40 bg-transparent text-white">Keep browsing</Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}
