#!/usr/bin/env node
/**
 * Vision-group the July-23 store photos into physical items.
 * One Gemini call, every photo labeled, so grouping is by visual identity
 * (handles photos of the same item that are a few frames apart).
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const IN = "/private/tmp/claude-501/-Users-aaron-Priceless-Building-Center/ac2d5cc2-65ce-4da3-9a69-ca7c6234dd08/scratchpad/jul23-group-in";
const OUT = "/private/tmp/claude-501/-Users-aaron-Priceless-Building-Center/ac2d5cc2-65ce-4da3-9a69-ca7c6234dd08/scratchpad/groups.json";
const ENV = "/Users/aaron/Priceless Building Center/priceless-building/.env.local";

const key = Object.fromEntries(
  readFileSync(ENV, "utf8").split("\n").map((l) => {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(l.trim());
    return m ? [m[1], m[2].replace(/^"|"$/g, "")] : ["", ""];
  }),
).GEMINI_API_KEY;

const files = readdirSync(IN)
  .filter((f) => f.endsWith(".jpg"))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const PROMPT = `You are grouping phone photos taken on one pass through a surplus building-materials warehouse (Price-Less Building Center, Wausau WI). The photos are in shooting order but NOT perfectly sequential: occasionally the photographer skipped ahead and came back, so photos of the SAME physical item can be a few frames apart. Items are things like: butcher-block slabs, cabinets (base/wall/tall), cabinet doors, vanity tops with integrated sinks, countertop slabs/remnants, drop-in / undermount / utility sinks. Most items were shot 1-4 times (whole item, drawer/door open, and a close-up of the round price sticker or handwritten tag).

Group the photos so each group = ONE physical item (or one identical stack/lot sold together). Read any visible price sticker or tag text VERBATIM. Do NOT invent brands, model numbers, or dimensions — only report what is actually legible or clearly visible.

Allowed categories: doors, windows, cabinets, vanities, countertops, sinks, faucets, hardware, lighting, trim, plumbing, other.

Return STRICT JSON only, no prose, no fences:
{
  "items": [
    {
      "photos": [2259, 2260],        // IMG numbers, the FIRST/best (most complete) photo first
      "category": "cabinets",
      "provisional_title": "White shaker wall cabinet",  // only what's visible; no invented specs
      "tag_text": "MFR $85",         // verbatim sticker/tag text, "" if none legible
      "confidence": "high",          // high | med | low
      "note": ""                     // e.g. "photos non-adjacent", "possible two items", "blurry"
    }
  ],
  "ungrouped": [1234]                // IMG numbers you truly cannot place
}
Every one of the ${files.length} photos must appear exactly once across items[].photos and ungrouped[].`;

const parts = [{ text: PROMPT }];
for (const f of files) {
  const num = f.match(/\d+/)[0];
  parts.push({ text: `IMG_${num}` });
  parts.push({
    inline_data: { mime_type: "image/jpeg", data: readFileSync(path.join(IN, f)).toString("base64") },
  });
}

const model = "gemini-3.1-pro-preview";
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 16000, thinkingConfig: { thinkingBudget: 6000 } },
    }),
    signal: AbortSignal.timeout(300000),
  },
);
if (!res.ok) {
  console.error("HTTP", res.status, (await res.text()).slice(0, 500));
  process.exit(1);
}
const json = await res.json();
const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("") ?? "";
const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/g, "").trim();
let parsed;
try {
  parsed = JSON.parse(cleaned.slice(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
} catch (e) {
  console.error("parse fail. raw:\n", text.slice(0, 2000));
  process.exit(1);
}
writeFileSync(OUT, JSON.stringify(parsed, null, 2));

const items = parsed.items ?? [];
const used = new Set();
let dupes = 0;
for (const it of items) for (const p of it.photos) { if (used.has(p)) dupes++; used.add(p); }
for (const p of parsed.ungrouped ?? []) { if (used.has(p)) dupes++; used.add(p); }
console.log(`items: ${items.length}`);
console.log(`photos placed: ${used.size}/${files.length}  dupes: ${dupes}  ungrouped: ${(parsed.ungrouped ?? []).length}`);
const missing = files.map((f) => Number(f.match(/\d+/)[0])).filter((n) => !used.has(n));
if (missing.length) console.log("MISSING:", missing.join(","));
console.log("usage:", JSON.stringify(json.usageMetadata ?? {}));
