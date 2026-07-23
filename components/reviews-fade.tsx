"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Review } from "@/lib/google-reviews";
import { GOOGLE_RATING, isStorefrontSafeReview } from "@/lib/google-reviews";

const DWELL_MS = 10000;
const WIPE_MS = 480;
const STAGGER_MS = 420;
const MOBILE_SLOTS = 2;
const DESKTOP_SLOTS = 4;
const PLAYLIST_SIZE = 16;
const MD_QUERY = "(min-width: 768px)";

function curatePlaylist(reviews: Review[]): Review[] {
  const seen = new Set<string>();
  const unique = reviews.filter((r) => {
    if (!isStorefrontSafeReview(r)) return false;
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

  const strong = ranked.filter((r) => (r.quote?.length ?? 0) >= 60);
  return (strong.length >= MOBILE_SLOTS ? strong : ranked).slice(0, PLAYLIST_SIZE);
}

function useSlotCount(): number {
  const [slots, setSlots] = useState(MOBILE_SLOTS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(MD_QUERY);
    const sync = () => setSlots(mq.matches ? DESKTOP_SLOTS : MOBILE_SLOTS);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return slots;
}

/**
 * Reviews rotate with a crisp upward wipe.
 * Mobile: 2 stacked. md+: 2×2 grid of 4.
 */
export function ReviewsFade({ reviews }: { reviews: Review[] }) {
  const playlist = useMemo(() => curatePlaylist(reviews), [reviews]);
  const slotCount = useSlotCount();
  const [slotIdx, setSlotIdx] = useState<number[]>(() =>
    Array.from({ length: DESKTOP_SLOTS }, (_, i) => i),
  );
  const [incomingIdx, setIncomingIdx] = useState<(number | null)[]>(() =>
    Array.from({ length: DESKTOP_SLOTS }, () => null),
  );
  const [wiping, setWiping] = useState<boolean[]>(() =>
    Array.from({ length: DESKTOP_SLOTS }, () => false),
  );
  const slotRef = useRef(slotIdx);
  slotRef.current = slotIdx;

  useEffect(() => {
    setSlotIdx(Array.from({ length: DESKTOP_SLOTS }, (_, i) => i % Math.max(playlist.length, 1)));
    setIncomingIdx(Array.from({ length: DESKTOP_SLOTS }, () => null));
    setWiping(Array.from({ length: DESKTOP_SLOTS }, () => false));
  }, [slotCount, playlist.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (playlist.length < slotCount) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    const nextIndex = (current: number, occupied: number[]) => {
      let n = (current + 1) % playlist.length;
      let guard = 0;
      while (occupied.includes(n) && playlist.length > occupied.length && guard < playlist.length) {
        n = (n + 1) % playlist.length;
        guard += 1;
      }
      return n;
    };

    const advanceSlot = (slot: number, then: () => void) => {
      const idx = slotRef.current;
      const occupied = idx.filter((_, i) => i !== slot && i < slotCount);
      const next = nextIndex(idx[slot]!, occupied);

      setIncomingIdx((inc) => {
        const copy = [...inc];
        copy[slot] = next;
        return copy;
      });
      setWiping((w) => {
        const copy = [...w];
        copy[slot] = false;
        return copy;
      });

      later(20, () => {
        if (cancelled) return;
        setWiping((w) => {
          const copy = [...w];
          copy[slot] = true;
          return copy;
        });
      });

      later(WIPE_MS + 40, () => {
        if (cancelled) return;
        setSlotIdx((cur) => {
          const copy = [...cur];
          copy[slot] = next;
          return copy;
        });
        setIncomingIdx((inc) => {
          const copy = [...inc];
          copy[slot] = null;
          return copy;
        });
        setWiping((w) => {
          const copy = [...w];
          copy[slot] = false;
          return copy;
        });
        later(30, () => {
          if (!cancelled) then();
        });
      });
    };

    const advanceChain = (from: number) => {
      if (cancelled) return;
      if (from >= slotCount) {
        cycle();
        return;
      }
      advanceSlot(from, () => {
        later(STAGGER_MS, () => advanceChain(from + 1));
      });
    };

    const cycle = () => {
      later(DWELL_MS, () => {
        if (cancelled) return;
        advanceChain(0);
      });
    };

    cycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [playlist, slotCount]);

  if (playlist.length === 0) return null;

  const visible = Array.from({ length: slotCount }, (_, i) => {
    const idx = slotIdx[i] ?? i;
    const inc = incomingIdx[i];
    return {
      review: playlist[idx % playlist.length]!,
      incoming: inc != null ? playlist[inc % playlist.length]! : null,
      wiping: wiping[i] ?? false,
    };
  });

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

      <div className="mt-7 grid grid-cols-1 overflow-hidden border border-[var(--line)] text-left sm:mt-9 md:grid-cols-2">
        {visible.map((slot, i) => (
          <ReviewCard
            key={i}
            review={slot.review}
            incoming={slot.incoming}
            wiping={slot.wiping}
            borderTop={slotCount === MOBILE_SLOTS ? i > 0 : i >= 2}
            borderLeft={slotCount === DESKTOP_SLOTS && i % 2 === 1}
          />
        ))}
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
  incoming,
  wiping,
  borderTop = false,
  borderLeft = false,
}: {
  review: Review;
  incoming: Review | null;
  wiping: boolean;
  borderTop?: boolean;
  borderLeft?: boolean;
}) {
  return (
    <figure
      className={`relative min-h-[16rem] overflow-hidden bg-white sm:min-h-[20rem] ${
        borderTop ? "border-t border-[var(--line)]" : ""
      } ${borderLeft ? "md:border-l" : ""}`}
    >
      <ReviewLayer review={review} />
      {incoming ? (
        <div
          aria-hidden={!wiping}
          className="absolute inset-0 z-[1] bg-white will-change-[clip-path]"
          style={{
            clipPath: wiping ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            transition: `clip-path ${WIPE_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
          }}
        >
          <ReviewLayer review={incoming} />
        </div>
      ) : null}
    </figure>
  );
}

function ReviewLayer({ review }: { review: Review }) {
  return (
    <div className="relative flex h-full min-h-[16rem] flex-col p-5 sm:min-h-[20rem] sm:p-8">
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
  );
}
