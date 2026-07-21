import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";
import { findBySku } from "@/lib/items/store";
import { renderQrLabel, renderPriceTag } from "@/lib/intake/labels";
import { printLabel } from "@/lib/intake/printer";

export const runtime = "nodejs";

/** POST { sku, type: "qr"|"price", copies?: number } */
export async function POST(req: NextRequest) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }

  let body: { sku?: unknown; type?: unknown; copies?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sku = typeof body.sku === "string" ? body.sku : "";
  const item = await findBySku(sku);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const type = body.type === "price" ? "price" : "qr";
  const copies = Math.min(20, Math.max(1, Number(body.copies) || 1));

  try {
    const png = type === "price" ? await renderPriceTag(item) : await renderQrLabel(item);
    const result = await printLabel(png, copies);
    return NextResponse.json(result, { status: result.ok ? 200 : 503 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : "Print failed" },
      { status: 500 },
    );
  }
}
