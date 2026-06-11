/**
 * AI vision classifier for the Add Item flow.
 *
 * POST { images: dataURL[]; context?: string }
 *   or (legacy) { image: dataURL; context?: string }
 *   → 200 { suggestion: { title, subtitle, category, manufacturer,
 *                          dimensions, estimatedRetail } }
 *   → 200 { suggestion: null, reason: "..." } when the model can't
 *      provide useful suggestions (or no API key configured)
 *
 * Multi-image: pass all photos in `images[]`. Gemini sees them all in
 * one prompt, so a wide shot of the item + a close-up of the tag
 * combine into a single richer classification.
 *
 * Context: optional free-text the staffer adds before snapping (e.g.
 * "30-inch hollow-core interior door, slight scuff on bottom"). Gets
 * appended to the prompt for the model to use.
 *
 * Uses Gemini 3.1 Pro Preview per CLAUDE.md global rule. Degrades
 * gracefully if GEMINI_API_KEY is absent so the form still works
 * (the staffer just fills the fields manually).
 */

import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gemini-3.1-pro-preview";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const VALID_CATEGORIES = [
  "doors",
  "windows",
  "cabinets",
  "vanities",
  "countertops",
  "hardware",
  "lighting",
  "trim",
] as const;

interface Suggestion {
  title?: string;
  subtitle?: string;
  category?: string;
  manufacturer?: string;
  dimensions?: string;
  estimatedRetail?: number;
}

const PROMPT = `You are looking at a single product photo from a small-business surplus building-materials warehouse in Wausau, Wisconsin. Identify what the item is. Output STRICT JSON only, no prose, no markdown fences. Schema:

{
  "title": string,           // 8-14 word product title suitable for a tag and a Facebook Marketplace listing
  "subtitle": string,        // one short line of specs/condition (under 80 chars)
  "category": "doors" | "windows" | "cabinets" | "vanities" | "countertops" | "hardware" | "lighting" | "trim",
  "manufacturer": string,    // best guess from visible branding (e.g. "Masonite", "JELD-WEN", "Kohler"); empty string if not visible
  "dimensions": string,      // e.g. "32×80×1-3/4\\"" for a door, "36\\" W × 22\\" D" for a vanity; empty string if not estimable
  "estimatedRetail": number  // ballpark US retail price at Home Depot / Lowe's / Menards in 2026 dollars; integer
}

Rules:
- If you cannot identify the item with reasonable confidence, return {"category": "hardware", "title": "Unknown surplus item", "subtitle": "", "manufacturer": "", "dimensions": "", "estimatedRetail": 0}.
- Never invent a manufacturer.
- estimatedRetail must be a single number, no ranges, no currency symbols, no commas.`;

export async function POST(req: Request) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ suggestion: null, reason: "GEMINI_API_KEY not configured" });
  }

  let body: { image?: string; images?: string[]; context?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ suggestion: null, reason: "Invalid JSON body" }, { status: 400 });
  }
  // Accept legacy single-image OR new multi-image format.
  const imgs: string[] = Array.isArray(body.images)
    ? body.images.filter((i): i is string => typeof i === "string")
    : body.image
      ? [body.image]
      : [];
  if (imgs.length === 0) {
    return NextResponse.json({ suggestion: null, reason: "Missing image(s)" }, { status: 400 });
  }
  const parsedImages: { mimeType: string; data: string }[] = [];
  for (const img of imgs.slice(0, 6)) {
    const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(img);
    if (!m) continue;
    parsedImages.push({ mimeType: m[1], data: m[2] });
  }
  if (parsedImages.length === 0) {
    return NextResponse.json({ suggestion: null, reason: "No valid base64 data URLs" }, { status: 400 });
  }
  const context = typeof body.context === "string" ? body.context.trim().slice(0, 500) : "";

  const parts: { text?: string; inline_data?: { mime_type: string; data: string } }[] = [
    {
      text: `${PROMPT}\n\nNumber of source photos in this analysis: ${parsedImages.length}. Treat them as different angles or close-ups (e.g. wide shot + tag close-up) of the SAME single item.${context ? `\n\nADDITIONAL CONTEXT FROM STAFFER (use this — it overrides what you'd otherwise infer):\n${context}` : ""}`,
    },
    ...parsedImages.map((img) => ({
      inline_data: { mime_type: img.mimeType, data: img.data },
    })),
  ];

  try {
    const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.2,
          response_mime_type: "application/json",
        },
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json(
        { suggestion: null, reason: `Gemini ${res.status}: ${txt.slice(0, 200)}` },
        { status: 502 },
      );
    }
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ suggestion: null, reason: "No text in Gemini response" });
    }
    let parsed: Suggestion;
    try {
      parsed = JSON.parse(text) as Suggestion;
    } catch {
      return NextResponse.json({ suggestion: null, reason: "Gemini returned non-JSON" });
    }
    // Sanitize.
    const suggestion: Suggestion = {
      title: clean(parsed.title),
      subtitle: clean(parsed.subtitle),
      category:
        parsed.category && (VALID_CATEGORIES as readonly string[]).includes(parsed.category)
          ? parsed.category
          : undefined,
      manufacturer: clean(parsed.manufacturer),
      dimensions: clean(parsed.dimensions),
      estimatedRetail:
        typeof parsed.estimatedRetail === "number" && parsed.estimatedRetail > 0
          ? Math.round(parsed.estimatedRetail)
          : undefined,
    };
    return NextResponse.json({ suggestion });
  } catch (err) {
    return NextResponse.json(
      { suggestion: null, reason: err instanceof Error ? err.message : "unknown" },
      { status: 502 },
    );
  }
}

function clean(v?: string): string | undefined {
  if (!v) return undefined;
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  if (/^unknown/i.test(trimmed)) return undefined;
  return trimmed;
}
