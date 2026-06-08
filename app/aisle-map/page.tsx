import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Zone = { id: string; x: number; y: number; w: number; h: number; label: string; href: string; tone: "warm" | "cool" | "neutral" | "accent" };

const ZONES: Zone[] = [
  { id: "A", x: 4, y: 4, w: 30, h: 16, label: "A · Reclaim Loft", href: "/shop", tone: "warm" },
  { id: "B", x: 36, y: 4, w: 28, h: 16, label: "B · Builders Corner Showroom", href: "/builders-corner", tone: "cool" },
  { id: "C", x: 66, y: 4, w: 30, h: 16, label: "C · Cabinets", href: "/shop/cabinets", tone: "neutral" },
  { id: "D", x: 4, y: 22, w: 18, h: 30, label: "D · Doors", href: "/shop/doors", tone: "warm" },
  { id: "W", x: 24, y: 22, w: 18, h: 30, label: "W · Windows", href: "/shop/windows", tone: "cool" },
  { id: "V", x: 44, y: 22, w: 22, h: 14, label: "V · Vanities + Countertops", href: "/shop/vanities", tone: "accent" },
  { id: "L", x: 44, y: 38, w: 22, h: 14, label: "L · Lighting", href: "/shop/lighting", tone: "warm" },
  { id: "H", x: 68, y: 22, w: 14, h: 30, label: "H · Hardware bins", href: "/shop/hardware", tone: "neutral" },
  { id: "T", x: 84, y: 22, w: 12, h: 30, label: "T · Trim & Millwork", href: "/shop/trim", tone: "warm" },
  { id: "POS", x: 4, y: 54, w: 22, h: 10, label: "Checkout · Counter 1+2", href: "/cart", tone: "accent" },
  { id: "LOAD", x: 28, y: 54, w: 26, h: 10, label: "Rear Load-Bay (pickup)", href: "/track", tone: "neutral" },
  { id: "OFFICE", x: 56, y: 54, w: 18, h: 10, label: "Office + Will-Call", href: "/contractors", tone: "neutral" },
  { id: "DESIGN", x: 76, y: 54, w: 20, h: 10, label: "Design Consult Room", href: "/builders-corner/consultation", tone: "cool" },
];

const TONE_BG: Record<Zone["tone"], string> = {
  warm: "bg-[var(--brand-priceless)]/15 border-[var(--brand-priceless)]/40 hover:bg-[var(--brand-priceless)]/25",
  cool: "bg-[var(--brand-builders)]/15 border-[var(--brand-builders)]/40 hover:bg-[var(--brand-builders)]/25",
  neutral: "bg-[var(--muted)] border-[var(--border)] hover:bg-[var(--muted)]/80",
  accent: "bg-amber-100 border-amber-300 hover:bg-amber-200",
};

export default function AisleMap() {
  return (
    <>
      <SiteHeader brand="priceless" />
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-10">
        <div className="grid items-end gap-x-10 gap-y-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">Find it fast · 825 Washington St</div>
            <h1 className="font-display mt-3 text-6xl leading-[1.05] md:text-8xl">
              Warehouse <span className="text-[var(--brand-priceless)]">map.</span>
            </h1>
          </div>
          <p className="font-serif text-base italic text-[var(--muted-foreground)] md:col-span-4">
            Tap any aisle to jump to what's on its shelves today. A printed copy is at the front counter.
          </p>
        </div>

        <div className="mt-10 border bg-[var(--muted)] p-3">
          <div className="relative w-full" style={{ paddingBottom: "55%" }}>
            <div className="absolute inset-0 bg-white">
              {/* North arrow + scale */}
              <div className="font-mono pointer-events-none absolute right-3 top-3 border bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em]">N ↑</div>
              <div className="font-mono pointer-events-none absolute left-3 bottom-3 border bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em]">~ 18,000 sq ft</div>
              {ZONES.map((z) => (
                <Link
                  key={z.id}
                  href={z.href}
                  className={`absolute flex flex-col items-center justify-center border text-center transition ${TONE_BG[z.tone]}`}
                  style={{
                    left: `${z.x}%`,
                    top: `${z.y}%`,
                    width: `${z.w}%`,
                    height: `${z.h}%`,
                  }}
                >
                  <span className="font-display text-sm md:text-base">{z.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-px bg-[var(--border)] md:grid-cols-4">
          <Legend swatch="bg-[var(--brand-priceless)]/30" label="Price-Less floor" />
          <Legend swatch="bg-[var(--brand-builders)]/30" label="Builders Corner studio" />
          <Legend swatch="bg-amber-200" label="Counter / pickup" />
          <Legend swatch="bg-[var(--muted)] border" label="Office / overflow" />
        </div>

        <div className="mt-12 grid gap-px border bg-[var(--border)] md:grid-cols-2">
          <div className="bg-white p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">Find a specific item</div>
            <h2 className="font-display mt-3 text-2xl leading-tight">Looking for something <span className="text-[var(--brand-priceless)]">specific?</span></h2>
            <p className="font-serif mt-2 text-sm italic text-[var(--muted-foreground)]">Search and we'll show you the exact bin.</p>
            <form action="/search" className="mt-4 flex items-center border-b border-[var(--border)]">
              <input name="q" type="search" placeholder='e.g. "double-hung window"' className="flex-1 border-0 bg-transparent px-0 py-2 text-base focus:outline-none focus:ring-0" />
              <button className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">Find →</button>
            </form>
          </div>
          <div className="bg-white p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)]">Talk to the team</div>
            <h2 className="font-display mt-3 text-2xl leading-tight">Need help on the <span className="text-[var(--brand-priceless)]">floor?</span></h2>
            <p className="font-serif mt-2 text-sm italic text-[var(--muted-foreground)]">Brian, Sam and the team are around. Flag one of us down or call ahead.</p>
            <a href="tel:+17158483855" className="font-mono mt-4 inline-block text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">Call (715) 848-3855 →</a>
          </div>
        </div>
      </section>
      <SiteFooter brand="priceless" />
    </>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-white p-2 text-xs">
      <span className={`inline-block h-4 w-6 rounded ${swatch}`} />
      <span>{label}</span>
    </div>
  );
}
