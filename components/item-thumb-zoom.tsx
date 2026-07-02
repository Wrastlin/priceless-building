"use client";

import { useState } from "react";
import type { CatalogItem } from "@/lib/items/types";
import { ItemThumb } from "@/components/item-thumb";
import { PhotoLightbox } from "@/components/photo-lightbox";

/**
 * Click-to-enlarge wrapper around ItemThumb. Tapping the thumbnail opens the
 * shared PhotoLightbox with the item's cover photo + gallery (arrow keys /
 * swipe between them, Escape or click-outside to close). Items with no real
 * photo fall back to the plain category-icon thumb (nothing to enlarge).
 */
export function ItemThumbZoom({
  item,
  className,
  iconClass,
}: {
  item: CatalogItem;
  className?: string;
  iconClass?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  if (!item.image) {
    return <ItemThumb item={item} className={className} iconClass={iconClass} />;
  }

  const photos = [item.image, ...(item.gallery ?? [])]
    .filter(Boolean)
    .map((src) => ({ src: src as string, alt: item.title }));

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(0);
        }}
        aria-label={`Enlarge photo of ${item.title}`}
        className="group/zoom relative block cursor-zoom-in"
      >
        <ItemThumb item={item} className={className} iconClass={iconClass} />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] opacity-0 transition group-hover/zoom:bg-black/30 group-hover/zoom:opacity-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
          </svg>
        </span>
      </button>
      <PhotoLightbox photos={photos} index={open} onClose={() => setOpen(null)} />
    </>
  );
}
