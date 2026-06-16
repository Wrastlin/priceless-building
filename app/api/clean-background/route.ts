// POST /api/clean-background  { image: dataURL }
//   → 200 { image: dataURL }            ← cleaned photo
//   → 200 { image: null, reason: "..." } ← bg removal couldn't run
//
// Pipes a warehouse-floor product photo through Gemini Nano Banana
// (gemini-3.1-flash-image-preview) with an instruction to remove the
// background and replace it with pure white. Returns the same photo,
// cleaned, as a data URL the form can swap in place.
//
// Auth + rate limiting via guardAiRoute(); the Gemini call (key header,
// timeout, retry, error mapping) goes through lib/ai/gemini.ts.

import { NextResponse } from "next/server";
import { guardAiRoute } from "@/lib/ai/guard";
import {
  callGemini,
  extractInlineImage,
  geminiKey,
  imageTooLarge,
  parseDataUrl,
} from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gemini-3.1-flash-image-preview";

const PROMPT = `Remove the entire background from this product photo and replace it with a pure white #FFFFFF background. Keep the product perfectly intact with crisp natural edges. Preserve the original colors, materials, and shadows on the product itself. Do not crop, resize, add text, change the angle, or stylize. The output should look like a clean e-commerce catalog photo of the same item against a seamless white backdrop.`;

export async function POST(req: Request) {
  const guard = await guardAiRoute({ bucket: "clean-bg" });
  if (!guard.ok) return guard.response;

  if (!geminiKey()) {
    return NextResponse.json({ image: null, reason: "GEMINI_API_KEY not configured" });
  }

  let body: { image?: string };
  try {
    body = (await req.json()) as { image?: string };
  } catch {
    return NextResponse.json({ image: null, reason: "Invalid JSON body" }, { status: 400 });
  }
  const img = parseDataUrl(body.image);
  if (!img) {
    return NextResponse.json({ image: null, reason: "Not a base64 data URL" }, { status: 400 });
  }
  if (imageTooLarge(img)) {
    return NextResponse.json(
      { image: null, reason: "Image exceeds the 8MB size limit" },
      { status: 413 },
    );
  }

  const result = await callGemini({
    model: MODEL,
    parts: [
      { text: PROMPT },
      { inline_data: { mime_type: img.mimeType, data: img.data } },
    ],
  });
  if (!result.ok) {
    return NextResponse.json({ image: null, reason: result.error }, { status: 502 });
  }
  const out = extractInlineImage(result.json);
  if (!out) {
    return NextResponse.json({ image: null, reason: "No image in Gemini response" });
  }
  return NextResponse.json({ image: out });
}
