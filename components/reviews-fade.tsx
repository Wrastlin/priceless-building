"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Review } from "@/lib/google-reviews";
import { GOOGLE_RATING } from "@/lib/google-reviews";

const DWELL_MS = 14000;
const FADE_MS = 1400;

/**
 * Rejuvenation-style "living" reviews: three slots on desktop (staggered
 * crossfades through the pool), one fading card on mobile so the section
 * stays short but never static.
 */
export function ReviewsFade({ reviews }: { reviews: Review[] }) {
  const pool = reviews.length > 0 ? reviews : [];
  const slots = Math.min(3, Math.max(1, pool.length));

  if (pool.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-14 text-center sm:px-8 sm:py-24">
      <p className="eyebrow">Since 1978</p>
      <h2 className="font-display mx-auto mt-3 max-w-[24ch] text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05] sm:mt-4">
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

      {/* Mobile: one living card */}
      <div className="mt-8 md:hidden">
        <ReviewSlot reviews={pool} startIndex={0} />
      </div>

      {/* Desktop: three staggered living cards */}
      <div className="mt-16 hidden gap-8 text-left md:grid md:grid-cols-3">
        {Array.from({ length: slots }, (_, slot) => (
          <ReviewSlot
            key={slot}
            reviews={pool}
            startIndex={slot % pool.length}
            staggerMs={slot * 4500}
          />
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

function ReviewSlot({
  reviews,
  startIndex,
  staggerMs = 0,
}: {
  reviews: Review[];
  startIndex: number;
  staggerMs?: number;
}) {
  const [index, setIndex] = useState(startIndex);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (reviews.length < 2) return;

    let cancelled = false;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let tickTimer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (delay: number) => {
      tickTimer = setTimeout(() => {
        if (cancelled) return;
        setVisible(false);
        fadeTimer = setTimeout(() => {
          if (cancelled) return;
          setIndex((i) => (i + 1) % reviews.length);
          setVisible(true);
          schedule(DWELL_MS);
        }, FADE_MS);
      }, delay);
    };

    schedule(staggerMs + DWELL_MS);

    return () => {
      cancelled = true;
      clearTimeout(tickTimer);
      clearTimeout(fadeTimer);
    };
  }, [reviews.length, staggerMs]);

  const review = reviews[index] ?? reviews[0];

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
