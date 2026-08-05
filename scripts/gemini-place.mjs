// Gemini placement render: show the EXACT product in use in a real room.
// node scripts/gemini-place.mjs <in.jpg|png> <out.png> "<room context>"
// Cost: API pennies. Output is AI-generated: flag it, fidelity-diff before listing use.
import { readFileSync, writeFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const KEY = env.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim().replace(/^["\x27]|["\x27]$/g, "");
if (!KEY) { console.error("no GEMINI_API_KEY"); process.exit(1); }
const MODEL = "gemini-3.1-flash-image-preview";
const [inPath, outPath, context] = process.argv.slice(2);
if (!context) { console.error("usage: gemini-place.mjs <in> <out.png> \"<room context>\""); process.exit(1); }
const PROMPT = `Show this EXACT product installed and in real use in the following setting: ${context}.

Keep the product identical: same materials, colors, proportions, hardware, glass layout, and finish. Do not redesign, restyle, or swap it.

Scene rules:
- Editorial interior-photography quality, natural light, believable architecture
- The product is the clear hero of the shot, prominently placed and fully visible
- ABSOLUTELY NO people, hands, pets, text, logos, or watermarks
- Vertical 4:5 or 9:16 framing preferred
- Realistic scale for the product's true size`;
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
