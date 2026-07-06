import { AdminShell } from "@/components/admin-shell";
import { CaptureForm } from "./capture-form";

/**
 * Rapid inventory capture — the phone-first flow for the store-wide
 * physical count. Photos + a tag close-up per item; Gemini transcribes
 * the tag verbatim (no guessing) and the item lands as a draft stamped
 * `inventoriedAt`. Pricing/publishing happens later in the normal tools.
 */
export default function Capture() {
  return (
    <AdminShell
      active="capture"
      title="Quick capture"
      crumbs={[{ label: "Inventory", href: "/admin/inventory" }, { label: "Quick capture" }]}
    >
      <CaptureForm />
    </AdminShell>
  );
}
