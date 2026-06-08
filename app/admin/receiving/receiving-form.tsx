"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { formatSKU } from "@/lib/utils";

type Draft = {
  id: string;
  photo: string | null;
  title: string;
  category: string;
  qty: number;
  status: "draft" | "researching" | "priced" | "tagged";
  suggestedPrice?: number;
};

const DEMO_TITLES = [
  "Pre-hung 6-panel interior door 32×80",
  "Vinyl double-hung window 36×60",
  "30\" shaker base cabinet · white",
  "48\" single-sink vanity · quartz",
  "Matte black cabinet pulls (10-pack)",
  "Casement window · black frame 24×48",
  "Primed MDF base trim bundle",
  "3-light vanity bar · brushed brass",
];

const DEMO_PRICES = [79, 129, 189, 449, 24, 219, 39, 79];

export function ReceivingForm() {
  const [batchName, setBatchName] = useState(`Truck ${new Date().toLocaleDateString()}`);
  const [supplier, setSupplier] = useState("Cancelled order · ABC Builders");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function addDemoBatch() {
    const next: Draft[] = DEMO_TITLES.map((title, i) => ({
      id: `D${Date.now()}-${i}`,
      photo: null,
      title,
      category: ["doors", "windows", "cabinets", "vanities", "hardware", "windows", "trim", "lighting"][i],
      qty: [12, 8, 4, 2, 24, 3, 16, 5][i],
      status: "draft",
    }));
    setDrafts(next);
    toast.success(`Loaded ${next.length} items from packing slip`);
  }

  function runResearch() {
    setDrafts((prev) => prev.map((d) => ({ ...d, status: "researching" })));
    toast.message("Running live comparable search on all items…");
    let i = 0;
    const handle = setInterval(() => {
      setDrafts((prev) => {
        const next = [...prev];
        if (i < next.length) {
          next[i] = { ...next[i], status: "priced", suggestedPrice: DEMO_PRICES[i] ?? Math.round(50 + Math.random() * 200) };
        }
        i++;
        if (i >= next.length) clearInterval(handle);
        return next;
      });
    }, 250);
  }

  function commitAll() {
    if (drafts.length === 0) return;
    setDrafts((prev) => prev.map((d) => ({ ...d, status: "tagged" })));
    toast.success(`${drafts.length} SKUs created · tags queued at floor printer`);
  }

  return (
    <div className="space-y-5">
      <section className="admin-card p-5">
        <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">Batch metadata</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field label="Batch name">
            <input value={batchName} onChange={(e) => setBatchName(e.target.value)} className="admin-input" />
          </Field>
          <Field label="Source / supplier">
            <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="admin-input" />
          </Field>
          <Field label="Received by">
            <select className="admin-input">
              <option>Brian · Floor Manager</option>
              <option>Josh · Owner</option>
              <option>Sam · Inventory Lead</option>
            </select>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button onClick={addDemoBatch} className="admin-btn admin-btn-primary">Scan packing slip</button>
          <button onClick={() => fileRef.current?.click()} className="admin-btn admin-btn-outline">+ Photograph one</button>
          <input ref={fileRef} type="file" capture="environment" accept="image/*" className="hidden" />
          <button onClick={runResearch} disabled={drafts.length === 0 || drafts.every((d) => d.status !== "draft")} className="admin-btn admin-btn-outline">
            Search comparables
          </button>
          <button onClick={commitAll} disabled={drafts.length === 0 || drafts.some((d) => d.status === "researching" || d.status === "draft")} className="admin-btn admin-btn-primary">
            Commit + queue tags
          </button>
        </div>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold text-foreground">Queue</h2>
          <span className="text-xs text-muted-foreground">{drafts.length} items</span>
        </div>
        {drafts.length === 0 ? (
          <div className="m-5 rounded-md border-2 border-dashed border-border bg-[#fafaf9] p-10 text-center text-sm text-muted-foreground">
            Empty queue · scan a packing slip or photograph items one at a time
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Qty</th>
                <th>Category</th>
                <th className="text-right">Suggested tag</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((d, i) => (
                <tr key={d.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded bg-[#f4f4f3]">
                        {d.photo ? <Image src={d.photo} alt="" fill className="object-cover" sizes="48px" /> : <span className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">no photo</span>}
                      </div>
                      <div>{d.title}</div>
                    </div>
                  </td>
                  <td className="text-right tabular-nums">{d.qty}</td>
                  <td className="capitalize">{d.category}</td>
                  <td className="text-right font-mono font-semibold tabular-nums">{d.suggestedPrice ? `$${d.suggestedPrice}` : "—"}</td>
                  <td>
                    <StatusPill s={d.status} />
                    {d.status === "tagged" ? (
                      <Link href={`/admin/tags?sku=${formatSKU("PL", 900 + i)}`} className="ml-2 text-xs text-[var(--brand-priceless)] hover:underline">Print</Link>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function StatusPill({ s }: { s: Draft["status"] }) {
  const styles = {
    draft: "bg-[#f4f4f3] text-muted-foreground",
    researching: "bg-amber-50 text-amber-700",
    priced: "bg-sky-50 text-sky-700",
    tagged: "bg-emerald-50 text-emerald-700",
  };
  const labels = { draft: "Drafted", researching: "Researching…", priced: "Priced", tagged: "Tagged" };
  return <span className={`admin-pill ${styles[s]}`}>{labels[s]}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}
