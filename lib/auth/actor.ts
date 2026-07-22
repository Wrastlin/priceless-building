import { adminIdentity, type AppRole, type AdminIdentity } from "@/lib/auth/session";

export type ResolvedActor = {
  login: AdminIdentity;
  /** Display string for createdBy / soldBy / events — the signed-in person. */
  label: string;
};

/**
 * Attribution = who is signed in (individual Google or invite login).
 * No shared-account picker.
 */
export async function resolveActor(): Promise<ResolvedActor | null> {
  const login = await adminIdentity();
  if (!login) return null;
  return { login, label: login.email };
}

export function actorStamp(actor: ResolvedActor): {
  createdBy: string;
  actorId: string | null;
  actorName: string | null;
  loginEmail: string;
  loginRole: AppRole;
} {
  return {
    createdBy: actor.label,
    actorId: null,
    actorName: actor.label,
    loginEmail: actor.login.email,
    loginRole: actor.login.role,
  };
}
