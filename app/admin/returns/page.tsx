import { AdminShell } from "@/components/admin-shell";
import { formatCurrency } from "@/lib/utils";

type Return = {
  id: string;
  date: string;
  customer: string;
  sku: string;
  item: string;
  qty: number;
  refund: number;
  reason: string;
  status: "pending" | "restock" | "scrap" | "refunded";
};

const RETURNS: Return[] = [
  { id: "RT-201", date: "today", customer: "Riverside Build Co.", sku: "PL-000201", item: "Vinyl double-hung window 36×60", qty: 2, refund: 258, reason: "Wrong size on order", status: "restock" },
  { id: "RT-200", date: "today", customer: "Maria Solberg", sku: "PL-000601", item: "3-Light vanity bar · brushed brass", qty: 1, refund: 79, reason: "Damaged in transit", status: "scrap" },
  { id: "RT-199", date: "yesterday", customer: "Dan Heinrichs", sku: "PL-000101", item: "Pre-Hung 6-Panel Interior Door", qty: 1, refund: 79, reason: "Hung in wrong direction", status: "pending" },
  { id: "RT-198", date: "yesterday", customer: "Jeff Korbel", sku: "PL-000501", item: "Matte black cabinet pulls (10-pack)", qty: 1, refund: 24, reason: "Customer changed finish", status: "restock" },
  { id: "RT-197", date: "2 days ago", customer: "Centra Group", sku: "PL-000110", item: "Exterior steel door · smooth", qty: 1, refund: 199, reason: "Door slab warped", status: "refunded" },
];

const STATUS_STYLES: Record<Return["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  restock: "bg-emerald-50 text-emerald-700",
  scrap: "bg-rose-50 text-rose-700",
  refunded: "bg-sky-50 text-sky-700",
};

export default function ReturnsPage() {
  return (
    <AdminShell
      active="returns"
      title="Returns"
      actions={<button className="admin-btn admin-btn-primary">+ Start a return</button>}
    >
      <p className="admin-help mb-5 max-w-2xl">
        Every return scans back through the same SKU. Restock puts it back on the floor with its history intact. Scrap removes it. Refund triggers the channel to release funds.
      </p>

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Return</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Reason</th>
              <th className="text-right">Refund</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {RETURNS.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="font-mono text-xs">{r.id}</div>
                  <div className="text-xs text-muted-foreground">{r.date}</div>
                </td>
                <td>{r.customer}</td>
                <td>
                  <div>{r.item}</div>
                  <div className="text-xs text-muted-foreground"><span className="font-mono">{r.sku}</span> · qty {r.qty}</div>
                </td>
                <td className="text-sm text-muted-foreground">{r.reason}</td>
                <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(r.refund)}</td>
                <td>
                  <span className={`admin-pill capitalize ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                </td>
                <td className="text-right">
                  {r.status === "pending" ? (
                    <div className="flex justify-end gap-1">
                      <button className="admin-btn admin-btn-primary px-2 py-1 text-xs">Restock</button>
                      <button className="admin-btn admin-btn-danger px-2 py-1 text-xs">Scrap</button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
