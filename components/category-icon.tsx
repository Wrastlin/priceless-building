import type { Category } from "@/lib/items/types";

/**
 * Per-category line glyph, shown as the thumbnail fallback when an item has
 * no real photo. Imagery-first: a clear category silhouette beats a repeated
 * generic warehouse photo or an empty gray box for at-a-glance scanning.
 */
const PATHS: Record<Category, React.ReactNode> = {
  doors: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <circle cx="15.5" cy="12" r="1" />
    </>
  ),
  windows: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M12 4v16M4 12h16" />
    </>
  ),
  cabinets: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18" />
      <path d="M9.5 8h.01M14.5 8h.01" />
    </>
  ),
  vanities: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M7 11h10M9 11v3a3 3 0 0 0 6 0v-3" />
    </>
  ),
  countertops: (
    <>
      <path d="M3 9h18l-1 3H4z" />
      <path d="M5 12v6M19 12v6" />
    </>
  ),
  hardware: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z" />
    </>
  ),
  lighting: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.2V16h6v-.3c0-.8.4-1.6 1-2.2A6 6 0 0 0 12 3z" />
    </>
  ),
  trim: (
    <>
      <path d="M4 20V8a4 4 0 0 1 4-4h12" />
      <path d="M4 20h6a4 4 0 0 0 4-4V8" />
    </>
  ),
};

export function CategoryIcon({
  category,
  className = "",
}: {
  category: Category;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[category] ?? PATHS.hardware}
    </svg>
  );
}
