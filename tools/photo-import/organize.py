#!/usr/bin/env python3
"""
Take a Gemini-labeled manifest.jsonl and:
1. Copy each (non-reject) photo into public/real-photos/business/ with
   its descriptive slug name (de-duplicated where slugs collide).
2. Regenerate lib/business-photos.ts so any section of the site can
   filter by subject / brand / quality programmatically.

Re-runnable: if you process a new batch in this directory, it merges
into the existing manifest instead of clobbering it.
"""
import json
import os
import shutil
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = HERE
DEST_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "public", "real-photos", "business"))
MANIFEST_PATH = os.path.normpath(os.path.join(HERE, "..", "..", "lib", "business-photos.ts"))

os.makedirs(DEST_DIR, exist_ok=True)

# Read this batch's labels.
new_entries = []
manifest_jsonl = os.path.join(SRC, "manifest.jsonl")
if os.path.exists(manifest_jsonl):
    with open(manifest_jsonl) as f:
        for line in f:
            if not line.strip():
                continue
            new_entries.append(json.loads(line))

# Pull existing manifest (if any) so re-runs don't clobber prior batches.
existing_photos = []
if os.path.exists(MANIFEST_PATH):
    txt = open(MANIFEST_PATH).read()
    try:
        marker = "export const BUSINESS_PHOTOS: BusinessPhoto[] = "
        start = txt.index(marker) + len(marker)
        end = txt.index(";\n\nexport function photosBySubject", start)
        existing_photos = json.loads(txt[start:end])
    except (ValueError, json.JSONDecodeError):
        existing_photos = []

existing_srcs = {p["src"] for p in existing_photos}

# Build slug counter from existing photos so collisions get clean
# numeric suffixes across batches.
existing_slugs = defaultdict(int)
for p in existing_photos:
    base = os.path.splitext(os.path.basename(p["src"]))[0]
    # Strip trailing -N if present so the base slug counts together.
    parts = base.rsplit("-", 1)
    if len(parts) == 2 and parts[1].isdigit():
        existing_slugs[parts[0]] = max(existing_slugs[parts[0]], int(parts[1]))
    else:
        existing_slugs[base] = max(existing_slugs[base], 1)

added = []
skipped = 0
for e in new_entries:
    if e.get("best_for") == "reject":
        skipped += 1
        continue
    src_filename = e["filename"]
    src_path = os.path.join(SRC, src_filename)
    if not os.path.exists(src_path):
        continue

    base_slug = e["filename_slug"]
    src_ext = os.path.splitext(src_filename)[1].lower()
    if src_ext in (".jpg", ".jpeg"):
        out_ext = ".jpg"
    elif src_ext == ".webp":
        out_ext = ".webp"
    elif src_ext == ".png":
        out_ext = ".png"
    else:
        out_ext = src_ext

    existing_slugs[base_slug] += 1
    n = existing_slugs[base_slug]
    suffix = f"-{n}" if n > 1 else ""
    new_name = f"{base_slug}{suffix}{out_ext}"
    rel_src = f"/real-photos/business/{new_name}"

    if rel_src in existing_srcs:
        continue

    dest_path = os.path.join(DEST_DIR, new_name)
    shutil.copy2(src_path, dest_path)

    added.append({
        "src": rel_src,
        "alt": e["specific"],
        "subject": e["subject"],
        "brand": e["brand"],
        "quality": e["quality"],
        "best_for": e["best_for"],
        "notes": e.get("notes", ""),
    })

# Merge + sort.
combined = existing_photos + added
quality_rank = {"hero-grade": 0, "good": 1, "acceptable": 2, "low": 3}
combined.sort(key=lambda x: (quality_rank.get(x["quality"], 9), x["subject"]))

ts = """/**
 * Real business photos imported from the storefront's Facebook +
 * Instagram archives. Generated from labels produced by Gemini 3.1
 * Pro Preview via tools/photo-import/label-all.sh.
 *
 * Subjects:
 *   storefront-exterior, warehouse-interior, mural, install-kitchen,
 *   install-bath, install-other, product-shot, team-or-staff,
 *   community-event, holiday-event, sign, aerial, other
 *
 * best_for:
 *   hero, gallery, timeline-event, review-pair, catalog-tile, brand-card
 *
 * Use the helpers below to pull a subset for any section of the site
 * instead of hard-coding paths inline.
 */
export interface BusinessPhoto {
  src: string;
  alt: string;
  subject: string;
  brand: string;
  quality: string;
  best_for: string;
  notes: string;
}

export const BUSINESS_PHOTOS: BusinessPhoto[] = """
ts += json.dumps(combined, indent=2)
ts += """;

export function photosBySubject(subject: string): BusinessPhoto[] {
  return BUSINESS_PHOTOS.filter((p) => p.subject === subject);
}

export function photosBy(filter: { subject?: string; best_for?: string; brand?: string }): BusinessPhoto[] {
  return BUSINESS_PHOTOS.filter((p) => {
    if (filter.subject && p.subject !== filter.subject) return false;
    if (filter.best_for && p.best_for !== filter.best_for) return false;
    if (filter.brand && p.brand !== filter.brand) return false;
    return true;
  });
}
"""
with open(MANIFEST_PATH, "w") as f:
    f.write(ts)

print(f"Added {len(added)} new photos ({skipped} rejected).")
print(f"Total in manifest: {len(combined)}")
print(f"Manifest: {MANIFEST_PATH}")

from collections import Counter
print()
print("Subject totals:")
for s, c in Counter(p["subject"] for p in combined).most_common():
    print(f"  {s}: {c}")
