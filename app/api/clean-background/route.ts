// POST /api/clean-background  { image: dataURL }
//   → 200 { image: dataURL, provider }  ← cleaned photo
//   → 200 { image: null, reason: "..." } ← bg removal couldn't run
//
// Production path: Photoroom Remove Background API (PHOTOROOM_API_KEY).
// Fallbacks: remove.bg → Gemini flash-image. Auth + rate limit via guardAiRoute.

import { NextResponse } from "next/server";
import { guardAiRoute } from "@/lib/ai/guard";
import { parseDataUrl } from "@/lib/ai/gemini";
import { removeBackground, removeBgConfigured } from "@/lib/ai/remove-background";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const guard = await guardAiRoute({ bucket: "clean-bg" });
  if (!guard.ok) return guard.response;

  if (!removeBgConfigured().provider) {
    return NextResponse.json({
      image: null,
      reason:
        "No background-removal key configured. Set PHOTOROOM_API_KEY (recommended).",
    });
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

  const result = await removeBackground(img);
  if (!result.ok) {
    const status = result.status && result.status >= 400 ? result.status : 502;
    return NextResponse.json({ image: null, reason: result.reason }, { status });
  }
  return NextResponse.json({ image: result.image, provider: result.provider });
}
