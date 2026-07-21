import Link from "next/link";
import { requireAuth } from "@/lib/auth/require-auth";
import { signOutAction } from "@/lib/actions/auth";
import { Camera, LayoutGrid, Megaphone, ArrowLeft } from "lucide-react";
import { InventoryMoreMenu } from "./inventory-more-menu";

/**
 * Floor inventory product shell — daily loop only:
 * Inventory → Intake → Generate post. Everything else lives under More.
 */

export type InventoryNavKey =
  | "inventory"
  | "intake"
  | "marketing"
  | "connections"
  | "staging"
  | "aging"
  | "featured"
  | "more";

const PRIMARY: {
  href: string;
  label: string;
  key: InventoryNavKey;
  icon: typeof LayoutGrid;
}[] = [
  { href: "/admin/inventory", label: "Inventory", key: "inventory", icon: LayoutGrid },
  { href: "/admin/inventory/intake", label: "Intake", key: "intake", icon: Camera },
  { href: "/admin/marketing", label: "Generate post", key: "marketing", icon: Megaphone },
];

const MORE_HREF: Partial<Record<InventoryNavKey, string>> = {
  connections: "/admin/connections",
  staging: "/admin/staging",
  aging: "/admin/aging",
  featured: "/admin/featured",
};

export async function InventoryAppShell({
  children,
  active,
  title,
  subtitle,
  backHref,
  actions,
}: {
  children: React.ReactNode;
  active: InventoryNavKey;
  title?: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
}) {
  const claims = await requireAuth();
  const userEmail = (claims?.email as string | undefined) ?? null;

  return (
    <div className="inv-app min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="inv-topbar sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {backHref ? (
              <Link href={backHref} className="inv-icon-btn" aria-label="Back">
                <ArrowLeft size={18} strokeWidth={2} />
              </Link>
            ) : (
              <Link href="/admin/inventory" className="flex shrink-0 items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-navy)] text-[11px] font-bold tracking-wide text-[oklch(0.96_0.01_85)]">
                  PL
                </span>
                <span className="hidden sm:block">
                  <span className="block font-[family-name:var(--font-display)] text-[17px] font-medium leading-none tracking-[-0.01em]">
                    Inventory
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-gold-deep)]">
                    Price-Less
                  </span>
                </span>
              </Link>
            )}
            {title ? (
              <div className="min-w-0 border-l border-[var(--border)] pl-3">
                <h1 className="truncate text-[15px] font-semibold leading-tight">{title}</h1>
                {subtitle ? (
                  <p className="truncate text-[12px] text-[var(--muted-foreground)]">{subtitle}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {actions}
            <Link
              href="/"
              className="hidden text-[13px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:inline"
            >
              Storefront
            </Link>
            <span className="hidden max-w-[10rem] truncate text-[12px] text-[var(--muted-foreground)] md:inline">
              {userEmail ?? "Dev"}
            </span>
            {claims ? (
              <form action={signOutAction}>
                <button type="submit" className="inv-btn inv-btn-ghost text-[13px]">
                  Sign out
                </button>
              </form>
            ) : null}
          </div>
        </div>

        <nav
          className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 pb-2.5 sm:px-6"
          aria-label="Inventory"
        >
          {PRIMARY.map((n) => {
            const Icon = n.icon;
            const on = active === n.key;
            return (
              <Link
                key={n.key}
                href={n.href}
                className={
                  "inv-nav-pill inline-flex shrink-0 items-center gap-1.5 " +
                  (on ? "inv-nav-pill-active" : "")
                }
              >
                <Icon size={15} strokeWidth={2} />
                {n.label}
              </Link>
            );
          })}
          <InventoryMoreMenu activeHref={MORE_HREF[active]} />
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
