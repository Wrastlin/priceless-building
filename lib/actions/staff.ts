"use server";

/**
 * Staff-allowlist server actions for /admin/team.
 * Owners only. Invites never expose a public signup form — only Team can add emails.
 */

import { revalidatePath } from "next/cache";
import { requireOwner, adminIdentity } from "@/lib/auth/session";
import { invalidateAllowlist } from "@/lib/auth/staff-allowlist";
import { addStaff, setStaffActive, removeStaff, normalizeEmail } from "@/lib/staff/store";
import { adminClient } from "@/lib/supabase/admin";
import { logCaptureEvent } from "@/lib/capture/events";
import { SITE_ORIGIN } from "@/lib/integrations";

function inviteRedirectTo(): string {
  // Always use the public site for invite emails. APP_BASE_URL is often the
  // store LAN host for label printing and must not ship in invite links.
  const base = SITE_ORIGIN.replace(/\/+$/, "");
  return `${base}/auth/callback?next=${encodeURIComponent("/admin/today")}`;
}

/** Allowlist only — for people who will use Continue with Google. */
export async function addStaffAction(formData: FormData): Promise<void> {
  const owner = await requireOwner();
  const email = String(formData.get("email") ?? "");
  await addStaff(email, owner.email);
  invalidateAllowlist(email);
  await logCaptureEvent({
    source: "action",
    action: "staff.add",
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { email: normalizeEmail(email), mode: "allowlist" },
  });
  revalidatePath("/admin/team");
}

/**
 * Allowlist + send a private Supabase invite / magic link to that email only.
 * Not available on the public login page.
 */
export async function inviteStaffAction(formData: FormData): Promise<{ emailed: boolean; detail: string }> {
  const owner = await requireOwner();
  const raw = String(formData.get("email") ?? "");
  const email = normalizeEmail(raw);
  await addStaff(email, owner.email);
  invalidateAllowlist(email);

  const redirectTo = inviteRedirectTo();
  const sb = adminClient();

  const invite = await sb.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (!invite.error) {
    await logCaptureEvent({
      source: "action",
      action: "staff.invite",
      loginEmail: owner.email,
      loginRole: owner.role,
      payload: { email, mode: "inviteUserByEmail" },
    });
    revalidatePath("/admin/team");
    return {
      emailed: true,
      detail: `Invite sent to ${email}. They open the email link (not the public login form).`,
    };
  }

  // Already registered, or invite API quirk — try a one-time magic link email via generateLink.
  // We still don't expose OTP on /login; this is owner-triggered only.
  const link = await sb.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (link.error) {
    await logCaptureEvent({
      source: "action",
      action: "staff.invite_partial",
      loginEmail: owner.email,
      loginRole: owner.role,
      payload: { email, inviteError: invite.error.message, linkError: link.error.message },
    });
    revalidatePath("/admin/team");
    return {
      emailed: false,
      detail: `Added ${email} to Team, but the invite email failed (${invite.error.message}). If they have Google, they can use Continue with Google at /login.`,
    };
  }

  // generateLink does not send email by itself. Prefer invite path; surface clear next step.
  await logCaptureEvent({
    source: "action",
    action: "staff.invite_partial",
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { email, inviteError: invite.error.message, generatedLink: true },
  });
  revalidatePath("/admin/team");
  return {
    emailed: false,
    detail: `Added ${email} to Team. Automatic invite email failed (${invite.error.message}). They can sign in with Google if that address is a Google account, or retry Invite after Auth email is configured in Supabase.`,
  };
}

/** Re-send invite for an existing allowlisted employee. */
export async function resendStaffInviteAction(email: string): Promise<{ emailed: boolean; detail: string }> {
  const owner = await requireOwner();
  const e = normalizeEmail(email);
  const fd = new FormData();
  fd.set("email", e);
  // inviteStaffAction upserts allowlist again — fine
  void owner;
  return inviteStaffAction(fd);
}

export async function setStaffActiveAction(email: string, active: boolean): Promise<void> {
  const owner = await requireOwner();
  await setStaffActive(email, active);
  invalidateAllowlist(email);
  await logCaptureEvent({
    source: "action",
    action: active ? "staff.resume" : "staff.pause",
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { email: normalizeEmail(email) },
  });
  revalidatePath("/admin/team");
}

export async function removeStaffAction(email: string): Promise<void> {
  const owner = await requireOwner();
  await removeStaff(email);
  invalidateAllowlist(normalizeEmail(email));
  await logCaptureEvent({
    source: "action",
    action: "staff.remove",
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { email: normalizeEmail(email) },
  });
  revalidatePath("/admin/team");
}
