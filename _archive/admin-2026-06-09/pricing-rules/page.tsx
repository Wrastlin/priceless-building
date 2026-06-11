import { AdminShell } from "@/components/admin-shell";
import { PricingRules } from "./pricing-rules";

export default function PricingRulesPage() {
  return (
    <AdminShell active="pricing" title="Pricing rules">
      <p className="admin-help mb-5 max-w-2xl">
        Rules run nightly against the live SerpApi snapshot. Stale items get re-tagged automatically and fresh tags queue at the floor printer before we open.
      </p>
      <PricingRules />
    </AdminShell>
  );
}
