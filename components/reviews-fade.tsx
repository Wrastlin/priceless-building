"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Review } from "@/lib/google-reviews";
import { GOOGLE_RATING, isStorefrontSafeReview } from "@/lib/google-reviews";

const DWELL_MS = 10000;
const WIPE_MS = 480;
const STAGGER_MS = 420;
const SLOT_COUNT = 3;
const PLAYLIST_SIZE = 15;

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
  return (strong.length >= SLOT_COUNT ? strong : ranked).slice(0, PLAYLIST_SIZE);
}

/**
 * Three reviews side by side. One slot swaps with a crisp upward wipe.
 */
export function ReviewsFade({ reviews }: { reviews: Review[] }) {
  const playlist = useMemo(() => curatePlaylist(reviews), [reviews]);
  const [slotIdx, setSlotIdx] = useState<[number, number, number]>([0, 1, 2]);
  const [incomingIdx, setIncomingIdx] = useState<[number | null, number | null, number | null]>([
    null,
    null,
    null,
  ]);
  const [wiping, setWiping] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const slotRef = useRef(slotIdx);
  slotRef.current = slotIdx;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (playlist.length < SLOT_COUNT) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    const nextIndex = (current: number, occupied: number[]) => {
      let n = (current + 1) % playlist.length;
      let guard = 0;
      while (occupied.includes(n) && guard < playlist.length) {
        n = (n + 1) % playlist.length;
        guard += 1;
      }
      return n;
    };

    const advanceSlot = (slot: 0 | 1 | 2, then: () => void) => {
      const idx = slotRef.current;
      const occupied = idx.filter((_, i) => i !== slot);
      const next = nextIndex(idx[slot], occupied);

      setIncomingIdx((inc) => {
        const copy: [number | null, number | null, number | null] = [...inc];
        copy[slot] = next;
        return copy;
      });
      setWiping((w) => {
        const copy: [boolean, boolean, boolean] = [...w];
        copy[slot] = false;
        return copy;
      });

      later(20, () => {
        if (cancelled) return;
        setWiping((w) => {
          const copy: [boolean, boolean, boolean] = [...w];
          copy[slot] = true;
          return copy;
        });
      });

      later(WIPE_MS + 40, () => {
        if (cancelled) return;
        setSlotIdx((cur) => {
          const copy: [number, number, number] = [...cur];
          copy[slot] = next;
          return copy;
        });
        setIncomingIdx((inc) => {
          const copy: [number | null, number | null, number | null] = [...inc];
          copy[slot] = null;
          return copy;
        });
        setWiping((w) => {
          const copy: [boolean, boolean, boolean] = [...w];
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
              later(STAGGER_MS, () => {
                if (cancelled) return;
                advanceSlot(2, () => {
                  if (!cancelled) cycle();
                });
              });
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

  const slots = [0, 1, 2].map((i) => {
    const idx = slotIdx[i]!;
    const inc = incomingIdx[i];
    return {
      review: playlist[idx % playlist.length]!,
      incoming: inc != null ? playlist[inc % playlist.length]! : null,
      wiping: wiping[i]!,
    };
  });

  return (
    <section className="mx-auto max-w-[1360px] px-5 py-8 text-center sm:px-8 sm:py-10">
      <h2 className="font-display mx-auto max-w-[24ch] text-[clamp(1.75rem,0.9rem+2.4vw,2.75rem)] leading-[1.05]">
        Trusted across <span className="font-normal italic">central Wisconsin</span> since 1978.
      </h2>
      <div className="mt-2 flex items-center justify-center gap-3 sm:mt-3">
        <span className="text-sm tracking-[0.18em] text-[var(--rust)]" aria-hidden>
          ★★★★★
        </span>
        <span className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--soft)] sm:text-[0.8rem]">
          {GOOGLE_RATING.average} on Google
          <span className="hidden sm:inline"> · Family-run</span>
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 overflow-hidden border border-[var(--line)] text-left sm:mt-6 md:grid-cols-3">
        {slots.map((slot, i) => (
          <ReviewCard
            key={i}
            review={slot.review}
            incoming={slot.incoming}
            wiping={slot.wiping}
            connected={i > 0}
          />
        ))}
      </div>

      <Link
        href="/reviews"
        className="mt-5 inline-block text-[0.8rem] font-medium uppercase tracking-[0.16em] underline-offset-[6px] hover:underline sm:mt-6"
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
  connected = false,
}: {
  review: Review;
  incoming: Review | null;
  wiping: boolean;
  connected?: boolean;
}) {
  return (
    <figure
      className={`relative min-h-[11rem] overflow-hidden bg-white sm:min-h-[13rem] ${
        connected
          ? "border-t border-[var(--line)] md:border-t-0 md:border-l"
          : ""
      }`}
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
    <div className="relative flex h-full min-h-[11rem] flex-col p-4 sm:min-h-[13rem] sm:p-5">
      <div className="text-xs tracking-[0.2em] text-[var(--rust)]" aria-hidden>
        {"★".repeat(review.rating ?? 5)}
      </div>
      <blockquote className="font-display mt-2 line-clamp-5 flex-1 text-[1rem] font-normal italic leading-[1.45] sm:mt-3 sm:text-[1.05rem]">
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--soft)] sm:text-[0.75rem]">
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
