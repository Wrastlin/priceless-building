import "server-only";
import { adminClient, hasServiceRole } from "@/lib/supabase/admin";

/**
 * Item photo persistence — Supabase Storage, not data URLs.
 *
 * The legacy Add Item flow persists photos as base64 data URLs inside the
 * item's `data` jsonb. That bloats every row (each photo is re-downloaded
 * with every list query) and was a contributor to the catalog slowness.
 * The production inventory-capture path stores real files in the public
 * `item-photos` bucket instead and keeps only the public URL on the item.
 *
 * Uploads go through the service-role client (server-only), so no storage
 * RLS policies are needed; the bucket itself is public-read, which is fine
 * because every stored photo is destined for the storefront anyway.
 */

const BUCKET = "item-photos";

/** One-time (per server instance) bucket ensure. Races are harmless: a
 *  concurrent create fails with "already exists" and we carry on. */
let bucketReady: Promise<void> | null = null;

function ensureBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      const supabase = adminClient();
      const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
      if (error && !/already exists/i.test(error.message)) {
        bucketReady = null; // allow a retry on the next call
        throw new Error(`item-photos bucket: ${error.message}`);
      }
    })();
  }
  return bucketReady;
}

const DATA_URL_RE = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/gif": "gif",
};

export function photoStorageConfigured(): boolean {
  return hasServiceRole();
}

export type PhotoUploadTarget = {
  /** Storage object path the client uploads to. */
  path: string;
  /** Single-use token that authorizes the direct upload (no RLS needed). */
  token: string;
  /** Public URL the object will be served from after upload. */
  publicUrl: string;
};

/**
 * Mint per-file signed upload URLs so the BROWSER can push original,
 * full-resolution photos straight into the bucket — bypassing the ~4.5MB
 * serverless request-body limit that made multi-photo phone saves fail. The
 * service-role token is created here (server); the anon browser client uploads
 * to it via uploadToSignedUrl. Returns targets in the same order as `files`.
 */
export async function createPhotoUploadTargets(
  folder: string,
  files: Array<{ contentType: string }>,
): Promise<PhotoUploadTarget[]> {
  if (files.length === 0) return [];
  await ensureBucket();
  const supabase = adminClient();
  const safeFolder = (folder.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 80)) || "misc";

  const targets: PhotoUploadTarget[] = [];
  for (let i = 0; i < files.length; i++) {
    const ext = EXT_BY_MIME[files[i]!.contentType] ?? "jpg";
    const path = `${safeFolder}/${i + 1}.${ext}`;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path, { upsert: true });
    if (error || !data) throw new Error(`sign upload ${i + 1}: ${error?.message ?? "no data"}`);
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    targets.push({ path: data.path, token: data.token, publicUrl: pub.publicUrl });
  }
  return targets;
}

/**
 * Upload one item's photos (as data URLs) under a shared folder and return
 * their public URLs, in order. Throws on the first failed upload — callers
 * decide whether that aborts the save or falls back.
 */
export async function storeItemPhotos(folder: string, dataUrls: string[]): Promise<string[]> {
  if (dataUrls.length === 0) return [];
  await ensureBucket();
  const supabase = adminClient();
  const safeFolder = folder.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const urls: string[] = [];
  for (let i = 0; i < dataUrls.length; i++) {
    const m = DATA_URL_RE.exec(dataUrls[i]!);
    if (!m) throw new Error(`photo ${i + 1}: not a data URL`);
    const mime = m[1]!;
    const ext = EXT_BY_MIME[mime] ?? "jpg";
    const path = `${safeFolder}/${i + 1}.${ext}`;
    const bytes = Buffer.from(m[2]!, "base64");
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: mime,
      upsert: true,
    });
    if (error) throw new Error(`photo ${i + 1} upload: ${error.message}`);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}
