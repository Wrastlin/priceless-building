import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { listDrafts, listPublished } from "@/lib/items/store";
import { getVelocitySummary } from "@/lib/items/velocity";
import { DashboardQueues } from "./dashboard-queues";
import { VelocityPanel } from "./velocity-panel";

export const dynamic = "force-dynamic";

/**
 * Admin dashboard. Re-framed as a "what's next" board for the
 * document-an-item loop:
 *
 *   1. Add a new item (snap photo + describe)
 *   2. Review the staging queue (approve / reject drafts)
 *   3. Generate marketing for live items
 *   4. Print floor tags
 *
 * Replaces the old mocked revenue / channel-health stats which were
 * misleading because none of those systems are wired up yet.
 */
export default async function AdminDashboard() {
  const [drafts, published, velocity] = await Promise.all([
    listDrafts(),
    listPublished(),
    getVelocitySummary(),
  ]);

  const oldestDraft = drafts
    .slice()
    .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""))[0];

  const recentPublished = published
    .slice()
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 4);

  return (
    <AdminShell
      active="dashboard"
      title="Dashboard"
      actions={
        <Link href="/admin/inventory/new" className="admin-btn admin-btn-primary">
          + Add item
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StepCard
          step="01"
          title="Add a new item"
          body="Snap a photo, describe it, pull live retail comparables, set a tag price."
          cta="Add item"
          href="/admin/inventory/new"
          count={null}
        />
        <StepCard
          step="02"
          title={drafts.length > 0 ? `Review ${drafts.length} draft${drafts.length === 1 ? "" : "s"}` : "Staging is clear"}
          body={
            drafts.length > 0
              ? `${drafts.length} item${drafts.length === 1 ? "" : "s"} waiting on approval before going live.`
              : "No drafts queued. New items will land here for review before they go live."
          }
          cta={drafts.length > 0 ? "Open staging" : "View staging"}
          href="/admin/staging"
          count={drafts.length}
          highlight={drafts.length > 0}
        />
        <StepCard
          step="03"
          title="Generate marketing"
          body="Turn a live item into a Facebook Marketplace post, Instagram caption, or floor flyer."
          cta="Generate post"
          href="/admin/marketing"
          count={published.length}
        />
      </div>

      <div className="mt-8">
        <DashboardQueues drafts={drafts} recent={recentPublished} oldestDraft={oldestDraft} />
      </div>

      <div className="mt-8">
        <VelocityPanel v={velocity} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Live SKUs" value={published.length.toString()} />
        <Stat label="In staging" value={drafts.length.toString()} />
        <Stat label="Departments" value={new Set(published.map((p) => p.category)).size.toString()} />
      </div>
    </AdminShell>
  );
}

function StepCard({
  step,
  title,
  body,
  cta,
  href,
  count,
  highlight = false,
}: {
  step: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  count: number | null;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "admin-card group flex flex-col gap-3 p-5 transition hover:border-[var(--brand-navy)] hover:shadow-sm " +
        (highlight ? "border-[var(--brand-navy)] bg-[var(--brand-navy)]/5" : "")
      }
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-navy)]">
          Step {step}
        </span>
        {count !== null ? (
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {count}
          </span>
        ) : null}
      </div>
      <h2 className="text-lg font-semibold leading-tight text-foreground">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      <span className="mt-auto text-sm font-medium text-[var(--brand-navy)] group-hover:underline">
        {cta} →
      </span>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}
