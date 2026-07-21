import { InventoryAppShell } from "@/components/inventory/inventory-app-shell";
import { IntakeCaptureForm } from "./intake-capture-form";

export default function IntakePage() {
  return (
    <InventoryAppShell
      active="intake"
      title="New intake"
      subtitle="Photo → details → print"
      backHref="/admin/inventory"
    >
      <div className="mb-6 max-w-lg">
        <p className="inv-eyebrow mb-2">Capture</p>
        <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-medium tracking-[-0.01em] leading-tight">
          Add one unit to the floor
        </h2>
        <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
          Shoot the item, confirm the price, and print a permanent QR label. Reprint only the price tag when the number changes.
        </p>
      </div>
      <IntakeCaptureForm />
    </InventoryAppShell>
  );
}
