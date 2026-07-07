"use client";

import Image from "next/image";
import { useState } from "react";
import { PhotoLightbox } from "@/components/photo-lightbox";
import type { TrackedPhoto } from "./types";

/**
 * The thumbnail grid for the Add Item flow. The first photo is the cover;
 * AI-generated photos are badged. Tapping a photo enlarges it in a lightbox
 * (step through all of them); the per-photo actions (make cover, clean
 * background, remove) live in the hover overlay. The capture buttons + file
 * inputs stay in the parent so they sit above this grid.
 */
export function PhotoGrid({
  photos,
  cleaningIdx,
  onSetCover,
  onClean,
  onRemove,
}: {
  photos: TrackedPhoto[];
  cleaningIdx: number | null;
  onSetCover: (i: number) => void;
  onClean: (i: number) => void;
  onRemove: (i: number) => void;
}) {
  const [zoom, setZoom] = useState<number | null>(null);
  if (photos.length === 0) return null;
  const lightboxPhotos = photos.map((p, i) => ({ src: p.url, alt: `Photo ${i + 1}` }));
  return (
    <>
      <PhotoLightbox photos={lightboxPhotos} index={zoom} onClose={() => setZoom(null)} />
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((p, i) => (
          <li key={i} className="group relative">
            <button
              type="button"
              onClick={() => setZoom(i)}
              aria-label={`Enlarge photo ${i + 1}`}
              className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded border border-border bg-[oklch(0.975_0.008_85)]"
            >
              <Image src={p.url} alt={`photo ${i + 1}`} fill className="object-cover" unoptimized />
            </button>
            {i === 0 ? (
              <span className="font-mono pointer-events-none absolute left-1 top-1 bg-[var(--brand-navy)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-white">
                Cover
              </span>
            ) : null}
            {p.source !== "real" ? (
              <span className="font-mono pointer-events-none absolute right-1 top-1 bg-amber-600/95 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-white">
                AI
              </span>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-1 bg-black/60 px-1 py-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
              {i !== 0 ? (
                <button
                  type="button"
                  onClick={() => onSetCover(i)}
                  className="text-[10px] font-medium text-white hover:underline"
                >
                  Make cover
                </button>
              ) : <span />}
              <button
                type="button"
                onClick={() => onClean(i)}
                disabled={cleaningIdx === i}
                className="text-[10px] font-medium text-white hover:underline disabled:opacity-50"
              >
                {cleaningIdx === i ? "Cleaning…" : "Clean bg"}
              </button>
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Remove photo"
                className="text-[10px] font-medium text-white hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
