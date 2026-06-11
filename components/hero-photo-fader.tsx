"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface HeroPhotoSource {
  src: string;
  alt: string;
}

export function HeroPhotoFader({
  photos,
  intervalMs = 5000,
}: {
  photos: HeroPhotoSource[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [photos.length, intervalMs]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--muted)]">
      {photos.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt={i === 0 ? p.alt : ""}
          aria-hidden={i === index ? undefined : true}
          fill
          sizes="(min-width:768px) 60vw, 100vw"
          priority={i === 0}
          quality={82}
          className={
            "object-cover transition-opacity duration-[1400ms] ease-in-out " +
            (i === index ? "opacity-100" : "opacity-0")
          }
        />
      ))}
    </div>
  );
}
