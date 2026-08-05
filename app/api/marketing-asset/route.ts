// GET /api/marketing-asset?f=<relative path within the deliverables library>
//
// Streams one file from the on-disk marketing library (PRICE-LESS
// DELIVERABLES/) so the admin item page can show every rendered deliverable
// for an item inline. Admin-gated (not public). The item page builds the `f`
// values from listDeliverablesForSku, so they are always library-relative.
//
// Security: resolve `f` against the library root and refuse anything that
// escapes it (path traversal), and only serve known image/video extensions.
// Supports HTTP range requests so <video> scrubs and plays in Safari.

import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { deliverablesRoot } from "@/lib/marketing/deliverables";
import { requireAdminSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rel = req.nextUrl.searchParams.get("f");
  if (!rel) return NextResponse.json({ error: "Missing f" }, { status: 400 });

  const root = deliverablesRoot();
  const resolved = path.resolve(root, rel);
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return NextResponse.json({ error: "Unsupported type" }, { status: 415 });

  let size: number;
  try {
    const stat = await fs.stat(resolved);
    if (!stat.isFile()) throw new Error("not a file");
    size = stat.size;
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const baseHeaders: Record<string, string> = {
    "Content-Type": mime,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=300",
  };

  const buf = await fs.readFile(resolved);
  const range = req.headers.get("range");
  const match = range ? /^bytes=(\d*)-(\d*)$/.exec(range) : null;

  if (match) {
    let start = match[1] ? parseInt(match[1], 10) : 0;
    let end = match[2] ? parseInt(match[2], 10) : size - 1;
    if (Number.isNaN(start)) start = 0;
    if (Number.isNaN(end) || end >= size) end = size - 1;
    if (start > end || start >= size) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    const chunk = buf.subarray(start, end + 1);
    return new NextResponse(chunk as unknown as BodyInit, {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(chunk.byteLength),
      },
    });
  }

  return new NextResponse(buf as unknown as BodyInit, {
    status: 200,
    headers: { ...baseHeaders, "Content-Length": String(size) },
  });
}
