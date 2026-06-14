import { notFound } from "next/navigation";
import { ConnectionsForm } from "@/components/connections-form";
import { INTEGRATION_GROUPS } from "@/lib/integrations";

/**
 * LOCAL-ONLY setup guide. This page is NEVER served on the hosted site —
 * it returns 404 in production. Pull it up in dev (localhost:3002/connections)
 * to set up payments / sales channels / lead email. Anything you type lives
 * only in your browser; the real secrets belong in the hosting platform's
 * environment variables (use "Copy as .env"). It is intentionally not in the
 * admin nav and not reachable by storefront or admin users.
 */
export default function ConnectionsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="min-h-screen bg-[#f7f7f6] px-6 py-8 text-foreground">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold text-foreground">Connections · setup guide</h1>
        <p className="admin-help mb-6 mt-1">
          Local-only backend reference. Where to go and what to paste for each payment / sales-channel / email
          integration. Not hosted; not in admin.
        </p>
        <ConnectionsForm groups={INTEGRATION_GROUPS} />
      </div>
    </div>
  );
}
