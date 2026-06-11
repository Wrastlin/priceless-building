/**
 * Browser-only media + fetch helpers shared by the admin capture flows.
 *
 * Two jobs:
 *   1. Downscale + recompress photos in the browser BEFORE they're sent
 *      to an API route. Raw phone photos are 5-12 MB each; base64-encoding
 *      several of them blows past Vercel's ~4.5 MB request-body limit, and
 *      the platform answers with a PLAIN-TEXT "Request Entity Too Large"
 *      body. The old code then called res.json() on that and threw
 *      `Unexpected token 'R', "Request En"...`. Shrinking the images at
 *      capture time keeps every payload comfortably under the limit (and
 *      keeps the stored item JSON small, since photos persist as data URLs).
 *   2. Parse a fetch Response defensively, so a non-JSON error body (413,
 *      502 HTML, gateway text) surfaces a clean message instead of a
 *      JSON-parse exception.
 *
 * Must only be imported from client components ("use client") — it touches
 * Image, document, and canvas.
 */

const DEFAULT_MAX_DIM = 1600;
const DEFAULT_QUALITY = 0.82;

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Downscale a data URL so its longest edge is at most `maxDim` px and
 * re-encode as JPEG at `quality`. Returns the original string untouched
 * if anything fails (non-image, decode error, canvas blocked) so the
 * caller never loses the photo over a compression hiccup.
 */
export function downscaleDataUrl(
  dataUrl: string,
  maxDim = DEFAULT_MAX_DIM,
  quality = DEFAULT_QUALITY,
): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl.startsWith("data:image/")) {
      resolve(dataUrl);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      try {
        const { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        // Already small enough and not worth re-encoding a tiny image.
        const targetW = Math.max(1, Math.round(width * scale));
        const targetH = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const out = canvas.toDataURL("image/jpeg", quality);
        // Guard against a degenerate result that's somehow bigger.
        resolve(out && out.length < dataUrl.length ? out : dataUrl);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/** Read a File and return a downscaled JPEG data URL ready to POST. */
export async function fileToCompressedDataUrl(
  file: File,
  maxDim = DEFAULT_MAX_DIM,
  quality = DEFAULT_QUALITY,
): Promise<string> {
  const raw = await fileToDataUrl(file);
  return downscaleDataUrl(raw, maxDim, quality);
}

export interface SafeJson<T> {
  ok: boolean;
  status: number;
  data: T | null;
  /** Human-readable error when the response wasn't usable JSON or was an error status. */
  error?: string;
}

/**
 * Parse a Response without ever throwing on a non-JSON body. On a 413 we
 * return the friendly "images too large" message instead of leaking the
 * raw "Request Entity Too Large" text.
 */
export async function readJsonSafe<T>(res: Response): Promise<SafeJson<T>> {
  const text = await res.text().catch(() => "");
  let data: T | null = null;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }
  if (res.status === 413) {
    return {
      ok: false,
      status: 413,
      data,
      error: "Photos are too large to send. Try fewer photos, or retake them at a lower resolution.",
    };
  }
  if (!res.ok && !data) {
    return {
      ok: false,
      status: res.status,
      data: null,
      error: text ? `Server error ${res.status}: ${text.slice(0, 120)}` : `Server error ${res.status}`,
    };
  }
  return { ok: res.ok, status: res.status, data };
}
