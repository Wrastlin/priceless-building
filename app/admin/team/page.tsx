import { AdminShell } from "@/components/admin-shell";
import { listStaff } from "@/lib/staff/store";
import { envAllowedEmails } from "@/lib/auth/allowlist";
import { isOwner } from "@/lib/auth/session";
import { StaffManager } from "./staff-manager";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const [staff, owner] = await Promise.all([listStaff(), isOwner()]);
  const owners = Array.from(envAllowedEmails());

  return (
    <AdminShell active="team" title="Team">
      <p className="admin-help mb-5">
        Who can sign in to the admin. Staff sign in with Google at{" "}
        <span className="font-mono text-foreground">/login</span>.{" "}
        {owner
          ? "Add their Google email here and they get access on their next sign-in — no redeploy needed."
          : "Only owners can add or remove people, so this list is read-only for you."}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <StaffManager initialStaff={staff} owners={owners} canManage={owner} />

        {/* Owners: the ALLOWED_EMAILS env list. Always on, can't be removed here
            (they're the lock-out safety net), so we show them read-only. */}
        <div className="admin-card p-5">
          <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
            Owners <span className="font-normal text-muted-foreground">· always on</span>
          </h2>
          <p className="admin-help mt-2">
            Set in the <span className="font-mono">ALLOWED_EMAILS</span> environment variable. These accounts
            can never be locked out from here — change them in the hosting env.
          </p>
          {owners.length ? (
            <ul className="mt-3 divide-y divide-border">
              {owners.map((e) => (
                <li key={e} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="truncate font-mono text-sm text-foreground">{e}</span>
                  <span className="admin-pill">Owner</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No owner emails configured (dev mode is open to any signed-in Google account).
            </p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
