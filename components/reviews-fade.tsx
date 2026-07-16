"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Review } from "@/lib/google-reviews";
import { GOOGLE_RATING } from "@/lib/google-reviews";

const DWELL_MS = 10000;
const FADE_MS = 1000;
const STAGGER_MS = 500;
const SLOT_COUNT = 2;
const PLAYLIST_SIZE = 10;

/**
 * Strongest unique quotes for the living reviews pair.
 */
function curatePlaylist(reviews: Review[]): Review[] {
  const seen = new Set<string>();
  const unique = reviews.filter((r) => {
    const key = (r.quote || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const ranked = [...unique].sort((a, b) => {
    const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return (b.quote?.length ?? 0) - (a.quote?.length ?? 0);
  });

  const strong = ranked.filter((r) => (r.rating ?? 0) >= 5 && (r.quote?.length ?? 0) >= 60);
  return (strong.length >= SLOT_COUNT ? strong : ranked).slice(0, PLAYLIST_SIZE);
}

/**
 * Two reviews at a time. Only one slot crossfades at a time (staggered),
 * so readers always have a steady quote while the other swaps.
 */
export function ReviewsFade({ reviews }: { reviews: Review[] }) {
  const playlist = useMemo(() => curatePlaylist(reviews), [reviews]);
  const [slotIdx, setSlotIdx] = useState<[number, number]>([0, 1]);
  const [slotVisible, setSlotVisible] = useState<[boolean, boolean]>([true, true]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (playlist.length < SLOT_COUNT) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const later = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    const nextIndex = (current: number, other: number) => {
      let n = (current + 1) % playlist.length;
      if (n === other && playlist.length > 1) n = (n + 1) % playlist.length;
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
  }, [playlist]);

  if (playlist.length === 0) return null;

  const left = playlist[slotIdx[0] % playlist.length]!;
  const right = playlist[slotIdx[1] % playlist.length]!;

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-10 text-center sm:px-8 sm:py-14">
      <h2 className="font-display mx-auto max-w-[24ch] text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05]">
        Trusted across <span className="font-normal italic">central Wisconsin</span> since 1978.
      </h2>
      <div className="mt-3 flex items-center justify-center gap-3 sm:mt-4">
        <span className="text-base tracking-[0.18em] text-[var(--rust)]" aria-hidden>
          ★★★★★
        </span>
        <span className="text-[0.8rem] font-medium uppercase tracking-[0.14em] text-[var(--soft)] sm:text-[0.85rem]">
          {GOOGLE_RATING.average} on Google
          <span className="hidden sm:inline"> · Family-run</span>
        </span>
      </div>

      <div className="mt-7 grid grid-cols-1 overflow-hidden border border-[var(--line)] text-left sm:mt-9 sm:grid-cols-2">
        <ReviewCard review={left} visible={slotVisible[0]} />
        <ReviewCard review={right} visible={slotVisible[1]} connected />
      </div>

      <Link
        href="/reviews"
        className="mt-6 inline-block text-[0.8rem] font-medium uppercase tracking-[0.16em] underline-offset-[6px] hover:underline sm:mt-8"
      >
        More reviews ›
      </Link>
    </section>
  );
}

function ReviewCard({
  review,
  visible,
  connected = false,
}: {
  review: Review;
  visible: boolean;
  connected?: boolean;
}) {
  return (
    <figure
      className={`relative flex min-h-[16rem] flex-col bg-white p-5 sm:min-h-[20rem] sm:p-8 ${
        connected ? "border-t border-[var(--line)] sm:border-t-0 sm:border-l" : ""
      }`}
    >
      <div
        className="flex flex-1 flex-col transition-opacity ease-in-out"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: `${FADE_MS}ms`,
        }}
      >
        <div className="text-sm tracking-[0.2em] text-[var(--rust)]" aria-hidden>
          {"★".repeat(review.rating ?? 5)}
        </div>
        <blockquote className="font-display mt-4 flex-1 text-[1.15rem] font-normal italic leading-[1.5] sm:mt-5 sm:text-[1.25rem] sm:leading-[1.55]">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-[var(--soft)] sm:mt-6 sm:text-[0.85rem]">
          {review.author ?? "Customer"}
          <span className="hidden sm:inline">
            {" "}
            · {review.source}
            {review.relative ? ` · ${review.relative}` : ""}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
