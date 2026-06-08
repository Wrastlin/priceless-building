import { AdminShell } from "@/components/admin-shell";

export default function SettingsPage() {
  return (
    <AdminShell active="settings" title="Settings">
      <p className="admin-help mb-5">Floor configuration · SKU + tag + pricing rules.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="SKU prefix">
          <p className="text-sm text-muted-foreground">
            Items default to <span className="font-mono text-foreground">PL-XXXXXX</span> for Price-Less and{" "}
            <span className="font-mono text-foreground">BC-XXXXXX</span> for Builders Corner. Adjust per category if needed.
          </p>
        </Card>
        <Card title="Pricing rules">
          <p className="text-sm text-muted-foreground">
            Suggested tag = comparable retail × <strong className="text-foreground">45%</strong>. Floor minimum margin{" "}
            = <strong className="text-foreground">35%</strong>. Auto-discount stale items after{" "}
            <strong className="text-foreground">60 days</strong>.
          </p>
        </Card>
        <Card title="Comparable retailers">
          <ul className="space-y-1 text-sm text-foreground">
            <li>Home Depot (Wausau)</li>
            <li>Menards (Wausau)</li>
            <li>Lowe&apos;s (Wausau)</li>
            <li>Amazon (national)</li>
          </ul>
        </Card>
        <Card title="Floor printer">
          <p className="text-sm text-muted-foreground">
            Brother QL-820NWB · 4×3&quot; continuous · Bluetooth, paired.
          </p>
        </Card>
      </div>
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card p-5">
      <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
