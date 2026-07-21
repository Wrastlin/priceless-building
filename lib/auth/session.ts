import { createClient } from "@/lib/supabase/server";
import { envAllowlistEmpty, devAdminBypass, isEnvAllowed } from "@/lib/auth/allowlist";
import { isEmailAllowed } from "@/lib/auth/staff-allowlist";

/**
 * Admin access gate for every protected route and Server Action.
 *
 * Login tiers:
 *   - owner  → email in ALLOWED_EMAILS (env). Full power.
 *   - floor  → email in staff_emails (the shared employee Google login).
 *
 * Floor can inventory and sell; cannot run destructive owner tools.
 */

const isProd = () => process.env.NODE_ENV === "production";

export function adminGloballyEnabled(): boolean {
  if (!isProd()) return true;
  return process.env.PUBLIC_ADMIN_ENABLED === "1";
}

/** App role — not the Supabase JWT role. */
export type AppRole = "owner" | "floor";

export type AdminIdentity = {
  email: string;
  sub: string;
  role: AppRole;
};

export async function adminIdentity(): Promise<AdminIdentity | null> {
  if (!adminGloballyEnabled()) return null;
  if (devAdminBypass()) return { email: "dev@local", sub: "dev", role: "owner" };

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseConfigured) {
    if (envAllowlistEmpty() && !isProd()) return { email: "dev@local", sub: "dev", role: "owner" };
    return null;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;
    if (!claims) return null;
    const email = (claims.email as string | undefined)?.toLowerCase();
    const sub = (claims.sub as string | undefined) ?? email ?? "unknown";
    if (!(await isEmailAllowed(email))) {
      if (envAllowlistEmpty() && !isProd()) {
        return { email: email ?? "dev@local", sub, role: "owner" };
      }
      return null;
    }
    const role: AppRole = isEnvAllowed(email ?? "") ? "owner" : "floor";
    return { email: email ?? "unknown", sub, role };
  } catch {
    return null;
  }
}

export async function hasAdminSession(): Promise<boolean> {
  return (await adminIdentity()) !== null;
}

/** Any signed-in owner or employee login. */
export async function requireAdminSession(): Promise<AdminIdentity> {
  const id = await adminIdentity();
  if (!id) throw new Error("Unauthorized");
  return id;
}

/** Alias — floor or owner may use non-destructive tools. */
export async function requireFloorOrOwner(): Promise<AdminIdentity> {
  return requireAdminSession();
}

export async function isOwner(): Promise<boolean> {
  const id = await adminIdentity();
  return id?.role === "owner";
}

export async function isFloor(): Promise<boolean> {
  const id = await adminIdentity();
  return id?.role === "floor";
}

export async function requireOwner(): Promise<AdminIdentity> {
  const id = await adminIdentity();
  if (!id || id.role !== "owner") {
    throw new Error("Unauthorized: owners only");
  }
  return id;
}
