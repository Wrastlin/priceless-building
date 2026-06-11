import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { CATALOG } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

const CUSTOMERS: Record<string, { name: string; type: string; city: string; phone: string; email: string; ltv: number; joined: string; notes: string }> = {
  "CT-001": { name: "Riverside Build Co.", type: "Contractor", city: "Wausau, WI", phone: "(715) 555-0142", email: "ops@riverside-build.com", ltv: 184310, joined: "Apr 2019", notes: "Net-30 account · 3% volume discount · Locker A1 on standby" },
  "CT-002": { name: "Northern Renovations", type: "Contractor", city: "Schofield, WI", phone: "(715) 555-2208", email: "matt@northern-renovations.com", ltv: 102450, joined: "Jan 2020", notes: "Will-call lockers A2/A3/A4 · prefers Wednesday pickup" },
  "CT-003": { name: "Dan Heinrichs", type: "Retail", city: "Wausau, WI", phone: "(715) 555-7711", email: "dan.h@gmail.com", ltv: 4820, joined: "Aug 2023", notes: "Building out a primary suite. Has bought 6 doors over 4 visits" },
  "CT-004": { name: "Maria Solberg", type: "Retail", city: "Rib Mountain, WI", phone: "(715) 555-1842", email: "mariasol@yahoo.com", ltv: 2140, joined: "Mar 2024", notes: "Vanity remodel project · interested in matte black hardware" },
  "CT-005": { name: "The Martins", type: "Builders Corner", city: "Schofield, WI", phone: "(715) 555-3309", email: "martins.kitchen@gmail.com", ltv: 28400, joined: "Feb 2025", notes: "Active kitchen design · phase 2 install in July" },
  "CT-006": { name: "Marathon County Habitat", type: "Contractor", city: "Wausau, WI", phone: "(715) 848-1234", email: "restore@habitatmc.org", ltv: 67120, joined: "Jun 2018", notes: "Non-profit rate · monthly receiving day" },
  "CT-007": { name: "The Olsons", type: "Builders Corner", city: "Lake DuBay, WI", phone: "(715) 555-8821", email: "tolsons@gmail.com", ltv: 0, joined: "Jun 2026", notes: "Just intaked · primary bath" },
  "CT-008": { name: "Jeff Korbel", type: "Retail", city: "Mosinee, WI", phone: "(715) 555-1090", email: "jkorbel@hotmail.com", ltv: 6420, joined: "Apr 2024", notes: "Reno of grandparents' home · reclaimed pieces preferred" },
  "CT-009": { name: "Helen Birrenkott", type: "Builders Corner", city: "Wausau, WI", phone: "(715) 555-4477", email: "helenb@gmail.com", ltv: 41200, joined: "May 2025", notes: "Inset painted kitchen · install complete · referred 2 friends" },
  "CT-010": { name: "Centra Group", type: "Contractor", city: "Stevens Point, WI", phone: "(715) 555-9912", email: "purchasing@centragroup.com", ltv: 89320, joined: "Sep 2022", notes: "Builds spec homes · standing window order" },
};

export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = CUSTOMERS[id];
  if (!c) notFound();
  const recentOrders = [
    { id: "PL-ORD-48211", date: "today, 9:00 AM", total: 1190, items: [CATALOG[0], CATALOG[7]] },
    { id: "PL-ORD-48199", date: "last week", total: 879, items: [CATALOG[3], CATALOG[8]] },
    { id: "PL-ORD-48174", date: "Apr 12", total: 412, items: [CATALOG[4]] },
  ];
  return (
    <AdminShell
      active="customers"
      title={c.name}
      crumbs={[
        { label: "Customers", href: "/admin/customers" },
        { label: id },
      ]}
    >
      <div className="mb-5 admin-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">
              <span className="font-mono">{id}</span> · {c.type} · {c.city} · since {c.joined}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <a href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`} className="text-[var(--brand-priceless)] hover:underline">{c.phone}</a>
              <a href={`mailto:${c.email}`} className="text-[var(--brand-priceless)] hover:underline">{c.email}</a>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Lifetime value</div>
            <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">{formatCurrency(c.ltv)}</div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <Card title="Internal notes"><p className="text-sm text-foreground">{c.notes}</p></Card>
        <Card title="Avg ticket"><div className="font-mono text-2xl font-semibold tabular-nums">{formatCurrency(c.ltv ? c.ltv / 12 : 0)}</div></Card>
        <Card title="Visit frequency"><div className="text-2xl font-semibold">{c.type === "Contractor" ? "Weekly" : c.type === "Builders Corner" ? "Project" : "Monthly"}</div></Card>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-foreground">Recent orders</h2>
        <div className="admin-card overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Items</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs">{o.id}</td>
                  <td className="text-sm text-muted-foreground">{o.date}</td>
                  <td className="text-sm">{o.items.map((i) => i.title).join(" · ")}</td>
                  <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
