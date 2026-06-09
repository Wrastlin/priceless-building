export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-24">
      <div
        role="status"
        aria-label="Loading the warehouse"
        className="size-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--brand-priceless)]"
      />
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        Loading the floor…
      </div>
    </div>
  );
}
