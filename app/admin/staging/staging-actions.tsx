"use client";

import { useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import {
  approveDraftAction,
  rejectDraftAction,
  undoStatusChangeAction,
} from "@/lib/actions/staging";

/**
 * Approve / reject buttons for a single draft card.
 *
 * Approve is combined with the tag print: it opens the floor-tag print
 * screen for this SKU as part of the same click, so a manager approves and
 * prints in one action. (The tab is opened synchronously in the click so a
 * popup blocker won't kill it, then pointed at the item only once the
 * approval succeeds.)
 *
 * Both actions are reversible: after firing, a sonner toast appears with an
 * "Undo" button AND Cmd+Z / Ctrl+Z reverses the most recent mutation for
 * ten seconds. After that window the undo handle expires and it stands.
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

  function armUndo(verb: "Approved" | "Rejected") {
    const undo: PendingUndo = { sku, verb };
    pendingUndoRef.current = undo;
    if (expiryRef.current) window.clearTimeout(expiryRef.current);
    expiryRef.current = window.setTimeout(() => {
      if (pendingUndoRef.current === undo) pendingUndoRef.current = null;
    }, 10_000);
    toast(`${verb} · ${title}`, {
      description: "Cmd+Z to undo",
      action: { label: "Undo", onClick: () => runUndo(undo) },
      duration: 10_000,
    });
  }

  function approveAndTag() {
    // Open the print tab now, inside the user gesture, so it isn't blocked.
    const win = window.open("", "_blank");
    startTransition(async () => {
      try {
        await approveDraftAction(sku);
        if (win) win.location.href = `/admin/tags?sku=${encodeURIComponent(sku)}`;
        armUndo("Approved");
      } catch (err) {
        if (win) win.close();
        toast.error(`Approve failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  function reject() {
    startTransition(async () => {
      try {
        await rejectDraftAction(sku);
        armUndo("Rejected");
      } catch (err) {
        toast.error(`Reject failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={approveAndTag}
        className="admin-btn admin-btn-primary w-full"
      >
        {pending ? "…" : "Approve + tag"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={reject}
        className="admin-btn admin-btn-outline w-full"
      >
        {pending ? "…" : "Reject"}
      </button>
    </div>
  );
}
