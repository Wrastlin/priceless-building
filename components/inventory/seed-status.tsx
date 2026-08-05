"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markSeedAction } from "@/lib/actions/marketing-seeds";
import type { ItemMarketing } from "@/lib/items/types";

/**
 * Ad-kit seed state on an item: where this product sits in the marketing
 * deliverables pipeline. The kit itself is produced on the studio Mac
 * (product-ad pipeline); this card records and steers that work.
 */
export function SeedStatus({
  sku,
  initial,
  canManage,
}: {
  sku: string;
  initial?: ItemMarketing;
  canManage: boolean;
}) {
  const router = useRouter();
  const [marketing, setMarketing] = useState<ItemMarketing | undefined>(initial);
  const [pending, start] = useTransition();

  const status = marketing?.status ?? "new";

  function mark(next: "new" | "processed" | "skipped") {
    start(async () => {
      try {
        const updated = await markSeedAction(sku, next);
        setMarketing(updated);
        toast.success(
          next === "processed"
            ? "Marked: ad kit ready"
            : next === "skipped"
              ? "Seed skipped"
              : "Seed reopened",
        );
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not update seed");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SeedChip status={status} />
        {marketing?.slug ? (
          <span className="font-mono text-[12px] text-[var(--muted-foreground)]">{marketing.slug}</span>
        ) : null}
        {marketing?.processedAt ? (
          <span className="text-[12px] text-[var(--muted-foreground)]">
            {new Date(marketing.processedAt).toLocaleDateString()}
          </span>
        ) : null}
      </div>

      {marketing?.deliverables?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {marketing.deliverables.map((d) => (
            <span
              key={d}
              className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--foreground)]"
            >
              {d}
            </span>
          ))}
        </div>
      ) : null}

      {status === "new" ? (
        <p className="text-[13px] text-[var(--muted-foreground)]">
          Photos from intake are the seed. The ad kit (master, cutout, room scenes, feed post) is
          produced on the studio Mac — this flips to Ready when it ships.
        </p>
      ) : null}
      {marketing?.note ? (
        <p className="text-[13px] text-[var(--muted-foreground)]">{marketing.note}</p>
      ) : null}

      {canManage ? (
        <div className="flex flex-wrap gap-2">
          {status !== "processed" ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => mark("processed")}
              className="inv-btn inv-btn-secondary text-[13px]"
            >
              Mark ad kit ready
            </button>
          ) : null}
          {status === "new" ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => mark("skipped")}
              className="inv-btn inv-btn-outline text-[13px]"
            >
              Skip
            </button>
          ) : null}
          {status !== "new" ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => mark("new")}
              className="inv-btn inv-btn-outline text-[13px]"
            >
              Reopen
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function SeedChip({ status }: { status: "new" | "processed" | "skipped" }) {
  const styles =
    status === "processed"
      ? "bg-[color-mix(in_oklch,var(--brand-navy)_12%,white)] text-[var(--brand-navy)]"
      : status === "skipped"
        ? "bg-[var(--surface)] text-[var(--muted-foreground)]"
        : "bg-[color-mix(in_oklch,var(--brand-gold)_18%,white)] text-[var(--foreground)]";
  const label =
    status === "processed" ? "Ad kit ready" : status === "skipped" ? "Skipped" : "New seed";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${styles}`}>{label}</span>
  );
}
