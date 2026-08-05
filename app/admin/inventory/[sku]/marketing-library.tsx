"use client";

import type { DeliverableGroup } from "@/lib/marketing/deliverables";

/**
 * The item's rendered marketing deliverables, grouped by class. Every file is
 * a real render from the compounding library, resolved by SKU on the server
 * (listDeliverablesForSku) and streamed through /api/marketing-asset. Images
 * open full-size; videos play inline; every tile has a download link.
 */
export function MarketingLibrary({
  groups,
  total,
  rootExists,
  slug,
}: {
  groups: DeliverableGroup[];
  total: number;
  rootExists: boolean;
  slug: string;
}) {
  if (!rootExists) {
    return (
      <p className="text-[13px] leading-relaxed text-[var(--muted-foreground)]">
        The deliverables library isn&rsquo;t mounted on this host. It lives on the studio Mac at{" "}
        <span className="font-mono text-[12px]">PRICE-LESS DELIVERABLES/</span>. Point{" "}
        <span className="font-mono text-[12px]">MARKETING_DELIVERABLES_DIR</span> at it (or sync the
        library into storage) to surface every render here.
      </p>
    );
  }

  if (total === 0) {
    return (
      <p className="text-[13px] leading-relaxed text-[var(--muted-foreground)]">
        No rendered deliverables found for <span className="font-mono text-[12px]">{slug}</span> yet.
        When the ad kit ships from the studio Mac — keyed by this slug — the master, cutout, room
        scenes, feed post and clips appear here automatically.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-[var(--muted-foreground)]">
        <span className="font-semibold text-[var(--foreground)]">{total}</span> ready-to-use pieces
        for this item, all keyed to <span className="font-mono text-[12px]">{slug}</span>.
      </p>
      {groups.map((g) => (
        <section key={g.key}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <h3 className="text-[13px] font-semibold">{g.title}</h3>
            <span className="text-[11px] tabular-nums text-[var(--muted-foreground)]">
              {g.files.length}
            </span>
          </div>
          {g.hint ? (
            <p className="mb-2.5 text-[12px] leading-snug text-[var(--muted-foreground)]">{g.hint}</p>
          ) : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {g.files.map((f) => (
              <figure
                key={f.rel}
                className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-white"
              >
                <div className="relative aspect-square w-full bg-[var(--surface)]">
                  {f.kind === "image" ? (
                    <a href={f.url} target="_blank" rel="noreferrer" className="block h-full w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.url}
                        alt={f.label}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </a>
                  ) : (
                    <video
                      src={f.url}
                      controls
                      preload="metadata"
                      muted
                      playsInline
                      className="h-full w-full bg-black object-contain"
                    />
                  )}
                </div>
                <figcaption className="flex items-center justify-between gap-2 px-2 py-1.5">
                  <span
                    className="truncate font-mono text-[10px] text-[var(--muted-foreground)]"
                    title={f.label}
                  >
                    {f.label}
                  </span>
                  <a
                    href={f.url}
                    download
                    className="shrink-0 text-[11px] font-medium text-[var(--brand-navy)] underline"
                  >
                    save
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
