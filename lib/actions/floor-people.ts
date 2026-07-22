"use server";

/**
 * Legacy floor_people helpers kept for data already in the table.
 * Day-to-day identity is the signed-in email (Team invite / Google).
 */

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/session";
import {
  addFloorPerson,
  setFloorPersonActive,
  removeFloorPerson,
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
  await logCaptureEvent({
    source: "action",
    action: "floor_person.remove",
    loginEmail: owner.email,
    loginRole: owner.role,
    payload: { id },
  });
  revalidatePath("/admin/team");
}
