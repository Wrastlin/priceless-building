#!/usr/bin/env node
/** Focused split of a rack into per-tag items, reading hi-res tags. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const HI = "/private/tmp/claude-501/-Users-aaron-Priceless-Building-Center/ac2d5cc2-65ce-4da3-9a69-ca7c6234dd08/scratchpad/jul23-hi";
const ENV = "/Users/aaron/Priceless Building Center/priceless-building/.env.local";
const key = Object.fromEntries(readFileSync(ENV, "utf8").split("\n").map((l) => {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(l.trim()); return m ? [m[1], m[2].replace(/^"|"$/g, "")] : ["", ""];
})).GEMINI_API_KEY;

const mode = process.argv[2];
const nums = process.argv[3].split(",");
const OUT = process.argv[4];

const PROMPTS = {
  butcher: `These hi-res photos show ONE rack of butcher-block / edge-grain wood slabs at a surplus store. The slabs are sold PER PIECE and grouped by SIZE: each distinct handwritten blue/white tag = one product (a species + thickness + dimensions + a price "per each"). Read EVERY legible tag verbatim. Make one item per DISTINCT tag. Do NOT invent a size or price you cannot read — if a tag is partly legible, include only what you can read and set "flag" to note it.`,
  vanity: `These hi-res photos show a ROW of vanity tops / sink tops standing on edge at a surplus store. Each distinct top is its own product; most have a handwritten tag with dimensions and a price (sometimes an original and a sale price). Read tags verbatim. Make one item per DISTINCT vanity top you can identify. Do NOT invent dimensions/prices you cannot read.`,
};

const PROMPT = `${PROMPTS[mode]}

Return STRICT JSON only (no fences):
{
  "items": [
    {
      "label": "1.25\\" oak 13.5 x 18.5",   // short human label
      "category": "countertops",            // countertops for butcher block/slabs; vanities for vanity tops
      "title": "1-1/4\\" Oak butcher block slab, 13.5\\" x 18.5\\"",  // only what's legible/visible
      "dimensions": "13.5\\" x 18.5\\" x 1.25\\"",  // ONLY from a tag; "" if not legible
      "price": 40,                          // number from the tag ("/each" price); null if not legible
      "tag_text": "1.25\\" OAK 13.5\\" x 18.5\\" $40/each",  // verbatim
      "photos": [2276],                     // IMG numbers best showing this item/its tag
      "flag": ""                            // note if uncertain/partly legible
    }
  ]
}`;

const parts = [{ text: PROMPT }];
for (const n of nums) {
  parts.push({ text: `IMG_${n}` });
  parts.push({ inline_data: { mime_type: "image/jpeg", data: readFileSync(path.join(HI, `IMG_${n}.jpg`)).toString("base64") } });
}

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-goog-api-key": key },
  body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.1, maxOutputTokens: 16000, thinkingConfig: { thinkingBudget: 8000 } } }),
  signal: AbortSignal.timeout(300000),
});
if (!res.ok) { console.error("HTTP", res.status, (await res.text()).slice(0, 400)); process.exit(1); }
const json = await res.json();
const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("") ?? "";
writeFileSync(OUT + ".raw.txt", text);
let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
const arr = cleaned.indexOf("["), obj = cleaned.indexOf("{");
let parsed;
try {
  if (arr !== -1 && (obj === -1 || arr < obj)) {
    parsed = { items: JSON.parse(cleaned.slice(arr, cleaned.lastIndexOf("]") + 1)) };
  } else {
    parsed = JSON.parse(cleaned.slice(obj, cleaned.lastIndexOf("}") + 1));
  }
} catch (e) { console.error("parse fail:", e.message, "\n--- raw head ---\n", text.slice(0, 1200)); process.exit(1); }
writeFileSync(OUT, JSON.stringify(parsed, null, 2));
console.log(`${mode}: ${parsed.items.length} items`);
for (const it of parsed.items) console.log(`  $${it.price ?? "?"}  ${it.title}${it.flag ? "  [" + it.flag + "]" : ""}`);
console.log("usage:", JSON.stringify(json.usageMetadata ?? {}));
