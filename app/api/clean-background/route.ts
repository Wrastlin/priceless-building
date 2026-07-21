// POST /api/clean-background
//   { image: dataURL, mode?: "studio" | "cutout" }
//   → 200 { image, provider }
//
// Default mode is "studio" (Gemini) — fills white BEHIND glass so doors/
// windows don't show warehouse junk through the panes. Pass mode:"cutout"
// only for opaque products when you want a hard matte.

import { NextResponse } from "next/server";
import { guardAiRoute } from "@/lib/ai/guard";
import { parseDataUrl } from "@/lib/ai/gemini";
import {
  removeBackground,
  removeBgConfigured,
  type RemoveBgMode,
} from "@/lib/ai/remove-background";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(req: Request) {
  const guard = await guardAiRoute({ bucket: "clean-bg" });
  if (!guard.ok) return guard.response;

  if (!removeBgConfigured().provider) {
    return NextResponse.json({
      image: null,
      reason: "GEMINI_API_KEY not configured (required for studio catalog cleanup).",
    });
  }

  let body: { image?: string; mode?: string };
  try {
    body = (await req.json()) as { image?: string; mode?: string };
  } catch {
    return NextResponse.json({ image: null, reason: "Invalid JSON body" }, { status: 400 });
  }
  const img = parseDataUrl(body.image);
  if (!img) {
    return NextResponse.json({ image: null, reason: "Not a base64 data URL" }, { status: 400 });
  }

  const mode: RemoveBgMode = body.mode === "cutout" ? "cutout" : "studio";
  const result = await removeBackground(img, { mode });
  if (!result.ok) {
    const status = result.status && result.status >= 400 ? result.status : 502;
    return NextResponse.json({ image: null, reason: result.reason }, { status });
  }
  return NextResponse.json({ image: result.image, provider: result.provider, mode });
}
