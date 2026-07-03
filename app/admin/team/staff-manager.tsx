"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addStaffAction,
  setStaffActiveAction,
  removeStaffAction,
} from "@/lib/actions/staff";

type Staff = { email: string; addedBy: string | null; addedAt: string; active: boolean };

export function StaffManager({
  initialStaff,
  owners,
  canManage,
}: {
  initialStaff: Staff[];
  owners: string[];
  canManage: boolean;
}) {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [email, setEmail] = useState("");
  const [pending, start] = useTransition();

  function add(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return;
    if (owners.includes(value) || staff.some((s) => s.email === value)) {
      toast.error("That email is already on the team.");
      return;
    }
    start(async () => {
      const fd = new FormData();
      fd.set("email", value);
      try {
        await addStaffAction(fd);
        setStaff((prev) => [
          ...prev,
          { email: value, addedBy: null, addedAt: new Date().toISOString(), active: true },
        ]);
        setEmail("");
        toast.success(`Added ${value}. They can sign in with Google at /login.`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not add staff.");
      }
    });
  }

  function toggle(s: Staff) {
    const next = !s.active;
    setStaff((prev) => prev.map((x) => (x.email === s.email ? { ...x, active: next } : x)));
    start(async () => {
      try {
        await setStaffActiveAction(s.email, next);
        toast.success(next ? `${s.email} can sign in again.` : `${s.email} access paused.`);
      } catch (err) {
        setStaff((prev) => prev.map((x) => (x.email === s.email ? { ...x, active: s.active } : x)));
        toast.error(err instanceof Error ? err.message : "Could not update staff.");
      }
    });
  }

  function remove(s: Staff) {
    const prev = staff;
    setStaff((cur) => cur.filter((x) => x.email !== s.email));
    start(async () => {
      try {
        await removeStaffAction(s.email);
        toast.success(`Removed ${s.email}.`);
      } catch (err) {
        setStaff(prev);
        toast.error(err instanceof Error ? err.message : "Could not remove staff.");
      }
    });
  }

  return (
    <div className="admin-card p-5">
      <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">Staff</h2>

      {canManage ? (
        <>
          <form onSubmit={add} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              aria-label="Staff Google email"
              className="admin-input flex-1"
            />
            <button type="submit" disabled={pending} className="admin-btn admin-btn-primary shrink-0">
              Add staff
            </button>
          </form>
          <p className="admin-help mt-1.5">Use the Google account they&apos;ll sign in with.</p>
        </>
      ) : (
        <p className="admin-help mt-3">Only owners can add or remove staff.</p>
      )}

      {staff.length ? (
        <ul className="mt-4 divide-y divide-border">
          {staff.map((s) => (
            <li key={s.email} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <div className="truncate font-mono text-sm text-foreground">{s.email}</div>
                {!s.active ? (
                  <div className="text-xs text-muted-foreground">Access paused</div>
                ) : null}
              </div>
              {canManage ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggle(s)}
                    disabled={pending}
                    className="admin-btn admin-btn-ghost px-2 py-1 text-sm"
                  >
                    {s.active ? "Pause" : "Resume"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(s)}
                    disabled={pending}
                    className="admin-btn admin-btn-danger px-2 py-1 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          No added staff yet. Owners (right) always have access.
        </p>
      )}
    </div>
  );
}
