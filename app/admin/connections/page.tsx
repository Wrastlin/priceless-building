import { AdminShell } from "@/components/admin-shell";
import { ConnectionsForm } from "@/components/admin/connections-form";
import { INTEGRATION_GROUPS } from "@/lib/integrations";

export default function ConnectionsPage() {
  return (
    <AdminShell active="connections" title="Connections" crumbs={[{ label: "Connections" }]}>
      <p className="admin-help mb-5">
        Sales channels, payments, and lead email — each one tells you exactly where to go and what to
        paste in. Sandbox / test mode first; nothing goes live until you turn it on.
      </p>
      <ConnectionsForm groups={INTEGRATION_GROUPS} />
    </AdminShell>
  );
}
