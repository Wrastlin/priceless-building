// Standalone Gemini studio isolation: node scripts/gemini-isolate.mjs <in.jpg> <out.png>
// Same prompt + model as lib/ai/remove-background.ts (glass-safe studio catalog).
import { readFileSync, writeFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const KEY = env.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim().replace(/^["\x27]|["\x27]$/g, "");
if (!KEY) { console.error("no GEMINI_API_KEY"); process.exit(1); }
const MODEL = "gemini-3.1-flash-image-preview";
const PROMPT = `Place this EXACT building-product into a professional product photography studio for an e-commerce catalog.

Keep the product identical: same materials, colors, proportions, angle, hardware holes, muntins, and panel layout. Do not redesign it.

Studio setup:
- Seamless white cyclorama backdrop and floor
- Soft even catalog lighting
- If the product has glass / lites / clear inserts: the glass MUST remain as real glass (not empty holes). Behind the glass show the soft white studio wall. On the glass, include natural softbox reflections and slight specular highlights so panes read as glazed.
- Subtle contact shadow under the product is OK
- No warehouse clutter, other products, text, logos, or watermarks

Premium manufacturer-catalog quality.`;
const [inPath, outPath] = process.argv.slice(2);
const data = readFileSync(inPath).toString("base64");
const mime = inPath.endsWith(".png") ? "image/png" : "image/jpeg";
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-goog-api-key": KEY },
  body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: mime, data } }] }] }),
});
if (!res.ok) { console.error("HTTP", res.status, (await res.text()).slice(0,200)); process.exit(1); }
const json = await res.json();
const parts = json?.candidates?.[0]?.content?.parts ?? [];
const img = parts.find(p => p.inlineData?.data || p.inline_data?.data);
const b64 = img?.inlineData?.data ?? img?.inline_data?.data;
if (!b64) { console.error("no image in response"); process.exit(1); }
writeFileSync(outPath, Buffer.from(b64, "base64"));
console.log("SAVED", outPath);
