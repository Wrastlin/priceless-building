/**
 * Special store hours and holiday closures.
 *
 * These surface on the home page and /contact so customers always know when
 * we're closed. It's the reliable replacement for reading closures off the
 * live Facebook feed — that feed renders as a blank box whenever a browser
 * blocks third-party cookies (common on phones), so a shopper could miss a
 * holiday closure entirely.
 *
 * HOW TO UPDATE
 *   Add one entry per closure or special-hours day. Past entries drop off the
 *   site automatically (they're filtered by date). Leave the array empty when
 *   nothing is upcoming — the panel falls back to a "regular hours" message.
 *
 *   date    — ISO day, "YYYY-MM-DD", in local (Wausau) time
 *   endDate — optional last day of a multi-day closure
 *   title   — what it is, e.g. "Thanksgiving"
 *   status  — "Closed", or the special hours, e.g. "Open 8:30 AM – 12:00 PM"
 */
export type StoreNotice = {
  date: string;
  endDate?: string;
  title: string;
  status: string;
};

// The real holiday schedule goes here. Aaron: paste the dates you post to
// Facebook (see the format above). Example of a filled-in entry:
//   { date: "2026-11-26", title: "Thanksgiving", status: "Closed" },
export const STORE_NOTICES: StoreNotice[] = [];

/** ISO "YYYY-MM-DD" for a date (defaults to now). */
function isoDay(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Upcoming notices only — anything whose closure has not fully passed —
 * soonest first, capped so the panel stays short.
 */
export function upcomingNotices(limit = 4, now: Date = new Date()): StoreNotice[] {
  const today = isoDay(now);
  return STORE_NOTICES.filter((n) => (n.endDate ?? n.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

/** Human label for a notice's date or date range, e.g. "Thu, Nov 26". */
export function noticeDateLabel(n: StoreNotice): string {
  const fmt = (iso: string) => {
    // Parse as local time (append T00:00) so the weekday doesn't shift.
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };
  return n.endDate && n.endDate !== n.date ? `${fmt(n.date)} – ${fmt(n.endDate)}` : fmt(n.date);
}
