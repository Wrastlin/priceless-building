// POST /api/analyze-and-price
//   body: { images: dataURL[]; context?: string }
//   200:  {
//     suggestion: { title, subtitle, category, manufacturer, dimensions, estimatedRetail } | null,
//     comparables: { source, title, price, url, image }[],
//     retailAverage: number,
//     suggestedTagPrice: number,
//     reason?: string
//   }
//
// The combined "do everything" endpoint behind the Add Item form's
// "Analyze and price" button. Pipes the photos (plus optional staffer
// context) through Gemini vision for product classification, then
// pivots into SerpAPI to find real live comparables for the
// AI-suggested title, and finally derives the tag price at 60% of
// the comparable retail average.
//
// Each piece is independent: if SerpAPI returns nothing, you still
// get the vision suggestion. If vision fails, the comparables run
// against the optional context text.

import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";
import {
  averagePrice,
  findComparables,
  suggestTagPrice,
} from "@/lib/comparable-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
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

const PROMPT = `You are looking at one or more product photos from a small-business surplus building-materials warehouse in Wausau, Wisconsin. Multiple photos of the SAME single item may be included (e.g. a wide shot plus a close-up of its identification tag). Combine information across all images.

Identify what the item is. Output STRICT JSON only, no prose, no markdown fences. Schema:

{
  "title": string,           // 8-14 word product title suitable for a tag and a Facebook Marketplace listing
  "subtitle": string,        // one short line of specs/condition (under 80 chars)
  "category": "doors" | "windows" | "cabinets" | "vanities" | "countertops" | "hardware" | "lighting" | "trim",
  "manufacturer": string,    // best guess from visible branding (e.g. "Masonite", "JELD-WEN", "Kohler"); empty string if not visible
  "dimensions": string,      // e.g. "32x80x1-3/4\\"" for a door, "36\\" W x 22\\" D" for a vanity; empty string if not estimable
  "estimatedRetail": number  // ballpark US retail price at Home Depot / Lowe's / Menards in 2026 dollars; integer
}

Rules:
- If you cannot identify the item with reasonable confidence, return {"category": "hardware", "title": "Unknown surplus item", "subtitle": "", "manufacturer": "", "dimensions": "", "estimatedRetail": 0}.
- Never invent a manufacturer.
- estimatedRetail must be a single number, no ranges, no currency symbols, no commas.
- If a model/SKU number is visible on a tag in any image, work it into the title.`;

interface Suggestion {
  title?: string;
  subtitle?: string;
  category?: string;
  manufacturer?: string;
  dimensions?: string;
  estimatedRetail?: number;
}

function clean(v?: string): string | undefined {
  if (!v) return undefined;
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  if (/^unknown/i.test(trimmed)) return undefined;
  return trimmed;
}

async function classifyImages(
  apiKey: string,
  images: { mimeType: string; data: string }[],
  context: string,
): Promise<{ suggestion: Suggestion | null; reason?: string }> {
  const parts: { text?: string; inline_data?: { mime_type: string; data: string } }[] = [
    {
      text: `${PROMPT}\n\nNumber of source photos in this analysis: ${images.length}. Treat them as different angles or close-ups of the SAME single item.${context ? `\n\nADDITIONAL CONTEXT FROM STAFFER (use this — it overrides what you'd otherwise infer):\n${context}` : ""}`,
    },
    ...images.map((img) => ({
      inline_data: { mime_type: img.mimeType, data: img.data },
    })),
  ];

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
    return { suggestion: null, reason: `Gemini ${res.status}: ${txt.slice(0, 200)}` };
  }
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return { suggestion: null, reason: "No text in Gemini response" };
  let parsed: Suggestion;
  try {
    parsed = JSON.parse(text) as Suggestion;
  } catch {
    return { suggestion: null, reason: "Gemini returned non-JSON" };
  }
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
  return { suggestion };
}

export async function POST(req: Request) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }

  let body: { images?: string[]; image?: string; context?: string; broaden?: boolean };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ reason: "Invalid JSON body" }, { status: 400 });
  }
  const broaden = body.broaden === true;

  const imgs: string[] = Array.isArray(body.images)
    ? body.images.filter((i): i is string => typeof i === "string")
    : body.image
      ? [body.image]
      : [];
  const context = typeof body.context === "string" ? body.context.trim().slice(0, 500) : "";

  if (imgs.length === 0 && !context) {
    return NextResponse.json(
      { reason: "Need at least one image or some context text" },
      { status: 400 },
    );
  }

  // 1) Vision classification (parallel-safe: catches its own errors).
  let suggestion: Suggestion | null = null;
  let visionReason: string | undefined;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && imgs.length > 0) {
    const parsedImages: { mimeType: string; data: string }[] = [];
    for (const img of imgs.slice(0, 6)) {
      const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(img);
      if (!m) continue;
      parsedImages.push({ mimeType: m[1], data: m[2] });
    }
    if (parsedImages.length > 0) {
      try {
        const { suggestion: s, reason } = await classifyImages(apiKey, parsedImages, context);
        suggestion = s;
        visionReason = reason;
      } catch (err) {
        visionReason = err instanceof Error ? err.message : "vision call failed";
      }
    }
  } else if (!apiKey) {
    visionReason = "GEMINI_API_KEY not configured";
  }

  // 2) Comparables: query is the AI-suggested title if we got one,
  //    otherwise the staffer's context text, otherwise nothing.
  const compareQuery = (suggestion?.title || context || "").trim();
  let comparables: Awaited<ReturnType<typeof findComparables>> = [];
  let comparablesReason: string | undefined;
  if (compareQuery && compareQuery.length >= 3) {
    try {
      comparables = await findComparables(compareQuery, { broaden });
    } catch (err) {
      comparablesReason = err instanceof Error ? err.message : "comparables call failed";
    }
  } else {
    comparablesReason = "Not enough info to search comparables";
  }

  const retailAverage = averagePrice(comparables);
  const suggestedTagPrice = retailAverage > 0 ? suggestTagPrice(retailAverage) : 0;

  return NextResponse.json({
    suggestion,
    comparables,
    retailAverage,
    suggestedTagPrice,
    reason: visionReason || comparablesReason,
  });
}
