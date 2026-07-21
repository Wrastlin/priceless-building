"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireOwner, adminIdentity } from "@/lib/auth/session";
import { ACTOR_COOKIE } from "@/lib/auth/actor";
import {
  addFloorPerson,
  setFloorPersonActive,
  removeFloorPerson,
  getFloorPerson,
} from "@/lib/floor-people/store";
import { logCaptureEvent } from "@/lib/capture/events";

export async function addFloorPersonAction(formData: FormData): Promise<void> {
  const owner = await requireOwner();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name required");
  const person = await addFloorPerson(name, owner.email);
  await logCaptureEvent({
    source: "action",
    action: "floor_person.add",
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { id: person.id, name: person.name },
  });
  revalidatePath("/admin/team");
  revalidatePath("/admin/inventory", "layout");
}

export async function setFloorPersonActiveAction(id: string, active: boolean): Promise<void> {
  const owner = await requireOwner();
  await setFloorPersonActive(id, active);
  await logCaptureEvent({
    source: "action",
    action: active ? "floor_person.resume" : "floor_person.pause",
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { id, active },
  });
  revalidatePath("/admin/team");
}

export async function removeFloorPersonAction(id: string): Promise<void> {
  const owner = await requireOwner();
  await removeFloorPerson(id);
  const jar = await cookies();
  if (jar.get(ACTOR_COOKIE)?.value === id) {
    jar.delete(ACTOR_COOKIE);
  }
  await logCaptureEvent({
    source: "action",
    action: "floor_person.remove",
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { id },
  });
  revalidatePath("/admin/team");
  revalidatePath("/admin/inventory", "layout");
}

/** Sticky Who-is-working — any floor or owner login may select. */
export async function setActiveActorAction(personId: string | null): Promise<void> {
  const login = await adminIdentity();
  if (!login) throw new Error("Unauthorized");

  const jar = await cookies();
  if (!personId) {
    jar.delete(ACTOR_COOKIE);
    await logCaptureEvent({
      source: "action",
      action: "actor.clear",
      loginEmail: login.email,
      loginRole: login.role,
    });
    revalidatePath("/admin/inventory", "layout");
    return;
  }

  const person = await getFloorPerson(personId);
  if (!person || !person.active) throw new Error("That person is not available");

  jar.set(ACTOR_COOKIE, person.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  await logCaptureEvent({
    source: "action",
    action: "actor.select",
    actorId: person.id,
    actorName: person.name,
    loginEmail: login.email,
    loginRole: login.role,
    payload: { personId: person.id, name: person.name },
  });
  revalidatePath("/admin/inventory", "layout");
  revalidatePath("/admin/team");
}
