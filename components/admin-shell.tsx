import Link from "next/link";
import { requireAuth } from "@/lib/auth/require-auth";
import { signOutAction } from "@/lib/actions/auth";

/**
 * Classic admin chrome for secondary tools (staging, team, etc.).
 * Daily floor work lives in InventoryAppShell — this sidebar stays short:
 * primary loop + a scrollable More list.
 */
type NavItem = {
  href: string;
  label: string;
  key: string;
  section: "Daily" | "More";
};

const NAV: NavItem[] = [
  { href: "/admin/inventory", label: "Inventory", key: "inventory", section: "Daily" },
  { href: "/admin/inventory/intake", label: "Intake", key: "intake", section: "Daily" },
  { href: "/admin/marketing", label: "Generate post", key: "marketing", section: "Daily" },
  { href: "/admin/connections", label: "Connections", key: "connections", section: "More" },
  { href: "/admin/staging", label: "Staging", key: "staging", section: "More" },
  { href: "/admin/aging", label: "Aging", key: "aging", section: "More" },
  { href: "/admin/featured", label: "Featured", key: "featured", section: "More" },
  { href: "/admin/capture", label: "Quick capture", key: "capture", section: "More" },
  { href: "/admin/labels", label: "Print stickers", key: "labels", section: "More" },
  { href: "/admin/tags", label: "Print tags", key: "tags", section: "More" },
  { href: "/admin/receiving", label: "Receiving", key: "receiving", section: "More" },
  { href: "/admin/returns", label: "Returns", key: "returns", section: "More" },
  { href: "/admin/team", label: "Team", key: "team", section: "More" },
  { href: "/admin/settings", label: "Settings", key: "settings", section: "More" },
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
  title?: string;
  crumbs?: Crumb[];
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
  const sections: Array<"Daily" | "More"> = ["Daily", "More"];

  return (
    <div className="min-h-screen bg-[oklch(0.968_0.008_85)] text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-white">
        <div className="flex h-12 items-center justify-between gap-4 px-5">
          <div className="flex min-w-0 items-center gap-3 text-sm">
            <Link
              href="/admin/inventory"
              className="flex items-center gap-2 font-semibold text-foreground"
            >
              <span className="inline-flex h-6 items-center rounded bg-[var(--brand-priceless)] px-1.5 text-[11px] font-bold text-white">
                PL
              </span>
              <span>Price-Less floor</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            {trail.map((c, i) => (
              <span key={i} className="flex min-w-0 items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="truncate text-muted-foreground hover:text-foreground">
                    {c.label}
                  </Link>
                ) : (
                  <span className="truncate text-muted-foreground">{c.label}</span>
                )}
                {i < trail.length - 1 ? <span className="text-muted-foreground">/</span> : null}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Storefront
            </Link>
            <span className="hidden text-muted-foreground sm:inline">{userEmail ?? "Dev mode"}</span>
            {claims ? (
              <form action={signOutAction}>
                <button type="submit" className="admin-btn admin-btn-ghost px-2 py-1 text-sm">
                  Sign out
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-56 shrink-0 overflow-y-auto overscroll-contain border-r border-border bg-white md:block">
          <nav className="py-3">
            {sections.map((section) => (
              <div key={section} className="mb-3">
                <div className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  {section === "Daily" ? "Daily loop" : "More"}
                </div>
                {NAV.filter((n) => n.section === section).map((n) => {
                  const isActive = active === n.key;
                  return (
                    <Link
                      key={n.key}
                      href={n.href}
                      className={
                        "mx-2 block rounded-lg px-2.5 py-1.5 text-sm transition " +
                        (isActive
                          ? "bg-[var(--brand-navy)]/10 font-semibold text-[var(--brand-navy)]"
                          : "text-foreground hover:bg-[oklch(0.955_0.01_85)]")
                      }
                    >
                      {n.label}
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="mt-4 border-t border-border px-4 pt-4 pb-6">
              <div className="text-xs text-muted-foreground">Signed in as</div>
              <div className="mt-0.5 truncate text-sm font-semibold capitalize text-foreground">
                {displayName}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {userEmail ?? "no account attached"}
              </div>
            </div>
          </nav>
        </aside>

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
