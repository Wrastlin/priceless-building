#!/bin/bash
# Label every .jpg/.jpeg/.png/.webp in the current directory via
# Gemini 3.1 Pro Preview. Outputs manifest.jsonl (one JSON object
# per line) for downstream processing by organize.py. Runs up to
# 8 in parallel.
#
# Usage:
#   GEMINI_API_KEY=... ./label-all.sh
set -euo pipefail
cd "$(dirname "$0")"

if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "GEMINI_API_KEY not set" >&2
  exit 1
fi

: > manifest.jsonl

label_one() {
  local f="$1"
  local out
  out=$(GEMINI_API_KEY="$GEMINI_API_KEY" bash label.sh "$f" 2>/dev/null) || out=""
  if [ -z "$out" ]; then
    out="{\"filename\":\"$(basename "$f")\",\"subject\":\"other\",\"specific\":\"label-failed\",\"best_for\":\"reject\",\"filename_slug\":\"unlabeled-$RANDOM\",\"brand\":\"mixed\",\"quality\":\"low\",\"notes\":\"\"}"
  fi
  echo "$out" | python3 -c "import sys, json; d = json.loads(sys.stdin.read()); print(json.dumps(d))" >> manifest.jsonl
  echo "✓ $(basename "$f")" >&2
}

export -f label_one
export GEMINI_API_KEY

find . -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -print0 \
  | xargs -0 -P 8 -I {} bash -c 'label_one "$@"' _ {}

echo "Done. $(wc -l < manifest.jsonl) labels written." >&2
