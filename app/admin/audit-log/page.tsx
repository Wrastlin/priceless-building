import { AdminShell } from "@/components/admin-shell";
import { formatCurrency } from "@/lib/utils";

type Entry = {
  ts: string;
  who: string;
  action: string;
  target: string;
  delta?: string;
  source: "ui" | "rule" | "channel" | "pos" | "system";
};

const LOG: Entry[] = [
  { ts: "today · 14:21", who: "Brian", action: "Tag printed", target: "PL-000301 · 30\" Shaker Base", source: "ui" },
  { ts: "today · 14:18", who: "POS · Counter 1", action: "Sale", target: "PL-000201 × 2", delta: formatCurrency(258), source: "pos" },
  { ts: "today · 13:50", who: "Floor staff", action: "Item added", target: "PL-000701 · MDF Base Trim", source: "ui" },
  { ts: "today · 13:34", who: "System", action: "Comparable refresh", target: "PL-000101 · HD ↓$8", delta: "−$8", source: "rule" },
  { ts: "today · 13:01", who: "POS · Counter 2", action: "Sale", target: "PL-000401 × 1", delta: formatCurrency(449), source: "pos" },
  { ts: "today · 12:44", who: "Channel · FB", action: "Listing updated", target: "PL-000104 · Reclaimed Pine Door", source: "channel" },
  { ts: "today · 12:30", who: "Josh", action: "Customer created", target: "New customer · contractor account", source: "ui" },
  { ts: "today · 12:04", who: "Rule · Stale stock discount", action: "Bulk re-tag", target: "14 items · doors + windows", delta: "−15%", source: "rule" },
  { ts: "today · 11:15", who: "POS · Counter 1", action: "Sale", target: "PL-000401 + PL-000601 × 3", delta: formatCurrency(678), source: "pos" },
  { ts: "today · 10:33", who: "Brian", action: "Return restocked", target: "RT-201 · PL-000201 × 2", delta: `+${formatCurrency(258)}`, source: "ui" },
  { ts: "today · 10:30", who: "Sam", action: "Receiving committed", target: "Truck ABC Builders · 50 SKUs", source: "ui" },
  { ts: "today · 09:48", who: "Channel · eBay", action: "Listing sold", target: "PL-000104 (reclaimed door)", delta: formatCurrency(145), source: "channel" },
  { ts: "today · 09:00", who: "POS · Counter 2", action: "Order pickup", target: "PL-ORD-48211 · Dan H.", delta: formatCurrency(1190), source: "pos" },
  { ts: "today · 08:30", who: "System", action: "Pricing rules run", target: "6 rules · 17 changes proposed", source: "system" },
  { ts: "today · 06:00", who: "System", action: "Daily channel sync", target: "412 listings refreshed", source: "system" },
];

const SOURCE_CHIP: Record<Entry["source"], string> = {
  ui: "bg-sky-50 text-sky-700",
  rule: "bg-amber-50 text-amber-700",
  channel: "bg-emerald-50 text-emerald-700",
  pos: "bg-rose-50 text-[var(--brand-priceless)]",
  system: "bg-[#f4f4f3] text-muted-foreground",
};

export default function AuditLog() {
  return (
    <AdminShell
      active="audit"
      title="Audit log"
      actions={
        <>
          <select className="admin-input w-auto">
            <option>All sources</option><option>UI</option><option>POS</option><option>Channel</option><option>Rule</option><option>System</option>
          </select>
          <button className="admin-btn admin-btn-outline">Export CSV</button>
        </>
      }
    >
      <p className="admin-help mb-4">Last 24 hours of every action that touched inventory.</p>
      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Who</th>
              <th>Action</th>
              <th>Target</th>
              <th className="text-right">Delta</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {LOG.map((e, i) => (
              <tr key={i}>
                <td className="font-mono text-xs text-muted-foreground">{e.ts}</td>
                <td>{e.who}</td>
                <td className="font-medium">{e.action}</td>
                <td className="text-sm text-muted-foreground">{e.target}</td>
                <td className="text-right font-mono text-xs tabular-nums">{e.delta ?? ""}</td>
                <td><span className={`admin-pill capitalize ${SOURCE_CHIP[e.source]}`}>{e.source}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
