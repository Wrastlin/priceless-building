import "server-only";
import { adminClient, hasServiceRole } from "@/lib/supabase/admin";

/**
 * Data layer for the `staff_emails` allowlist table (see
 * supabase/migrations/0002_liquidation.sql). Reads/writes run through the
 * authenticated per-request client; RLS restricts the table to signed-in
 * staff and the app-level requireAdminSession() gates who may write (same
 * trust model as the items table).
 *
 * Everything degrades gracefully before the migration is applied: reads
 * return [] and writes surface a clear error rather than crashing the page.
 */

export type StaffRow = {
  email: string;
  addedBy: string | null;
  addedAt: string;
  active: boolean;
};

const CONFIGURED = hasServiceRole();

type Row = { email: string; added_by: string | null; added_at: string; active: boolean };

function toStaff(r: Row): StaffRow {
  return { email: r.email, addedBy: r.added_by, addedAt: r.added_at, active: r.active };
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function listStaff(): Promise<StaffRow[]> {
  if (!CONFIGURED) return [];
  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from("staff_emails")
      .select("email, added_by, added_at, active")
      .order("added_at", { ascending: true });
    if (error) return [];
    return (data as Row[] | null ?? []).map(toStaff);
  } catch {
    return [];
  }
}

export async function addStaff(email: string, addedBy: string | null): Promise<void> {
  const e = normalizeEmail(email);
  if (!EMAIL_RE.test(e)) throw new Error("Enter a valid email address.");
  const supabase = adminClient();
  const { error } = await supabase
    .from("staff_emails")
    .upsert({ email: e, added_by: addedBy, active: true }, { onConflict: "email" });
  if (error) throw new Error(`Could not add staff: ${error.message}`);
}

export async function setStaffActive(email: string, active: boolean): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase
    .from("staff_emails")
    .update({ active })
    .eq("email", normalizeEmail(email));
  if (error) throw new Error(`Could not update staff: ${error.message}`);
}

export async function removeStaff(email: string): Promise<void> {
  const supabase = adminClient();
  const { error } = await supabase
    .from("staff_emails")
    .delete()
    .eq("email", normalizeEmail(email));
  if (error) throw new Error(`Could not remove staff: ${error.message}`);
}
