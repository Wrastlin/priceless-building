// POST /api/marketing-variants
//   body: { image: dataURL | "/same-origin/path", sku?: string, scenes: string[], item?: InlineItem }
//   200:  { variants: { scene: string; image: string | null; reason?: string }[] }
//
// Generates photo-realistic marketing variants of an existing item in
// the requested scenes (kitchen, bathroom, front-entry, etc.) using
// Gemini Nano Banana (gemini-3.1-flash-image-preview). The source image
// must be a real photo of the actual item; the prompt locks the model to
// preserving the product exactly and only changing the environment.
//
// Each variant succeeds or fails independently so one scene hitting a
// content filter doesn't kill the batch. Fan-out is capped (MAX_SCENES)
// and the whole route is rate-limited (guardAiRoute) because every scene
// is a separate paid image generation.

import { NextResponse } from "next/server";
import { guardAiRoute } from "@/lib/ai/guard";
import {
  callGemini,
  extractInlineImage,
  geminiKey,
  imageTooLarge,
  MAX_IMAGE_BYTES,
  parseDataUrl,
} from "@/lib/ai/gemini";
import { findBySku } from "@/lib/items/store";
import type { CatalogItem, Category } from "@/lib/items/types";
import { buildScenePrompt, type SceneKey, SCENES } from "@/lib/marketing/scene-prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = "gemini-3.1-flash-image-preview";
const VALID_KEYS = new Set(SCENES.map((s) => s.key as string));
const MAX_SCENES = 8;

const VALID_CATEGORIES: Category[] = [
  "doors", "windows", "cabinets", "vanities", "countertops", "hardware", "lighting", "trim",
];

// Inline item fields posted by the Add Item page, which has no saved
// SKU yet. buildScenePrompt only reads these descriptive fields.
interface InlineItem {
  title?: string;
  category?: string;
  subtitle?: string;
  dimensions?: string;
  manufacturer?: string;
}

function itemFromInline(inline: InlineItem): CatalogItem | null {
  const title = typeof inline.title === "string" ? inline.title.trim() : "";
  if (!title) return null;
  const category = (VALID_CATEGORIES as string[]).includes(inline.category ?? "")
    ? (inline.category as Category)
    : "hardware";
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

/**
 * Resolve the source image to { mimeType, data } base64. Accepts a data
 * URL, or a SAME-ORIGIN path/URL only. Arbitrary remote URLs are rejected
 * to close the SSRF where the server would fetch any attacker-supplied
 * host (e.g. cloud metadata / internal services).
 */
async function resolveSourceImage(
  req: Request,
  image: string,
): Promise<{ mimeType: string; data: string } | { error: NextResponse }> {
  const dataUrl = parseDataUrl(image);
  if (dataUrl) {
    if (imageTooLarge(dataUrl)) {
      return { error: NextResponse.json({ variants: [], reason: "Image exceeds the 8MB size limit" }, { status: 413 }) };
    }
    return dataUrl;
  }

  const origin = new URL(req.url).origin;
  let absolute: string;
  if (image.startsWith("/") && !image.startsWith("//")) {
    absolute = `${origin}${image}`;
  } else if (image.startsWith("http")) {
    let target: URL;
    try {
      target = new URL(image);
    } catch {
      return { error: NextResponse.json({ variants: [], reason: "Invalid source image URL" }, { status: 400 }) };
    }
    if (target.origin !== origin) {
      return { error: NextResponse.json({ variants: [], reason: "Source image must be on this site's own origin" }, { status: 400 }) };
    }
    absolute = target.toString();
  } else {
    return { error: NextResponse.json({ variants: [], reason: "Source image is not a data URL or same-origin path" }, { status: 400 }) };
  }

  try {
    const r = await fetch(absolute, { signal: AbortSignal.timeout(10_000) });
    if (!r.ok) throw new Error(`source fetch HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.byteLength > MAX_IMAGE_BYTES) {
      return { error: NextResponse.json({ variants: [], reason: "Source image exceeds the 8MB size limit" }, { status: 413 }) };
    }
    return {
      mimeType: r.headers.get("content-type") || "image/jpeg",
      data: buf.toString("base64"),
    };
  } catch (err) {
    return {
      error: NextResponse.json(
        { variants: [], reason: `Source image fetch failed: ${err instanceof Error ? err.message : "unknown"}` },
        { status: 502 },
      ),
    };
  }
}

export async function POST(req: Request) {
  // Image generation is the most expensive route (N images per call), so
  // it gets its own tighter rate-limit bucket.
  const guard = await guardAiRoute({ bucket: "variants", limit: 10 });
  if (!guard.ok) return guard.response;

  if (!geminiKey()) {
    return NextResponse.json({ variants: [], reason: "GEMINI_API_KEY not configured" });
  }

  let body: { image?: string; sku?: string; scenes?: string[]; item?: InlineItem };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ variants: [], reason: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.image || typeof body.image !== "string") {
    return NextResponse.json({ variants: [], reason: "Missing image" }, { status: 400 });
  }
  if (!Array.isArray(body.scenes) || body.scenes.length === 0) {
    return NextResponse.json({ variants: [], reason: "Missing scenes" }, { status: 400 });
  }

  // Two ways in: a saved SKU (Marketing compose page) or inline item
  // fields (Add Item page, before the item is saved).
  const item = (body.sku ? await findBySku(body.sku) : undefined) ?? (body.item ? itemFromInline(body.item) : null);
  if (!item) {
    return NextResponse.json(
      { variants: [], reason: body.sku ? `No item with sku ${body.sku}` : "Need a saved sku or an item with at least a title" },
      { status: body.sku ? 404 : 400 },
    );
  }

  const src = await resolveSourceImage(req, body.image);
  if ("error" in src) return src.error;

  const scenes = body.scenes
    .filter((s): s is string => typeof s === "string" && VALID_KEYS.has(s))
    .slice(0, MAX_SCENES);
  if (scenes.length === 0) {
    return NextResponse.json({ variants: [], reason: "No valid scenes" }, { status: 400 });
  }

  const results = await Promise.all(
    scenes.map(async (sceneKey) => {
      const result = await callGemini({
        model: MODEL,
        parts: [
          { text: buildScenePrompt(item, sceneKey as SceneKey) },
          { inline_data: { mime_type: src.mimeType, data: src.data } },
        ],
      });
      if (!result.ok) return { scene: sceneKey, image: null, reason: result.error };
      const image = extractInlineImage(result.json);
      return { scene: sceneKey, image, reason: image ? undefined : "No image in Gemini response" };
    }),
  );

  return NextResponse.json({ variants: results });
}
