"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Lightweight Matterport-style walkthrough. Each viewpoint is a wide
 * shot of an aisle plus a couple of "hotspots" the user can tap to jump
 * to an adjacent viewpoint or open a product. Real 3D would swap in a
 * Pannellum or Matterport embed; this is the IA + interaction model so
 * the data shape is right when the upgrade happens.
 */

type Hotspot = { x: number; y: number; label: string; targetViewpoint?: string; href?: string };
type Media =
  /** Wide static photo (current default). */
  | { kind: "image"; src: string }
  /** Real 360° photo. Equirectangular JPEG. The viewer will be wired
   * to a Pannellum/Photo Sphere component when the user uploads
   * the captures from their walkthrough rig. Same data shape, no UI
   * change for callers. */
  | { kind: "panorama"; src: string };

type Viewpoint = {
  id: string;
  label: string;
  media: Media;
  blurb: string;
  hotspots: Hotspot[];
  /** Position on the warehouse minimap, as percentages of the floorplan box. */
  map: { x: number; y: number };
};

const VIEWPOINTS: Viewpoint[] = [
  {
    id: "entrance",
    label: "Front entrance",
    media: { kind: "image", src: "/real-photos/storefront-signage.webp" },
    blurb: "You're standing inside the main door on Washington St. The aisle map is to your left, the front counter is to your right. Tap a hotspot to keep walking.",
    map: { x: 10, y: 80 },
    hotspots: [
      { x: 25, y: 60, label: "→ Aisle D · Doors", targetViewpoint: "doors" },
      { x: 60, y: 55, label: "→ Aisle C · Cabinets", targetViewpoint: "cabinets" },
      { x: 85, y: 50, label: "→ Builders Corner Studio", targetViewpoint: "builders-studio" },
    ],
  },
  {
    id: "doors",
    label: "Aisle D · Doors",
    media: { kind: "image", src: "/real-photos/store-interior-doors.webp" },
    blurb: "Four hundred doors stacked floor-to-ceiling. Pre-hung interiors on the left, smooth-skin exteriors on the right, reclaimed at the back.",
    map: { x: 16, y: 45 },
    hotspots: [
      { x: 30, y: 65, label: "Reclaimed pine door", href: "/shop/item/PL-000104" },
      { x: 65, y: 50, label: "Pre-hung 6-panel", href: "/shop/item/PL-000101" },
      { x: 90, y: 50, label: "← back to entrance", targetViewpoint: "entrance" },
    ],
  },
  {
    id: "windows",
    label: "Aisle W · Windows",
    media: { kind: "image", src: "/real-photos/store-interior-window-andersen.webp" },
    blurb: "Surplus vinyl, casement, and slider windows in the most-requested rough-opening sizes. The black-frame casements move fastest. Big Andersen and JELD-WEN stock here too.",
    map: { x: 36, y: 45 },
    hotspots: [
      { x: 35, y: 55, label: "Vinyl double-hung 36×60", href: "/shop/item/PL-000201" },
      { x: 70, y: 55, label: "Casement window · black", href: "/shop/item/PL-000208" },
      { x: 10, y: 50, label: "← Aisle D · Doors", targetViewpoint: "doors" },
    ],
  },
  {
    id: "cabinets",
    label: "Aisle C · Cabinets",
    media: { kind: "image", src: "/real-photos/store-interior-warehouse.webp" },
    blurb: "Stock kitchen runs ready to load. Shaker base, wall, tall and pantry units in the most common widths.",
    map: { x: 80, y: 16 },
    hotspots: [
      { x: 30, y: 55, label: "Shaker base 30\"", href: "/shop/item/PL-000301" },
      { x: 65, y: 55, label: "Wall cabinet 36\"", href: "/shop/item/PL-000305" },
      { x: 90, y: 50, label: "→ Builders Corner Studio", targetViewpoint: "builders-studio" },
    ],
  },
  {
    id: "vanities",
    label: "Showroom · Vanities",
    media: { kind: "image", src: "/real-photos/store-interior-vanity-display.webp" },
    blurb: "Vanity displays staged with quartz tops, pulls and faucets so you can see the full look before you load up.",
    map: { x: 56, y: 35 },
    hotspots: [
      { x: 40, y: 55, label: "48\" single-sink vanity", href: "/shop/item/PL-000401" },
      { x: 75, y: 60, label: "3-light vanity bar", href: "/shop/item/PL-000601" },
      { x: 10, y: 50, label: "← Aisle C · Cabinets", targetViewpoint: "cabinets" },
    ],
  },
  {
    id: "builders-studio",
    label: "Builders Corner Studio",
    media: { kind: "image", src: "/test-images/18-bone-white-inset-kitchen.jpg" },
    blurb: "The sister-brand studio. Custom kitchen + bath cabinetry, designed in-house. Worth a walk through even if you're just browsing.",
    map: { x: 50, y: 12 },
    hotspots: [
      { x: 50, y: 60, label: "Visit Builders Corner →", href: "/builders-corner" },
      { x: 20, y: 50, label: "Book a consult", href: "/builders-corner/consultation" },
      { x: 85, y: 50, label: "← back to entrance", targetViewpoint: "entrance" },
    ],
  },
];

export function InteractiveTour() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("at") && VIEWPOINTS.some((v) => v.id === params.get("at"))
    ? (params.get("at") as string)
    : VIEWPOINTS[0].id;
  const [currentId, setCurrentId] = useState(initial);
  const current = VIEWPOINTS.find((v) => v.id === currentId) ?? VIEWPOINTS[0];

  // Keep the URL in sync so deep links + back/forward + sharing all work.
  // We use `replace` not `push` so the tour doesn't pollute browser history
  // with every aisle hop.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("at") !== currentId) {
      url.searchParams.set("at", currentId);
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [currentId, router]);

  // React to back/forward navigation pulling a different ?at=.
  useEffect(() => {
    const next = params.get("at");
    if (next && next !== currentId && VIEWPOINTS.some((v) => v.id === next)) setCurrentId(next);
  }, [params, currentId]);

  const walk = useCallback((id: string) => setCurrentId(id), []);

  return (
    <div className="rounded-2xl border bg-black shadow-card">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl">
        {current.media.kind === "panorama" ? (
          // 360 photo slot. When the user's walkthrough captures are
          // ready, this swaps to a Pannellum/A-Frame viewer. For now
          // we render the equirectangular JPEG flat so the data shape
          // round-trips end-to-end.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.media.src} alt={current.label} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Image
            key={current.id}
            src={current.media.src}
          alt={current.label}
          fill
          priority
          sizes="(min-width:1024px) 1100px, 100vw"
          quality={80}
          className="object-cover transition-opacity duration-500"
        />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        {/* Top control bar */}
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
          <div className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <span className="size-1.5 mr-1.5 inline-block rounded-full bg-emerald-400 align-middle" />
            Drag to look around · Tap hotspots to walk
          </div>
          <div className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[var(--brand-priceless)] backdrop-blur">
            {current.label}
          </div>
        </div>

        {/* Hotspots */}
        {current.hotspots.map((h, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (h.targetViewpoint) walk(h.targetViewpoint);
            }}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            {h.href ? (
              <Link href={h.href} className="group inline-flex items-center gap-2">
                <span className="relative inline-flex h-9 w-9 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
                  <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-[var(--brand-priceless)] shadow-lg">+</span>
                </span>
                <span className="rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  {h.label}
                </span>
              </Link>
            ) : (
              <span className="group inline-flex items-center gap-2">
                <span className="relative inline-flex h-9 w-9 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
                  <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-[var(--brand-priceless)] shadow-lg">→</span>
                </span>
                <span className="rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
                  {h.label}
                </span>
              </span>
            )}
          </button>
        ))}

        {/* Minimap. Shows where you are in the warehouse */}
        <div className="absolute right-3 bottom-3 hidden w-44 rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur md:block">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">You are here</div>
          <div className="relative mt-1 aspect-[5/4] w-full overflow-hidden rounded-md bg-[var(--muted)]">
            {/* Aisle blocks. Laid out to roughly match /aisle-map */}
            <span className="absolute left-[4%] top-[4%] h-[18%] w-[30%] rounded bg-[var(--brand-priceless)]/15" title="Reclaim Loft" />
            <span className="absolute left-[36%] top-[4%] h-[18%] w-[28%] rounded bg-[var(--brand-builders)]/15" title="Builders Studio" />
            <span className="absolute left-[66%] top-[4%] h-[18%] w-[30%] rounded bg-slate-300/40" title="Cabinets" />
            <span className="absolute left-[4%] top-[24%] h-[34%] w-[18%] rounded bg-[var(--brand-priceless)]/15" title="Doors" />
            <span className="absolute left-[24%] top-[24%] h-[34%] w-[18%] rounded bg-[var(--brand-builders)]/15" title="Windows" />
            <span className="absolute left-[44%] top-[24%] h-[16%] w-[22%] rounded bg-amber-200/60" title="Vanities" />
            <span className="absolute left-[44%] top-[42%] h-[16%] w-[22%] rounded bg-[var(--brand-priceless)]/15" title="Lighting" />
            <span className="absolute left-[68%] top-[24%] h-[34%] w-[14%] rounded bg-slate-300/40" title="Hardware" />
            <span className="absolute left-[84%] top-[24%] h-[34%] w-[12%] rounded bg-[var(--brand-priceless)]/15" title="Trim" />
            <span className="absolute left-[4%] top-[62%] h-[14%] w-[22%] rounded bg-amber-300/60" title="Checkout" />
            <span className="absolute left-[28%] top-[62%] h-[14%] w-[26%] rounded bg-slate-300/40" title="Load-Bay" />
            <span className="absolute left-[76%] top-[62%] h-[14%] w-[20%] rounded bg-[var(--brand-builders)]/15" title="Consult Room" />

            {/* Position pin */}
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${current.map.x}%`, top: `${current.map.y}%` }}
            >
              <span className="relative inline-flex h-3 w-3">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--brand-priceless)]/60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--brand-priceless)] ring-2 ring-white" />
              </span>
            </span>
          </div>
          <div className="mt-1 text-[10px] font-mono text-[var(--muted-foreground)]">{current.label}</div>
        </div>

        {/* Bottom blurb */}
        <div className="absolute inset-x-3 bottom-3 md:right-52 rounded-xl bg-black/55 px-4 py-3 text-white backdrop-blur">
          <p className="text-sm">{current.blurb}</p>
        </div>
      </div>

      {/* Viewpoint switcher */}
      <div className="flex gap-2 overflow-x-auto bg-[#0b1220] p-3">
        {VIEWPOINTS.map((v) => (
          <button
            key={v.id}
            onClick={() => walk(v.id)}
            className={
              "shrink-0 overflow-hidden rounded-lg border-2 text-left " +
              (current.id === v.id ? "border-[var(--brand-priceless)]" : "border-transparent")
            }
            style={{ width: 140 }}
          >
            <div className="relative aspect-[4/3]">
              <Image src={v.media.src} alt={v.label} fill className="object-cover" sizes="140px" quality={45} />
              {v.media.kind === "panorama" ? (
                <span className="absolute left-1 top-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white">360°</span>
              ) : null}
            </div>
            <div className="bg-[#0b1220] px-2 py-1.5">
              <div className="text-[11px] font-semibold text-white">{v.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
