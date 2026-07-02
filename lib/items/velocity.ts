import "server-only";
import { listSold, listPublished } from "@/lib/items/store";
import { getItemPrivateMap } from "@/lib/items/private-store";

/**
 * Sold-velocity metrics for the dashboard, computed from REAL sold rows only
 * (status = 'sold' items joined to their item_private sold record). No mocks —
 * before anything is marked sold, every number is 0/null and the UI says so.
 */

export type VelocitySummary = {
  totalSold: number;
  onFloor: number;
  soldThisWeek: number;
  soldThisMonth: number;
  avgDaysToSell: number | null;
  sellThroughPct: number | null;
  /** Units sold per week, oldest → newest, last 8 weeks (index 7 = this week). */
  weekly: number[];
};

const DAY = 86_400_000;
const WEEK = 7 * DAY;
const WEEKS = 8;

export async function getVelocitySummary(now: number = Date.now()): Promise<VelocitySummary> {
  const [sold, onFloor] = await Promise.all([listSold(), listPublished()]);
  const priv = await getItemPrivateMap(sold.map((s) => s.sku));

  const events = sold.map((s) => {
    const p = priv.get(s.sku);
    const soldAt = p?.soldAt ? new Date(p.soldAt).getTime() : null;
    const createdAt = s.createdAt ? new Date(s.createdAt).getTime() : null;
    return { soldAt: Number.isFinite(soldAt) ? soldAt : null, createdAt: Number.isFinite(createdAt) ? createdAt : null };
  });

  const dated = events.filter((e): e is { soldAt: number; createdAt: number | null } => e.soldAt != null);

  const soldThisWeek = dated.filter((e) => e.soldAt >= now - WEEK).length;
  const soldThisMonth = dated.filter((e) => e.soldAt >= now - 30 * DAY).length;

  const daysToSell = dated
    .filter((e) => e.createdAt != null && e.soldAt >= e.createdAt)
    .map((e) => (e.soldAt - (e.createdAt as number)) / DAY);
  const avgDaysToSell = daysToSell.length
    ? Math.round(daysToSell.reduce((a, b) => a + b, 0) / daysToSell.length)
    : null;

  const totalSold = sold.length;
  const denom = totalSold + onFloor.length;
  const sellThroughPct = denom > 0 ? Math.round((totalSold / denom) * 100) : null;

  const weekly = Array.from({ length: WEEKS }, (_, i) => {
    // i = 0 is the oldest of the 8 weeks; WEEKS-1 is the current week.
    const end = now - (WEEKS - 1 - i) * WEEK;
    const start = end - WEEK;
    return dated.filter((e) => e.soldAt > start && e.soldAt <= end).length;
  });

  return {
    totalSold,
    onFloor: onFloor.length,
    soldThisWeek,
    soldThisMonth,
    avgDaysToSell,
    sellThroughPct,
    weekly,
  };
}
