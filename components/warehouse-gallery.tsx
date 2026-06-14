"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useRef } from "react";
import { SectionHead } from "@/components/section-head";
import { PhotoLightbox, type LightboxPhoto } from "@/components/photo-lightbox";
import { photosBy, type BusinessPhoto } from "@/lib/business-photos";

/**
 * Around-the-warehouse gallery.
 *
 * Twelve visible tiles, but the deck behind them carries dozens more
 * photos drawn from the full Facebook + Instagram archive. Tiles flip
 * on a stagger to reveal the next photo, so the section has constant
 * gentle motion. Click any tile to open a full-screen lightbox that
 * lets the visitor browse the entire deck with arrow keys, swipe-
 * compatible buttons, and escape-to-close.
 */
export function WarehouseGallery() {
  // Round-robin interleave across subject buckets so the gallery feels
  // varied. Pull from a larger pool than before so the rotation has
  // material to cycle through.
  const ordered = useMemo<BusinessPhoto[]>(() => {
    const buckets = [
      photosBy({ subject: "warehouse-interior" }),
      photosBy({ subject: "product-shot" }),
      photosBy({ subject: "install-kitchen" }),
      photosBy({ subject: "install-bath" }),
      photosBy({ subject: "community-event" }),
      photosBy({ subject: "mural" }),
      photosBy({ subject: "storefront-exterior" }),
      photosBy({ subject: "sign" }),
      photosBy({ subject: "team-or-staff" }),
      photosBy({ subject: "install-other" }),
      photosBy({ subject: "other" }),
    ].map((b) => [...b]);
    const out: BusinessPhoto[] = [];
    let progress = true;
    while (progress) {
      progress = false;
      for (const b of buckets) {
        const item = b.shift();
        if (item) {
          out.push(item);
          progress = true;
        }
      }
    }
    // Drop any photo that shows up in more than one bucket so a single src
    // can never be seeded onto two tiles.
    const seen = new Set<string>();
    return out.filter((p) => (seen.has(p.src) ? false : (seen.add(p.src), true)));
  }, []);

  const VISIBLE = 12;
  const photos: LightboxPhoto[] = ordered.map((p) => ({ src: p.src, alt: p.alt }));

  // Front / back of each visible tile, plus which side is currently up.
  const [front, setFront] = useState<LightboxPhoto[]>(() =>
    photos.slice(0, VISIBLE),
  );
  const [back, setBack] = useState<LightboxPhoto[]>(() =>
    photos.slice(VISIBLE, VISIBLE * 2),
  );
  const [flipped, setFlipped] = useState<boolean[]>(() =>
    Array.from({ length: VISIBLE }, () => false),
  );

  // Index map: which photos sit on the front/back of each tile, so
  // a click can hand the lightbox the correct deck-index.
  const frontIdx = useRef<number[]>(Array.from({ length: VISIBLE }, (_, i) => i));
  const backIdx = useRef<number[]>(
    Array.from({ length: VISIBLE }, (_, i) => VISIBLE + i).map((n) => n % photos.length),
  );

  const flippedRef = useRef<boolean[]>(Array.from({ length: VISIBLE }, () => false));
  const cursorRef = useRef(VISIBLE * 2);
  const tileCursor = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (photos.length <= VISIBLE) return;

    let cancelled = false;
    const FLIP_MS = 1600;
    const BETWEEN_MS = 2400;

    // Pick the next deck photo that is NOT currently on any face (other than
    // the one we're about to overwrite), so two tiles can never display the
    // same image at once. Walks the deck in order and only falls back to the
    // raw next index if the deck is too small to stay unique.
    function pickIndex(excludeTile: number, excludeSide: "front" | "back") {
      const shown = new Set<string>();
      for (let k = 0; k < VISIBLE; k++) {
        const fi = frontIdx.current[k];
        const bi = backIdx.current[k];
        if (typeof fi === "number" && !(k === excludeTile && excludeSide === "front")) shown.add(photos[fi]!.src);
        if (typeof bi === "number" && !(k === excludeTile && excludeSide === "back")) shown.add(photos[bi]!.src);
      }
      for (let step = 0; step < photos.length; step++) {
        const idx = cursorRef.current % photos.length;
        cursorRef.current += 1;
        if (!shown.has(photos[idx]!.src)) return idx;
      }
      const idx = cursorRef.current % photos.length;
      cursorRef.current += 1;
      return idx;
    }

    function tick() {
      if (cancelled) return;
      const tile = tileCursor.current % VISIBLE;
      tileCursor.current += 1;

      const toggled = [...flippedRef.current];
      toggled[tile] = !toggled[tile];
      flippedRef.current = toggled;
      setFlipped(toggled);

      window.setTimeout(() => {
        if (cancelled) return;
        // The flip has landed; the side now facing AWAY is safe to refresh.
        const side: "front" | "back" = flippedRef.current[tile] ? "front" : "back";
        const idx = pickIndex(tile, side);
        if (side === "front") {
          setFront((p) => { const copy = [...p]; copy[tile] = photos[idx]!; return copy; });
          frontIdx.current[tile] = idx;
        } else {
          setBack((p) => { const copy = [...p]; copy[tile] = photos[idx]!; return copy; });
          backIdx.current[tile] = idx;
        }
        window.setTimeout(tick, BETWEEN_MS);
      }, FLIP_MS);
    }
    const t = window.setTimeout(tick, BETWEEN_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [photos]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function openTile(tile: number) {
    const visibleIdx = flipped[tile] ? backIdx.current[tile] : frontIdx.current[tile];
    setOpenIndex(typeof visibleIdx === "number" ? visibleIdx : 0);
  }

  if (ordered.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <SectionHead
          headline="Around the warehouse."
          sub="A slice of what is on the floor, in the showroom, and on the walls. Click any tile to open the full gallery."
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {Array.from({ length: VISIBLE }).map((_, i) => {
            const f = front[i];
            const b = back[i];
            const isFlipped = flipped[i];
            return (
              <li key={i} style={{ perspective: "1200px" }}>
                <button
                  type="button"
                  onClick={() => openTile(i)}
                  aria-label="Open photo"
                  className="group block w-full text-left"
                >
                  <div
                    className="relative aspect-[4/3] w-full transition-transform duration-[1500ms]"
                    style={{
                      transformStyle: "preserve-3d",
                      transitionTimingFunction: "cubic-bezier(.4,.05,.2,1)",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    <div
                      className="absolute inset-0 overflow-hidden bg-[var(--muted)] ring-1 ring-transparent transition group-hover:ring-[var(--brand-priceless)]"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {f && (
                        <Image
                          src={f.src}
                          alt={f.alt}
                          fill
                          sizes="(min-width:768px) 25vw, 50vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                          quality={75}
                          loading="lazy"
                        />
                      )}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/0 text-white opacity-0 transition group-hover:bg-white/90 group-hover:text-[var(--brand-priceless)] group-hover:opacity-100"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                      </span>
                    </div>
                    <div
                      className="absolute inset-0 overflow-hidden bg-[var(--muted)] ring-1 ring-transparent transition group-hover:ring-[var(--brand-priceless)]"
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
                          sizes="(min-width:768px) 25vw, 50vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                          quality={75}
                          loading="lazy"
                        />
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-end gap-4 border-t border-[var(--border)] pt-8">
          <button
            type="button"
            onClick={() => setOpenIndex(0)}
            className="btn btn-priceless"
          >
            Open full gallery →
          </button>
        </div>
      </div>

      <PhotoLightbox
        photos={photos}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
