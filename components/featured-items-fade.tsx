"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FloorFeature } from "@/lib/items/floor-features";

const DWELL_MS = 4200;
const WIPE_MS = 520;
const STAGGER_MS = 380;
const SLOT_COUNT = 2;

/**
 * Two featured finds. One slot at a time swaps with a crisp upward wipe —
 * no opacity fade, no blank flash between items.
 */
export function FeaturedItemsFade({
  items,
  title = (
    <>
      Featured <span className="font-normal italic">finds.</span>
    </>
  ),
}: {
  items: FloorFeature[];
  title?: React.ReactNode;
}) {
  const [slotIdx, setSlotIdx] = useState<[number, number]>([0, 1]);
  const [incomingIdx, setIncomingIdx] = useState<[number | null, number | null]>([null, null]);
  const [wiping, setWiping] = useState<[boolean, boolean]>([false, false]);
  const slotRef = useRef(slotIdx);
  slotRef.current = slotIdx;

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
      if (n === other && items.length > 1) n = (n + 1) % items.length;
      return n;
    };

    const advanceSlot = (slot: 0 | 1, then: () => void) => {
      const idx = slotRef.current;
      const other = slot === 0 ? idx[1] : idx[0];
      const next = nextIndex(idx[slot], other);

      setIncomingIdx((inc) => {
        const copy: [number | null, number | null] = [...inc];
        copy[slot] = next;
        return copy;
      });
      setWiping((w) => {
        const copy: [boolean, boolean] = [...w];
        copy[slot] = false;
        return copy;
      });

      // Mount closed, then open wipe on the following frame
      later(20, () => {
        if (cancelled) return;
        setWiping((w) => {
          const copy: [boolean, boolean] = [...w];
          copy[slot] = true;
          return copy;
        });
      });

      later(WIPE_MS + 40, () => {
        if (cancelled) return;
        setSlotIdx((cur) => {
          const copy: [number, number] = [...cur];
          copy[slot] = next;
          return copy;
        });
        setIncomingIdx((inc) => {
          const copy: [number | null, number | null] = [...inc];
          copy[slot] = null;
          return copy;
        });
        setWiping((w) => {
          const copy: [boolean, boolean] = [...w];
          copy[slot] = false;
          return copy;
        });
        later(30, () => {
          if (!cancelled) then();
        });
      });
    };

    const cycle = () => {
      later(DWELL_MS, () => {
        if (cancelled) return;
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
  const leftIn =
    incomingIdx[0] != null ? items[incomingIdx[0] % items.length]! : null;
  const rightIn =
    incomingIdx[1] != null ? items[incomingIdx[1] % items.length]! : null;

  return (
    <section className="mx-auto max-w-[1360px] px-8 py-10 sm:px-10 sm:py-14 md:px-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display max-w-[22ch] text-[clamp(1.9rem,1rem+2.4vw,3rem)] leading-[1.05]">
            {title}
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden shrink-0 border-b border-[var(--ink)] pb-1 text-[0.8rem] font-medium uppercase tracking-[0.16em] sm:inline-block"
        >
          Shop departments ›
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 overflow-hidden border border-[var(--line)] sm:mt-8 sm:grid-cols-2">
        <FeatureCard item={left} incoming={leftIn} wiping={wiping[0]} />
        <FeatureCard item={right} incoming={rightIn} wiping={wiping[1]} connected />
      </div>
    </section>
  );
}

function FeatureCard({
  item,
  incoming,
  wiping,
  connected = false,
}: {
  item: FloorFeature;
  incoming: FloorFeature | null;
  wiping: boolean;
  connected?: boolean;
}) {
  return (
    <article
      className={`group relative aspect-[4/5] overflow-hidden bg-[var(--taupe)] sm:aspect-[4/5] md:aspect-[5/4] ${
        connected ? "border-t border-[var(--line)] sm:border-t-0 sm:border-l" : ""
      }`}
    >
      <FeatureLayer item={item} />
      {incoming ? (
        <div
          aria-hidden={!wiping}
          className="absolute inset-0 z-[1] will-change-[clip-path]"
          style={{
            clipPath: wiping ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            transition: `clip-path ${WIPE_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
          }}
        >
          <FeatureLayer item={incoming} />
        </div>
      ) : null}
    </article>
  );
}

function FeatureLayer({ item }: { item: FloorFeature }) {
  return (
    <div className="absolute inset-0">
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
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-white/80">
          {item.categoryLabel}
        </p>
        <h3 className="font-display mt-2 text-2xl leading-tight sm:text-[1.7rem] md:text-3xl">
          {item.title}
        </h3>
        <p className="mt-1.5 text-[1rem] font-light text-white/85">{item.subtitle}</p>
      </div>
    </div>
  );
}
