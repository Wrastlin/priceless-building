"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { FloorFeature } from "@/lib/items/floor-features";

const DWELL_MS = 3000;
const FADE_MS = 1000;
const STAGGER_MS = 450;
const SLOT_COUNT = 2;

/**
 * Two connected featured finds. Text sits on the photo. Only one slot
 * crossfades at a time (staggered), so the pair never blanks together.
 */
export function FeaturedItemsFade({
  items,
  eyebrow = "Featured finds",
  title = (
    <>
      Pieces worth a closer <span className="font-normal italic">look.</span>
    </>
  ),
}: {
  items: FloorFeature[];
  eyebrow?: string;
  title?: React.ReactNode;
}) {
  const [slotIdx, setSlotIdx] = useState<[number, number]>([0, 1]);
  const [slotVisible, setSlotVisible] = useState<[boolean, boolean]>([true, true]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (items.length < SLOT_COUNT) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const later = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    const nextIndex = (current: number, other: number) => {
      let n = (current + 1) % items.length;
      // Prefer not showing the same piece in both slots
      if (n === other && items.length > 1) n = (n + 1) % items.length;
      return n;
    };

    const advanceSlot = (slot: 0 | 1, then: () => void) => {
      setSlotVisible((v) => {
        const next: [boolean, boolean] = [...v];
        next[slot] = false;
        return next;
      });
      later(FADE_MS, () => {
        if (cancelled) return;
        setSlotIdx((idx) => {
          const next: [number, number] = [...idx];
          const other = slot === 0 ? idx[1] : idx[0];
          next[slot] = nextIndex(idx[slot], other);
          return next;
        });
        setSlotVisible((v) => {
          const next: [boolean, boolean] = [...v];
          next[slot] = true;
          return next;
        });
        later(FADE_MS, () => {
          if (!cancelled) then();
        });
      });
    };

    const cycle = () => {
      later(DWELL_MS, () => {
        if (cancelled) return;
        // Left first, then right — only one fades at a time
        advanceSlot(0, () => {
          later(STAGGER_MS, () => {
            if (cancelled) return;
            advanceSlot(1, () => {
              if (!cancelled) cycle();
            });
          });
        });
      });
    };

    cycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  const left = items[slotIdx[0] % items.length]!;
  const right = items[slotIdx[1] % items.length]!;

  return (
    <section className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-display mt-3 max-w-[22ch] text-[clamp(1.9rem,1rem+2.4vw,3rem)] leading-[1.05] sm:mt-4">
            {title}
          </h2>
          <p className="mt-3 max-w-[42ch] text-[0.95rem] font-light leading-[1.65] text-[var(--soft)]">
            Real pieces from our warehouse. Call (715) 848-3855 to hold one for
            pickup.
          </p>
        </div>
        <Link
          href="/shop"
          className="hidden shrink-0 border-b border-[var(--ink)] pb-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] sm:inline-block"
        >
          Shop departments ›
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 overflow-hidden border border-[var(--line)] sm:grid-cols-2">
        <FeatureCard item={left} visible={slotVisible[0]} />
        <FeatureCard item={right} visible={slotVisible[1]} connected />
      </div>
    </section>
  );
}

function FeatureCard({
  item,
  visible,
  connected = false,
}: {
  item: FloorFeature;
  visible: boolean;
  connected?: boolean;
}) {
  return (
    <article
      className={`group relative aspect-[4/5] overflow-hidden bg-[var(--taupe)] sm:aspect-[4/5] md:aspect-[5/4] ${
        connected ? "border-t border-[var(--line)] sm:border-t-0 sm:border-l" : ""
      }`}
    >
      <div
        className="absolute inset-0 transition-opacity ease-in-out"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: `${FADE_MS}ms`,
        }}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width:640px) 50vw, 100vw"
          quality={78}
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6 md:p-7">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-white/75">
            {item.categoryLabel}
          </p>
          <h3 className="font-display mt-2 text-2xl leading-tight sm:text-[1.7rem] md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-1.5 text-sm font-light text-white/80">{item.subtitle}</p>
          <p className="mt-4 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/90">
            Call for price
          </p>
        </div>
      </div>
    </article>
  );
}
