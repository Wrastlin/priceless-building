"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export interface PortfolioPhoto {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Dynamic install portfolio. Six tiles on desktop / four on mobile,
 * each tile flips on a stagger to reveal the next photo. Backed by a
 * deck of real install photos so the rotation never repeats the same
 * image side-by-side.
 *
 * Animation:
 *  - one tile flips at a time (cycles in a fixed order)
 *  - 3D rotateY w/ preserve-3d
 *  - reduces to no-motion if the user prefers reduced motion
 */
export function PortfolioFlip({
  deck,
  tilesDesktop = 6,
  tilesMobile = 4,
  flipMs = 1800,
  betweenMs = 2200,
}: {
  deck: PortfolioPhoto[];
  tilesDesktop?: number;
  tilesMobile?: number;
  flipMs?: number;
  betweenMs?: number;
}) {
  const tilesNeeded = Math.max(tilesDesktop, tilesMobile);
  const initial = useMemo(() => deck.slice(0, tilesNeeded), [deck, tilesNeeded]);

  const [front, setFront] = useState<PortfolioPhoto[]>(initial);
  const [back, setBack] = useState<PortfolioPhoto[]>(() =>
    deck.slice(tilesNeeded, tilesNeeded * 2).concat(deck.slice(0, Math.max(0, tilesNeeded * 2 - deck.length))).slice(0, tilesNeeded),
  );
  const [flipped, setFlipped] = useState<boolean[]>(() => Array.from({ length: tilesNeeded }, () => false));

  const cursorRef = useRef(tilesNeeded * 2);
  const tileRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (deck.length <= tilesNeeded) return;

    let cancelled = false;

    function scheduleNext() {
      if (cancelled) return;
      window.setTimeout(() => {
        if (cancelled) return;
        // Flip the next tile in rotation.
        const i = tileRef.current % tilesNeeded;
        tileRef.current += 1;

        setFlipped((f) => {
          const next = [...f];
          next[i] = !next[i];
          return next;
        });

        // After the flip animation lands, swap the side that's now
        // hidden to the next photo from the deck so the deck keeps
        // moving even after we revisit a tile.
        window.setTimeout(() => {
          if (cancelled) return;
          const nextPhoto = deck[cursorRef.current % deck.length];
          cursorRef.current += 1;
          // The just-flipped tile is now showing the OTHER side.
          // Refresh the side that is no longer visible.
          setFlipped((f) => {
            const tileNowFlipped = f[i];
            if (tileNowFlipped) {
              setFront((prev) => {
                const copy = [...prev];
                copy[i] = nextPhoto;
                return copy;
              });
            } else {
              setBack((prev) => {
                const copy = [...prev];
                copy[i] = nextPhoto;
                return copy;
              });
            }
            return f;
          });
          scheduleNext();
        }, flipMs);
      }, betweenMs);
    }

    scheduleNext();
    return () => {
      cancelled = true;
    };
  }, [deck, tilesNeeded, flipMs, betweenMs]);

  return (
    <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {Array.from({ length: tilesNeeded }).map((_, i) => {
        const f = front[i];
        const b = back[i];
        const isFlipped = flipped[i];
        const tileClass =
          i >= tilesMobile && i < tilesDesktop
            ? "hidden md:block"
            : i >= tilesDesktop
              ? "hidden"
              : "block";
        return (
          <li
            key={i}
            className={`${tileClass} [perspective:1200px]`}
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative aspect-[4/3] w-full transition-transform duration-[1600ms] [transform-style:preserve-3d]"
              style={{
                transformStyle: "preserve-3d",
                transitionTimingFunction: "cubic-bezier(.4,.05,.2,1)",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0 overflow-hidden bg-[var(--muted)] [backface-visibility:hidden]"
                style={{ backfaceVisibility: "hidden" }}
              >
                {f && (
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    sizes="(min-width:768px) 33vw, 50vw"
                    className="object-cover"
                    quality={78}
                  />
                )}
              </div>
              <div
                className="absolute inset-0 overflow-hidden bg-[var(--muted)] [backface-visibility:hidden]"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {b && (
                  <Image
                    src={b.src}
                    alt={b.alt}
                    fill
                    sizes="(min-width:768px) 33vw, 50vw"
                    className="object-cover"
                    quality={78}
                  />
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
