"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { allFields, type Field, type Integration, type IntegrationGroup } from "@/lib/integrations";

const LS_KEY = "pl-connections-draft";

const STATUS: Record<string, { label: string; cls: string }> = {
  recommended: { label: "Recommended", cls: "bg-[var(--brand-priceless)]/10 text-[var(--brand-priceless)]" },
  optional: { label: "Optional", cls: "bg-slate-100 text-slate-600" },
  connected: { label: "Connected", cls: "bg-emerald-100 text-emerald-700" },
  manual: { label: "Manual", cls: "bg-amber-100 text-amber-700" },
  skip: { label: "Skip", cls: "bg-slate-100 text-slate-400" },
};

export function ConnectionsForm({ groups }: { groups: IntegrationGroup[] }) {
  const fields = allFields();
  const [values, setValues] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setValues(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(values));
    } catch {}
  }, [values, hydrated]);

  const set = (env: string, v: string) => setValues((p) => ({ ...p, [env]: v }));
  const filled = fields.filter((f) => (values[f.env] ?? "").trim()).length;

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Copied ${label}`);
  };
  const exportEnv = () => {
    const lines = fields.filter((f) => (values[f.env] ?? "").trim()).map((f) => `${f.env}=${values[f.env].trim()}`);
    if (!lines.length) return toast.error("Nothing filled in yet.");
    navigator.clipboard?.writeText(lines.join("\n"));
    toast.success(`Copied ${lines.length} env var${lines.length > 1 ? "s" : ""} — paste into Vercel → Environment Variables`);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Sandbox / test mode.</strong> Set up each connection one at a time and paste the values in as you go — entries are saved in this browser only. When you&rsquo;re ready to go live, hit{" "}
        <em>Copy as .env</em> and paste into Vercel → Settings → Environment Variables (secret keys belong there, not in code).
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="admin-help">{filled} of {fields.length} fields filled.</p>
        <div className="flex gap-2">
          <button type="button" onClick={exportEnv} className="admin-btn admin-btn-primary">Copy as .env</button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear everything you've entered from this browser?")) {
                setValues({});
                toast.success("Cleared");
              }
            }}
            className="admin-btn admin-btn-ghost"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-9">
        {groups.map((g) => (
          <section key={g.id}>
            <h2 className="text-lg font-semibold text-foreground">{g.title}</h2>
            <p className="admin-help mb-3">{g.blurb}</p>
            <div className="space-y-3">
              {g.items.map((it) => (
                <IntegrationCard key={it.key} it={it} values={values} set={set} copy={copy} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function IntegrationCard({
  it,
  values,
  set,
  copy,
}: {
  it: Integration;
  values: Record<string, string>;
  set: (env: string, v: string) => void;
  copy: (text: string, label: string) => void;
}) {
  const s = STATUS[it.status];
  const cardFilled = (it.fields ?? []).filter((f) => (values[f.env] ?? "").trim()).length;
  const cardTotal = (it.fields ?? []).length;
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-foreground">{it.name}</h3>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${s.cls}`}>{s.label}</span>
          {cardTotal > 0 && cardFilled === cardTotal ? (
            <span className="text-[11px] font-medium text-emerald-700">✓ filled</span>
          ) : null}
        </div>
        {it.dashboardUrl ? (
          <a href={it.dashboardUrl} target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost px-3 py-1.5 text-sm">
            Open {it.dashboardLabel ?? "dashboard"} →
          </a>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{it.blurb}</p>
      {it.sandboxNote ? <p className="mt-1 text-xs text-emerald-700">{it.sandboxNote}</p> : null}

      {it.steps?.length ? (
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-foreground marker:text-muted-foreground">
          {it.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      ) : null}

      {it.provide?.length ? (
        <div className="mt-4 space-y-2">
          {it.provide.map((p) => (
            <div key={p.value} className="rounded-md border border-border bg-[#f7f7f6] p-3">
              <div className="text-xs font-medium text-foreground">{p.label}</div>
              <div className="mt-1 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded bg-white px-2 py-1 text-xs text-muted-foreground">{p.value}</code>
                <button type="button" onClick={() => copy(p.value, "URL")} className="admin-btn admin-btn-ghost shrink-0 px-2 py-1 text-xs">
                  Copy
                </button>
              </div>
              {p.note ? <div className="mt-1 text-[11px] text-muted-foreground">{p.note}</div> : null}
            </div>
          ))}
        </div>
      ) : null}

      {it.fields?.length ? (
        <div className="mt-4 grid gap-3">
          {it.fields.map((f) => (
            <FieldInput key={f.env} f={f} value={values[f.env] ?? ""} onChange={(v) => set(f.env, v)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{f.label}</span>
        <span className="font-mono text-[11px] text-muted-foreground">{f.env}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <input
          type={f.secret && !show ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={f.placeholder ?? f.hint ?? ""}
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-md border border-border bg-white px-3 py-2 font-mono text-sm text-foreground placeholder:font-sans placeholder:text-muted-foreground focus:border-[var(--brand-priceless)] focus:outline-none"
        />
        {f.secret ? (
          <button type="button" onClick={() => setShow((s) => !s)} className="admin-btn admin-btn-ghost shrink-0 px-2 py-1.5 text-xs">
            {show ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>
      {f.hint ? <div className="mt-1 text-[11px] text-muted-foreground">{f.hint}</div> : null}
    </label>
  );
}
