"use server";

/**
 * Public contact + consultation form intake.
 *
 * These used to only console.log and return ok (so the form said "message
 * sent" while nothing reached the store). They now email the store via Resend,
 * the same path the Builders Corner / 4 Squared inquiry forms use
 * (lib/actions/inquiry.ts):
 *   1. Always log to stdout (grep-friendly in hosting logs)
 *   2. If RESEND_API_KEY is set, email INQUIRY_TO_EMAIL
 *      (defaults to pricelessbuildingcenter@gmail.com)
 *   3. In production, if the email could not be sent, return an honest error
 *      instead of a false "sent" confirmation.
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

/** Email the store via Resend. Returns true only if Resend accepted it. */
async function emailLead(subject: string, lines: (string | null)[], replyTo: string): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return false;
  const toEmail = process.env.INQUIRY_TO_EMAIL || "pricelessbuildingcenter@gmail.com";
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || "Price-Less Building <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: replyTo,
        subject,
        text: lines.filter((l): l is string => l !== null).join("\n"),
      }),
    });
    if (res.ok) return true;
    console.error("[lead] resend HTTP", res.status, await res.text().catch(() => ""));
    return false;
  } catch (err) {
    console.error("[lead] resend send error", err);
    return false;
  }
}

const SEND_FAILED =
  "Sorry — we couldn't send your message just now. Please call (715) 848-3855 and we'll take it down by hand.";

export async function submitContactLead(formData: FormData): Promise<LeadResult> {
  const parsed = ContactLead.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: "Please fill in the required fields." };
  }
  const id = newId("CT");
  const d = parsed.data;
  console.log("[contact-lead]", id, d.email);

  const sent = await emailLead(
    `New contact message from ${d.name}`,
    [
      `New contact-form message · ${id}`,
      ``,
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || "(not provided)"}`,
      d.looking_for ? `Looking for: ${d.looking_for}` : null,
      ``,
      `Message:`,
      d.message,
    ],
    d.email,
  );

  if (!sent && process.env.NODE_ENV === "production") {
    return { ok: false, error: SEND_FAILED };
  }
  return { ok: true, id };
}

export async function submitConsultationLead(formData: FormData): Promise<LeadResult> {
  const parsed = ConsultLead.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  const id = newId("BC");
  const d = parsed.data;
  console.log("[consultation-lead]", id, d.email);

  const sent = await emailLead(
    `New consultation request from ${d.name}`,
    [
      `New consultation request · ${id}`,
      ``,
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone}`,
      d.city ? `City: ${d.city}` : null,
      `Project type: ${d.project_type}`,
      d.budget ? `Budget: ${d.budget}` : null,
      d.preferred_contact ? `Prefers contact by: ${d.preferred_contact}` : null,
      ``,
      `Message:`,
      d.message,
    ],
    d.email,
  );

  if (!sent && process.env.NODE_ENV === "production") {
    return { ok: false, error: SEND_FAILED };
  }
  return { ok: true, id };
}
