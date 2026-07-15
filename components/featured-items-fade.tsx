"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { FloorFeature } from "@/lib/items/floor-features";

const DWELL_MS = 3000;
const FADE_MS = 1000;
const SLOT_COUNT = 2;

/**
 * Two featured floor finds at a time — dwell 3s, crossfade 1s, advance.
 * Display-only cards (no product pages); department link is optional chrome.
 */
export function FeaturedItemsFade({
  items,
  eyebrow = "Featured from the floor",
  title = (
    <>
      Finds worth a closer <span className="font-normal italic">look.</span>
    </>
  ),
}: {
  items: FloorFeature[];
  eyebrow?: string;
  title?: React.ReactNode;
}) {
  const pairCount = Math.max(1, Math.floor(items.length / SLOT_COUNT));
  const [frame, setFrame] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (items.length < SLOT_COUNT) return;

    let cancelled = false;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let tickTimer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (delay: number) => {
      tickTimer = setTimeout(() => {
        if (cancelled) return;
        setVisible(false);
        fadeTimer = setTimeout(() => {
          if (cancelled) return;
          setFrame((f) => f + 1);
          setVisible(true);
          schedule(DWELL_MS);
        }, FADE_MS);
      }, delay);
    };

    schedule(DWELL_MS);

    return () => {
      cancelled = true;
      clearTimeout(tickTimer);
      clearTimeout(fadeTimer);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  const pair = frame % pairCount;
  const pairItems = Array.from({ length: Math.min(SLOT_COUNT, items.length) }, (_, slot) => {
    const idx = pair * SLOT_COUNT + slot;
    return items[idx % items.length]!;
  });

  // Mobile: show the same pair stacked; still advances as a pair.
  return (
    <section className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-display mt-3 max-w-[22ch] text-[clamp(1.9rem,1rem+2.4vw,3rem)] leading-[1.05] sm:mt-4">
            {title}
          </h2>
          <p className="mt-3 max-w-[42ch] text-[0.95rem] font-light leading-[1.65] text-[var(--soft)]">
            Real pieces on the warehouse floor. Call (715) 848-3855 to hold one
            for pickup — no online checkout yet.
          </p>
        </div>
        <Link
          href="/shop"
          className="hidden shrink-0 border-b border-[var(--ink)] pb-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] sm:inline-block"
        >
          Shop departments ›
        </Link>
      </div>

      <div
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
        }}
      >
        {pairItems.map((item) => (
          <FeatureCard key={`${pair}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ item }: { item: FloorFeature }) {
  return (
    <article className="group relative overflow-hidden bg-white">
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[var(--taupe)] sm:aspect-[4/3]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width:640px) 50vw, 100vw"
          quality={78}
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 bg-[var(--ink)]/85 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-white">
          {item.categoryLabel}
        </span>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="font-display text-xl leading-snug sm:text-2xl">{item.title}</h3>
        <p className="mt-1 text-sm font-light text-[var(--soft)]">{item.subtitle}</p>
        <p className="mt-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--rust)]">
          Call for price · on the floor
        </p>
      </div>
    </article>
  );
}
