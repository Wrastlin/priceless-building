/**
 * Product background removal for intake → value → marketing.
 *
 * Preference order (best cutout quality first):
 *   1. Photoroom Remove Background API  (PHOTOROOM_API_KEY)
 *   2. remove.bg                        (REMOVE_BG_API_KEY)
 *   3. Gemini flash-image               (GEMINI_API_KEY) — generative fallback
 *
 * Photoroom is the paid production path: crisp subject edges, white studio
 * fill, HD size. Gemini is kept so local/dev still works before the key lands.
 */

import {
  callGemini,
  extractInlineImage,
  geminiKey,
  imageTooLarge,
  type ParsedImage,
} from "@/lib/ai/gemini";

export type RemoveBgProvider = "photoroom" | "remove.bg" | "gemini";

export type RemoveBgResult =
  | { ok: true; image: string; provider: RemoveBgProvider }
  | { ok: false; reason: string; status?: number };

const GEMINI_MODEL = "gemini-3.1-flash-image-preview";
const GEMINI_PROMPT = `Remove the entire background from this product photo and replace it with a pure white #FFFFFF background. Keep the product perfectly intact with crisp natural edges. Preserve the original colors, materials, and shadows on the product itself. Do not crop, resize, add text, change the angle, or stylize. The output should look like a clean e-commerce catalog photo of the same item against a seamless white backdrop.`;

function photoroomKey(): string | undefined {
  const key = process.env.PHOTOROOM_API_KEY?.trim() || undefined;
  // Sandbox keys watermark every cutout — unusable for catalog/marketing.
  // Prefer Gemini (or remove.bg) until a production Photoroom key is set.
  if (key?.startsWith("sandbox_")) return undefined;
  return key;
}

function removeBgKey(): string | undefined {
  return process.env.REMOVE_BG_API_KEY?.trim() || undefined;
}

/** True when a Photoroom key exists but is sandbox-only (watermarked). */
export function photoroomIsSandbox(): boolean {
  const key = process.env.PHOTOROOM_API_KEY?.trim() || "";
  return key.startsWith("sandbox_");
}

/** Which provider will run given current env (for admin / diagnostics). */
export function removeBgConfigured(): {
  provider: RemoveBgProvider | null;
  photoroom: boolean;
  removeBg: boolean;
  gemini: boolean;
  sandboxPhotoroom: boolean;
} {
  const photoroom = Boolean(photoroomKey());
  const removeBg = Boolean(removeBgKey());
  const gemini = Boolean(geminiKey());
  const provider: RemoveBgProvider | null = photoroom
    ? "photoroom"
    : removeBg
      ? "remove.bg"
      : gemini
        ? "gemini"
        : null;
  return { provider, photoroom, removeBg, gemini, sandboxPhotoroom: photoroomIsSandbox() };
}

function dataUrlToBlobParts(img: ParsedImage): { bytes: Buffer; filename: string; mime: string } {
  const bytes = Buffer.from(img.data, "base64");
  const ext = img.mimeType.includes("png")
    ? "png"
    : img.mimeType.includes("webp")
      ? "webp"
      : "jpg";
  return { bytes, filename: `product.${ext}`, mime: img.mimeType };
}

function bufferToDataUrl(buf: Buffer, mime: string): string {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/** Photoroom Basic segment API — best dedicated cutout for hard-goods. */
async function viaPhotoroom(img: ParsedImage): Promise<RemoveBgResult> {
  const key = photoroomKey();
  if (!key) return { ok: false, reason: "PHOTOROOM_API_KEY not configured" };

  const { bytes, filename, mime } = dataUrlToBlobParts(img);
  const form = new FormData();
  form.append(
    "image_file",
    new Blob([new Uint8Array(bytes)], { type: mime }),
    filename,
  );
  form.append("bg_color", "#FFFFFF");
  form.append("format", "png");
  form.append("size", "hd");
  form.append("crop", "false");

  try {
    const res = await fetch("https://sdk.photoroom.com/v1/segment", {
      method: "POST",
      headers: { "x-api-key": key },
      body: form,
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return {
        ok: false,
        reason: `Photoroom ${res.status}: ${txt.slice(0, 200)}`,
        status: res.status,
      };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const outMime = res.headers.get("content-type")?.split(";")[0] || "image/png";
    return { ok: true, image: bufferToDataUrl(buf, outMime), provider: "photoroom" };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Photoroom request failed",
      status: 504,
    };
  }
}

/** remove.bg — strong alternate if Photoroom isn't keyed yet. */
async function viaRemoveBg(img: ParsedImage): Promise<RemoveBgResult> {
  const key = removeBgKey();
  if (!key) return { ok: false, reason: "REMOVE_BG_API_KEY not configured" };

  const { bytes, filename, mime } = dataUrlToBlobParts(img);
  const form = new FormData();
  form.append(
    "image_file",
    new Blob([new Uint8Array(bytes)], { type: mime }),
    filename,
  );
  form.append("size", "auto");
  form.append("format", "png");
  form.append("bg_color", "#FFFFFF");

  try {
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": key },
      body: form,
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return {
        ok: false,
        reason: `remove.bg ${res.status}: ${txt.slice(0, 200)}`,
        status: res.status,
      };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true, image: bufferToDataUrl(buf, "image/png"), provider: "remove.bg" };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "remove.bg request failed",
      status: 504,
    };
  }
}

/** Generative fallback — already keyed via GEMINI_API_KEY. */
async function viaGemini(img: ParsedImage): Promise<RemoveBgResult> {
  if (!geminiKey()) return { ok: false, reason: "GEMINI_API_KEY not configured" };

  const result = await callGemini({
    model: GEMINI_MODEL,
    parts: [
      { text: GEMINI_PROMPT },
      { inline_data: { mime_type: img.mimeType, data: img.data } },
    ],
    timeoutMs: 60_000,
  });
  if (!result.ok) {
    return { ok: false, reason: result.error, status: result.status || 502 };
  }
  const out = extractInlineImage(result.json);
  if (!out) return { ok: false, reason: "No image in Gemini response" };
  return { ok: true, image: out, provider: "gemini" };
}

/**
 * Remove the background from a product photo (parsed data-URL image).
 * Tries Photoroom → remove.bg → Gemini in order.
 */
export async function removeBackground(img: ParsedImage): Promise<RemoveBgResult> {
  if (imageTooLarge(img)) {
    return { ok: false, reason: "Image exceeds the 8MB size limit", status: 413 };
  }

  if (photoroomKey()) {
    const r = await viaPhotoroom(img);
    if (r.ok) return r;
    // Fall through only on upstream failure so a bad key doesn't soft-lock intake.
  }

  if (removeBgKey()) {
    const r = await viaRemoveBg(img);
    if (r.ok) return r;
  }

  if (geminiKey()) {
    return viaGemini(img);
  }

  return {
    ok: false,
    reason:
      "No background-removal key configured. Set PHOTOROOM_API_KEY (recommended) or REMOVE_BG_API_KEY / GEMINI_API_KEY.",
  };
}
