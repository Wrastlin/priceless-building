import Link from "next/link";
import { InventoryAppShell } from "@/components/inventory/inventory-app-shell";
import { listAdminAll } from "@/lib/items/store";
import { resolveActor } from "@/lib/auth/actor";

export const metadata = { title: "Today" };

function startOfWeekIso(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d.toISOString();
}

export default async function TodayPage() {
  const [actor, items] = await Promise.all([
    resolveActor(),
    listAdminAll().catch(() => []),
  ]);
  const weekStart = startOfWeekIso();
  const label = actor?.label ?? null;
  const firstName = label?.includes("@") ? label.split("@")[0] : label;

  const thisWeek = items.filter((it) => (it.createdAt ?? "") >= weekStart);
  const mine = label
    ? thisWeek.filter((it) => (it.createdBy ?? "").toLowerCase() === label.toLowerCase())
    : [];
  const recent = [...items]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 8);

  const withMeas = mine.filter((it) => !!(it.dimensions && it.dimensions.trim())).length;
  const withDesc = mine.filter((it) => !!(it.description && it.description.trim())).length;
  const multiPhoto = mine.filter((it) => (it.photos?.length ?? 0) + (it.gallery?.length ?? 0) > 1).length;

  return (
    <InventoryAppShell active="today" title="Today">
      <div className="mb-8 max-w-lg">
        <p className="inv-eyebrow mb-2">Floor</p>
        <h2 className="font-[family-name:var(--font-display)] text-[1.75rem] font-medium tracking-tight">
          {firstName ? `Hi, ${firstName}` : "Welcome"}
        </h2>
        <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
          Your photos help get items ready for customers.
        </p>      </div>

      <Link
        href="/admin/inventory/intake"
        className="inv-btn inv-btn-primary mb-8 flex w-full max-w-md items-center justify-center py-4 text-[17px]"
      >
        ＋ Add item
      </Link>

      <div className="mb-8 grid max-w-md grid-cols-2 gap-3">
        <div className="rounded-[14px] border border-[var(--border)] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            You this week
          </p>
          <p className="mt-1 text-[2rem] font-semibold tabular-nums leading-none">{mine.length}</p>
          <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">items recorded</p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Team this week
          </p>
          <p className="mt-1 text-[2rem] font-semibold tabular-nums leading-none">{thisWeek.length}</p>
          <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">ready for the floor</p>
        </div>
      </div>

      {mine.length > 0 ? (
        <div className="mb-8 max-w-md rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px]">
          <p className="font-medium">Your quality this week</p>
          <p className="mt-1 text-[var(--muted-foreground)]">
            {multiPhoto} with extra photos · {withMeas} with measurements · {withDesc} with descriptions
          </p>
        </div>
      ) : null}

      <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        Recent
      </h3>
      <ul className="max-w-md divide-y divide-[var(--border)] rounded-[14px] border border-[var(--border)] bg-white">
        {recent.length === 0 ? (
          <li className="px-4 py-6 text-[14px] text-[var(--muted-foreground)]">Nothing yet — add the first item.</li>
        ) : (
          recent.map((it) => (
            <li key={it.sku}>
              <Link
                href={`/admin/inventory/${it.sku}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-[14px] hover:bg-[var(--surface)]"
              >
                <span className="min-w-0 truncate font-medium">{it.title}</span>
                <span className="shrink-0 text-[12px] capitalize text-[var(--muted-foreground)]">
                  {it.status}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </InventoryAppShell>
  );
}
