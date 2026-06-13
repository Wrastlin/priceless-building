import Image from "next/image";
import Link from "next/link";
import { HeroPhotoFader, type HeroPhotoSource } from "@/components/hero-photo-fader";
import { PRICELESS } from "@/lib/brands";

const MURAL_HERO = "/real-photos/mural-wide.webp";

const HERO_PHOTOS: HeroPhotoSource[] = [
  { src: "/real-photos/business/white-kitchen-marble-island.jpg", alt: "A finished custom kitchen with white shaker cabinetry and a marble-top island, installed by the local crew in Wausau." },
  { src: "/real-photos/business/warehouse-cabinet-display.jpg", alt: "Rows of cabinets and vanities on the warehouse floor at Price-Less Building Center in Wausau, Wisconsin." },
  { src: "/real-photos/business/kitchen-island-wood-cabinets-range.jpg", alt: "A finished kitchen with warm wood cabinets, a stainless range, and a bar-seat island." },
  { src: "/real-photos/business/warehouse-assorted-windows.jpg", alt: "Surplus windows arranged on the warehouse floor, brand-new in the box at a fraction of retail." },
  { src: "/real-photos/business/dark-cabinet-kitchen-install.jpg", alt: "A finished kitchen with dark wood cabinets and pendant lighting." },
];

// Mobile shows a single static photo. Keep it distinct from every photo in
// the desktop fader so the hero section never repeats an image.
const MOBILE_HERO: HeroPhotoSource = {
  src: "/real-photos/business/white-kitchen-rustic-island.jpg",
  alt: "A finished custom kitchen with white cabinetry and a rustic wood island, built and installed in Wausau.",
};

export function HomeHero() {
  return (
    <section className="relative border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-12 md:pt-20 md:pb-24">
        <div className="grid items-stretch gap-0 md:grid-cols-12">
          {/* Text column. Half the grid; the photo extends slightly
              under its right edge via negative margin so the seam reads
              as a fade, not a hard line. */}
          <div className="relative z-10 md:col-span-6 md:py-10 md:pr-12 lg:pr-16">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-[var(--muted-foreground)] md:text-lg">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <OpenToday />
              </span>
              <span className="hidden sm:inline text-[var(--muted-foreground)]/50">·</span>
              <span>Wausau, WI</span>
            </div>
            <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
              Wausau&apos;s one-stop shop for materials, <span className="text-[var(--brand-priceless)]">cabinetry, and installs.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-[var(--foreground)] md:text-lg">
              Walk the warehouse, design with our team, install with our crew. Since 1978.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/contact" className="btn btn-priceless">
                See our store
              </Link>
              <Link
                href="/shop"
                className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg"
              >
                Browse the warehouse →
              </Link>
            </div>
          </div>

          {/* Photo column. Half the grid, extends left a bit so it
              bleeds under the text column's right padding, and runs
              past the right edge of the page for cinematic feel.
              A short white fade on the leftmost slice softens the
              seam without hiding image content. */}
          <div className="relative hidden md:col-span-6 md:block">
            <div className="absolute inset-y-0 -right-6 -left-12 lg:-right-12 lg:-left-16">
              <HeroPhotoFader photos={HERO_PHOTOS} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.85) 2%, rgba(255,255,255,0) 12%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile-only hero photo. */}
        <div className="-mx-6 mt-10 md:hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
            <Image
              src={MOBILE_HERO.src}
              alt={MOBILE_HERO.alt}
              fill
              priority
              sizes="100vw"
              quality={80}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mural figure. Anchored, with full press attribution. */}
      <figure className="border-t border-[var(--border)]">
        <div className="relative w-full overflow-hidden bg-[var(--muted)]">
          <Image
            src={MURAL_HERO}
            alt="Build Your Future community mural on the side of the Price-Less Building Center, painted by 50 Wausau volunteers in June 2023."
            width={2400}
            height={750}
            loading="lazy"
            className="block h-auto w-full object-contain"
            sizes="100vw"
          />
        </div>
        <figcaption className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border)] px-6 py-3 text-sm">
          <span className="text-[var(--muted-foreground)]">
            &ldquo;Build Your Future&rdquo; mural · designed by Stephanie Kohli · painted by 50 Wausau volunteers · June 2023
          </span>
          <a
            href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
            target="_blank"
            rel="noreferrer"
            className="font-mono shrink-0 text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
          >
            WSAW story →
          </a>
        </figcaption>
      </figure>
    </section>
  );
}

function OpenToday() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayHours =
    PRICELESS.hours.find((h) => h.day === today)?.hours ?? "Closed";
  if (todayHours === "Closed") {
    return <span className="text-[var(--foreground)]">Closed today · Open Mon 8:30 AM</span>;
  }
  return <span className="text-[var(--foreground)]">Open today, {todayHours}</span>;
}
