/**
 * Label compositor for the Brother QL-800 (300 dpi). Adapted from
 * priceless-intake to render against CatalogItem.
 */
import sharp from "sharp";
import { qrPng } from "./barcode";
import type { CatalogItem } from "@/lib/items/types";
import { categoryLabel, subcategoryLabel, DEFAULT_CATEGORIES } from "./taxonomy";

export interface RollPreset {
  id: string;
  label: string;
  width: number;
  maxLength: number;
  continuous: boolean;
}

export const ROLLS: Record<string, RollPreset> = {
  "62": { id: "62", label: "DK-2205 continuous 62mm", width: 696, maxLength: 1200, continuous: true },
  "29x90": { id: "29x90", label: "DK-1201 die-cut 29x90mm", width: 991, maxLength: 306, continuous: false },
  "29": { id: "29", label: "DK-2210 continuous 29mm", width: 306, maxLength: 1200, continuous: true },
};

export function activeRoll(): RollPreset {
  return ROLLS[process.env.LABEL_ROLL ?? "62"] ?? ROLLS["62"];
}

export function itemUrl(sku: string): string {
  const base = process.env.APP_BASE_URL?.trim().replace(/\/+$/, "");
  return base ? `${base}/s/${encodeURIComponent(sku)}` : sku;
}

const WHITE = "#ffffff";
const INK = "#111111";
const GRAY = "#5b5b5b";
const SALE = "#b3261e";

interface Block {
  buf: Buffer;
  w: number;
  h: number;
}

async function measure(buf: Buffer): Promise<Block> {
  const m = await sharp(buf).metadata();
  return { buf, w: m.width ?? 0, h: m.height ?? 0 };
}

async function text(
  markup: string,
  font: string,
  width: number,
  align: "left" | "center" | "right" = "center",
): Promise<Block> {
  // Prefer libvips pangocairo text when available; fall back to SVG (macOS
  // sharp builds often ship without the text operation).
  try {
    const buf = await sharp({
      text: { text: markup, font, rgba: true, width, align, spacing: 2 },
    })
      .png()
      .toBuffer();
    return measure(buf);
  } catch {
    const sizeMatch = /(\d+)\s*$/.exec(font);
    const fontSize = Number(sizeMatch?.[1] ?? 24);
    const weight = /bold|<b>/i.test(font + markup) ? "700" : "500";
    const plain = markup
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
    const anchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
    const x = align === "left" ? 0 : align === "right" ? width : Math.round(width / 2);
    const lineH = Math.round(fontSize * 1.25);
    // Rough wrap
    const words = plain.split(" ");
    const lines: string[] = [];
    let cur = "";
    const maxChars = Math.max(8, Math.floor(width / (fontSize * 0.55)));
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (next.length > maxChars && cur) {
        lines.push(cur);
        cur = w;
      } else cur = next;
    }
    if (cur) lines.push(cur);
    const height = Math.max(lineH, lines.length * lineH + 4);
    const tspans = lines
      .map((ln, i) => `<tspan x="${x}" dy="${i === 0 ? fontSize : lineH}">${esc(ln)}</tspan>`)
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <text font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}"
        fill="${INK}" text-anchor="${anchor}">${tspans}</text>
    </svg>`;
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    return measure(buf);
  }
}

async function stack(blocks: Block[], width: number, pad: number, gap: number): Promise<Buffer> {
  const inner = blocks.reduce((s, b, i) => s + b.h + (i ? gap : 0), 0);
  const height = Math.round(inner + pad * 2);
  let top = pad;
  const composites = blocks.map((b) => {
    const left = Math.max(0, Math.round((width - b.w) / 2));
    const c = { input: b.buf, top: Math.round(top), left };
    top += b.h + gap;
    return c;
  });
  return sharp({ create: { width, height, channels: 4, background: WHITE } })
    .composite(composites)
    .png()
    .toBuffer();
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function subtitleLine(item: CatalogItem): string {
  const bits = [
    item.manufacturer,
    subcategoryLabel(item.category, item.subcategory, DEFAULT_CATEGORIES) ??
      categoryLabel(item.category, DEFAULT_CATEGORIES),
    item.dimensions,
  ].filter(Boolean);
  return bits.join("  ·  ");
}

export async function renderQrLabel(item: CatalogItem): Promise<Buffer> {
  const roll = activeRoll();
  const width = roll.width;
  const pad = 24;
  const gap = 26;

  const qrSize = 250;
  const qr = await measure(
    await sharp(await qrPng(itemUrl(item.sku), { scale: 6 }))
      .resize({ width: qrSize, height: qrSize, fit: "contain", background: WHITE })
      .flatten({ background: WHITE })
      .png()
      .toBuffer(),
  );

  const textWidth = width - pad * 2 - qrSize - gap;
  const lines: Block[] = [await text(`<b>${esc(item.title)}</b>`, "sans 27", textWidth, "left")];
  lines.push(await text(`<span foreground="${INK}"><b>${esc(item.sku)}</b></span>`, "sans 30", textWidth, "left"));
  const sub = subtitleLine(item);
  if (sub) lines.push(await text(`<span foreground="${GRAY}">${esc(sub)}</span>`, "sans 20", textWidth, "left"));

  const lineGap = 10;
  const textH = lines.reduce((s, b, i) => s + b.h + (i ? lineGap : 0), 0);
  const contentH = Math.max(qr.h, textH);
  const height = contentH + pad * 2;

  const composites: { input: Buffer; left: number; top: number }[] = [
    { input: qr.buf, left: pad, top: Math.round(pad + (contentH - qr.h) / 2) },
  ];
  let ty = pad + Math.round((contentH - textH) / 2);
  const tx = pad + qrSize + gap;
  for (const b of lines) {
    composites.push({ input: b.buf, left: tx, top: Math.round(ty) });
    ty += b.h + lineGap;
  }

  return sharp({ create: { width, height, channels: 4, background: WHITE } })
    .composite(composites)
    .png()
    .toBuffer();
}

export async function renderPriceTag(item: CatalogItem): Promise<Buffer> {
  const roll = activeRoll();
  const width = roll.width;
  const inner = width - 48;

  const blocks: Block[] = [
    await text(`<span foreground="${GRAY}" letter_spacing="3000">PRICE-LESS BUILDING CENTER</span>`, "sans 15", inner),
  ];

  if (typeof item.price === "number" && item.price > 0) {
    blocks.push(await text(`<span foreground="${INK}"><b>$${item.price.toLocaleString()}</b></span>`, "sans 120", inner));
  } else {
    blocks.push(await text(`<span foreground="${GRAY}">Ask Staff</span>`, "sans 64", inner));
  }

  const compareAt = item.compareAt ?? item.msrp;
  if (
    typeof compareAt === "number" &&
    compareAt > 0 &&
    typeof item.price === "number" &&
    item.price > 0 &&
    compareAt > item.price
  ) {
    const pct = Math.round((1 - item.price / compareAt) * 100);
    blocks.push(
      await text(
        `<span foreground="${GRAY}">Compare at <s>$${compareAt.toLocaleString()}</s></span>  <span foreground="${SALE}"><b>SAVE ${pct}%</b></span>`,
        "sans 22",
        inner,
      ),
    );
  }

  blocks.push(await text(`<b>${esc(item.title)}</b>`, "sans 26", inner));

  const dimline = [item.dimensions, item.color, item.condition].filter(Boolean).join("  ·  ");
  if (dimline) blocks.push(await text(`<span foreground="${GRAY}">${esc(dimline)}</span>`, "sans 20", inner));

  blocks.push(await text(`<span foreground="${GRAY}">${esc(item.sku)}</span>`, "sans 18", inner));

  return stack(blocks, width, 24, 14);
}
