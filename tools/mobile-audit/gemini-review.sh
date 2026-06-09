#!/bin/bash
# Send a mobile screenshot + page source to Gemini 3.1 Pro Preview for
# a structured UI/UX critique. Outputs JSON to stdout.
#
# Usage: ./gemini-review.sh <page-name> <screenshot-path> <source-path>
set -euo pipefail

PAGE="$1"
SHOT="$2"
SOURCE="$3"

if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "GEMINI_API_KEY not set. Pass it inline: GEMINI_API_KEY=... ./gemini-review.sh ..." >&2
  exit 1
fi

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

base64 < "$SHOT" | tr -d '\n' > "$WORK/img.b64"
head -c 80000 "$SOURCE" > "$WORK/source.txt"

PROMPT_HEAD="You are a senior mobile UI/UX designer reviewing a small-business website (Price-Less Building Center in Wausau, WI — discount + surplus building materials, plus Builders Corner custom cabinetry and Four Squared install crew). Audience leans older (50+).

The screenshot is the /${PAGE} page rendered at a 390x844 mobile viewport (iPhone 14 Pro). The page source follows after the image.

Identify the top mobile UX issues that hurt readability, trust, scanability, tap-target size, or visual hierarchy. Focus on what an OLDER customer would struggle with first.

STRICT JSON OUTPUT ONLY:
{
  \"page\": \"${PAGE}\",
  \"top_issues\": [
    { \"severity\": \"critical|major|minor\", \"area\": \"short label\", \"issue\": \"plain-English description\", \"fix\": \"specific concrete change a developer can make in 1-2 sentences\" }
  ],
  \"strengths\": [\"...\"],
  \"overall_score\": 1
}

overall_score is 1-10 for mobile UX quality.

Page source (truncated):
\`\`\`tsx
"
PROMPT_TAIL="
\`\`\`
"

# Build the request JSON safely. Use Python because jq + bash arg list
# can't take megabytes of base64.
python3 - "$PAGE" "$WORK/img.b64" "$WORK/source.txt" "$WORK/req.json" <<'PY'
import base64, json, sys
page, img_path, src_path, out_path = sys.argv[1:]
with open(img_path) as f:
    img_b64 = f.read().strip()
with open(src_path) as f:
    source = f.read()
prompt = f"""You are a senior mobile UI/UX designer reviewing a small-business website (Price-Less Building Center in Wausau, WI — discount + surplus building materials, plus Builders Corner custom cabinetry and Four Squared install crew). Audience leans older (50+).

The screenshot is the /{page} page rendered at a 390x844 mobile viewport (iPhone 14 Pro). The page source follows after the image.

Identify the top mobile UX issues that hurt readability, trust, scanability, tap-target size, or visual hierarchy. Focus on what an OLDER customer would struggle with first.

STRICT JSON OUTPUT ONLY:
{{
  "page": "{page}",
  "top_issues": [
    {{ "severity": "critical|major|minor", "area": "short label", "issue": "plain-English description", "fix": "specific concrete change a developer can make in 1-2 sentences" }}
  ],
  "strengths": ["..."],
  "overall_score": 1
}}

overall_score is 1-10 for mobile UX quality.

Page source (truncated):
```tsx
{source}
```
"""
req = {
  "contents": [{
    "parts": [
      {"text": prompt},
      {"inline_data": {"mime_type": "image/png", "data": img_b64}}
    ]
  }],
  "generationConfig": {
    "temperature": 0.4,
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
  | python3 -c "import sys, json; d = json.load(sys.stdin); print(d.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', json.dumps(d.get('error', d), indent=2)))"
