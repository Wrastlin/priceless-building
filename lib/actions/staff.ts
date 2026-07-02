"use server";

/**
 * Staff-allowlist server actions for /admin/team. Each opens with
 * requireAdminSession() (the real write boundary), writes the staff_emails
 * table, drops the in-process allowlist cache for that email so the change
 * takes effect on the next request, and revalidates the team page.
 */

import { revalidatePath } from "next/cache";
import { requireAdminSession, adminIdentity } from "@/lib/auth/session";
import { invalidateAllowlist } from "@/lib/auth/allowlist";
import { addStaff, setStaffActive, removeStaff, normalizeEmail } from "@/lib/staff/store";

export async function addStaffAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const email = String(formData.get("email") ?? "");
  const me = await adminIdentity();
  await addStaff(email, me?.email ?? null);
  invalidateAllowlist(email);
  revalidatePath("/admin/team");
}

export async function setStaffActiveAction(email: string, active: boolean): Promise<void> {
  await requireAdminSession();
  await setStaffActive(email, active);
  invalidateAllowlist(email);
  revalidatePath("/admin/team");
}

export async function removeStaffAction(email: string): Promise<void> {
  await requireAdminSession();
  await removeStaff(email);
  invalidateAllowlist(normalizeEmail(email));
  revalidatePath("/admin/team");
}
