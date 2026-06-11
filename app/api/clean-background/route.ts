// POST /api/clean-background  { image: dataURL }
//   → 200 { image: dataURL }            ← cleaned photo
//   → 200 { image: null, reason: "..." } ← bg removal couldn't run
//
// Pipes a warehouse-floor product photo through Gemini Nano Banana
// (gemini-3.1-flash-image-preview) with an instruction to remove the
// background and replace it with pure white. Returns the same photo,
// cleaned, as a data URL the form can swap in place.
//
// Why this is optional and not automatic:
//   - Most surplus shots look better with the warehouse in the
//     background (it signals "real, in stock, brand new in box").
//   - Catalog hero shots benefit from the clean cutout though.
//   - Floor staff hit the button only on the photos they want sterile.

import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const MODEL = "gemini-3.1-flash-image-preview";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const PROMPT = `Remove the entire background from this product photo and replace it with a pure white #FFFFFF background. Keep the product perfectly intact with crisp natural edges. Preserve the original colors, materials, and shadows on the product itself. Do not crop, resize, add text, change the angle, or stylize. The output should look like a clean e-commerce catalog photo of the same item against a seamless white backdrop.`;

export async function POST(req: Request) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ image: null, reason: "GEMINI_API_KEY not configured" });
  }

  let body: { image?: string };
  try {
    body = (await req.json()) as { image?: string };
  } catch {
    return NextResponse.json({ image: null, reason: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.image || typeof body.image !== "string") {
    return NextResponse.json({ image: null, reason: "Missing image" }, { status: 400 });
  }
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(body.image);
  if (!match) {
    return NextResponse.json({ image: null, reason: "Not a base64 data URL" }, { status: 400 });
  }
  const mimeType = match[1];
  const data = match[2];

  try {
    const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              { inline_data: { mime_type: mimeType, data } },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json(
        { image: null, reason: `Gemini ${res.status}: ${txt.slice(0, 200)}` },
        { status: 502 },
      );
    }
    const json = (await res.json()) as {
      candidates?: {
        content?: { parts?: { inline_data?: { mime_type?: string; data?: string }; inlineData?: { mimeType?: string; data?: string } }[] };
      }[];
    };
    // Gemini image-out can use either snake_case or camelCase depending
    // on SDK version; check both.
    const parts = json.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      const inline = (part.inline_data ?? part.inlineData) as
        | { mime_type?: string; mimeType?: string; data?: string }
        | undefined;
      const partData = inline?.data;
      const partMime = inline?.mime_type ?? inline?.mimeType;
      if (partData && partMime) {
        return NextResponse.json({ image: `data:${partMime};base64,${partData}` });
      }
    }
    return NextResponse.json({ image: null, reason: "No image in Gemini response" });
  } catch (err) {
    return NextResponse.json(
      { image: null, reason: err instanceof Error ? err.message : "unknown" },
      { status: 502 },
    );
  }
}
