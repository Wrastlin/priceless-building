"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markSoldAction, unmarkSoldAction } from "@/lib/actions/staging";

/**
 * One-tap "Mark sold" for floor staff (replacing the pen-and-paper log).
 * Flips the item to sold (off the storefront) and records the sale; an Undo
 * toast reverses it. When already sold, offers "restore to floor."
 */
export function MarkSoldButton({ sku, price, status }: { sku: string; price: number; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const isSold = status === "sold";

  function restore() {
    start(async () => {
      try {
        await unmarkSoldAction(sku);
        toast.success("Restored to the floor.");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not restore.");
      }
    });
  }

  function markSold() {
    start(async () => {
      try {
        await markSoldAction(sku, price);
        router.refresh();
        toast.success("Marked sold.", {
          description: "Removed from the storefront.",
          action: { label: "Undo", onClick: restore },
          duration: 8000,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not mark sold.");
      }
    });
  }

  return isSold ? (
    <button type="button" onClick={restore} disabled={pending} className="admin-btn admin-btn-outline">
      Sold · restore to floor
    </button>
  ) : (
    <button type="button" onClick={markSold} disabled={pending} className="admin-btn admin-btn-danger">
      Mark sold
    </button>
  );
}
