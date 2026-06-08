"use server";

/**
 * Public inquiry intake.
 *
 * The InquiryForm component (components/inquiry-form.tsx) submits to
 * `submitInquiryAction`. We:
 *   1. Always log the inquiry to stdout (grep-friendly for hosting logs)
 *   2. If RESEND_API_KEY is set, email Josh at INQUIRY_TO_EMAIL
 *      (defaults to pricelessbuildingcenter@gmail.com)
 *   3. If we're in dev (no Resend key and we can write the local FS),
 *      also append to data/inquiries.json so dev work can read them back
 *
 * Production path: email-only via Resend. Zero infra beyond an env var.
 * When we wire Supabase, add a third sink that inserts a row.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";

export type Brand = "builders" | "four-squared";

export type InquiryNeed =
  | "Custom kitchen design"
  | "Custom bath design"
  | "Cabinetry quote"
  | "Installation / remodel"
  | "Schedule a walkthrough"
  | "In-store measuring & planning"
  | "General question"
  | "Other";

const NEEDS: readonly InquiryNeed[] = [
  "Custom kitchen design",
  "Custom bath design",
  "Cabinetry quote",
  "Installation / remodel",
  "Schedule a walkthrough",
  "In-store measuring & planning",
  "General question",
  "Other",
] as const;

const BRANDS: readonly Brand[] = ["builders", "four-squared"] as const;

const InquirySchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  need: z.enum(NEEDS as unknown as [string, ...string[]]),
  project: z.string().optional(),
  brand: z.enum(BRANDS as unknown as [string, ...string[]]),
  source_path: z.string().optional(),
});

export type InquiryResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

type StoredInquiry = z.infer<typeof InquirySchema> & {
  id: string;
  createdAt: string;
};

function newId(): string {
  return `IQ-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

function dataPaths() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("node:path") as typeof import("node:path");
  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "inquiries.json");
  return { dir, file };
}

async function appendInquiry(entry: StoredInquiry): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fsp = require("node:fs/promises") as typeof import("node:fs/promises");
  const { dir, file } = dataPaths();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let existing: StoredInquiry[] = [];
  if (fs.existsSync(file)) {
    try {
      const raw = await fsp.readFile(file, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) existing = parsed as StoredInquiry[];
    } catch {
      // If the file is corrupt we start fresh; the corrupt copy stays
      // on disk for forensics until the next deploy.
      existing = [];
    }
  }

  existing.push(entry);
  const tmp = file + ".tmp";
  await fsp.writeFile(tmp, JSON.stringify(existing, null, 2), "utf8");
  await fsp.rename(tmp, file);
}

export async function submitInquiryAction(formData: FormData): Promise<InquiryResult> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = InquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      error: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const entry: StoredInquiry = {
    ...parsed.data,
    id: newId(),
    createdAt: new Date().toISOString(),
  };

  // Always log first — production hosts (Vercel, Netlify) capture stdout.
  console.log("[inquiry]", entry.id, entry.brand, entry.need, entry.email);

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INQUIRY_TO_EMAIL || "pricelessbuildingcenter@gmail.com";
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || "Price-Less Building <onboarding@resend.dev>";
  let emailSent = false;
  let diskWritten = false;

  if (resendKey) {
    try {
      const subject = `New ${entry.brand === "builders" ? "Builders Corner" : "Four Squared"} inquiry: ${entry.need}`;
      const text = [
        `New inquiry · ${entry.id}`,
        `Brand: ${entry.brand}`,
        `Need: ${entry.need}`,
        ``,
        `Name: ${entry.name}`,
        `Email: ${entry.email}`,
        `Phone: ${entry.phone || "(not provided)"}`,
        ``,
        `Project:`,
        entry.project || "(no project notes)",
        ``,
        `From page: ${entry.source_path || "(unknown)"}`,
        `Submitted: ${entry.createdAt}`,
      ].join("\n");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: entry.email,
          subject,
          text,
        }),
      });
      if (res.ok) {
        emailSent = true;
      } else {
        console.error("[inquiry] resend HTTP", res.status, await res.text().catch(() => ""));
      }
    } catch (err) {
      console.error("[inquiry] resend send error", err);
    }
  }

  // Dev / non-serverless fallback: also persist to disk so we can read
  // them back locally. Safe to ignore failures in serverless environments
  // where the filesystem is read-only.
  if (!resendKey || process.env.NODE_ENV !== "production") {
    try {
      await appendInquiry(entry);
      diskWritten = true;
    } catch (err) {
      // Swallow in prod-like environments. The email path is the contract.
      if (process.env.NODE_ENV !== "production") {
        console.error("[inquiry] disk append failed (non-fatal)", err);
      }
    }
  }

  if (!emailSent && !diskWritten) {
    return {
      ok: false,
      error: "Something went wrong sending your message. Call (715) 848-3855 and we'll take it down by hand.",
    };
  }

  // Make sure any list view that ever shows inquiries (e.g. /admin) gets
  // re-rendered next visit. The source page itself doesn't need invalidation.
  revalidatePath("/admin/inquiries");

  return { ok: true, id: entry.id };
}
