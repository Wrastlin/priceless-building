/**
 * Pure helpers for "how long has this been on the floor." No runtime deps, so
 * both the server (aging report) and client (inventory table) can use them.
 * Bands mirror the settings rule: auto-discount candidates after 60 days.
 */

export type AgeBand = "fresh" | "aging" | "stale" | "old";

/** Whole days since an item was created, or null if the date is missing/bad. */
export function daysOnFloor(createdAt: string | undefined, now: number = Date.now()): number | null {
  if (!createdAt) return null;
  const t = new Date(createdAt).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((now - t) / 86_400_000));
}

export function ageBand(days: number | null): AgeBand {
  if (days == null || days <= 30) return "fresh";
  if (days <= 60) return "aging";
  if (days <= 90) return "stale";
  return "old";
}

export const AGE_BAND_LABEL: Record<AgeBand, string> = {
  fresh: "0–30 days",
  aging: "31–60 days",
  stale: "61–90 days",
  old: "90+ days",
};

/** Markdown candidate = past the 60-day floor rule. */
export const MARKDOWN_AFTER_DAYS = 60;
