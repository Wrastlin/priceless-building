import { AdminShell } from "@/components/admin-shell";
import { formatCurrency } from "@/lib/utils";

type Slot = {
  time: string;
  type: "pickup" | "delivery" | "consult" | "receiving";
  customer: string;
  detail: string;
  total?: number;
};

const TODAY: Slot[] = [
  { time: "8:30 AM", type: "receiving", customer: "Brian + Sam", detail: "Truck · cancelled order ABC Builders · ~50 SKUs" },
  { time: "9:00 AM", type: "pickup", customer: "Dan H., Wausau", detail: "PL-ORD-48211 · 6 doors + 2 vanities", total: 1190 },
  { time: "9:45 AM", type: "consult", customer: "The Martins, Schofield", detail: "Builders Corner · kitchen design intake" },
  { time: "10:30 AM", type: "delivery", customer: "Riverside Build Co.", detail: "8 windows + 32' of trim · 3204 Rib Mountain Dr", total: 819 },
  { time: "11:15 AM", type: "pickup", customer: "Maria S., Rib Mountain", detail: "PL-ORD-48214 · 1 vanity + 3 lighting fixtures", total: 678 },
  { time: "12:30 PM", type: "consult", customer: "The Olsons, Lake DuBay", detail: "Builders Corner · primary bath remodel walk-through" },
  { time: "1:30 PM", type: "pickup", customer: "Northern Renovations", detail: "Will-call lockers A2, A3, A4 (contractor account)" },
  { time: "2:15 PM", type: "delivery", customer: "Jeff K., Mosinee", detail: "1 reclaimed door · 1 cabinet run", total: 240 },
  { time: "3:30 PM", type: "pickup", customer: "Helen B., Wausau", detail: "PL-ORD-48217 · custom inset Builders Corner kitchen final pickup" },
];

const TYPE_STYLES: Record<Slot["type"], string> = {
  pickup: "border-l-emerald-500",
  delivery: "border-l-sky-500",
  consult: "border-l-amber-500",
  receiving: "border-l-[var(--brand-priceless)]",
};

const TYPE_PILL: Record<Slot["type"], string> = {
  pickup: "bg-emerald-50 text-emerald-700",
  delivery: "bg-sky-50 text-sky-700",
  consult: "bg-amber-50 text-amber-700",
  receiving: "bg-rose-50 text-[var(--brand-priceless)]",
};

const TYPE_LABELS: Record<Slot["type"], string> = {
  pickup: "Pickup",
  delivery: "Delivery",
  consult: "Consult",
  receiving: "Receiving",
};

export default function SchedulePage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  return (
    <AdminShell
      active="schedule"
      title={`Schedule · ${today}`}
      actions={
        <>
          <button className="admin-btn admin-btn-outline">Yesterday</button>
          <button className="admin-btn admin-btn-primary">Today</button>
          <button className="admin-btn admin-btn-outline">Tomorrow</button>
        </>
      }
    >
      <ol className="space-y-2">
        {TODAY.map((s, i) => (
          <li key={i} className={`admin-card grid grid-cols-[110px_1fr_auto] items-center gap-4 border-l-4 p-4 ${TYPE_STYLES[s.type]}`}>
            <div>
              <div className="font-mono text-lg font-semibold tabular-nums text-foreground">{s.time}</div>
              <span className={`admin-pill mt-1 ${TYPE_PILL[s.type]}`}>{TYPE_LABELS[s.type]}</span>
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold text-foreground">{s.customer}</div>
              <div className="text-sm text-muted-foreground">{s.detail}</div>
            </div>
            <div className="shrink-0 text-right">
              {s.total ? <div className="font-mono text-lg font-semibold tabular-nums text-foreground">{formatCurrency(s.total)}</div> : null}
              <button className="admin-btn admin-btn-ghost mt-1 px-2 py-1 text-sm text-[var(--brand-priceless)]">Open</button>
            </div>
          </li>
        ))}
      </ol>
    </AdminShell>
  );
}
