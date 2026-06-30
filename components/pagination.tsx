import Link from "next/link";

/**
 * Numbered pager, modeled on the big-box product-listing pages (Home Depot
 * et al.): Prev / 1 … current-window … last / Next. Pure server component —
 * each page is its own cacheable URL (`?page=N`), so the CDN can hold them.
 */
function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  const out: (number | "ellipsis")[] = [];
  const lo = Math.max(1, current - 1);
  const hi = Math.min(total, current + 1);
  out.push(1);
  if (lo > 2) out.push("ellipsis");
  for (let n = Math.max(2, lo); n <= Math.min(total - 1, hi); n++) out.push(n);
  if (hi < total - 1) out.push("ellipsis");
  if (total > 1) out.push(total);
  return out;
}

export function Pagination({
  basePath,
  page,
  totalPages,
  query = {},
}: {
  basePath: string;
  page: number;
  totalPages: number;
  /** Other query params to preserve in the links (e.g. the search `q`). */
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) if (v) params.set(k, v);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const cell =
    "font-mono inline-flex h-10 min-w-10 items-center justify-center px-3 text-xs uppercase tracking-[0.12em] transition";
  const active = `${cell} bg-[var(--brand-priceless)] text-white`;
  const link = `${cell} border border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--brand-priceless)] hover:text-[var(--brand-priceless)]`;
  const disabled = `${cell} border border-[var(--border)] bg-white text-[var(--muted-foreground)]/40`;

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={link}>
          ← Prev
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">
          ← Prev
        </span>
      )}

      {pageWindow(page, totalPages).map((it, i) =>
        it === "ellipsis" ? (
          <span key={`gap-${i}`} className="px-1 text-[var(--muted-foreground)]">
            …
          </span>
        ) : (
          <Link
            key={it}
            href={href(it)}
            aria-current={it === page ? "page" : undefined}
            className={it === page ? active : link}
          >
            {it}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" className={link}>
          Next →
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">
          Next →
        </span>
      )}
    </nav>
  );
}
