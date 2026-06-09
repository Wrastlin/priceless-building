/**
 * Compact search input that lives inside the site header on larger
 * screens. It is a plain GET form pointing to /search?q=..., so it
 * works without JavaScript and lets the user start typing right away
 * without having to click a separate icon first.
 */
export function HeaderSearch() {
  return (
    <form
      role="search"
      action="/search"
      method="get"
      className="hidden h-11 items-center gap-2.5 rounded-md border border-[var(--border)] bg-white px-3.5 text-base transition focus-within:border-[var(--brand-priceless)] hover:border-[var(--foreground)]/30 lg:flex"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-[var(--brand-priceless)]"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        name="q"
        type="search"
        placeholder="Search doors, windows, cabinets…"
        aria-label="Search the warehouse"
        className="w-72 border-0 bg-transparent p-0 text-base font-medium text-[var(--foreground)] placeholder:font-medium placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-0 xl:w-96"
      />
    </form>
  );
}
