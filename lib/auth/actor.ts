import { cookies } from "next/headers";
import { adminIdentity, type AppRole, type AdminIdentity } from "@/lib/auth/session";
import { getFloorPerson, type FloorPerson } from "@/lib/floor-people/store";

export const ACTOR_COOKIE = "pbc_actor";

export type ResolvedActor = {
  login: AdminIdentity;
  /** Floor person selected as "Who is working", if any. */
  person: FloorPerson | null;
  /** Display string for createdBy / soldBy / events. */
  label: string;
};

/**
 * Login user + sticky Who-is-working person.
 * Cookie holds floor_people.id; invalid/inactive ids are ignored.
 */
export async function resolveActor(): Promise<ResolvedActor | null> {
  const login = await adminIdentity();
  if (!login) return null;

  let person: FloorPerson | null = null;
  try {
    const jar = await cookies();
    const id = jar.get(ACTOR_COOKIE)?.value?.trim();
    if (id) {
      const p = await getFloorPerson(id);
      if (p?.active) person = p;
    }
  } catch {
    // cookies() can throw outside a request — ignore
  }

  const label = person?.name ?? (login.role === "owner" ? login.email : "Floor");
  return { login, person, label };
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
    actorId: actor.person?.id ?? null,
    actorName: actor.person?.name ?? null,
    loginEmail: actor.login.email,
    loginRole: actor.login.role,
  };
}
