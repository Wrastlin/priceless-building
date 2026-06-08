import { AdminShell } from "@/components/admin-shell";
import { PosRegister } from "./pos-register";
import { CATALOG } from "@/lib/catalog";

export default function PosPage() {
  return (
    <AdminShell active="pos" title="Register" crumbs={[{ label: "Register · Counter 1" }]}>
      <PosRegister items={CATALOG} />
    </AdminShell>
  );
}
