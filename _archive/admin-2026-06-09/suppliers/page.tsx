import { AdminShell } from "@/components/admin-shell";
import { formatCurrency } from "@/lib/utils";

type Supplier = {
  id: string;
  name: string;
  kind: "manufacturer-overstock" | "cancelled-orders" | "reclaim" | "auction" | "manufacturer-direct";
  city: string;
  contact: string;
  ytdSpend: number;
  lastDelivery: string;
  notes: string;
};

const SUPPLIERS: Supplier[] = [
  { id: "SU-01", name: "Masonite (cancelled orders)", kind: "cancelled-orders", city: "Tampa, FL (drop-ship)", contact: "Brad Q. · brad@masonite-surplus.com", ytdSpend: 68400, lastDelivery: "today", notes: "Doors. Pickup 1× / quarter. Pays back in 14 days." },
  { id: "SU-02", name: "JELD-WEN cancelled orders", kind: "cancelled-orders", city: "Charlotte, NC", contact: "Maria L. · 704-555-2102", ytdSpend: 41200, lastDelivery: "2 weeks ago", notes: "Windows + patio doors. Sea-trailer monthly." },
  { id: "SU-03", name: "Conestoga Custom Cabinetry", kind: "manufacturer-direct", city: "Lancaster, PA", contact: "Rep: Steve W.", ytdSpend: 184000, lastDelivery: "ongoing", notes: "Builders Corner premium cabinet boxes. 14-day lead." },
  { id: "SU-04", name: "Marathon County Habitat ReStore overflow", kind: "reclaim", city: "Wausau, WI", contact: "Helen S. · 715-848-1234", ytdSpend: 1200, lastDelivery: "last Friday", notes: "Reclaimed doors + hardware. Local pickup." },
  { id: "SU-05", name: "Auction House · Twin Cities", kind: "auction", city: "Minneapolis, MN", contact: "Bidder: Brian", ytdSpend: 14800, lastDelivery: "March", notes: "Vanity overruns + countertop remnants. Annual visit." },
  { id: "SU-06", name: "Behr / Masco overstock", kind: "manufacturer-overstock", city: "Various", contact: "Channel: Surplus.net", ytdSpend: 9320, lastDelivery: "this month", notes: "Hardware, pulls, finishes. Reactive purchasing." },
  { id: "SU-07", name: "ABC Builders cancelled order", kind: "cancelled-orders", city: "Eau Claire, WI", contact: "Mike P. · 715-555-1188", ytdSpend: 7800, lastDelivery: "today", notes: "One-time inquiry, building was scrapped mid-build." },
];

const KIND_LABEL: Record<Supplier["kind"], string> = {
  "manufacturer-overstock": "Manufacturer overstock",
  "cancelled-orders": "Cancelled orders",
  reclaim: "Reclaim",
  auction: "Auction",
  "manufacturer-direct": "Manufacturer direct",
};

export default function SuppliersPage() {
  return (
    <AdminShell
      active="suppliers"
      title="Suppliers"
      actions={<button className="admin-btn admin-btn-primary">+ Add supplier</button>}
    >
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <Stat label="Active suppliers" value={SUPPLIERS.length} />
        <Stat label="YTD spend" value={formatCurrency(SUPPLIERS.reduce((s, x) => s + x.ytdSpend, 0))} />
        <Stat label="Avg unit cost vs. retail" value="34%" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {SUPPLIERS.map((s) => (
          <div key={s.id} className="admin-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-semibold text-foreground">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.city}</div>
              </div>
              <span className="admin-pill bg-[#f4f4f3] text-muted-foreground shrink-0">{KIND_LABEL[s.kind]}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.notes}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Contact</div>
                <div className="mt-1 text-foreground">{s.contact}</div>
              </div>
              <div>
                <div className="text-muted-foreground">YTD spend</div>
                <div className="mt-1 font-mono font-semibold tabular-nums text-foreground">{formatCurrency(s.ytdSpend)}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Last delivery: {s.lastDelivery}</div>
          </div>
        ))}
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
