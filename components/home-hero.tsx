import Image from "next/image";
import Link from "next/link";
import { PRICELESS } from "@/lib/brands";

const MURAL_HERO = "/real-photos/mural-wide.webp";

/**
 * Home hero: text column + looping storefront video, followed by the
 * full-width mural figure with attribution caption. The first thing
 * a visitor sees.
 */
export function HomeHero() {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-12 md:pt-20 md:pb-20">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
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
              Three local brands at 825 Washington Street since 1978. We are happy to help with anything from a single doorknob to a full kitchen — and everything in between.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/shop" className="btn btn-priceless">
                Shop everything
              </Link>
              <Link
                href="/reviews"
                className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg"
              >
                Read our reviews →
              </Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0b1220] shadow-sm">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/real-photos/storefront-bg-poster.jpg"
                aria-hidden="true"
              >
                <source src="/real-photos/storefront-bg.webm" type="video/webm" />
                <source src="/real-photos/storefront-bg.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/70 px-2 py-1 text-xs font-medium uppercase tracking-[0.14em] text-white">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Live walkthrough
              </div>
            </div>
          </div>
        </div>
      </div>
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
  // Today's hours, computed on the server at render time. Falls back
  // to a friendly "closed today" message if the day is closed.
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayHours =
    PRICELESS.hours.find((h) => h.day === today)?.hours ?? "Closed";
  if (todayHours === "Closed") {
    return <span className="text-[var(--foreground)]">Closed today · Open Mon 8:30 AM</span>;
  }
  return <span className="text-[var(--foreground)]">Open today, {todayHours}</span>;
}
