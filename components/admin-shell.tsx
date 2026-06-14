import Link from "next/link";
import { requireAuth } from "@/lib/auth/require-auth";
import { signOutAction } from "@/lib/actions/auth";

/**
 * Utility admin chrome. Plain top bar + simple left sidebar nav.
 * Sans-only, sentence case, optimized for fast scanning by floor staff.
 * The storefront stays editorial; the admin is a tool.
 *
 * Gated by Supabase auth. Any unauthed request is redirected to /login
 * by proxy.ts, and `requireAuth()` here is defense-in-depth in case a
 * route is reachable without the proxy. Skipped entirely when Supabase
 * env vars are absent in dev (lets designers work without secrets).
 */
type NavItem = {
  href: string;
  label: string;
  key: string;
  section?: string;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", key: "dashboard", section: "Overview" },
  { href: "/admin/inventory/new", label: "Add item", key: "add", section: "Items" },
  { href: "/admin/staging", label: "Staging", key: "staging", section: "Items" },
  { href: "/admin/inventory", label: "Inventory", key: "inventory", section: "Items" },
  { href: "/admin/tags", label: "Print tags", key: "tags", section: "Items" },
  { href: "/admin/marketing", label: "Generate post", key: "marketing", section: "Marketing" },
  { href: "/admin/receiving", label: "Receiving", key: "receiving", section: "Flow" },
  { href: "/admin/returns", label: "Returns", key: "returns", section: "Flow" },
  { href: "/admin/settings", label: "Settings", key: "settings", section: "Config" },
];

type Crumb = { label: string; href?: string };

export async function AdminShell({
  children,
  active,
  title,
  crumbs,
  actions,
}: {
  children: React.ReactNode;
  active: string;
  /** Optional page title shown in the breadcrumb. Falls back to active key. */
  title?: string;
  /** Optional explicit breadcrumb chain (after "Admin"). */
  crumbs?: Crumb[];
  /** Optional top-bar action slot (e.g. primary CTA). */
  actions?: React.ReactNode;
}) {
  const claims = await requireAuth();
  const userEmail = (claims?.email as string | undefined) ?? null;
  const displayName = userEmail
    ? userEmail.split("@")[0].replace(/[._-]+/g, " ")
    : "Native";

  const activeItem = NAV.find((n) => n.key === active);
  const trail: Crumb[] = crumbs ?? (activeItem ? [{ label: activeItem.label, href: activeItem.href }] : []);
  const pageTitle = title ?? activeItem?.label ?? "Admin";

  const sections = Array.from(new Set(NAV.map((n) => n.section ?? "More")));

  return (
    <div className="min-h-screen bg-[#f7f7f6] text-foreground">
      {/* TOP BAR */}
      <header className="sticky top-0 z-20 border-b border-border bg-white">
        <div className="flex h-12 items-center justify-between gap-4 px-5">
          <div className="flex min-w-0 items-center gap-3 text-sm">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-foreground">
              <span className="inline-flex h-6 items-center rounded bg-[var(--brand-priceless)] px-1.5 text-[11px] font-bold text-white">PL</span>
              <span>Price-Less admin</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            {trail.map((c, i) => (
              <span key={i} className="flex items-center gap-2 min-w-0">
                {c.href ? (
                  <Link href={c.href} className="truncate text-muted-foreground hover:text-foreground">{c.label}</Link>
                ) : (
                  <span className="truncate text-muted-foreground">{c.label}</span>
                )}
                {i < trail.length - 1 ? <span className="text-muted-foreground">/</span> : null}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">Storefront</Link>
            <span className="text-muted-foreground">{userEmail ?? "Dev mode"}</span>
            {claims ? (
              <form action={signOutAction}>
                <button type="submit" className="admin-btn admin-btn-ghost px-2 py-1 text-sm">Sign out</button>
              </form>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-56 shrink-0 overflow-y-auto border-r border-border bg-white md:block">
          <nav className="py-3">
            {sections.map((section) => (
              <div key={section} className="mb-3">
                <div className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  {section}
                </div>
                {NAV.filter((n) => (n.section ?? "More") === section).map((n) => {
                  const isActive = active === n.key;
                  return (
                    <Link
                      key={n.key}
                      href={n.href}
                      className={
                        "relative block px-4 py-1.5 text-sm transition " +
                        (isActive
                          ? "bg-[var(--brand-priceless)]/8 font-semibold text-[var(--brand-priceless)]"
                          : "text-foreground hover:bg-[#f4f4f3]")
                      }
                    >
                      {isActive ? (
                        <span className="absolute left-0 top-0 h-full w-[3px] bg-[var(--brand-priceless)]" />
                      ) : null}
                      {n.label}
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="mt-4 border-t border-border px-4 pt-4">
              <div className="text-xs text-muted-foreground">Signed in as</div>
              <div className="mt-0.5 truncate text-sm font-semibold capitalize text-foreground">{displayName}</div>
              <div className="truncate text-xs text-muted-foreground">{userEmail ?? "no account attached"}</div>
              <Link href="/admin/team" className="mt-2 inline-block text-xs text-muted-foreground hover:text-foreground">
                Manage team →
              </Link>
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">
          <div className="border-b border-border bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <h1 className="text-2xl font-semibold text-foreground">{pageTitle}</h1>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </div>
          </div>
          <div className="px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
