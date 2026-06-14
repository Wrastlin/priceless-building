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

  // De-dupe the deck by src so the same photo can't be seeded onto two
  // tiles, and so the rotation has a clean set of unique images to order.
  const pool = useMemo(() => {
    const seen = new Set<string>();
    return deck.filter((p) => (seen.has(p.src) ? false : (seen.add(p.src), true)));
  }, [deck]);

  const initialFront = useMemo(() => pool.slice(0, tilesNeeded), [pool, tilesNeeded]);
  const initialBack = useMemo(() => pool.slice(tilesNeeded, tilesNeeded * 2), [pool, tilesNeeded]);

  const [front, setFront] = useState<PortfolioPhoto[]>(initialFront);
  const [back, setBack] = useState<PortfolioPhoto[]>(initialBack);
  const [flipped, setFlipped] = useState<boolean[]>(() => Array.from({ length: tilesNeeded }, () => false));

  // Refs mirror the live faces so the rotation can read "what is on every
  // face right now" synchronously when choosing the next photo.
  const frontRef = useRef(initialFront);
  const backRef = useRef(initialBack);
  const flippedRef = useRef<boolean[]>(Array.from({ length: tilesNeeded }, () => false));
  const cursorRef = useRef(tilesNeeded * 2);
  const tileRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (pool.length <= tilesNeeded) return;

    let cancelled = false;

    // Next photo not currently on any face (other than the one being
    // overwritten), so two tiles never show the same image at once.
    function pickNext(excludeTile: number, excludeSide: "front" | "back") {
      const shown = new Set<string>();
      for (let k = 0; k < tilesNeeded; k++) {
        const fp = frontRef.current[k];
        const bp = backRef.current[k];
        if (fp && !(k === excludeTile && excludeSide === "front")) shown.add(fp.src);
        if (bp && !(k === excludeTile && excludeSide === "back")) shown.add(bp.src);
      }
      for (let step = 0; step < pool.length; step++) {
        const cand = pool[cursorRef.current % pool.length];
        cursorRef.current += 1;
        if (cand && !shown.has(cand.src)) return cand;
      }
      const cand = pool[cursorRef.current % pool.length]!;
      cursorRef.current += 1;
      return cand;
    }

    function scheduleNext() {
      if (cancelled) return;
      window.setTimeout(() => {
        if (cancelled) return;
        // Flip the next tile in rotation.
        const i = tileRef.current % tilesNeeded;
        tileRef.current += 1;

        const toggled = [...flippedRef.current];
        toggled[i] = !toggled[i];
        flippedRef.current = toggled;
        setFlipped(toggled);

        // Once the flip lands, refresh the side that is now hidden with a
        // photo not shown anywhere else, so the deck keeps moving without
        // ever doubling an image.
        window.setTimeout(() => {
          if (cancelled) return;
          const side: "front" | "back" = flippedRef.current[i] ? "front" : "back";
          const next = pickNext(i, side);
          if (side === "front") {
            const copy = [...frontRef.current];
            copy[i] = next;
            frontRef.current = copy;
            setFront(copy);
          } else {
            const copy = [...backRef.current];
            copy[i] = next;
            backRef.current = copy;
            setBack(copy);
          }
          scheduleNext();
        }, flipMs);
      }, betweenMs);
    }

    scheduleNext();
    return () => {
      cancelled = true;
    };
  }, [pool, tilesNeeded, flipMs, betweenMs]);

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
