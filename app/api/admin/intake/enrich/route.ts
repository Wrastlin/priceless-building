import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hasAdminSession } from "@/lib/auth/session";
import { resolveActor, actorStamp } from "@/lib/auth/actor";
import { logCaptureEvent } from "@/lib/capture/events";
import { insertCompsSnapshot } from "@/lib/comps/snapshots";
import {
  callGemini,
  extractText,
  geminiKey,
  imageTooLarge,
  MAX_IMAGES,
  parseDataUrl,
  type ParsedImage,
} from "@/lib/ai/gemini";
import {
  findComparables,
  marketAnchor,
  medianPrice,
  averagePrice,
} from "@/lib/comparable-search";
import { findBySku, updateItem } from "@/lib/items/store";
import type { CatalogItem } from "@/lib/items/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gemini-3.1-pro-preview";

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

interface EnrichSuggestion {
  title?: string;
  description?: string;
  category?: string;
  dimensions?: string;
}

const VISION_PROMPT = `You are looking at product photos from a small-business surplus building-materials warehouse in Wausau, Wisconsin. Write catalog copy for this item. Output STRICT JSON only, no prose, no markdown fences. Schema:

{
  "title": string,           // 8-14 word product title suitable for a tag and a Facebook Marketplace listing
  "description": string,     // 2-4 sentences describing the item for staff and shoppers
  "category": "doors" | "windows" | "cabinets" | "vanities" | "countertops" | "hardware" | "lighting" | "trim",
  "dimensions": string       // e.g. "32x80x1-3/4\\""; empty string if not estimable
}

Rules:
- Never invent a manufacturer or model number not visible in the photos.
- description should be factual and useful for resale, not marketing fluff.`;

const TEXT_PROMPT = `You are helping catalog a surplus building-materials item for a warehouse in Wausau, Wisconsin. Given partial data, suggest improved catalog fields. Output STRICT JSON only, no prose, no markdown fences. Schema:

{
  "title": string,
  "description": string,
  "category": "doors" | "windows" | "cabinets" | "vanities" | "countertops" | "hardware" | "lighting" | "trim",
  "dimensions": string
}

Rules:
- description should be 2-4 factual sentences suitable for staff and shoppers.
- Never invent specifics not implied by the provided data.`;

function clean(v?: string): string | undefined {
  if (!v) return undefined;
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  if (/^unknown/i.test(trimmed)) return undefined;
  return trimmed;
}

function isUntitled(title: string): boolean {
  const t = title.trim();
  return !t || /^untitled/i.test(t);
}

function normalizeCategory(raw?: string): string | undefined {
  if (!raw) return undefined;
  return (VALID_CATEGORIES as readonly string[]).includes(raw) ? raw : undefined;
}

async function enrichWithVision(
  item: CatalogItem,
  images: ParsedImage[],
): Promise<{ suggestion: EnrichSuggestion | null; reason?: string }> {
  const context = [
    item.title ? `Current title: ${item.title}` : "",
    item.category ? `Current category: ${item.category}` : "",
    item.dimensions ? `Current dimensions: ${item.dimensions}` : "",
    item.captureNote ? `Staff note: ${item.captureNote}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await callGemini({
    model: MODEL,
    parts: [
      {
        text: `${VISION_PROMPT}${context ? `\n\nExisting catalog data (refine, don't contradict):\n${context}` : ""}`,
      },
      ...images.map((img) => ({
        inline_data: { mime_type: img.mimeType, data: img.data },
      })),
    ],
    generationConfig: { temperature: 0.2, response_mime_type: "application/json" },
  });

  if (!result.ok) return { suggestion: null, reason: result.error };
  const text = extractText(result.json);
  if (!text) return { suggestion: null, reason: "No text in Gemini response" };

  try {
    const parsed = JSON.parse(text) as EnrichSuggestion;
    return {
      suggestion: {
        title: clean(parsed.title),
        description: clean(parsed.description),
        category: normalizeCategory(parsed.category),
        dimensions: clean(parsed.dimensions),
      },
    };
  } catch {
    return { suggestion: null, reason: "Gemini returned non-JSON" };
  }
}

async function enrichWithText(
  item: CatalogItem,
): Promise<{ suggestion: EnrichSuggestion | null; reason?: string }> {
  const context = [
    `Title: ${item.title || "(empty)"}`,
    `Category: ${item.category || "(empty)"}`,
    item.dimensions ? `Dimensions: ${item.dimensions}` : "",
    item.manufacturer ? `Manufacturer: ${item.manufacturer}` : "",
    item.captureNote ? `Staff note: ${item.captureNote}` : "",
    item.description ? `Existing description: ${item.description}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await callGemini({
    model: MODEL,
    parts: [{ text: `${TEXT_PROMPT}\n\nItem data:\n${context}` }],
    generationConfig: { temperature: 0.2, response_mime_type: "application/json" },
  });

  if (!result.ok) return { suggestion: null, reason: result.error };
  const text = extractText(result.json);
  if (!text) return { suggestion: null, reason: "No text in Gemini response" };

  try {
    const parsed = JSON.parse(text) as EnrichSuggestion;
    return {
      suggestion: {
        title: clean(parsed.title),
        description: clean(parsed.description),
        category: normalizeCategory(parsed.category),
        dimensions: clean(parsed.dimensions),
      },
    };
  } catch {
    return { suggestion: null, reason: "Gemini returned non-JSON" };
  }
}

async function applyComparables(
  sku: string,
  query: string,
  actorName: string | null,
  loginEmail: string | null,
): Promise<{ compsCount: number; compareAt?: number; patch: Partial<CatalogItem> }> {
  const patch: Partial<CatalogItem> = {};
  const q = query.trim();
  if (q.length < 3) return { compsCount: 0, patch };

  const comps = await findComparables(q, { broaden: false });
  const now = new Date().toISOString();
  const comparables = comps.map((c) => ({
    source: c.source,
    title: c.title,
    price: c.price,
    url: c.url,
    image: c.image,
    capturedAt: now,
  }));

  const anchor = marketAnchor(comps);
  const median = medianPrice(comps);
  const trimmedMean = averagePrice(comps);

  await insertCompsSnapshot({
    sku,
    query: q,
    broadened: false,
    rawResults: comps,
    anchor,
    median,
    trimmedMean,
    n: comps.length,
    actorName,
    loginEmail,
  });

  patch.comparables = comparables;
  if (anchor > 0) {
    patch.compareAt = Math.round(anchor);
    patch.compareAtSource = "market";
    patch.msrp = Math.round(anchor);
    const top = comps[0];
    if (top) {
      patch.comparable = { retailer: top.source, price: top.price, url: top.url };
    }
  }

  return { compsCount: comps.length, compareAt: patch.compareAt, patch };
}

export async function POST(req: NextRequest) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }

  const actor = await resolveActor();
  const stamp = actor
    ? actorStamp(actor)
    : {
        createdBy: "Floor",
        actorId: null as string | null,
        actorName: null as string | null,
        loginEmail: null as string | null,
        loginRole: null as "owner" | "floor" | null,
      };
  const requestId = randomUUID();

  let body: { sku?: string; images?: string[] };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const sku = typeof body.sku === "string" ? body.sku.trim() : "";
  if (!sku) {
    return NextResponse.json({ ok: false, error: "sku required" }, { status: 400 });
  }

  const item = await findBySku(sku);
  if (!item) {
    await logCaptureEvent({
      source: "api",
      action: "enrich.fail",
      requestId,
      path: "/api/admin/intake/enrich",
      sku,
      ...stamp,
      error: "item not found",
    });
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    let suggestion: EnrichSuggestion | null = null;
    let enrichReason: string | undefined;

    if (geminiKey()) {
      const imgs = Array.isArray(body.images)
        ? body.images.filter((i): i is string => typeof i === "string")
        : [];
      const parsedImages: ParsedImage[] = [];
      for (const img of imgs.slice(0, MAX_IMAGES)) {
        const p = parseDataUrl(img);
        if (!p) continue;
        if (imageTooLarge(p)) {
          return NextResponse.json({ ok: false, error: "An image exceeds the 8MB size limit" }, {
            status: 413,
          });
        }
        parsedImages.push(p);
      }

      if (parsedImages.length > 0) {
        const result = await enrichWithVision(item, parsedImages);
        suggestion = result.suggestion;
        enrichReason = result.reason;
      } else {
        const result = await enrichWithText(item);
        suggestion = result.suggestion;
        enrichReason = result.reason;
      }
    } else {
      enrichReason = "GEMINI_API_KEY not configured";
    }

    const patch: Partial<CatalogItem> = {};
    if (suggestion?.description) patch.description = suggestion.description;
    if (suggestion?.title && isUntitled(item.title)) patch.title = suggestion.title;
    if (suggestion?.dimensions && !item.dimensions?.trim()) patch.dimensions = suggestion.dimensions;
    if (suggestion?.category && !item.category?.trim()) patch.category = suggestion.category;

    const compareQuery = (patch.title ?? item.title).trim();
    const { compsCount, compareAt, patch: compsPatch } = await applyComparables(
      sku,
      compareQuery,
      stamp.actorName,
      stamp.loginEmail,
    );
    Object.assign(patch, compsPatch);

    const updated =
      Object.keys(patch).length > 0 ? await updateItem(sku, patch) : item;

    await logCaptureEvent({
      source: "api",
      action: "enrich.ok",
      requestId,
      path: "/api/admin/intake/enrich",
      itemId: item.id,
      sku,
      actorId: stamp.actorId,
      actorName: stamp.actorName,
      loginEmail: stamp.loginEmail,
      loginRole: stamp.loginRole,
      payload: {
        hadImages: Array.isArray(body.images) && body.images.length > 0,
        enrichReason,
        compsCount,
        fieldsUpdated: Object.keys(patch),
      },
    });

    return NextResponse.json({
      ok: true,
      title: updated.title,
      description: updated.description,
      compareAt: updated.compareAt ?? compareAt,
      compsCount,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Enrich failed";
    await logCaptureEvent({
      source: "api",
      action: "enrich.fail",
      requestId,
      path: "/api/admin/intake/enrich",
      itemId: item.id,
      sku,
      actorId: stamp.actorId,
      actorName: stamp.actorName,
      loginEmail: stamp.loginEmail,
      loginRole: stamp.loginRole,
      error: message,
    });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
