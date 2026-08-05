/**
 * Browser-side, device-AGNOSTIC photo upload for the intake flows.
 *
 * "Ask for the best quality" means: upload the device's ORIGINAL file at full
 * resolution with NO downscaling or recompression, straight into Supabase
 * Storage via a per-file signed URL. That bypasses the ~4.5MB serverless
 * request-body limit that made multi-photo saves fail, and keeps only the
 * hosted public URL on the item row (no base64 bloat).
 *
 * The one exception is HEIC/HEIF: some browsers can't render it in <img>, so
 * it's re-encoded to a high-quality JPEG. The re-encode runs on the SAME
 * device that produced the file — which can always decode its own capture —
 * so this needs no per-device assumptions and no decoder library. If anything
 * fails, the untouched original is uploaded instead, so a photo is never lost.
 *
 * Client-only (uses <img>, canvas, the browser Supabase client).
 */
import { createClient } from "@/lib/supabase/client";

const BUCKET = "item-photos";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode failed"));
    img.src = src;
  });
}

/** Re-encode HEIC/HEIF to full-resolution high-quality JPEG for universal
 *  display. Everything else passes through untouched (original quality). */
async function toUniversalFile(file: File): Promise<File> {
  const isHeic = /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
  if (!isHeic) return file;
  let url: string | null = null;
  try {
    url = URL.createObjectURL(file);
    const img = await loadImage(url);
    if (!img.naturalWidth) return file;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.95));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // never lose the photo — the original bytes still upload
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
}

export type UploadProgress = (done: number, total: number) => void;

/**
 * Upload photos at full quality directly to Storage. Returns their public URLs
 * in the same order. Throws with a clear message if a file can't be prepared
 * or uploaded — the caller surfaces it so the employee can retry.
 */
export async function uploadItemPhotos(
  files: File[],
  onProgress?: UploadProgress,
): Promise<string[]> {
  if (files.length === 0) return [];
  const prepared = await Promise.all(files.map(toUniversalFile));

  const folder =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `intake-${Math.round(performance.now())}-${Math.floor(Math.random() * 1e6)}`;

  const res = await fetch("/api/admin/intake/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      folder,
      files: prepared.map((f) => ({ contentType: f.type || "image/jpeg" })),
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !Array.isArray(json.targets) || json.targets.length !== prepared.length) {
    throw new Error(json?.error || `Could not prepare upload (${res.status})`);
  }

  const supabase = createClient();
  const urls: string[] = [];
  for (let i = 0; i < prepared.length; i++) {
    const t = json.targets[i] as { path: string; token: string; publicUrl: string };
    const { error } = await supabase.storage
      .from(BUCKET)
      .uploadToSignedUrl(t.path, t.token, prepared[i]!, {
        contentType: prepared[i]!.type || "image/jpeg",
        upsert: true,
      });
    if (error) throw new Error(`Upload failed (photo ${i + 1}): ${error.message}`);
    urls.push(t.publicUrl);
    onProgress?.(i + 1, prepared.length);
  }
  return urls;
}
