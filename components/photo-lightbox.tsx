"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export interface LightboxPhoto {
  src: string;
  alt: string;
}

/**
 * Modal photo lightbox. Pure CSS animation, no library.
 *
 * Usage: render <PhotoLightbox photos={...} index={openIndex} onClose={...} />
 * Pass `index` as -1 / null to keep closed; pass a number to open at that
 * photo. Arrow keys + click-outside + Escape close or step. Body scroll
 * is locked while the lightbox is open.
 */
export function PhotoLightbox({
  photos,
  index,
  onClose,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
}) {
  const [active, setActive] = useState<number | null>(index);

  // Sync external open-index into local active state.
  useEffect(() => {
    setActive(index);
  }, [index]);

  const close = useCallback(() => {
    setActive(null);
    onClose();
  }, [onClose]);

  const next = useCallback(() => {
    setActive((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  const prev = useCallback(() => {
    setActive((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (active === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [active, close, next, prev]);

  if (active === null) return null;
  const p = photos[active];
  if (!p) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={close}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-6"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-6"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <figure
        className="relative h-[80vh] w-[92vw] max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={p.src}
          alt={p.alt}
          fill
          sizes="92vw"
          quality={86}
          className="object-contain"
          priority
        />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent px-4 py-4 text-sm text-white/90 md:text-base">
          <span className="line-clamp-2 max-w-[80%]">{p.alt}</span>
          <span className="font-mono shrink-0 text-xs uppercase tracking-[0.14em] text-white/70">
            {active + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
