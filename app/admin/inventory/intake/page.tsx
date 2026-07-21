import { InventoryAppShell } from "@/components/inventory/inventory-app-shell";
import { IntakeCaptureForm } from "./intake-capture-form";

export default function IntakePage() {
  return (
    <InventoryAppShell
      active="intake"
      title="Add item"
      subtitle="Photo → save → keep going"
      backHref="/admin/inventory"
    >
      <div className="mb-6 max-w-lg">
        <p className="inv-eyebrow mb-2">Capture</p>
        <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-medium tracking-[-0.01em] leading-tight">
          Photograph it. Save it. Do another.
        </h2>
        <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
          AI writes the description after you save. Add measurements and a private note when you know them.
        </p>
      </div>
      <IntakeCaptureForm />
    </InventoryAppShell>
  );
}
