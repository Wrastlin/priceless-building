"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Textless ambient video background — makes a section feel alive while the
 * site's own type does the talking (motion display doctrine, 2026-07-23).
 * Falls back to the poster image for prefers-reduced-motion and until the
 * clip can play. Clips live in /public/ambient as muted seamless loops.
 */
export function AmbientVideo({
  src,
  poster,
  alt,
  className = "",
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (still) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="(max-width:768px) 100vw, 33vw"
        quality={80}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <video
      key={src}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={alt}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
