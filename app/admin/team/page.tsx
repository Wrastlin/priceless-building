import { AdminShell } from "@/components/admin-shell";
import { listStaff } from "@/lib/staff/store";
import { envAllowedEmails } from "@/lib/auth/allowlist";
import { isOwner } from "@/lib/auth/session";
import { StaffManager } from "./staff-manager";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const owner = await isOwner();
  let staff: Awaited<ReturnType<typeof listStaff>> = [];
  try {
    staff = await listStaff();
  } catch (e) {
    console.error("listStaff", e);
  }
  const owners = Array.from(envAllowedEmails());

  return (
    <AdminShell active="team" title="Team">
      <p className="admin-help mb-5">
        Invite people <strong className="font-medium text-foreground">only from this page</strong>.
        There is no public sign-up. Each employee gets their own login (Google or a private email
        invite). Floor accounts cannot manage Team, costs, or destructive actions.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <StaffManager initialStaff={staff} owners={owners} canManage={owner} />

        <div className="admin-card p-5">
          <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
            Owners <span className="font-normal text-muted-foreground">· always on</span>
          </h2>
          <p className="admin-help mt-2">
            Set in the <span className="font-mono">ALLOWED_EMAILS</span> environment variable (Vercel).
            Change rarely — not used for everyday floor hires.
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
