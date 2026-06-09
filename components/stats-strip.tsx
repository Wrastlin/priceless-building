import { GOOGLE_RATING } from "@/lib/google-reviews";

/**
 * Four-stat anchor band on dark, sitting right under the hero. Only
 * verifiable facts: store age, Google rating + review count, weekly
 * open days, and the "HUGE" qualitative savings label (intentionally
 * non-numeric because we can't guarantee a flat discount on every SKU).
 *
 * Replaces both the old stats strip and the old "Quick Trust Bar"
 * row that sat below it — those were saying the same thing in two
 * different visual styles.
 */
export function StatsStrip() {
  return (
    <section className="border-b bg-[#0b1220] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-6 py-8 md:grid-cols-4 md:gap-x-6 md:py-10">
        <NumStat n="HUGE" label="savings vs. big-box retail" />
        <NumStat n="1978" label="serving central Wisconsin since" />
        <NumStat n={`${GOOGLE_RATING.average.toFixed(1)}★`} label={`on Google · ${GOOGLE_RATING.count} reviews`} />
        <NumStat n="MON–SAT" label="open six days a week" />
      </div>
    </section>
  );
}

function NumStat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl leading-none text-white md:text-5xl">
        {n}
      </div>
      <div className="mt-1 text-xs leading-snug text-white/85">{label}</div>
    </div>
  );
}
