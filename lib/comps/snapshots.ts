import { adminClient, hasServiceRole } from "@/lib/supabase/admin";
import type { Comparable } from "@/lib/comparable-search";

export type CompsSnapshotInput = {
  sku: string;
  query: string;
  broadened?: boolean;
  rawResults: Comparable[];
  anchor?: number;
  median?: number;
  trimmedMean?: number;
  n: number;
  actorName?: string | null;
  loginEmail?: string | null;
};

/** Append a comps capture snapshot. Soft-fails (logs, never throws) if table missing. */
export async function insertCompsSnapshot(input: CompsSnapshotInput): Promise<string | null> {
  try {
    if (!hasServiceRole()) {
      console.warn("comps_snapshots: service role not configured, skipping");
      return null;
    }
    const sb = adminClient();
    const { data, error } = await sb
      .from("comps_snapshots")
      .insert({
        sku: input.sku,
        query: input.query,
        broadened: input.broadened ?? false,
        raw_results: input.rawResults,
        anchor: input.anchor ?? null,
        median: input.median ?? null,
        trimmed_mean: input.trimmedMean ?? null,
        n: input.n,
        actor_name: input.actorName ?? null,
        login_email: input.loginEmail ?? null,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "42P01" || /does not exist/i.test(error.message)) {
        console.warn("comps_snapshots table missing, skipping snapshot");
        return null;
      }
      console.error("comps_snapshots insert failed", error.message);
      return null;
    }
    return data?.id ?? null;
  } catch (err) {
    console.error("comps_snapshots unavailable", err);
    return null;
  }
}
