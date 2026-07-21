import { AdminShell } from "@/components/admin-shell";
import { listStaff } from "@/lib/staff/store";
import { listFloorPeople } from "@/lib/floor-people/store";
import { envAllowedEmails } from "@/lib/auth/allowlist";
import { isOwner } from "@/lib/auth/session";
import { StaffManager } from "./staff-manager";
import { FloorPeopleManager } from "./floor-people-manager";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const owner = await isOwner();
  let staff: Awaited<ReturnType<typeof listStaff>> = [];
  let people: Awaited<ReturnType<typeof listFloorPeople>> = [];
  let peopleTableReady = true;
  try {
    staff = await listStaff();
  } catch (e) {
    console.error("listStaff", e);
  }
  try {
    people = await listFloorPeople();
  } catch (e) {
    peopleTableReady = false;
    console.error("listFloorPeople — run migration 0004_floor_auth.sql?", e);
  }
  const owners = Array.from(envAllowedEmails());

  return (
    <AdminShell active="team" title="Team">
      <p className="admin-help mb-5">
        <strong className="font-medium text-foreground">Owners</strong> (your admin Google) can do
        everything. Add <strong className="font-medium text-foreground">one employee Google</strong>{" "}
        under Employee login for the floor phones — that account cannot delete or manage team. Then
        add <strong className="font-medium text-foreground">People</strong> so each person can select
        Who is working; every action is flagged under their name.
      </p>

      {!peopleTableReady ? (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          People table not ready yet. In Supabase → SQL, run{" "}
          <span className="font-mono">supabase/migrations/0004_floor_auth.sql</span>, then refresh.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <StaffManager initialStaff={staff} owners={owners} canManage={owner} />
        <FloorPeopleManager initialPeople={people} canManage={owner && peopleTableReady} />

        <div className="admin-card p-5 lg:col-span-2">
          <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
            Owners <span className="font-normal text-muted-foreground">· always on</span>
          </h2>
          <p className="admin-help mt-2">
            Set in the <span className="font-mono">ALLOWED_EMAILS</span> environment variable. Full
            access — never locked out from this screen.
          </p>
          {owners.length ? (
            <ul className="mt-3 divide-y divide-border sm:columns-2">
              {owners.map((e) => (
                <li
                  key={e}
                  className="flex break-inside-avoid items-center justify-between gap-3 py-2.5"
                >
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
