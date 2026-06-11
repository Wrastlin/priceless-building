// GET /api/comparables?q=...
//
// Live comparable-price search used by the Add Item / Re-tag flows.
// Wraps lib/comparable-search.ts so the SerpApi key never leaves the
// server.

import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";
import { averagePrice, findComparables, suggestTagPrice } from "@/lib/comparable-search";

export async function GET(req: Request) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q || q.length < 3) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }
  const broaden = url.searchParams.get("broaden") === "1";
  const comparables = await findComparables(q, { broaden });
  const avg = averagePrice(comparables);
  const suggested = suggestTagPrice(avg);
  return NextResponse.json(
    { comparables, average: avg, suggested },
    { headers: { "Cache-Control": "private, max-age=300" } },
  );
}
