"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

type DoorStyle = { id: string; name: string; image: string; basePrice: number };
type Finish = { id: string; name: string; swatch: string; modifier: number };
type Hardware = { id: string; name: string; image: string; price: number };
type Counter = { id: string; name: string; swatch: string; price: number };

const DOORS: DoorStyle[] = [
  { id: "shaker", name: "Classic Shaker", image: "/test-images/17-whiteoak-shaker-kitchen.jpg", basePrice: 14800 },
  { id: "inset", name: "Inset Painted", image: "/test-images/18-bone-white-inset-kitchen.jpg", basePrice: 22400 },
  { id: "flat", name: "Flat Front", image: "/catalog-images/PL-000311-hero.jpg", basePrice: 18400 },
  { id: "5piece", name: "5-Piece Inset", image: "/test-images/03-base-cabinet-white-shaker.jpg", basePrice: 19800 },
];

const FINISHES: Finish[] = [
  { id: "bone", name: "Bone White", swatch: "#f4f0e8", modifier: 0 },
  { id: "linen", name: "Antique Linen", swatch: "#e3dccd", modifier: 0 },
  { id: "sage", name: "Sage Whisper", swatch: "#a8b6a0", modifier: 600 },
  { id: "forge", name: "Forge Iron", swatch: "#3a3f48", modifier: 800 },
  { id: "harbor", name: "Harbor Navy", swatch: "#26384d", modifier: 800 },
  { id: "walnut", name: "Walnut Stain", swatch: "#5a3a23", modifier: 1200 },
  { id: "oak", name: "Quarter-Sawn Oak", swatch: "#a07440", modifier: 1400 },
];

const HARDWARE: Hardware[] = [
  { id: "matte-black", name: "Matte Black Bar", image: "/test-images/15-matte-black-pulls.jpg", price: 280 },
  { id: "brass", name: "Brushed Brass Knob", image: "/test-images/07-cabinet-hardware-brushed-brass.jpg", price: 420 },
  { id: "nickel", name: "Antique Nickel Cup", image: "/catalog-images/PL-000510-hero.jpg", price: 380 },
  { id: "integrated", name: "Integrated (no pull)", image: "/catalog-images/PL-000519-hero.jpg", price: 0 },
];

const COUNTERS: Counter[] = [
  { id: "cala", name: "Calacatta Quartz", swatch: "linear-gradient(135deg, #f8f5ef 0%, #d4d1c5 100%)", price: 4800 },
  { id: "carrara", name: "Carrara Marble", swatch: "linear-gradient(135deg, #f0eee9 0%, #c2c0b8 100%)", price: 6400 },
  { id: "walnut-bb", name: "Walnut Butcher Block", swatch: "linear-gradient(135deg, #6b4528 0%, #3d2817 100%)", price: 2200 },
  { id: "soapstone", name: "Soapstone", swatch: "linear-gradient(135deg, #3a3d40 0%, #1f2123 100%)", price: 5200 },
];

export function KitchenBuilder() {
  const [door, setDoor] = useState(DOORS[0]);
  const [finish, setFinish] = useState(FINISHES[0]);
  const [hardware, setHardware] = useState(HARDWARE[0]);
  const [counter, setCounter] = useState(COUNTERS[0]);

  const total = useMemo(() => door.basePrice + finish.modifier + hardware.price + counter.price, [door, finish, hardware, counter]);

  function save() {
    const spec = `${door.name} · ${finish.name} · ${hardware.name} · ${counter.name}`;
    toast.success(`Spec saved · ${spec}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* PREVIEW */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden border-2 border-[var(--brand-builders)]/10 bg-[var(--muted)]">
            <Image src={door.image} alt={door.name} fill className="object-cover transition-all duration-500" sizes="(min-width:1024px) 60vw, 100vw" quality={80} priority />
            <div className="absolute inset-0" style={{ background: finish.swatch, mixBlendMode: "multiply", opacity: 0.35 }} />
            <div className="absolute inset-x-0 bottom-0 h-1/4" style={{ background: counter.swatch }} />
            <span className="font-mono absolute right-4 top-4 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--brand-builders)]">
              Live preview
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-px bg-[var(--border)]">
            <Spec label="Door" value={door.name} />
            <Spec label="Finish" value={finish.name} />
            <Spec label="Pulls" value={hardware.name} />
            <Spec label="Counters" value={counter.name} />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="space-y-10">
          <Section index="01" title="Door style">
            <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
              {DOORS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDoor(d)}
                  className={"overflow-hidden bg-white text-left transition " + (door.id === d.id ? "ring-2 ring-inset ring-[var(--brand-builders)]" : "hover:bg-[var(--muted)]/40")}
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={d.image} alt={d.name} fill className="object-cover" sizes="180px" quality={50} />
                  </div>
                  <div className="p-2">
                    <div className="font-display text-base leading-tight">{d.name}.</div>
                    <div className="font-mono mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">from {formatCurrency(d.basePrice)}</div>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <Section index="02" title="Finish">
            <div className="grid grid-cols-4 gap-px bg-[var(--border)]">
              {FINISHES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFinish(f)}
                  className={"bg-white p-2 text-left transition " + (finish.id === f.id ? "ring-2 ring-inset ring-[var(--brand-builders)]" : "hover:bg-[var(--muted)]/40")}
                >
                  <span className="block aspect-square w-full" style={{ background: f.swatch }} />
                  <div className="font-mono mt-1 text-[10px] uppercase tracking-[0.12em]">{f.name}</div>
                  {f.modifier > 0 ? <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--brand-builders-gold)]">+{formatCurrency(f.modifier)}</div> : null}
                </button>
              ))}
            </div>
          </Section>

          <Section index="03" title="Hardware">
            <div className="grid grid-cols-4 gap-px bg-[var(--border)]">
              {HARDWARE.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHardware(h)}
                  className={"overflow-hidden bg-white text-center transition " + (hardware.id === h.id ? "ring-2 ring-inset ring-[var(--brand-builders)]" : "hover:bg-[var(--muted)]/40")}
                >
                  <div className="relative aspect-square">
                    <Image src={h.image} alt={h.name} fill className="object-cover" sizes="80px" quality={50} />
                  </div>
                  <div className="font-mono px-1 py-1 text-[10px] uppercase tracking-[0.12em]">{h.name}</div>
                </button>
              ))}
            </div>
          </Section>

          <Section index="04" title="Countertops">
            <div className="grid grid-cols-4 gap-px bg-[var(--border)]">
              {COUNTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCounter(c)}
                  className={"bg-white p-2 text-left transition " + (counter.id === c.id ? "ring-2 ring-inset ring-[var(--brand-builders)]" : "hover:bg-[var(--muted)]/40")}
                >
                  <span className="block aspect-square w-full" style={{ background: c.swatch }} />
                  <div className="font-mono mt-1 text-[10px] uppercase tracking-[0.12em]">{c.name}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--brand-builders-gold)]">+{formatCurrency(c.price)}</div>
                </button>
              ))}
            </div>
          </Section>

          <div className="border-l-4 border-[var(--brand-builders-gold)] bg-[var(--brand-builders)] p-6 text-white">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--brand-builders-gold)]">Estimated package</div>
            <div className="font-display mt-3 text-5xl leading-none">{formatCurrency(total)}</div>
            <p className="font-serif mt-3 text-sm italic text-white/80">Install by Four Squared included. Upgrades quoted in person.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={save} className="font-mono bg-[var(--brand-builders-gold)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-builders)]">Save spec →</button>
              <Link href="/builders-corner/consultation" className="font-mono bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-builders)]">Book consult →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 border-b pb-2">
        <span className="font-mono text-[11px] tracking-tighter text-[var(--brand-builders-gold)]">{index}</span>
        <h3 className="font-display text-xl">{title}.</h3>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--brand-builders-gold)]">{label}</div>
      <div className="font-serif mt-1 text-sm italic leading-tight text-[var(--brand-builders)]">{value}</div>
    </div>
  );
}
