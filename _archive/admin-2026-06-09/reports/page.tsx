import { AdminShell } from "@/components/admin-shell";
import { CATALOG } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const byCat = new Map<string, { count: number; revenue: number }>();
  for (const c of CATALOG) {
    const prev = byCat.get(c.category) ?? { count: 0, revenue: 0 };
    byCat.set(c.category, { count: prev.count + 1, revenue: prev.revenue + c.price * Math.max(c.inStock, 1) });
  }

  return (
    <AdminShell active="reports" title="Reports">
      <p className="admin-help mb-5">Last 30 days · margins, velocity, channels.</p>
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <Card title="Revenue · last 30 days" value="$184,210" delta="+12% MoM" />
        <Card title="Avg margin" value="38%" delta="−2pts (priced more aggressively)" />
        <Card title="Inventory turn" value="5.4×/yr" delta="Stable" />
      </div>

      <div className="admin-card p-5">
        <h2 className="text-base font-semibold text-foreground">Sell-through by department</h2>
        <table className="admin-table mt-3">
          <thead>
            <tr>
              <th>Department</th>
              <th className="text-right">SKUs</th>
              <th className="text-right">Tag value on floor</th>
              <th>Velocity</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(byCat.entries()).map(([cat, { count, revenue }]) => (
              <tr key={cat}>
                <td className="capitalize">{cat}</td>
                <td className="text-right tabular-nums">{count}</td>
                <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(revenue)}</td>
                <td>
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-[#f4f4f3]">
                    <div className="h-full rounded-full bg-[var(--brand-priceless)]" style={{ width: `${30 + (count * 13) % 60}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Card({ title, value, delta }: { title: string; value: string; delta: string }) {
  return (
    <div className="admin-card p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-1.5 font-mono text-3xl font-semibold tabular-nums text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
    </div>
  );
}
