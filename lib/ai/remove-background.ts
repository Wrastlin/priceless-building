/**
 * Catalog background cleanup for intake → marketing.
 *
 * Default: Gemini flash-image (generative). Cutout APIs (Photoroom /
 * remove.bg) punch through glass and leave warehouse junk in door/window
 * panes — wrong for our hard-goods catalog. Use `mode: "cutout"` only for
 * solid opaque products when you want a pure matte.
 *
 * Photoroom sandbox keys watermark and are ignored.
 */

import {
  callGemini,
  extractInlineImage,
  geminiKey,
  imageTooLarge,
  type ParsedImage,
} from "@/lib/ai/gemini";

export type RemoveBgProvider = "gemini" | "photoroom" | "remove.bg";
export type RemoveBgMode = "studio" | "cutout";

export type RemoveBgResult =
  | { ok: true; image: string; provider: RemoveBgProvider }
  | { ok: false; reason: string; status?: number };

const GEMINI_MODEL = "gemini-3.1-flash-image-preview";

/**
 * Studio catalog prompt — critical for doors/windows with glass.
 * Segmentation APIs treat glass as a hole; we need generative fill behind
 * the panes so the product looks like a clean e-commerce shot.
 */
const GEMINI_STUDIO_PROMPT = `You are producing a clean e-commerce catalog photo of ONE building-product item (door, window, vanity, cabinet, etc.).

CRITICAL — GLASS / LITES
Doors and windows often have glass. The glass panes MUST remain as real glass — do NOT punch holes, do NOT delete the glass, do NOT leave empty cutouts.
- Keep muntins, grilles, and the glass sheets themselves.
- Remove ONLY the old scene visible THROUGH the glass (warehouse, lumber, other doors, labels, clutter).
- Behind each pane, put a soft white studio wall so the glass still looks like glass: subtle reflections, slight specular highlights, and faint refraction are required so shoppers can tell there is glass in the openings.
- Frosted or patterned glass: keep the frost/pattern; only replace the junk behind it.

EVERYTHING ELSE
1. Keep the product unchanged: same shape, angle, colors, wood grain, hardware, panels, proportions. Do not redraw or invent details.
2. Replace everything outside the product silhouette with seamless pure white #FFFFFF.
3. Soft natural contact shadow on the floor is OK. No props, text, logos, or watermarks.
4. Leave a modest white margin around the product. Do not crop tightly.

Output one photoreal catalog image. Glass must read as glass on white — never as empty holes.`;

function photoroomKey(): string | undefined {
  const key = process.env.PHOTOROOM_API_KEY?.trim() || undefined;
  if (key?.startsWith("sandbox_")) return undefined;
  return key;
}

function removeBgKey(): string | undefined {
  return process.env.REMOVE_BG_API_KEY?.trim() || undefined;
}

export function photoroomIsSandbox(): boolean {
  const key = process.env.PHOTOROOM_API_KEY?.trim() || "";
  return key.startsWith("sandbox_");
}

/** Which provider will run for the default studio mode. */
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
  // Studio default is always Gemini when available.
  const provider: RemoveBgProvider | null = gemini
    ? "gemini"
    : photoroom
      ? "photoroom"
      : removeBg
        ? "remove.bg"
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

async function viaGemini(img: ParsedImage): Promise<RemoveBgResult> {
  if (!geminiKey()) return { ok: false, reason: "GEMINI_API_KEY not configured" };

  const result = await callGemini({
    model: GEMINI_MODEL,
    parts: [
      { text: GEMINI_STUDIO_PROMPT },
      { inline_data: { mime_type: img.mimeType, data: img.data } },
    ],
    timeoutMs: 90_000,
  });
  if (!result.ok) {
    return { ok: false, reason: result.error, status: result.status || 502 };
  }
  const out = extractInlineImage(result.json);
  if (!out) return { ok: false, reason: "No image in Gemini response" };
  return { ok: true, image: out, provider: "gemini" };
}

/**
 * Studio cleanup (default): Gemini fills white behind glass.
 * Cutout mode: Photoroom → remove.bg → Gemini (opaque products only).
 */
export async function removeBackground(
  img: ParsedImage,
  opts: { mode?: RemoveBgMode } = {},
): Promise<RemoveBgResult> {
  if (imageTooLarge(img)) {
    return { ok: false, reason: "Image exceeds the 8MB size limit", status: 413 };
  }

  const mode: RemoveBgMode = opts.mode ?? "studio";

  if (mode === "studio") {
    if (geminiKey()) return viaGemini(img);
    // No Gemini — last resort cutouts (will mishandle glass).
    if (photoroomKey()) {
      const r = await viaPhotoroom(img);
      if (r.ok) return r;
    }
    if (removeBgKey()) {
      const r = await viaRemoveBg(img);
      if (r.ok) return r;
    }
    return {
      ok: false,
      reason: "GEMINI_API_KEY required for studio catalog cleanup (glass-safe).",
    };
  }

  // Explicit hard cutout path
  if (photoroomKey()) {
    const r = await viaPhotoroom(img);
    if (r.ok) return r;
  }
  if (removeBgKey()) {
    const r = await viaRemoveBg(img);
    if (r.ok) return r;
  }
  if (geminiKey()) return viaGemini(img);

  return {
    ok: false,
    reason:
      "No background-removal key configured. Set GEMINI_API_KEY (recommended for doors/windows).",
  };
}
