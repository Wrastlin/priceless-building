import { InventoryAppShell } from "@/components/inventory/inventory-app-shell";
import { ConnectionsForm } from "@/components/connections-form";
import { INTEGRATION_GROUPS } from "@/lib/integrations";

/**
 * Sales-channel setup — credentials draft only, no live feeds.
 */
export default function AdminConnectionsPage() {
  const groups = INTEGRATION_GROUPS.filter((g) =>
    g.id === "channels" || g.id === "data" || g.id === "payments",
  ).map((g) => {
    if (g.id !== "channels") return g;
    return {
      ...g,
      blurb:
        "Save account setup notes here while you sell socially. Product feeds stay off until we wire the website later.",
      items: g.items.map((item) => {
        if (item.key === "meta") {
          return {
            ...item,
            status: "manual" as const,
            sandboxNote:
              "For now: Generate post → paste into Marketplace / Instagram by hand. Catalog feeds are for a later website phase.",
            provide: undefined,
          };
        }
        if (item.key === "ebay") {
          return {
            ...item,
            status: "manual" as const,
            sandboxNote: "Use Generate post for listing copy. Auto-list stays off for now.",
            provide: undefined,
          };
        }
        if (item.key === "google-merchant") {
          return {
            ...item,
            status: "skip" as const,
            blurb: "Deferred until inventory connects to the live site.",
            provide: undefined,
          };
        }
        return item;
      }),
    };
  });

  return (
    <InventoryAppShell active="connections" title="Connections">
      <div className="mb-6 max-w-2xl">
        <p className="inv-eyebrow mb-2">Sales channels</p>
        <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-medium tracking-[-0.01em] leading-tight">
          Connect accounts when you&apos;re ready
        </h2>
        <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
          Setup steps and credential drafts stay in this browser. Nothing posts live from here.
        </p>
      </div>
      <ConnectionsForm groups={groups} />
    </InventoryAppShell>
  );
}
