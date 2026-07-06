// POST /api/capture-item
//   body: {
//     category: Category;
//     count?: number;        // physical units in this entry (default 1)
//     tagStart?: number;     // first sticker number on the roll for this entry
//     dimensions?: string;   // measured by hand, e.g. `24"`
//     price?: number;        // price read off the item's existing paper tag
//     note?: string;         // free-text condition/location note
//     images?: dataURL[];    // optional — the pass works with zero photos
//   }
//   200: { sku: string; tagRange: {start,end} | null; extract: TagExtract | null; reason?: string }
//
// The rapid inventory-capture endpoint behind /admin/capture. Sticker-first:
// every physical unit gets its own consecutive number off the sticker roll,
// and one entry covers the whole run of identical units (7 matching doors =
// tags 51–57, one record, inStock 7). Photos are optional; when a tag photo
// is included, Gemini TRANSCRIBES it — strictly what is printed, nothing
// inferred (unlike analyze-and-price, which identifies and estimates).
//
// The item lands as a draft stamped `inventoriedAt` — the store-wide count
// marker. No pricing research, no storefront exposure. Auth + rate limiting
// via guardAiRoute().

import { NextResponse } from "next/server";
import { guardAiRoute } from "@/lib/ai/guard";
import {
  callGemini,
  extractText,
  geminiKey,
  imageTooLarge,
  MAX_IMAGES,
  parseDataUrl,
  type ParsedImage,
} from "@/lib/ai/gemini";
import { photoStorageConfigured, storeItemPhotos } from "@/lib/items/photos";
import { createDraft } from "@/lib/items/store";
import type { Brand, CatalogItem, Category, TagExtract } from "@/lib/items/types";
import { formatSKU } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = "gemini-3.1-pro-preview";

const VALID_CATEGORIES: readonly Category[] = [
  "doors",
  "windows",
  "cabinets",
  "vanities",
  "countertops",
  "hardware",
  "lighting",
  "trim",
];

// Mirrors deriveBrand in lib/actions/staging.ts.
const CATEGORY_TO_BRAND: Record<string, Brand> = {
  cabinets: "builders",
  countertops: "builders",
};

const PROMPT = `You are looking at photos of ONE item in a surplus building-materials warehouse. One or more photos may show the item's printed or handwritten tag, label, or sticker (manufacturer label, retail tag, handwritten price sticker).

Your ONLY job is to TRANSCRIBE what is written on the tag/label. You are a transcriber, not an identifier.

STRICT RULES — these override everything:
- Output ONLY text that is literally visible on a tag, label, or sticker in the photos (printed or handwritten).
- Do NOT infer, guess, estimate, or complete anything. Not the product type, not the brand, not dimensions, not a price.
- If a field is not written on the tag, OMIT it entirely from the JSON.
- If no readable tag/label appears in any photo, return exactly: {"noTag": true}
- Partially legible text: transcribe only the legible part; never fill in blanks.

Output STRICT JSON only, no prose, no markdown fences. Schema (every field optional):

{
  "productName": string,   // the product name/description line as written
  "manufacturer": string,  // brand/manufacturer name as written
  "modelNumber": string,   // model / part / item number as written
  "dimensions": string,    // size as written, keep original formatting
  "color": string,         // color/finish as written
  "material": string,      // material/species as written (e.g. "Oak")
  "price": number,         // a price written on the tag (number only)
  "upc": string,           // UPC/barcode digits if printed and legible
  "otherLines": string[],  // any other written lines that don't fit above
  "rawText": string        // the full tag text, line by line, verbatim
}`;

function cleanStr(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

/** Accept a number OR a written price string ("$158.00") off the tag. */
function toPrice(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[$,\s]/g, ""));
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

function toExtract(parsed: Record<string, unknown>): TagExtract | null {
  if (parsed.noTag === true) return null;
  const extract: TagExtract = {
    productName: cleanStr(parsed.productName),
    manufacturer: cleanStr(parsed.manufacturer),
    modelNumber: cleanStr(parsed.modelNumber),
    dimensions: cleanStr(parsed.dimensions),
    color: cleanStr(parsed.color),
    material: cleanStr(parsed.material),
    price: toPrice(parsed.price),
    upc: cleanStr(parsed.upc),
    otherLines: Array.isArray(parsed.otherLines)
      ? parsed.otherLines.filter((l): l is string => typeof l === "string" && l.trim() !== "")
      : undefined,
    rawText: cleanStr(parsed.rawText),
  };
  const hasContent = Object.values(extract).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined,
  );
  return hasContent ? extract : null;
}

async function transcribeTag(
  images: ParsedImage[],
): Promise<{ extract: TagExtract | null; reason?: string }> {
  const result = await callGemini({
    model: MODEL,
    parts: [
      { text: PROMPT },
      ...images.map((img) => ({
        inline_data: { mime_type: img.mimeType, data: img.data },
      })),
    ],
    generationConfig: { temperature: 0, response_mime_type: "application/json" },
  });

  if (!result.ok) return { extract: null, reason: result.error };
  const text = extractText(result.json);
  if (!text) return { extract: null, reason: "No text in Gemini response" };
  // Belt-and-suspenders: strip markdown fences if the model added them
  // despite response_mime_type json.
  const bare = text.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, "");
  try {
    return { extract: toExtract(JSON.parse(bare) as Record<string, unknown>) };
  } catch {
    return { extract: null, reason: "Gemini returned non-JSON" };
  }
}

/** Title from facts only: the tag's own product name, or measured dimensions
 *  plus the chosen category. The tag-range suffix keeps runs tellable apart. */
function buildTitle(
  extract: TagExtract | null,
  category: Category,
  dimensions: string | undefined,
  tagRange: { start: number; end: number } | null,
): string {
  const singular = category.endsWith("s") ? category.slice(0, -1) : category;
  const base =
    extract?.productName ??
    [dimensions ?? extract?.dimensions, extract?.material, singular]
      .filter(Boolean)
      .join(" ");
  const named = base && base !== singular ? base : `Uncatalogued ${singular}`;
  if (!tagRange) return named;
  const tags =
    tagRange.start === tagRange.end
      ? `tag #${tagRange.start}`
      : `tags #${tagRange.start}–${tagRange.end}`;
  return `${named} (${tags})`;
}

export async function POST(req: Request) {
  const guard = await guardAiRoute({ bucket: "capture" });
  if (!guard.ok) return guard.response;

  let body: {
    images?: string[];
    category?: string;
    count?: number;
    tagStart?: number;
    dimensions?: string;
    price?: number;
    note?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ reason: "Invalid JSON body" }, { status: 400 });
  }

  const category = VALID_CATEGORIES.find((c) => c === body.category);
  if (!category) {
    return NextResponse.json({ reason: "Invalid or missing category" }, { status: 400 });
  }

  const count =
    typeof body.count === "number" && Number.isInteger(body.count) && body.count > 0
      ? Math.min(body.count, 500)
      : 1;
  const tagStart =
    typeof body.tagStart === "number" && Number.isInteger(body.tagStart) && body.tagStart > 0
      ? body.tagStart
      : undefined;
  const tagRange = tagStart ? { start: tagStart, end: tagStart + count - 1 } : null;
  const dimensions = cleanStr(body.dimensions);
  const note = cleanStr(body.note)?.slice(0, 500);
  const manualPrice =
    typeof body.price === "number" && Number.isFinite(body.price) && body.price > 0
      ? body.price
      : undefined;

  const parsedImages: ParsedImage[] = [];
  const validImages: string[] = [];
  for (const img of (body.images ?? []).slice(0, MAX_IMAGES)) {
    const p = parseDataUrl(img);
    if (!p) continue;
    if (imageTooLarge(p)) {
      return NextResponse.json({ reason: "An image exceeds the 8MB size limit" }, { status: 413 });
    }
    parsedImages.push(p);
    validImages.push(img);
  }

  // 1) Transcribe the tag — only when there are photos. Failure never blocks
  //    the save; the whole point of the pass is that every unit gets a row.
  let extract: TagExtract | null = null;
  let reason: string | undefined;
  if (parsedImages.length > 0) {
    if (geminiKey()) {
      try {
        ({ extract, reason } = await transcribeTag(parsedImages));
      } catch (err) {
        reason = err instanceof Error ? err.message : "tag transcription failed";
      }
    } else {
      reason = "GEMINI_API_KEY not configured";
    }
  }

  // 2) Persist photos as real files in Supabase Storage — data URLs must
  //    NOT land in the items row (row bloat is what slowed the catalog).
  //    Storage failure fails the request: production inventory must not
  //    silently drop photos.
  let photoUrls: string[] = [];
  if (validImages.length > 0) {
    if (!photoStorageConfigured()) {
      return NextResponse.json(
        { reason: "Photo storage not configured (SUPABASE_SERVICE_ROLE_KEY missing)" },
        { status: 500 },
      );
    }
    const folder = `cap-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
    try {
      photoUrls = await storeItemPhotos(folder, validImages);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "photo upload failed";
      return NextResponse.json({ reason: `Photo storage failed: ${msg}` }, { status: 502 });
    }
  }

  // 3) Save the draft, stamped as inventoried. Same SKU-retry scheme as
  //    createDraftFromFormAction (unique constraint + fresh suffix).
  const brand = CATEGORY_TO_BRAND[category] ?? "priceless";
  const prefix = brand === "builders" ? "BC" : "PL";

  const baseDraft: Omit<CatalogItem, "status" | "createdAt" | "id" | "sku"> = {
    brand,
    category,
    title: buildTitle(extract, category, dimensions, tagRange),
    subtitle: dimensions ?? extract?.dimensions ?? "",
    price: manualPrice ?? extract?.price ?? 0,
    image: photoUrls[0] ?? "",
    gallery: photoUrls.length > 1 ? photoUrls.slice(1) : undefined,
    inStock: count,
    manufacturer: extract?.manufacturer,
    dimensions: dimensions ?? extract?.dimensions,
    createdBy: guard.identity.email,
    inventoriedAt: new Date().toISOString(),
    tagRange: tagRange ?? undefined,
    captureNote: note,
    tagExtract: extract ?? undefined,
  };

  let createdSku: string | null = null;
  for (let attempt = 0; attempt < 8 && !createdSku; attempt++) {
    const suffix = (Date.now() + Math.floor(Math.random() * 1_000_000)) % 1_000_000;
    const sku = formatSKU(prefix, suffix);
    try {
      await createDraft({ ...baseDraft, id: sku.toLowerCase(), sku });
      createdSku = sku;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) continue;
      return NextResponse.json({ reason: `Save failed: ${msg}` }, { status: 500 });
    }
  }
  if (!createdSku) {
    return NextResponse.json(
      { reason: "Couldn't generate a unique SKU — try again" },
      { status: 500 },
    );
  }

  return NextResponse.json({ sku: createdSku, tagRange, extract, reason });
}
