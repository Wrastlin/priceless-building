#!/usr/bin/env python3
"""Full store catalog from the 716 walkthrough frames.

Stage 1 (vision): every frame -> one Gemini call (one image per call, the
config the bake-off proved; multi-image packing lost 40-65% of items).
Runs in parallel. Each detection keeps its source frame + timestamp so every
catalog row is verifiable back to a moment in the walk. Checkpointed to
catalog_raw.json so a crash never loses completed work.

Stage 2 (consolidate): per department, hand all raw detections to Gemini as
text and let it merge the same physical item seen across multiple frames into
a unique inventory list with a quantity estimate + source frames. Identical-
item clusters (e.g. a row of 5 matching doors) are flagged for a human count
rather than guessed.

Model: gemini-3.1-pro-preview (per CLAUDE.md + accuracy). Reads GEMINI_API_KEY
from env or .env.local.

Usage: python3 catalog_full.py <frames_dir> [--limit N] [--consolidate-only]
"""

import base64
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

MODEL = "gemini-3.5-flash"
EP = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
WORKERS = 12

VISION_PROMPT = """You are cataloging a surplus building-materials store
(Priceless Building / Builders Corner, Wausau WI) from ONE walkthrough frame.
List EVERY distinct sellable item or clearly-stacked lot. STRICT JSON only:

{"items":[{
  "label": str,            // concise product name, e.g. "Shaker base cabinet, white"
  "category": "doors"|"windows"|"cabinets"|"vanities"|"countertops"|"hardware"|"lighting"|"trim"|"molding"|"plumbing"|"other",
  "price_visible": bool,
  "price_text": str,       // exactly as written if legible, else ""
  "brand": str,            // visible branding/vendor sign, else ""
  "qty_estimate": int,
  "confidence": "high"|"medium"|"low"
}],
"vendor_signage": [str]}    // any legible vendor/brand signage in the frame

Only report what is visibly legible. Never invent prices or brands."""

CONSOLIDATE_PROMPT = """These are raw item detections for the "{cat}" department
of a surplus building-materials store, each seen in one frame of a walkthrough
video (the camera moved through the store, so the SAME physical item often
appears in several consecutive frames, and occasionally again later from a
back-and-forth pass).

Merge detections that are the SAME physical item into one entry. Keep genuinely
distinct items separate. For lots of identical items (e.g. a row of matching
doors), set needs_human_count=true rather than guessing an exact number.

Raw detections (JSON):
{detections}

Output STRICT JSON only:
{{"items":[{{
  "label": str,
  "best_price": str,           // most legible price seen, else ""
  "brand": str,
  "qty_estimate": int,
  "needs_human_count": bool,
  "source_frames": [str],      // frame filenames this item appears in
  "confidence": "high"|"medium"|"low"
}}],
"department_summary": str}}"""


def load_key():
    k = os.environ.get("GEMINI_API_KEY")
    if k:
        return k
    for line in (Path(__file__).resolve().parents[2] / ".env.local").read_text().splitlines():
        m = re.match(r"\s*GEMINI_API_KEY\s*=\s*(.+)$", line)
        if m:
            return m.group(1).strip().strip('"').strip("'")
    sys.exit("GEMINI_API_KEY not found")


def gemini(key, parts, retries=3):
    body = {"contents": [{"parts": parts}],
            "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}}
    for attempt in range(retries):
        try:
            r = requests.post(f"{EP}?key={key}", json=body, timeout=180)
            if r.status_code == 429 or r.status_code >= 500:
                time.sleep(2 * (attempt + 1))
                continue
            r.raise_for_status()
            txt = r.json()["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(txt)
        except (requests.RequestException, json.JSONDecodeError, KeyError):
            time.sleep(2 * (attempt + 1))
    return None


def vision_pass(key, frames_dir, out_path, limit=None):
    frames = sorted(Path(frames_dir).glob("*.jpg"))
    if limit:
        frames = frames[:limit]
    done = {}
    if out_path.exists():
        done = {d["frame"]: d for d in json.loads(out_path.read_text())}
    todo = [f for f in frames if f.name not in done]
    print(f"[vision] {len(frames)} frames, {len(done)} already done, {len(todo)} to do", flush=True)

    def work(f):
        ts = re.search(r"_t([\d.]+)s", f.name)
        data = base64.b64encode(f.read_bytes()).decode()
        res = gemini(key, [{"text": VISION_PROMPT},
                           {"inline_data": {"mime_type": "image/jpeg", "data": data}}])
        return {"frame": f.name,
                "t": float(ts.group(1)) if ts else 0.0,
                "items": (res or {}).get("items", []),
                "vendor_signage": (res or {}).get("vendor_signage", []),
                "ok": res is not None}

    results = list(done.values())
    n = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futs = {pool.submit(work, f): f for f in todo}
        for fut in as_completed(futs):
            results.append(fut.result())
            n += 1
            if n % 25 == 0:
                results.sort(key=lambda d: (d["frame"]))
                out_path.write_text(json.dumps(results, indent=1))
                print(f"[vision] {n}/{len(todo)} (checkpoint saved)", flush=True)
    results.sort(key=lambda d: d["frame"])
    out_path.write_text(json.dumps(results, indent=1))
    failed = sum(1 for r in results if not r.get("ok"))
    print(f"[vision] done. {len(results)} frames, {failed} failed", flush=True)
    return results


def consolidate(key, raw, out_path):
    by_cat = {}
    for fr in raw:
        for it in fr.get("items", []):
            cat = it.get("category", "other")
            by_cat.setdefault(cat, []).append(
                {"label": it.get("label"), "price": it.get("price_text", ""),
                 "brand": it.get("brand", ""), "qty": it.get("qty_estimate", 1),
                 "frame": fr["frame"]})
    catalog = {}
    for cat, dets in sorted(by_cat.items()):
        print(f"[consolidate] {cat}: {len(dets)} raw detections", flush=True)
        res = gemini(key, [{"text": CONSOLIDATE_PROMPT.format(
            cat=cat, detections=json.dumps(dets)[:120000])}])
        catalog[cat] = res or {"items": [], "department_summary": "(consolidation failed)"}
    # vendor signage rollup
    vendors = sorted({v.strip() for fr in raw for v in fr.get("vendor_signage", []) if v.strip()})
    out = {"departments": catalog,
           "vendors_seen": vendors,
           "raw_detection_count": sum(len(fr.get("items", [])) for fr in raw),
           "frames_analyzed": len(raw)}
    out_path.write_text(json.dumps(out, indent=2))
    print(f"\n[consolidate] saved {out_path}", flush=True)
    for cat, d in catalog.items():
        items = d.get("items", [])
        print(f"  {cat:12s}: {len(items)} unique items", flush=True)
    print(f"  vendors seen: {', '.join(vendors) if vendors else '(none legible)'}", flush=True)
    return out


def main():
    frames_dir = sys.argv[1]
    limit = None
    if "--limit" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--limit") + 1])
    base = Path(frames_dir).parent
    raw_path = base / "catalog_raw.json"
    cat_path = base / "catalog_by_department.json"
    key = load_key()

    if "--consolidate-only" in sys.argv:
        raw = json.loads(raw_path.read_text())
    else:
        raw = vision_pass(key, frames_dir, raw_path, limit)
    consolidate(key, raw, cat_path)


if __name__ == "__main__":
    main()
