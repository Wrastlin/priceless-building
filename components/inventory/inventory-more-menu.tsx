"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const MORE_LINKS = [
  { href: "/admin/connections", label: "Connections" },
  { href: "/admin/staging", label: "Staging" },
  { href: "/admin/aging", label: "Aging" },
  { href: "/admin/featured", label: "Featured" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/capture", label: "Quick capture (legacy)" },
  { href: "/admin/labels", label: "Print stickers (legacy)" },
  { href: "/admin/tags", label: "Print tags (legacy)" },
] as const;

/** Compact “More” menu for secondary / legacy admin tools. */
export function InventoryMoreMenu({ activeHref }: { activeHref?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const anyActive = MORE_LINKS.some((l) => l.href === activeHref);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        className={
          "inv-nav-pill inline-flex items-center gap-1 " +
          (anyActive || open ? "inv-nav-pill-active" : "")
        }
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        More
        <ChevronDown size={14} strokeWidth={2} className={open ? "rotate-180" : ""} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+6px)] z-40 min-w-[14rem] rounded-[12px] border border-[var(--border)] bg-white py-1.5 shadow-lg"
        >
          <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            Still available
          </p>
          {MORE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              className={
                "block px-3 py-2 text-[13px] hover:bg-[var(--surface)] " +
                (activeHref === l.href
                  ? "font-semibold text-[var(--brand-navy)]"
                  : "text-[var(--foreground)]")
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
