import { adminClient } from "@/lib/supabase/admin";

export type FloorPerson = {
  id: string;
  name: string;
  active: boolean;
  createdBy: string | null;
  createdAt: string;
};

type Row = {
  id: string;
  name: string;
  active: boolean;
  created_by: string | null;
  created_at: string;
};

function map(r: Row): FloorPerson {
  return {
    id: r.id,
    name: r.name,
    active: r.active,
    createdBy: r.created_by,
    createdAt: r.created_at,
  };
}

export async function listFloorPeople(opts?: { activeOnly?: boolean }): Promise<FloorPerson[]> {
  const sb = adminClient();
  let q = sb.from("floor_people").select("*").order("name", { ascending: true });
  if (opts?.activeOnly) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return ((data ?? []) as Row[]).map(map);
}

export async function getFloorPerson(id: string): Promise<FloorPerson | null> {
  const sb = adminClient();
  const { data, error } = await sb.from("floor_people").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? map(data as Row) : null;
}

export async function addFloorPerson(name: string, createdBy: string | null): Promise<FloorPerson> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name required");
  const sb = adminClient();
  const { data, error } = await sb
    .from("floor_people")
    .insert({ name: trimmed, created_by: createdBy, active: true })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return map(data as Row);
}

export async function setFloorPersonActive(id: string, active: boolean): Promise<void> {
  const sb = adminClient();
  const { error } = await sb.from("floor_people").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function removeFloorPerson(id: string): Promise<void> {
  const sb = adminClient();
  const { error } = await sb.from("floor_people").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
