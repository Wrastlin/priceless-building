"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { refreshComparablesAction } from "@/lib/actions/comparables";

export function RefreshComparables({ sku, title }: { sku: string; title: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [lastCount, setLastCount] = useState<number | null>(null);

  function run() {
    start(async () => {
      try {
        const result = await refreshComparablesAction(sku, title);
        setLastCount(result.count);
        toast.success(
          result.count
            ? `Found ${result.count} comparable${result.count === 1 ? "" : "s"}`
            : "No comparables found",
        );
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Comparables refresh failed");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="inv-btn inv-btn-outline text-[13px]"
        disabled={pending}
        onClick={run}
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        Refresh prices
      </button>
      {lastCount != null ? (
        <span className="text-[12px] text-[var(--muted-foreground)]">Last run: {lastCount}</span>
      ) : null}
    </div>
  );
}
