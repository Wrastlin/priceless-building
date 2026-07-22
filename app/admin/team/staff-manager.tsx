"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addStaffAction,
  inviteStaffAction,
  resendStaffInviteAction,
  setStaffActiveAction,
  removeStaffAction,
} from "@/lib/actions/staff";

type Staff = { email: string; addedBy: string | null; addedAt: string; active: boolean };

/**
 * Owner-only team allowlist. Public login never offers self-signup or
 * “email me a link” — invites only leave from this screen.
 */
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

  function alreadyOnTeam(value: string) {
    return owners.includes(value) || staff.some((s) => s.email === value);
  }

  function addGoogle(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return;
    if (alreadyOnTeam(value)) {
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
        toast.success(`Added ${value}. They sign in with Google at /login.`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not add staff.");
      }
    });
  }

  function inviteEmail(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return;
    if (owners.includes(value)) {
      toast.error("That email is already an owner.");
      return;
    }
    start(async () => {
      const fd = new FormData();
      fd.set("email", value);
      try {
        const result = await inviteStaffAction(fd);
        if (!staff.some((s) => s.email === value)) {
          setStaff((prev) => [
            ...prev,
            { email: value, addedBy: null, addedAt: new Date().toISOString(), active: true },
          ]);
        }
        setEmail("");
        if (result.emailed) toast.success(result.detail);
        else toast.message(result.detail);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not invite.");
      }
    });
  }

  return (
    <div className="admin-card p-5">
      <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
        Employees <span className="font-normal text-muted-foreground">· invite only</span>
      </h2>
      <p className="admin-help mt-2">
        Each person gets their own login. You add them here — nothing on the public site lets strangers
        join. Prefer Google when they have it; use email invite when they don&apos;t.
      </p>

      {canManage ? (
        <form className="mt-3 space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="maria@gmail.com"
            aria-label="Employee email"
            className="admin-input w-full"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={pending}
              className="admin-btn admin-btn-primary flex-1"
              onClick={addGoogle}
            >
              Add for Google
            </button>
            <button
              type="button"
              disabled={pending}
              className="admin-btn admin-btn-secondary flex-1"
              onClick={inviteEmail}
            >
              Send email invite
            </button>
          </div>
          <p className="admin-help">
            Google: they use Continue with Google. Email invite: private link in their inbox only —
            not shown on /login.
          </p>
        </form>
      ) : (
        <p className="admin-help mt-3">Only owners can invite people.</p>
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
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      start(async () => {
                        try {
                          const result = await resendStaffInviteAction(s.email);
                          if (result.emailed) toast.success(result.detail);
                          else toast.message(result.detail);
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Invite failed");
                        }
                      });
                    }}
                    disabled={pending}
                    className="admin-btn admin-btn-ghost px-2 py-1 text-sm"
                  >
                    Resend invite
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !s.active;
                      setStaff((prev) =>
                        prev.map((x) => (x.email === s.email ? { ...x, active: next } : x)),
                      );
                      start(async () => {
                        try {
                          await setStaffActiveAction(s.email, next);
                          toast.success(next ? "Access resumed." : "Access paused.");
                        } catch (err) {
                          setStaff((prev) =>
                            prev.map((x) => (x.email === s.email ? { ...x, active: s.active } : x)),
                          );
                          toast.error(err instanceof Error ? err.message : "Update failed");
                        }
                      });
                    }}
                    disabled={pending}
                    className="admin-btn admin-btn-ghost px-2 py-1 text-sm"
                  >
                    {s.active ? "Pause" : "Resume"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = staff;
                      setStaff((cur) => cur.filter((x) => x.email !== s.email));
                      start(async () => {
                        try {
                          await removeStaffAction(s.email);
                          toast.success(`Removed ${s.email}.`);
                        } catch (err) {
                          setStaff(prev);
                          toast.error(err instanceof Error ? err.message : "Remove failed");
                        }
                      });
                    }}
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
          No employees yet. Owners always have access via ALLOWED_EMAILS.
        </p>
      )}
    </div>
  );
}
