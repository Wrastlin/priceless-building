import { AdminShell } from "@/components/admin-shell";

const HARDCODED_TEAM = [
  { name: "Brian", email: "brian@pricelessbuilding.com", role: "Floor manager", note: "Hardcoded placeholder. Real list pulls from Supabase once team mgmt is wired." },
];

export default function TeamPage() {
  return (
    <AdminShell active="settings" title="Team" crumbs={[{ label: "Team" }]}>
      <p className="admin-help mb-5 max-w-3xl">
        Team accounts. Each team member signs in with their own Google account
        via the existing Supabase auth flow. This page will eventually let an
        admin invite a teammate by email, set their role, deactivate them, and
        review their activity log. Not wired yet.
      </p>

      <div className="admin-card overflow-hidden">
        <table className="admin-table w-full text-sm">
          <thead className="bg-[#fafaf9] text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {HARDCODED_TEAM.map((m) => (
              <tr key={m.email} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{m.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-foreground">{m.email}</td>
                <td className="px-4 py-3 text-foreground">{m.role}</td>
                <td className="px-4 py-3">
                  <span className="admin-pill bg-amber-50 text-amber-700">Placeholder</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card mt-6 p-5">
        <div className="text-base font-semibold text-foreground">What this page needs (next build)</div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>Supabase <span className="font-mono text-foreground">team_members</span> table (id, user_id, email, full_name, role, active, invited_by, created_at)</li>
          <li>RLS: only admins read/write; team members read their own row</li>
          <li>Invite-by-email flow: admin enters email, Supabase magic-link or pre-populates allowed-emails table; Google OAuth callback checks the email is on the list</li>
          <li>Role enum: <span className="font-mono text-foreground">admin</span> · <span className="font-mono text-foreground">manager</span> · <span className="font-mono text-foreground">floor</span> · <span className="font-mono text-foreground">designer</span> (BC)</li>
          <li>Soft delete (set <span className="font-mono text-foreground">active=false</span>) instead of hard delete, so audit log stays intact</li>
          <li>Page surfaces each member's last sign-in, items added this week, and an "Open audit log" link filtered to that user</li>
        </ul>
      </div>
    </AdminShell>
  );
}
