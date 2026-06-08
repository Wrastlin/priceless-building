"use client";

import { useState } from "react";
import { toast } from "sonner";

type Rule = {
  id: string;
  enabled: boolean;
  name: string;
  when: string;
  then: string;
  appliesTo: string;
  lastFired: string;
  affected: number;
};

const INITIAL_RULES: Rule[] = [
  {
    id: "r1",
    enabled: true,
    name: "Stale stock discount",
    when: "Item has been on the floor > 60 days",
    then: "Drop tag price by 15%",
    appliesTo: "All Price-Less inventory",
    lastFired: "Last night, 12:04 AM · 14 items re-tagged",
    affected: 14,
  },
  {
    id: "r2",
    enabled: true,
    name: "Beat the big box by 40%",
    when: "Comparable retail avg exceeds tag by > 100%",
    then: "Raise tag to 60% of retail (still beats big box by 40%)",
    appliesTo: "Doors, Windows, Cabinets",
    lastFired: "Last night, 12:04 AM · 3 items re-tagged up",
    affected: 3,
  },
  {
    id: "r3",
    enabled: true,
    name: "Minimum margin floor",
    when: "Margin vs. comparable retail < 35%",
    then: "Hold price · flag for floor manager review",
    appliesTo: "All Price-Less inventory",
    lastFired: "Last night, 12:04 AM · 0 flags",
    affected: 0,
  },
  {
    id: "r4",
    enabled: true,
    name: "Reclaimed never goes on sale",
    when: "Item has 'Reclaimed' badge",
    then: "Hold price regardless of age",
    appliesTo: "Reclaimed loft only",
    lastFired: "Last night, 12:04 AM · 0 changes",
    affected: 0,
  },
  {
    id: "r5",
    enabled: false,
    name: "Bundle: cabinet + countertop",
    when: "Customer adds a cabinet AND a countertop to cart",
    then: "Apply 8% bundle discount at checkout",
    appliesTo: "Cabinets + countertops",
    lastFired: "Disabled",
    affected: 0,
  },
  {
    id: "r6",
    enabled: true,
    name: "Builders Corner premium hold",
    when: "Brand = Builders Corner",
    then: "Never auto-discount; pricing managed by design team",
    appliesTo: "All Builders Corner items",
    lastFired: "Last night, 12:04 AM · 0 changes (held)",
    affected: 0,
  },
];

export function PricingRules() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [running, setRunning] = useState(false);

  function toggle(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }

  function dryRun() {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      const total = rules.filter((r) => r.enabled).reduce((s, r) => s + r.affected, 0);
      toast.success(`Dry run · ${total} items would be re-tagged. Tags queued for review.`);
    }, 900);
  }

  return (
    <div className="space-y-4">
      <div className="admin-card flex flex-wrap items-center gap-2 p-3">
        <button onClick={dryRun} disabled={running} className="admin-btn admin-btn-primary">
          {running ? "Running…" : "Dry-run all rules"}
        </button>
        <button className="admin-btn admin-btn-outline">+ New rule</button>
        <span className="ml-auto text-sm text-muted-foreground">
          {rules.filter((r) => r.enabled).length} of {rules.length} active
        </span>
      </div>

      <ol className="space-y-2">
        {rules.map((r) => (
          <li key={r.id} className="admin-card p-5">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="relative inline-flex h-5 w-10 cursor-pointer items-center">
                    <input type="checkbox" checked={r.enabled} onChange={() => toggle(r.id)} className="peer sr-only" />
                    <span className="absolute inset-0 rounded-full bg-[#e5e5e3] peer-checked:bg-[var(--brand-priceless)]" />
                    <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </label>
                  <span className="text-base font-semibold text-foreground">{r.name}</span>
                  <span className="text-xs text-muted-foreground">· {r.appliesTo}</span>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border-l-2 border-[var(--brand-priceless)] bg-[#fafaf9] p-3">
                    <div className="text-xs font-medium text-[var(--brand-priceless)]">When</div>
                    <p className="mt-1 text-sm text-foreground">{r.when}</p>
                  </div>
                  <div className="rounded-md border-l-2 border-[var(--brand-builders-gold)] bg-[#fafaf9] p-3">
                    <div className="text-xs font-medium text-[var(--brand-builders-gold)]">Then</div>
                    <p className="mt-1 text-sm text-foreground">{r.then}</p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-muted-foreground">Last fired</div>
                <div className="mt-1 text-sm">{r.lastFired}</div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
