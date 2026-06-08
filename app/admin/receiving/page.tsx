import { AdminShell } from "@/components/admin-shell";
import { ReceivingForm } from "./receiving-form";

export default function ReceivingPage() {
  return (
    <AdminShell active="receiving" title="Receiving">
      <p className="admin-help mb-5 max-w-2xl">
        Snap one photo per item or scan packing-slip barcodes. We batch-create SKUs, run comparables, and stage them for tag print.
      </p>
      <ReceivingForm />
    </AdminShell>
  );
}
