"use client";

import { useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import {
  approveDraftAction,
  rejectDraftAction,
  undoStatusChangeAction,
} from "@/lib/actions/staging";

/**
 * Client-side approve / reject buttons for a single draft card.
 *
 * Both actions are reversible: after firing, a sonner toast appears
 * with an "Undo" button AND Cmd+Z / Ctrl+Z reverses the most recent
 * mutation for ten seconds. After that window the undo handle expires
 * and the action stands.
 */

type PendingUndo = { sku: string; verb: string };

export function StagingActions({ sku, title }: { sku: string; title: string }) {
  const [pending, startTransition] = useTransition();
  const pendingUndoRef = useRef<PendingUndo | null>(null);
  const expiryRef = useRef<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta || e.key.toLowerCase() !== "z" || e.shiftKey) return;
      const u = pendingUndoRef.current;
      if (!u) return;
      e.preventDefault();
      runUndo(u);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function runUndo(u: PendingUndo) {
    pendingUndoRef.current = null;
    if (expiryRef.current) {
      window.clearTimeout(expiryRef.current);
      expiryRef.current = null;
    }
    startTransition(async () => {
      try {
        await undoStatusChangeAction(u.sku);
        toast.success(`Undone. ${u.sku} is back in staging.`);
      } catch {
        toast.error(`Undo failed for ${u.sku}.`);
      }
    });
  }

  function fire(verb: "Approved" | "Rejected", run: () => Promise<void>) {
    startTransition(async () => {
      try {
        await run();
        const undo: PendingUndo = { sku, verb };
        pendingUndoRef.current = undo;
        if (expiryRef.current) window.clearTimeout(expiryRef.current);
        // Auto-expire the undo window after 10s.
        expiryRef.current = window.setTimeout(() => {
          if (pendingUndoRef.current === undo) pendingUndoRef.current = null;
        }, 10_000);
        toast(`${verb} · ${title}`, {
          description: "Cmd+Z to undo",
          action: { label: "Undo", onClick: () => runUndo(undo) },
          duration: 10_000,
        });
      } catch (err) {
        toast.error(
          `${verb === "Approved" ? "Approve" : "Reject"} failed: ${
            err instanceof Error ? err.message : "unknown"
          }`,
        );
      }
    });
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => fire("Approved", () => approveDraftAction(sku))}
        className="admin-btn admin-btn-primary w-full"
      >
        {pending ? "…" : "Approve"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => fire("Rejected", () => rejectDraftAction(sku))}
        className="admin-btn admin-btn-outline w-full"
      >
        {pending ? "…" : "Reject"}
      </button>
    </div>
  );
}
