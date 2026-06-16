// GET /api/comparables?q=...
//
// Live comparable-price search used by the Add Item / Re-tag flows.
// Wraps lib/comparable-search.ts so the SerpApi key never leaves the
// server. Auth + rate limiting via guardAiRoute().

import { NextResponse } from "next/server";
import { guardAiRoute } from "@/lib/ai/guard";
import { averagePrice, findComparables, suggestTagPrice } from "@/lib/comparable-search";

export async function GET(req: Request) {
  const guard = await guardAiRoute({ bucket: "comparables" });
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q || q.length < 3) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }
  const broaden = url.searchParams.get("broaden") === "1";

  try {
    const comparables = await findComparables(q, { broaden });
    const avg = averagePrice(comparables);
    const suggested = suggestTagPrice(avg);
    return NextResponse.json(
      { comparables, average: avg, suggested },
      { headers: { "Cache-Control": "private, max-age=300" } },
    );
  } catch (err) {
    return NextResponse.json(
      { comparables: [], average: 0, suggested: 0, error: err instanceof Error ? err.message : "Comparable search failed" },
      { status: 502 },
    );
  }
}
