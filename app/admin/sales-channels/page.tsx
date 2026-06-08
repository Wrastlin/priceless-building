import { AdminShell } from "@/components/admin-shell";
import Link from "next/link";

type Channel = {
  key: string;
  name: string;
  logo: string;
  color: string;
  status: "Recommended" | "Available" | "Connected" | "Skip";
  pickup: "Native" | "No" | "Limited";
  fees: string;
  audience: string;
  blurb: string;
  notes?: string;
};

const CHANNELS: Channel[] = [
  {
    key: "facebook",
    name: "Facebook Marketplace + Shop",
    logo: "FB",
    color: "bg-blue-600",
    status: "Recommended",
    pickup: "Native",
    fees: "$0 local pickup. 5-10% on shipped checkout.",
    audience: "Wausau DIY + contractors, dense local pool.",
    blurb: "Free local pickup is native. Highest-ROI channel for a Wausau surplus warehouse. Start here.",
    notes: "Build order: #1",
  },
  {
    key: "ebay",
    name: "eBay Store (Basic)",
    logo: "eBay",
    color: "bg-red-500",
    status: "Recommended",
    pickup: "Native",
    fees: "$21.95/mo · 1,000 free listings · 13.6% final value + $0.40/order.",
    audience: "Contractors + DIY nationwide.",
    blurb: "Best for shippable items: hardware, lighting, smaller trim. Local-pickup toggle works for the big stuff. Per-order fees crush sub-$25 items, so bundle or keep those FB-only.",
    notes: "Build order: #2",
  },
  {
    key: "offerup",
    name: "OfferUp",
    logo: "OU",
    color: "bg-emerald-600",
    status: "Available",
    pickup: "Native",
    fees: "$0 local pickup. 12.9% on shipped, min $1.99.",
    audience: "Central WI local buyers.",
    blurb: "Free local backup feed. Manual listing or pair with a cross-lister like Vendoo.",
    notes: "Build order: #3",
  },
  {
    key: "craigslist",
    name: "Craigslist",
    logo: "CL",
    color: "bg-slate-700",
    status: "Available",
    pickup: "Native",
    fees: "$3-5 per for-sale post in most metros. Manual listings, no API.",
    audience: "Wausau locals scanning for bargains.",
    blurb: "Worth posting bulk one-offs (pallets, lot sales, dead stock). No catalog sync.",
  },
  {
    key: "houzz",
    name: "Houzz Shop",
    logo: "Hz",
    color: "bg-teal-700",
    status: "Skip",
    pickup: "No",
    fees: "Curated wholesale onboarding. Not self-serve.",
    audience: "Designers and pros.",
    blurb: "Trade Program is for buyers, not sellers. Houzz Shop vendors are vetted wholesale. Revisit only if Builders Corner wants to pursue wholesale vendor status.",
  },
  {
    key: "amazon",
    name: "Amazon Marketplace",
    logo: "A",
    color: "bg-amber-500",
    status: "Skip",
    pickup: "No",
    fees: "$39.99/mo Pro + 8-15% referral.",
    audience: "National.",
    blurb: "Doors and windows are heavily gated. No local pickup. Built for small, branded, shippable SKUs. Bad fit for our surplus catalog today.",
  },
  {
    key: "walmart",
    name: "Walmart Marketplace",
    logo: "W",
    color: "bg-blue-700",
    status: "Skip",
    pickup: "No",
    fees: "$0/mo · ~15% referral on Home Improvement.",
    audience: "National.",
    blurb: "Designed for new, shippable goods. No local pickup. 2-4 week approval. Skip until we have a dedicated shippable line.",
  },
  {
    key: "etsy",
    name: "Etsy",
    logo: "E",
    color: "bg-orange-600",
    status: "Skip",
    pickup: "No",
    fees: "20+ year old vintage architectural salvage only.",
    audience: "Crafters, vintage shoppers.",
    blurb: "Building materials are explicitly excluded under Etsy's craft-supply rules. Only old salvaged Builders Corner pieces could qualify.",
  },
];

const STATUS_PILL: Record<Channel["status"], string> = {
  Recommended: "bg-[var(--brand-priceless)]/10 text-[var(--brand-priceless)]",
  Available: "bg-[#f4f4f3] text-foreground",
  Connected: "bg-emerald-50 text-emerald-700",
  Skip: "bg-amber-50 text-amber-700",
};

export default function SalesChannels() {
  const recommended = CHANNELS.filter((c) => c.status === "Recommended");
  const available = CHANNELS.filter((c) => c.status === "Available");
  const skip = CHANNELS.filter((c) => c.status === "Skip");
  return (
    <AdminShell
      active="channels"
      title="Sales channels"
      actions={<Link href="/admin/inventory/new" className="admin-btn admin-btn-primary">+ Add item</Link>}
    >
      <p className="admin-help mb-5 max-w-3xl">
        Nothing is wired yet. The plan below reflects current research on what
        each platform charges, who shops there, and whether it allows
        local-pickup listings (critical for big items). Multi-channel push
        is cheap via Sellbrite ($29/mo) once we have 2+ channels live.
      </p>

      <Section title="Recommended" channels={recommended} statusPill={STATUS_PILL} />
      <Section title="Available, not a priority yet" channels={available} statusPill={STATUS_PILL} />
      <Section title="Not a fit right now" channels={skip} statusPill={STATUS_PILL} />

      <div className="admin-card mt-8 p-5">
        <div className="text-base font-semibold text-foreground">Push to multiple channels later</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Once we have 2+ channels live, <span className="font-mono text-foreground">Sellbrite</span>{" "}
          at $29/mo syncs the catalog, inventory, and pricing across eBay,
          Walmart, Etsy, Shopify and Amazon from one place. Don't subscribe
          before we have at least two channels connected.
        </p>
      </div>
    </AdminShell>
  );
}

function Section({ title, channels, statusPill }: { title: string; channels: Channel[]; statusPill: Record<Channel["status"], string> }) {
  if (channels.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {channels.map((c) => (
          <div key={c.key} className="admin-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-8 items-center rounded px-2 text-xs font-bold text-white ${c.color}`}>{c.logo}</span>
                <div>
                  <div className="text-base font-semibold text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.audience}</div>
                </div>
              </div>
              <span className={`admin-pill ${statusPill[c.status]}`}>{c.status}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{c.blurb}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Fees</dt>
                <dd className="mt-0.5 text-foreground">{c.fees}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Local pickup</dt>
                <dd className="mt-0.5 text-foreground">{c.pickup}</dd>
              </div>
            </dl>
            {c.notes ? (
              <div className="mt-3 text-xs font-medium text-[var(--brand-priceless)]">{c.notes}</div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {c.status === "Recommended" || c.status === "Available" ? (
                <button className="admin-btn admin-btn-primary" disabled>Connect (not wired)</button>
              ) : null}
              {c.status === "Connected" ? (
                <>
                  <button className="admin-btn admin-btn-outline">Manage rules</button>
                  <button className="admin-btn admin-btn-ghost">Pause</button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
