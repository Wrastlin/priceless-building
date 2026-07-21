"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setActiveActorAction } from "@/lib/actions/floor-people";

type Person = { id: string; name: string };

/**
 * Who is working — sticky attribution for a shared employee login.
 */
export function WhoIsWorking({
  people,
  activeId,
  loginRole,
}: {
  people: Person[];
  activeId: string | null;
  loginRole: "owner" | "floor";
}) {
  const [pending, start] = useTransition();

  if (!people.length) {
    return loginRole === "owner" ? (
      <span className="hidden text-[11px] text-[var(--muted-foreground)] lg:inline">
        Add people on Team
      </span>
    ) : (
      <span className="max-w-[9rem] truncate text-[12px] text-amber-800">
        Ask admin to add your name
      </span>
    );
  }

  return (
    <label className="flex min-w-0 items-center gap-1.5">
      <span className="hidden text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)] sm:inline">
        Working as
      </span>
      <select
        className="inv-input max-w-[9.5rem] py-1.5 text-[13px] sm:max-w-[11rem]"
        value={activeId ?? ""}
        disabled={pending}
        aria-label="Who is working"
        onChange={(e) => {
          const v = e.target.value || null;
          start(async () => {
            try {
              await setActiveActorAction(v);
              toast.success(v ? "Got it — actions are under that name." : "Cleared.");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not switch person");
            }
          });
        }}
      >
        <option value="">Select…</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
}
