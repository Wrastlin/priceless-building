/**
 * Compact search input that lives inside the site header on larger
 * screens. Plain GET form → /search?q=...
 */
export function HeaderSearch() {
  return (
    <form
      role="search"
      action="/search"
      method="get"
      className="hidden h-10 min-w-0 items-center gap-2.5 border border-[var(--line)] bg-white px-3 text-sm transition focus-within:border-[var(--ink)] hover:border-[var(--ink)]/40 lg:flex"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-[var(--ink)]"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        name="q"
        type="search"
        placeholder="Search…"
        aria-label="Search the warehouse"
        className="w-28 min-w-0 border-0 bg-transparent p-0 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[var(--ink)] placeholder:font-medium placeholder:text-[var(--soft)] focus:outline-none focus:ring-0 xl:w-40"
      />
    </form>
  );
}
