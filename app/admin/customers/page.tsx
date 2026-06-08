import { AdminShell } from "@/components/admin-shell";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type Customer = {
  id: string;
  name: string;
  city: string;
  type: "retail" | "contractor" | "builders-corner";
  joined: string;
  ltv: number;
  lastVisit: string;
  notes?: string;
};

const CUSTOMERS: Customer[] = [
  { id: "CT-001", name: "Riverside Build Co.", city: "Wausau", type: "contractor", joined: "2019", ltv: 184310, lastVisit: "today, 10:30 AM", notes: "Net-30 account · 3% volume discount" },
  { id: "CT-002", name: "Northern Renovations", city: "Schofield", type: "contractor", joined: "2020", ltv: 102450, lastVisit: "yesterday", notes: "Will-call locker A2/A3/A4" },
  { id: "CT-003", name: "Dan Heinrichs", city: "Wausau", type: "retail", joined: "2023", ltv: 4820, lastVisit: "today, 9:00 AM" },
  { id: "CT-004", name: "Maria Solberg", city: "Rib Mountain", type: "retail", joined: "2024", ltv: 2140, lastVisit: "today, 11:15 AM" },
  { id: "CT-005", name: "The Martins", city: "Schofield", type: "builders-corner", joined: "2025", ltv: 28400, lastVisit: "today, 9:45 AM", notes: "Active kitchen design · phase 2 install in July" },
  { id: "CT-006", name: "Marathon County Habitat", city: "Wausau", type: "contractor", joined: "2018", ltv: 67120, lastVisit: "last week", notes: "Non-profit rate · monthly receiving day" },
  { id: "CT-007", name: "The Olsons", city: "Lake DuBay", type: "builders-corner", joined: "2026", ltv: 0, lastVisit: "today, 12:30 PM", notes: "Just intaked · primary bath" },
  { id: "CT-008", name: "Jeff Korbel", city: "Mosinee", type: "retail", joined: "2024", ltv: 6420, lastVisit: "today, 2:15 PM" },
  { id: "CT-009", name: "Helen Birrenkott", city: "Wausau", type: "builders-corner", joined: "2025", ltv: 41200, lastVisit: "today, 3:30 PM", notes: "Inset painted kitchen · install complete" },
  { id: "CT-010", name: "Centra Group", city: "Stevens Point", type: "contractor", joined: "2022", ltv: 89320, lastVisit: "last Wed", notes: "Builds spec homes · standing window order" },
];

export default function CustomersPage() {
  return (
    <AdminShell
      active="customers"
      title={`Customers (${CUSTOMERS.length})`}
      actions={
        <>
          <button className="admin-btn admin-btn-outline">Import CSV</button>
          <button className="admin-btn admin-btn-primary">+ Add customer</button>
        </>
      }
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <Stat label="Contractors" value={CUSTOMERS.filter((c) => c.type === "contractor").length} />
        <Stat label="Builders Corner clients" value={CUSTOMERS.filter((c) => c.type === "builders-corner").length} />
        <Stat label="Retail" value={CUSTOMERS.filter((c) => c.type === "retail").length} />
        <Stat label="Total LTV" value={formatCurrency(CUSTOMERS.reduce((s, c) => s + c.ltv, 0))} />
      </div>

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Type</th>
              <th>Since</th>
              <th className="text-right">Lifetime value</th>
              <th>Last visit</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/admin/customers/${c.id}`} className="font-medium text-foreground hover:text-[var(--brand-priceless)] hover:underline">{c.name}</Link>
                  <div className="font-mono text-xs text-muted-foreground">{c.id}</div>
                </td>
                <td>{c.city}</td>
                <td><TypePill type={c.type} /></td>
                <td className="text-muted-foreground">{c.joined}</td>
                <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(c.ltv)}</td>
                <td className="text-xs text-muted-foreground">{c.lastVisit}</td>
                <td className="text-xs text-muted-foreground">{c.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="admin-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function TypePill({ type }: { type: Customer["type"] }) {
  const map: Record<Customer["type"], string> = {
    retail: "bg-[#f4f4f3] text-muted-foreground",
    contractor: "bg-rose-50 text-[var(--brand-priceless)]",
    "builders-corner": "bg-sky-50 text-[var(--brand-builders)]",
  };
  const label = type === "builders-corner" ? "Builders Corner" : type;
  return <span className={`admin-pill capitalize ${map[type]}`}>{label}</span>;
}
