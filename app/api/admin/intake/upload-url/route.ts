// POST /api/admin/intake/upload-url
//   body: { folder: string, files: [{ contentType: string }] }
//   200:  { targets: [{ path, token, publicUrl }] }
//
// Mints per-file signed upload URLs so the browser can push original,
// full-resolution photos straight into the item-photos bucket, bypassing the
// ~4.5MB serverless body limit. Admin-gated (404 on miss, matching the other
// intake routes). The client uploads to each target via uploadToSignedUrl,
// then saves the returned publicUrls on the item — no base64 ever transits
// the API.

import { NextResponse, type NextRequest } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";
import { createPhotoUploadTargets, photoStorageConfigured } from "@/lib/items/photos";

export const runtime = "nodejs";

const IMAGE_CT = /^image\/(jpeg|png|webp|heic|heif|gif|avif)$/i;
const MAX_FILES = 12;

export async function POST(req: NextRequest) {
  if (!(await hasAdminSession())) {
    return new NextResponse(null, { status: 404 });
  }
  if (!photoStorageConfigured()) {
    return NextResponse.json(
      { error: "Photo storage not configured (SUPABASE_SERVICE_ROLE_KEY missing)." },
      { status: 503 },
    );
  }

  let body: { folder?: unknown; files?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const folder = typeof body.folder === "string" ? body.folder : "";
  const filesIn = Array.isArray(body.files) ? body.files : [];
  if (!folder || filesIn.length === 0) {
    return NextResponse.json({ error: "folder and files required" }, { status: 400 });
  }
  if (filesIn.length > MAX_FILES) {
    return NextResponse.json({ error: `Too many files (max ${MAX_FILES}).` }, { status: 400 });
  }

  const files = filesIn.map((f) => ({
    contentType: String((f as { contentType?: unknown })?.contentType || "image/jpeg"),
  }));
  for (const f of files) {
    if (!IMAGE_CT.test(f.contentType)) {
      return NextResponse.json({ error: `Unsupported type: ${f.contentType}` }, { status: 415 });
    }
  }

  try {
    const targets = await createPhotoUploadTargets(folder, files);
    return NextResponse.json({ targets });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not create upload URLs" },
      { status: 500 },
    );
  }
}
