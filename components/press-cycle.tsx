"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type PressItem = {
  publisher: string;
  date: string;
  headline: string;
  teaser: string;
  attribution: string;
  url: string;
  image: string;
};

/**
 * Compact press section: a list of headlines on the left and a single
 * preview card on the right that auto-rotates through the stories. Click
 * any headline to jump to it; the timer pauses while the section is
 * hovered or keyboard-focused. Saves vertical space versus a stacked
 * grid of full-size cards.
 */
export function PressCycle({
  items,
  intervalMs = 6500,
}: {
  items: PressItem[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    timer.current = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, items.length, intervalMs]);

  if (items.length === 0) return null;
  const current = items[active];

  return (
    <div
      className="mt-10 grid items-start gap-10 md:grid-cols-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* LEFT. Compact list of headlines. */}
      <ol className="divide-y border-y border-[var(--border)] md:col-span-6">
        {items.map((p, i) => {
          const isActive = i === active;
          return (
            <li key={p.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group flex w-full items-start gap-5 py-5 text-left transition"
                aria-current={isActive}
              >
                <span
                  className={
                    "font-mono mt-1 w-7 shrink-0 text-[11px] tracking-tight " +
                    (isActive
                      ? "text-[var(--brand-priceless)]"
                      : "text-[var(--muted-foreground)]")
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3 text-xs text-[var(--muted-foreground)]">
                    <span className="font-medium text-[var(--foreground)]">
                      {p.publisher}
                    </span>
                    <span className="font-mono">{p.date}</span>
                  </div>
                  <h3
                    className={
                      "font-display mt-1.5 text-xl leading-snug transition md:text-2xl " +
                      (isActive
                        ? "text-[var(--foreground)]"
                        : "text-[var(--foreground)]/70 group-hover:text-[var(--foreground)]")
                    }
                  >
                    {p.headline}
                  </h3>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      {/* RIGHT. Rotating preview. Re-keys on each change so the image
          and copy crossfade cleanly. */}
      <a
        key={current.url}
        href={current.url}
        target="_blank"
        rel="noreferrer"
        className="group block overflow-hidden border border-[var(--border)] bg-white transition hover:border-[var(--brand-priceless)] md:col-span-6"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
          <Image
            src={current.image}
            alt={current.headline}
            fill
            sizes="(min-width:768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-6">
          <div className="flex items-baseline justify-between gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">
              {current.publisher}
            </span>
            <span className="font-mono">{current.date}</span>
          </div>
          <h3 className="font-display mt-3 text-2xl leading-snug">
            {current.headline}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
            {current.teaser}
          </p>
          <div className="mt-3 text-xs text-[var(--muted-foreground)]">
            {current.attribution}
          </div>
          <span className="font-mono mt-5 inline-block text-[11px] uppercase tracking-[0.22em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">
            Read the full story →
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 border-t border-[var(--border)] px-6 py-3">
          {items.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={
                "block h-1 rounded-full transition-all " +
                (i === active
                  ? "w-8 bg-[var(--brand-priceless)]"
                  : "w-3 bg-[var(--border)]")
              }
            />
          ))}
          <span className="ml-auto text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {active + 1} of {items.length}
          </span>
        </div>
      </a>
    </div>
  );
}
