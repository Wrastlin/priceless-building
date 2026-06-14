"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ADDRESS } from "@/lib/brands";

// Same WebGL mosaic as the homepage hero, themed for Four Squared: a grid
// of real finished remodels on the near-black FS background. Desktop only;
// mobile gets the static poster below.
const MosaicCanvas = dynamic(() => import("@/components/home/mosaic-canvas"), { ssr: false });

// 15 unique finished kitchen + bath installs (one per tile). All distinct
// from the poster so the hero never repeats a photo.
const FS_PHOTOS = [
  "/real-photos/business/kitchen-island-wood-cabinets-range.jpg",
  "/real-photos/business/dark-cabinet-kitchen-install.jpg",
  "/real-photos/business/rustic-wood-kitchen-island.jpg",
  "/real-photos/business/wood-cabinets-granite-kitchen.jpg",
  "/real-photos/business/white-kitchen-rustic-island.jpg",
  "/real-photos/business/white-kitchen-wood-island.jpg",
  "/real-photos/business/wood-cabinets-dark-counters.jpg",
  "/real-photos/business/kitchen-sink-dark-wood-cabinets.webp",
  "/real-photos/business/white-shaker-kitchen-cabinets.jpg",
  "/real-photos/business/dark-double-vanity-bathroom-install.jpg",
  "/real-photos/business/double-sink-bathroom-vanity-black.webp",
  "/real-photos/business/dark-double-vanity-install.jpg",
  "/real-photos/business/kitchen-and-bath-remodel-split.jpg",
  "/real-photos/business/kitchen-remodel-before-after.jpg",
  "/real-photos/business/wood-cabinet-kitchen-display.jpg",
];

const POSTER = "/real-photos/business/white-kitchen-marble-island.jpg";
const PHONE = ADDRESS.phone;
const PHONE_TEL = `tel:${PHONE.replace(/[^0-9+]/g, "")}`;
const EMAIL_MAILTO = "mailto:pricelessbuildingcenter@gmail.com?subject=Four%20Squared%20estimate%20request";

export function FourSquaredHero() {
  const [enableCanvas, setEnableCanvas] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const apply = () => setEnableCanvas(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  return (
    <section className="relative border-b">
      <div className="relative min-h-[88svh] w-full overflow-hidden bg-[#0a0e14]">
        <Image
          src={POSTER}
          alt="A finished kitchen remodel by the Four Squared crew: white cabinetry and a marble-top island."
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover"
        />

        {enableCanvas ? <MosaicCanvas photos={FS_PHOTOS} background={0x0a0e14} /> : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,14,20,0.93) 0%, rgba(10,14,20,0.55) 46%, rgba(10,14,20,0.22) 74%, rgba(10,14,20,0.5) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to top, rgba(10,14,20,0.9) 0%, rgba(10,14,20,0.35) 60%, rgba(10,14,20,0.55) 100%)" }}
        />

        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-center px-6 py-20">
          <BrandLogo brand="four-squared" size="lg" className="[&>span:last-child]:!text-white" />
          <div className="font-mono mt-7 text-xs uppercase tracking-[0.14em] text-emerald-300">
            The install side of 825 Washington Street
          </div>
          <h1 className="font-display mt-3 text-[clamp(2.75rem,1.8rem+6vw,7rem)] uppercase leading-[0.92] text-white">
            The install crew that{" "}
            <span className="text-emerald-400">finishes the job.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Four Squared handles the work. Kitchens, baths, doors, finish carpentry. We install cabinets from Builders Corner, materials from the Price-Less floor, or anything you bring on your own. One crew lead from demo through the final walkthrough.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={EMAIL_MAILTO}
              className="font-mono inline-flex items-center bg-emerald-600 px-7 py-4 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-emerald-700"
            >
              Get a free estimate →
            </a>
            <a
              href={PHONE_TEL}
              className="font-mono text-sm uppercase tracking-[0.14em] text-white underline decoration-emerald-400/60 underline-offset-[6px] hover:decoration-emerald-400"
            >
              Or call {PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
