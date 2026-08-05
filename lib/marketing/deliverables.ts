/**
 * Deliverables resolver — the item page's live window into the compounding
 * marketing library on disk (`PRICE-LESS DELIVERABLES/`).
 *
 * The library is filed by ASSET TYPE across numbered folders (01 Feed Posts,
 * 03 Textless Plates, 06 Placement Scenes, 07 Masters & Cutouts…), and every
 * deliverable's filename embeds the item's SKU'd slug — that is the only key
 * that ties the scattered pieces back to one product. This module resolves,
 * for a given SKU, every rendered file made for it, grouped by class, so the
 * admin item page can show "everything ready to advertise" in one place.
 *
 * SERVER ONLY. Uses fs; never import into a client component (import the
 * DeliverableGroup TYPE with `import type` only).
 *
 * The library lives OUTSIDE the app (the studio Mac's workspace root, one
 * level up). We read it in place rather than copy it — one canonical location,
 * never overwritten. Override the location with MARKETING_DELIVERABLES_DIR.
 * On a host where the folder isn't mounted (e.g. Vercel), reads return empty
 * and the UI says so; the follow-on is to sync these into a storage bucket
 * so the floor crew sees them off the Mac too.
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

export type DeliverableKind = "image" | "video";

export type DeliverableFile = {
  /** Bare filename, shown as the caption. */
  label: string;
  /** Path relative to the library root (the API route's `f` param). */
  rel: string;
  /** Same-origin URL that streams the file (auth-gated). */
  url: string;
  kind: DeliverableKind;
  bytes: number;
};

export type DeliverableGroup = {
  key: string;
  title: string;
  hint?: string;
  files: DeliverableFile[];
};

export type DeliverableLibrary = {
  groups: DeliverableGroup[];
  total: number;
  /** False when the library folder isn't present on this host. */
  rootExists: boolean;
};

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".m4v", ".webm", ".mov"]);

/** Absolute path to the deliverables library root. */
export function deliverablesRoot(): string {
  const override = process.env.MARKETING_DELIVERABLES_DIR;
  if (override) return path.resolve(override);
  // App cwd is the priceless-building/ project root; the library is a sibling.
  return path.resolve(process.cwd(), "..", "PRICE-LESS DELIVERABLES");
}

/**
 * A library section: one numbered folder, an optional filename filter (folder
 * 07 holds both masters and their cutouts), a display label and hint.
 */
type Section = {
  key: string;
  title: string;
  folder: string;
  include?: (lowerName: string) => boolean;
  hint?: string;
};

const SECTIONS: Section[] = [
  {
    key: "master",
    title: "Studio master",
    folder: "07 Product Masters & Cutouts",
    include: (n) => !n.includes("cutout"),
    hint: "Clean studio shot built from the real photo — the seed everything else grows from.",
  },
  {
    key: "cutout",
    title: "Transparent cutout",
    folder: "07 Product Masters & Cutouts",
    include: (n) => n.includes("cutout"),
    hint: "Background removed (PNG) — drop onto any layout.",
  },
  {
    key: "placement",
    title: "Room placement scenes",
    folder: "06 Placement Scenes",
    hint: "AI-generated room context. Marketing backdrop only — never used as a listing photo.",
  },
  {
    key: "feed",
    title: "Feed post",
    folder: "01 Feed Posts",
    hint: "Ready to post to Instagram / Facebook (4:5), text baked over the room scene.",
  },
  {
    key: "plate",
    title: "Textless plate",
    folder: "03 Textless Plates",
    hint: "Same motion with no text — re-caption in seconds or cut into a longer film.",
  },
  { key: "story", title: "Text story", folder: "02 Text Stories" },
  {
    key: "micro",
    title: "Product micro",
    folder: "04 Product Micros",
    hint: "Vertical 9:16 micro ad.",
  },
  {
    key: "clip",
    title: "Motion clips",
    folder: "12 Motion Clips",
    hint: "Modular product-motion b-roll.",
  },
  { key: "detail", title: "Detail & mood stills", folder: "13 Detail & Mood Stills" },
];

function kindFor(name: string): DeliverableKind | null {
  const ext = path.extname(name).toLowerCase();
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  return null;
}

/**
 * Every rendered deliverable made for this SKU, grouped by class in library
 * order. Match is a case-insensitive substring of the SKU (e.g. "vt-gen-0002")
 * on the filename — every deliverable embeds the SKU'd slug, and 4-digit
 * zero-padded SKUs can't collide as substrings, so this is exact.
 */
export async function listDeliverablesForSku(sku: string): Promise<DeliverableLibrary> {
  const root = deliverablesRoot();
  if (!existsSync(root)) return { groups: [], total: 0, rootExists: false };

  const needle = sku.trim().toLowerCase();
  if (!needle) return { groups: [], total: 0, rootExists: true };

  const groups: DeliverableGroup[] = [];
  let total = 0;

  for (const section of SECTIONS) {
    const dir = path.join(root, section.folder);
    let names: string[];
    try {
      names = await fs.readdir(dir);
    } catch {
      continue; // folder missing on this host — skip quietly
    }

    const files: DeliverableFile[] = [];
    for (const name of names) {
      if (name.startsWith(".")) continue;
      const lower = name.toLowerCase();
      if (!lower.includes(needle)) continue;
      if (section.include && !section.include(lower)) continue;
      const kind = kindFor(name);
      if (!kind) continue;

      const rel = path.join(section.folder, name);
      let bytes = 0;
      try {
        bytes = (await fs.stat(path.join(dir, name))).size;
      } catch {
        /* stat failure is non-fatal; leave bytes 0 */
      }
      files.push({
        label: name,
        rel,
        url: `/api/marketing-asset?f=${encodeURIComponent(rel)}`,
        kind,
        bytes,
      });
    }

    if (files.length) {
      files.sort((a, b) => a.label.localeCompare(b.label));
      groups.push({ key: section.key, title: section.title, hint: section.hint, files });
      total += files.length;
    }
  }

  return { groups, total, rootExists: true };
}
