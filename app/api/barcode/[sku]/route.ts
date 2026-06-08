// GET /api/barcode/<sku>.svg
//
// Returns a scannable Code 128 SVG for the given SKU. Used on price
// tags so the floor iPad can scan a real barcode (not the decorative
// pseudo-barcode the tag preview originally used).
//
// We cache hard at the edge because every SKU's barcode is immutable.

import { NextResponse } from "next/server";
import { code128Svg } from "@/lib/barcode";

export const dynamic = "force-static";

export async function GET(_req: Request, { params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const raw = sku.replace(/\.svg$/i, "");
  if (!/^[A-Z0-9-]{1,32}$/i.test(raw)) {
    return NextResponse.json({ error: "Invalid SKU" }, { status: 400 });
  }
  const svg = code128Svg(raw, { height: 56, moduleWidth: 2, showText: true });
  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
