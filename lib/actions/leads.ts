"use server";

/**
 * Server-action stubs that the public contact + consultation forms
 * submit through. They validate input with zod, log to stdout (for now;
 * Supabase wiring is a flip of one helper away), and return a typed
 * result that the client can render directly.
 *
 * When Supabase comes online: add a `leads` table with the columns we
 * write below and replace the `console.log` with `supabase.from("leads").insert(...)`.
 */

import { z } from "zod";

const ContactLead = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  looking_for: z.string().optional(),
  message: z.string().min(5),
});

const ConsultLead = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  city: z.string().optional(),
  project_type: z.string().min(2),
  budget: z.string().optional(),
  message: z.string().min(5),
  preferred_contact: z.string().optional(),
});

export type LeadResult = { ok: true; id: string } | { ok: false; error: string };

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`;
}

export async function submitContactLead(formData: FormData): Promise<LeadResult> {
  const parsed = ContactLead.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: "Please fill in the required fields." };
  }
  const id = newId("CT");
  console.log("[contact-lead]", id, parsed.data);
  return { ok: true, id };
}

export async function submitConsultationLead(formData: FormData): Promise<LeadResult> {
  const parsed = ConsultLead.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  const id = newId("BC");
  console.log("[consultation-lead]", id, parsed.data);
  return { ok: true, id };
}
