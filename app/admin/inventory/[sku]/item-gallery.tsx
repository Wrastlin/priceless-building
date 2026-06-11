"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { addPhotosToItemAction } from "@/lib/actions/staging";

/**
 * Item detail gallery + "Add more photos" action.
 *
 * Cover image is rendered at the top; gallery photos sit underneath in
 * a 4-column strip. The button below the strip launches a multi-file
 * picker; each picked file is read as a data URL and appended via the
 * `addPhotosToItem` server action.
 */
export function ItemGallery({
  sku,
  cover,
  gallery,
  alt,
}: {
  sku: string;
  cover: string;
  gallery: string[];
  alt: string;
}) {
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function readFiles(files: FileList): Promise<string[]> {
    return Promise.all(
      Array.from(files).map(
        (f) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(f);
          }),
      ),
    );
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const dataUrls = await readFiles(files);
    e.target.value = "";
    startTransition(async () => {
      try {
        await addPhotosToItemAction(sku, dataUrls);
        toast.success(`Added ${dataUrls.length} photo${dataUrls.length === 1 ? "" : "s"}.`);
      } catch (err) {
        toast.error(`Add failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const allPhotos = [cover, ...gallery];

  return (
    <div>
      <div className="admin-card overflow-hidden">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="relative block aspect-square w-full bg-[#f4f4f3]"
        >
          <Image src={cover} alt={alt} fill className="object-cover" sizes="(min-width:1024px) 30vw, 100vw" quality={80} />
        </button>
        {gallery.length > 0 ? (
          <div className="grid grid-cols-4 gap-px border-t border-border bg-border">
            {gallery.slice(0, 8).map((g, i) => (
              <button
                key={`${g}-${i}`}
                type="button"
                onClick={() => setLightboxIndex(i + 1)}
                className="relative aspect-square overflow-hidden bg-[#f4f4f3]"
              >
                <Image src={g} alt={`${alt} ${i + 2}`} fill className="object-cover" sizes="20vw" quality={60} unoptimized={g.startsWith("data:")} />
              </button>
            ))}
          </div>
        ) : null}
        <div className="border-t border-border bg-[#fafaf9] px-3 py-2 text-xs text-muted-foreground">
          {allPhotos.length} photo{allPhotos.length === 1 ? "" : "s"} on file
        </div>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() => fileRef.current?.click()}
        className="admin-btn admin-btn-outline mt-3 w-full"
      >
        {pending ? "Adding…" : "+ Add photo"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={onFiles}
        className="hidden"
      />

      {lightboxIndex !== null ? (
        <Lightbox
          photos={allPhotos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  );
}

function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [i, setI] = useState(startIndex);
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        ✕
      </button>
      <button
        type="button"
        aria-label="Previous"
        onClick={(e) => {
          e.stopPropagation();
          setI((idx) => (idx - 1 + photos.length) % photos.length);
        }}
        className="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={(e) => {
          e.stopPropagation();
          setI((idx) => (idx + 1) % photos.length);
        }}
        className="absolute right-4 bottom-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-4 md:top-1/2 md:-translate-y-1/2"
      >
        ›
      </button>
      <div
        className="relative h-[80vh] w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photos[i]!}
          alt={`photo ${i + 1}`}
          fill
          sizes="90vw"
          className="object-contain"
          unoptimized={photos[i]!.startsWith("data:")}
        />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-white/70">
        {i + 1} / {photos.length}
      </div>
    </div>
  );
}
