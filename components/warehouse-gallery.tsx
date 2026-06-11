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
    return out;
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

    function tick() {
      if (cancelled) return;
      const tile = tileCursor.current % VISIBLE;
      tileCursor.current += 1;

      setFlipped((f) => {
        const next = [...f];
        next[tile] = !next[tile];
        return next;
      });

      window.setTimeout(() => {
        if (cancelled) return;
        const nextPhotoIdx = cursorRef.current % photos.length;
        cursorRef.current += 1;
        // After the flip lands the side that's now facing AWAY is safe
        // to refresh with the next deck photo. flipped[tile] just
        // changed value above, so AWAY = !current visible side.
        setFlipped((f) => {
          const tileNowFlipped = f[tile];
          if (tileNowFlipped) {
            // Front is hidden now; swap front photo.
            setFront((p) => {
              const copy = [...p];
              copy[tile] = photos[nextPhotoIdx]!;
              return copy;
            });
            frontIdx.current[tile] = nextPhotoIdx;
          } else {
            setBack((p) => {
              const copy = [...p];
              copy[tile] = photos[nextPhotoIdx]!;
              return copy;
            });
            backIdx.current[tile] = nextPhotoIdx;
          }
          return f;
        });
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
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
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
