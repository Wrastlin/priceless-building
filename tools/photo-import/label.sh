#!/bin/bash
# Label one photo with Gemini 3.1 Pro Preview. Outputs strict JSON.
# Usage:
#   GEMINI_API_KEY=... ./label.sh <photo-path>
#
# Accepts .jpg/.jpeg/.png/.webp. Used by label-all.sh in the same
# directory to batch-label images sitting alongside it.
set -euo pipefail

IMG="$1"

if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "GEMINI_API_KEY not set" >&2
  exit 1
fi

WORK=$(mktemp -d); trap 'rm -rf "$WORK"' EXIT

# Pick mime-type by file extension so .webp / .png images don't get
# mislabeled as JPEG and rejected by the API.
ext="${IMG##*.}"
ext_lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"
case "$ext_lower" in
  jpg|jpeg) mime="image/jpeg" ;;
  png)      mime="image/png" ;;
  webp)     mime="image/webp" ;;
  *)        mime="image/jpeg" ;;
esac

base64 < "$IMG" | tr -d '\n' > "$WORK/img.b64"

python3 - "$IMG" "$WORK/img.b64" "$mime" "$WORK/req.json" <<'PY'
import json, sys, os
img_path, b64_path, mime, out_path = sys.argv[1:]
filename = os.path.basename(img_path)
with open(b64_path) as f:
    img_b64 = f.read().strip()
prompt = f"""You are labeling a photo from a Wausau, WI building-materials business that operates three brands at 825 Washington Street:
- Price-Less Building Center (discount + surplus materials warehouse)
- Builders Corner Cabinetry & Design (custom kitchens, baths, built-ins)
- Four Squared Construction (install crew)

Look at the photo and return STRICT JSON only:
{{
  "filename": "{filename}",
  "subject": "one of: storefront-exterior | warehouse-interior | mural | install-kitchen | install-bath | install-other | product-shot | team-or-staff | community-event | holiday-event | sign | aerial | other",
  "specific": "1-line plain description of what is shown (people, room, product, scene)",
  "best_for": "one of: hero | gallery | timeline-event | review-pair | catalog-tile | brand-card | reject",
  "filename_slug": "kebab-case slug to rename the file to (no extension, descriptive, under 40 chars)",
  "brand": "one of: priceless | builders-corner | four-squared | community | mixed",
  "quality": "one of: hero-grade | good | acceptable | low",
  "notes": "any relevant context for placement decisions, max 120 chars"
}}

Be precise on subject and specific. If the photo is blurry, tiny, or unusable for a public website, set best_for to 'reject'."""
req = {
  "contents": [{
    "parts": [
      {"text": prompt},
      {"inline_data": {"mime_type": mime, "data": img_b64}}
    ]
  }],
  "generationConfig": {
    "temperature": 0.2,
    "response_mime_type": "application/json"
  }
}
with open(out_path, "w") as f:
    json.dump(req, f)
PY

curl -sS \
  -H "Content-Type: application/json" \
  -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=$GEMINI_API_KEY" \
  --data-binary "@$WORK/req.json" \
  | python3 -c "import sys, json; d = json.load(sys.stdin); t = d.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', ''); print(t.strip())"
