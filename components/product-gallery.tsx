"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Product image gallery with a click-to-open lightbox.
 *
 * Renders the hero image up top + a thumbnail strip below. Clicking
 * the hero or any thumbnail opens a full-screen lightbox you can
 * navigate with the keyboard (Arrow keys), click (prev/next buttons),
 * or close with Escape / outside-click. No external deps.
 */
export function ProductGallery({
  title,
  images,
  stagedNote,
}: {
  title: string;
  images: string[];
  /** Optional badge to render on the hero when the first image is a staged render. */
  stagedNote?: string;
}) {
  // Drop any image whose file is unreachable (e.g. a gallery entry whose
  // source was never produced) so the strip shows real photos instead of a
  // broken-image icon. The catalog lives in Supabase, so a stale reference
  // there can only be healed at render time, not by editing a local file.
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const markFailed = useCallback((src: string | undefined) => {
    if (!src) return;
    setFailed((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }, []);
  const safe = images.filter((s): s is string => Boolean(s) && !failed.has(s));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const count = safe.length;
  const isOpen = activeIndex !== null && activeIndex < count;

  const open = useCallback((i: number) => setActiveIndex(i), []);
  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + count - 1) % count));
  }, [count]);
  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % count));
  }, [count]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, prev, next]);

  if (count === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => open(0)}
        className="group relative block aspect-square w-full overflow-hidden bg-[var(--muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-priceless)]"
        aria-label={`Open ${title} hero image at full size`}
      >
        <Image
          src={safe[0]}
          alt={title}
          fill
          priority
          sizes="(min-width:768px) 60vw, 100vw"
          quality={85}
          className="object-cover transition group-hover:scale-[1.01]"
          onError={() => markFailed(safe[0])}
        />
        {stagedNote ? (
          <span className="absolute right-3 bottom-3 bg-white/90 px-2 py-1 text-xs text-[var(--muted-foreground)]">
            {stagedNote}
          </span>
        ) : null}
        <span className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 bg-black/65 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          Click to zoom
        </span>
      </button>

      {count > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {safe.slice(0, 4).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => open(i)}
              className="relative aspect-square overflow-hidden bg-[var(--muted)] opacity-80 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-priceless)]"
              aria-label={`Open image ${i + 1} of ${count} at full size`}
            >
              <Image
                src={src}
                alt={`${title} view ${i + 1}`}
                fill
                sizes="(min-width:768px) 15vw, 25vw"
                className="object-cover"
                quality={60}
                onError={() => markFailed(src)}
              />
            </button>
          ))}
        </div>
      ) : null}

      {isOpen ? (
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} full-size image`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 outline-none md:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close image"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center bg-white/10 text-white transition hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          ) : null}
          <div className="relative max-h-full max-w-7xl">
            <Image
              src={safe[activeIndex]}
              alt={`${title} view ${activeIndex + 1} of ${count}`}
              width={2400}
              height={2400}
              sizes="100vw"
              quality={92}
              className="max-h-[90vh] w-auto select-none object-contain"
              draggable={false}
              onError={() => markFailed(safe[activeIndex])}
            />
            {count > 1 ? (
              <div className="mt-2 text-center text-xs text-white/80">
                {activeIndex + 1} / {count}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
