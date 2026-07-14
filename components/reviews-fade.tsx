"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Review } from "@/lib/google-reviews";
import { GOOGLE_RATING } from "@/lib/google-reviews";

const DWELL_MS = 14000;
const FADE_MS = 1400;
const SLOT_COUNT = 3;
const PLAYLIST_SIZE = 9; // multiple of 3 — three distinct triplets

/**
 * Pick the strongest reviews once, then play them in fixed triplets so
 * the three desktop cards never show the same quote at the same time.
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
    // Prefer substantive quotes over one-liners
    return (b.quote?.length ?? 0) - (a.quote?.length ?? 0);
  });

  // Prefer longer 5★ quotes; drop thin one-liners when we have enough depth
  const strong = ranked.filter((r) => (r.rating ?? 0) >= 5 && (r.quote?.length ?? 0) >= 60);
  const pool = (strong.length >= SLOT_COUNT ? strong : ranked).slice(0, PLAYLIST_SIZE);

  // Pad to a multiple of 3 so every frame is a clean triplet
  while (pool.length >= SLOT_COUNT && pool.length % SLOT_COUNT !== 0) {
    pool.pop();
  }
  return pool;
}

/**
 * Rejuvenation-style "living" reviews with a pre-assigned playlist.
 * Desktop: three cards advance together through non-overlapping triplets.
 * Mobile: one card walks the same playlist in order.
 */
export function ReviewsFade({ reviews }: { reviews: Review[] }) {
  const playlist = useMemo(() => curatePlaylist(reviews), [reviews]);
  const tripletCount = Math.max(1, Math.floor(playlist.length / SLOT_COUNT));
  const [frame, setFrame] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (playlist.length < 2) return;

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
  }, [playlist.length]);

  if (playlist.length === 0) return null;

  // Desktop triplets: frame 0 → [0,1,2], frame 1 → [3,4,5], …
  const triplet = frame % tripletCount;
  const desktopReviews = Array.from({ length: Math.min(SLOT_COUNT, playlist.length) }, (_, slot) => {
    const idx = triplet * SLOT_COUNT + slot;
    return playlist[idx % playlist.length]!;
  });

  // Mobile: walk every review in playlist order
  const mobileReview = playlist[frame % playlist.length]!;

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-14 text-center sm:px-8 sm:py-24">
      <h2 className="font-display mx-auto max-w-[24ch] text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05]">
        Trusted across <span className="font-normal italic">central Wisconsin.</span>
      </h2>
      <div className="mt-3 flex items-center justify-center gap-3 sm:mt-5">
        <span className="text-sm tracking-[0.2em] text-[var(--rust)]" aria-hidden>
          ★★★★★
        </span>
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--soft)] sm:text-[0.76rem] sm:tracking-[0.18em]">
          {GOOGLE_RATING.average} on Google
          <span className="hidden sm:inline"> · Family-run since 1978</span>
        </span>
      </div>

      <div className="mt-8 md:hidden">
        <ReviewCard review={mobileReview} visible={visible} />
      </div>

      <div className="mt-16 hidden gap-8 text-left md:grid md:grid-cols-3">
        {desktopReviews.map((review, i) => (
          <ReviewCard key={i} review={review} visible={visible} />
        ))}
      </div>

      <Link
        href="/reviews"
        className="mt-8 inline-block text-[0.72rem] font-medium uppercase tracking-[0.18em] underline-offset-[6px] hover:underline sm:mt-12"
      >
        More reviews ›
      </Link>
    </section>
  );
}

function ReviewCard({ review, visible }: { review: Review; visible: boolean }) {
  return (
    <figure className="relative flex min-h-[14rem] flex-col border border-[var(--line)] p-5 text-left sm:min-h-[18rem] sm:p-8">
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
        <blockquote className="font-display mt-4 flex-1 text-[1.05rem] font-normal italic leading-[1.5] line-clamp-6 sm:mt-5 sm:text-[1.12rem] sm:leading-[1.55] sm:line-clamp-7">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--soft)] sm:mt-6 sm:text-[0.74rem]">
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
