import { randomUUID } from "node:crypto";
import { adminClient } from "@/lib/supabase/admin";
import type { AppRole } from "@/lib/auth/session";

export type CaptureEventInput = {
  sessionId?: string | null;
  requestId?: string | null;
  actorId?: string | null;
  actorName?: string | null;
  loginEmail?: string | null;
  loginRole?: AppRole | null;
  itemId?: string | null;
  sku?: string | null;
  source: "ui" | "api" | "action";
  action: string;
  path?: string | null;
  payload?: Record<string, unknown> | null;
  error?: string | null;
};

/** Append-only debug/audit event. Never throws to callers — logging must not break intake. */
export async function logCaptureEvent(input: CaptureEventInput): Promise<string | null> {
  try {
    const sb = adminClient();
    const id = randomUUID();
    const { error } = await sb.from("capture_events").insert({
      id,
      session_id: input.sessionId ?? null,
      request_id: input.requestId ?? null,
      actor_id: input.actorId ?? null,
      actor_name: input.actorName ?? null,
      login_email: input.loginEmail ?? null,
      login_role: input.loginRole ?? null,
      item_id: input.itemId ?? null,
      sku: input.sku ?? null,
      source: input.source,
      action: input.action,
      path: input.path ?? null,
      payload: input.payload ?? null,
      error: input.error ?? null,
    });
    if (error) {
      console.error("capture_events insert failed", error.message);
      return null;
    }
    return id;
  } catch (err) {
    console.error("capture_events unavailable", err);
    return null;
  }
}
