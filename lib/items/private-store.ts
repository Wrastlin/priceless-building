import "server-only";
import { adminClient, hasServiceRole } from "@/lib/supabase/admin";

/**
 * Private, admin-only item data — what we paid, which liquidation lot it came
 * from, and the sold record. Lives in the `item_private` table (see
 * supabase/migrations/0002_liquidation.sql), which RLS hides from the anon
 * (public) role entirely, so cost/margin never reach the storefront.
 *
 * Reads degrade to null/empty before the migration is applied or if the DB is
 * down; writes surface a clear error.
 */

export type ItemPrivate = {
  sku: string;
  cost: number | null;
  sourceLot: string | null;
  soldAt: string | null;
  soldPrice: number | null;
  soldBy: string | null;
};

export type ItemPrivatePatch = Partial<{
  cost: number | null;
  sourceLot: string | null;
  soldAt: string | null;
  soldPrice: number | null;
  soldBy: string | null;
}>;

const CONFIGURED = hasServiceRole();

type Row = {
  sku: string;
  cost: number | null;
  source_lot: string | null;
  sold_at: string | null;
  sold_price: number | null;
  sold_by: string | null;
};

const COLS = "sku, cost, source_lot, sold_at, sold_price, sold_by";

function toPrivate(r: Row): ItemPrivate {
  return {
    sku: r.sku,
    cost: r.cost,
    sourceLot: r.source_lot,
    soldAt: r.sold_at,
    soldPrice: r.sold_price,
    soldBy: r.sold_by,
  };
}

export async function getItemPrivate(sku: string): Promise<ItemPrivate | null> {
  if (!CONFIGURED) return null;
  try {
    const supabase = adminClient();
    const { data, error } = await supabase.from("item_private").select(COLS).eq("sku", sku).maybeSingle();
    if (error || !data) return null;
    return toPrivate(data as Row);
  } catch {
    return null;
  }
}

/** Batch fetch for list views (aging, inventory). Missing rows are absent. */
export async function getItemPrivateMap(skus: string[]): Promise<Map<string, ItemPrivate>> {
  const map = new Map<string, ItemPrivate>();
  if (!CONFIGURED || skus.length === 0) return map;
  try {
    const supabase = adminClient();
    const { data, error } = await supabase.from("item_private").select(COLS).in("sku", skus);
    if (error) return map;
    for (const r of (data as Row[] | null) ?? []) map.set(r.sku, toPrivate(r));
  } catch {
    // table missing / transient — treat as no private data
  }
  return map;
}

/** All sold rows (for the velocity dashboard), newest first. */
export async function listSoldPrivate(): Promise<ItemPrivate[]> {
  if (!CONFIGURED) return [];
  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from("item_private")
      .select(COLS)
      .not("sold_at", "is", null)
      .order("sold_at", { ascending: false });
    if (error) return [];
    return ((data as Row[] | null) ?? []).map(toPrivate);
  } catch {
    return [];
  }
}

/** Partial upsert — only the provided fields change; the rest are untouched. */
export async function upsertItemPrivate(sku: string, patch: ItemPrivatePatch): Promise<void> {
  const supabase = adminClient();
  const row: Record<string, unknown> = { sku, updated_at: new Date().toISOString() };
  if ("cost" in patch) row.cost = patch.cost;
  if ("sourceLot" in patch) row.source_lot = patch.sourceLot;
  if ("soldAt" in patch) row.sold_at = patch.soldAt;
  if ("soldPrice" in patch) row.sold_price = patch.soldPrice;
  if ("soldBy" in patch) row.sold_by = patch.soldBy;
  const { error } = await supabase.from("item_private").upsert(row, { onConflict: "sku" });
  if (error) throw new Error(`Could not save private item data: ${error.message}`);
}

/** profit + margin% from a tag price and cost, or nulls when cost is unknown. */
export function margin(price: number, cost: number | null | undefined): { profit: number; pct: number } | null {
  if (cost == null || !(price > 0)) return null;
  return { profit: price - cost, pct: Math.round(((price - cost) / price) * 100) };
}
