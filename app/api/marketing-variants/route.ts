// POST /api/marketing-variants
//   body: { image: dataURL, sku: string, scenes: string[] }
//   200:  { variants: { scene: string; image: string | null; reason?: string }[] }
//
// Generates photo-realistic marketing variants of an existing item in
// the requested scenes (kitchen, bathroom, front-entry, etc.) using
// Gemini Nano Banana (gemini-3.1-flash-image-preview). The source
// image must be a real photo of the actual item — the prompt locks
// the model to preserving the product exactly and only changing the
// environment.
//
// Multiple scenes run in parallel. Each variant succeeds or fails
// independently so a single scene that hits a content filter doesn't
// kill the batch.

import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";
import { findBySku } from "@/lib/items/store";
import type { CatalogItem, Category } from "@/lib/items/types";
import { buildScenePrompt, type SceneKey, SCENES } from "@/lib/marketing/scene-prompts";

const VALID_CATEGORIES: Category[] = [
  "doors", "windows", "cabinets", "vanities", "countertops", "hardware", "lighting", "trim",
];

// Inline item fields posted by the Add Item page, which has no saved
// SKU yet. buildScenePrompt only reads these descriptive fields, so a
// minimal stand-in is enough to drive the image prompt.
interface InlineItem {
  title?: string;
  category?: string;
  subtitle?: string;
  dimensions?: string;
  manufacturer?: string;
}

function itemFromInline(inline: InlineItem): CatalogItem | null {
  const title = typeof inline.title === "string" ? inline.title.trim() : "";
  const category = (VALID_CATEGORIES as string[]).includes(inline.category ?? "")
    ? (inline.category as Category)
    : "hardware";
  if (!title) return null;
  return {
    id: "pending",
    sku: "pending",
    brand: "priceless",
    category,
    status: "draft",
    title,
    subtitle: typeof inline.subtitle === "string" ? inline.subtitle.trim() : "",
    price: 0,
    image: "",
    inStock: 1,
    dimensions: typeof inline.dimensions === "string" ? inline.dimensions.trim() || undefined : undefined,
    manufacturer: typeof inline.manufacturer === "string" ? inline.manufacturer.trim() || undefined : undefined,
  };
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-3.1-flash-image-preview";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const VALID_KEYS = new Set(SCENES.map((s) => s.key as string));

interface VariantResult {
  scene: string;
  image: string | null;
  reason?: string;
}

async function generateOne(
  apiKey: string,
  prompt: string,
  mimeType: string,
  data: string,
): Promise<{ image: string | null; reason?: string }> {
  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data } },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    return { image: null, reason: `Gemini ${res.status}: ${txt.slice(0, 200)}` };
  }
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: unknown[] } }[];
  };
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inline = (part as { inline_data?: { mime_type?: string; data?: string }; inlineData?: { mimeType?: string; data?: string } });
    const blob = (inline.inline_data ?? inline.inlineData) as
      | { mime_type?: string; mimeType?: string; data?: string }
      | undefined;
    const partData = blob?.data;
    const partMime = blob?.mime_type ?? blob?.mimeType;
    if (partData && partMime) {
      return { image: `data:${partMime};base64,${partData}` };
    }
  }
  return { image: null, reason: "No image in Gemini response" };
}

export async function POST(req: Request) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ variants: [], reason: "GEMINI_API_KEY not configured" });
  }

  let body: { image?: string; sku?: string; scenes?: string[]; item?: InlineItem };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ variants: [], reason: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.image) {
    return NextResponse.json({ variants: [], reason: "Missing image" }, { status: 400 });
  }
  if (!Array.isArray(body.scenes) || body.scenes.length === 0) {
    return NextResponse.json({ variants: [], reason: "Missing scenes" }, { status: 400 });
  }

  // Two ways in: a saved SKU (Marketing compose page) or inline item
  // fields (Add Item page, before the item is saved). Prefer the saved
  // item when both are present.
  const item = (body.sku ? await findBySku(body.sku) : undefined) ?? (body.item ? itemFromInline(body.item) : null);
  if (!item) {
    return NextResponse.json(
      { variants: [], reason: body.sku ? `No item with sku ${body.sku}` : "Need a saved sku or an item with at least a title" },
      { status: body.sku ? 404 : 400 },
    );
  }

  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(body.image);
  let mimeType: string;
  let data: string;
  if (match) {
    mimeType = match[1];
    data = match[2];
  } else if (body.image.startsWith("http") || body.image.startsWith("/")) {
    // URL reference — fetch + inline.
    try {
      const origin = new URL(req.url).origin;
      const absolute = body.image.startsWith("http") ? body.image : `${origin}${body.image}`;
      const r = await fetch(absolute);
      if (!r.ok) throw new Error(`source fetch HTTP ${r.status}`);
      mimeType = r.headers.get("content-type") || "image/jpeg";
      const buf = Buffer.from(await r.arrayBuffer());
      data = buf.toString("base64");
    } catch (err) {
      return NextResponse.json(
        { variants: [], reason: `Source image fetch failed: ${err instanceof Error ? err.message : "unknown"}` },
        { status: 502 },
      );
    }
  } else {
    return NextResponse.json({ variants: [], reason: "Source image is not a data URL or fetchable URL" }, { status: 400 });
  }

  const scenes = body.scenes.filter((s): s is string => typeof s === "string" && VALID_KEYS.has(s));
  if (scenes.length === 0) {
    return NextResponse.json({ variants: [], reason: "No valid scenes" }, { status: 400 });
  }

  const results = await Promise.all(
    scenes.map(async (sceneKey): Promise<VariantResult> => {
      try {
        const prompt = buildScenePrompt(item, sceneKey as SceneKey);
        const { image, reason } = await generateOne(apiKey, prompt, mimeType, data);
        return { scene: sceneKey, image, reason };
      } catch (err) {
        return {
          scene: sceneKey,
          image: null,
          reason: err instanceof Error ? err.message : "unknown",
        };
      }
    }),
  );

  return NextResponse.json({ variants: results });
}
