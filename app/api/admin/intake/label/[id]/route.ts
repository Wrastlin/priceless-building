import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";
import { findBySku } from "@/lib/items/store";
import { renderQrLabel, renderPriceTag } from "@/lib/intake/labels";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }
  const { id } = await ctx.params;
  const url = new URL(_req.url);
  const type = url.searchParams.get("type") === "price" ? "price" : "qr";

  // id may be sku (preferred) 
  const item = await findBySku(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const png = type === "price" ? await renderPriceTag(item) : await renderQrLabel(item);
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
