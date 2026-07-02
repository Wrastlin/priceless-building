"use client";

/**
 * Presentational building blocks for the Add Item workspace. Kept separate
 * from the form's state/logic so the main file stays focused on behavior.
 */

/** One column panel: a single light card holding one or more labeled Groups. */
export function Panel({ children }: { children: React.ReactNode }) {
  return <section className="admin-card space-y-5 p-5">{children}</section>;
}

/**
 * A labeled sub-section inside a Panel. `divided` adds a hairline rule above
 * it so multiple groups read as one continuous panel rather than loose boxes.
 */
export function Group({
  title,
  hint,
  divided,
  children,
}: {
  title: string;
  hint?: string;
  divided?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={divided ? "border-t border-border pt-5" : ""}>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="flex-1 text-xs font-semibold uppercase tracking-[0.08em] text-foreground">{title}</h2>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

/**
 * Collapsible secondary tool. Native <details> so it's keyboard-accessible
 * and needs no extra state. Closed by default to keep the primary entry
 * path uncluttered.
 */
export function Disclosure({
  summary,
  hint,
  children,
}: {
  summary: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="admin-card group overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3.5 text-sm font-semibold text-foreground hover:bg-[#fafaf9]">
        <span className="text-muted-foreground transition group-open:rotate-90">▶</span>
        <span className="flex-1">{summary}</span>
        {hint ? <span className="text-xs font-normal text-muted-foreground">{hint}</span> : null}
      </summary>
      <div className="border-t border-border p-5">{children}</div>
    </details>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}
