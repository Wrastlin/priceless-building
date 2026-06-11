#!/usr/bin/env python3
"""Pilot: run the store-cataloging vision pass on a handful of frames to
measure real token usage and cost before committing to all 716.

Reads GEMINI_API_KEY from the environment or .env.local. Sends each frame
at media_resolution_high (1120 tokens/image) so Gemini actually ingests
detail instead of silently downsampling. Prints detected items + the exact
token counts Gemini reports back.

Usage: python3 catalog_pilot.py <frames_dir> [n]
"""

import base64
import json
import os
import re
import sys
from pathlib import Path

import requests

MODEL = "gemini-3.1-pro-preview"
ENDPOINT = (f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{MODEL}:generateContent")


def load_key() -> str:
    k = os.environ.get("GEMINI_API_KEY")
    if k:
        return k
    envf = Path(__file__).resolve().parents[2] / ".env.local"
    if envf.exists():
        for line in envf.read_text().splitlines():
            m = re.match(r"\s*GEMINI_API_KEY\s*=\s*(.+)\s*$", line)
            if m:
                return m.group(1).strip().strip('"').strip("'")
    sys.exit("GEMINI_API_KEY not found in env or .env.local")


PROMPT = """You are cataloging a surplus building-materials store from a single
walkthrough video frame (Priceless Building / Builders Corner, Wausau WI).

List EVERY distinct sellable item or clearly-stacked lot of items you can see
in this frame. For each, output an object. Output STRICT JSON only:

{
  "items": [
    {
      "label": string,          // short product name, e.g. "Shaker base cabinet, white"
      "category": "doors"|"windows"|"cabinets"|"vanities"|"countertops"|"hardware"|"lighting"|"trim"|"plumbing"|"other",
      "price_visible": boolean,  // is a price tag/sign legible for THIS item?
      "price_text": string,      // exactly as written if visible, else ""
      "brand": string,           // visible branding/vendor sign, else ""
      "qty_estimate": integer,   // how many of this item are visible (1 if single)
      "position": string,        // rough location in frame: "left shelf", "center floor", "right rack high", etc.
      "confidence": "high"|"medium"|"low"
    }
  ],
  "readable_text": [string]      // any other legible signage/labels not tied to one item
}

Do not invent prices or brands. Only report what is visibly legible."""


def catalog(key: str, img_path: Path) -> dict:
    data = base64.b64encode(img_path.read_bytes()).decode()
    body = {
        "contents": [{
            "parts": [
                {"text": PROMPT},
                {"inline_data": {"mime_type": "image/jpeg", "data": data}},
            ],
        }],
        "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"},
    }
    r = requests.post(f"{ENDPOINT}?key={key}", json=body, timeout=120)
    r.raise_for_status()
    j = r.json()
    usage = j.get("usageMetadata", {})
    txt = j["candidates"][0]["content"]["parts"][0]["text"]
    try:
        parsed = json.loads(txt)
    except json.JSONDecodeError:
        parsed = {"items": [], "readable_text": [], "_raw": txt[:500]}
    return {"usage": usage, "parsed": parsed}


def main():
    frames_dir = Path(sys.argv[1])
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    key = load_key()
    frames = sorted(frames_dir.glob("*.jpg"))
    # spread the sample across the whole walk, not just the start
    step = max(1, len(frames) // n)
    sample = frames[::step][:n]

    tot_in = tot_out = tot_items = 0
    IN_PRICE, OUT_PRICE = 2.00 / 1e6, 12.00 / 1e6  # interactive tier
    print(f"model={MODEL}  sampling {len(sample)} of {len(frames)} frames\n")
    for f in sample:
        try:
            res = catalog(key, f)
        except Exception as e:
            print(f"  {f.name}: ERROR {e}")
            continue
        u = res["usage"]
        items = res["parsed"].get("items", [])
        pin = u.get("promptTokenCount", 0)
        pout = u.get("candidatesTokenCount", 0)
        tot_in += pin
        tot_out += pout
        tot_items += len(items)
        priced = sum(1 for i in items if i.get("price_visible"))
        print(f"  {f.name}: {len(items)} items ({priced} priced)  "
              f"in={pin} out={pout}")
        for i in items[:4]:
            pr = f" [{i.get('price_text')}]" if i.get("price_visible") else ""
            print(f"      - {i.get('label','?')}{pr}  ({i.get('confidence')})")

    nsamp = len(sample)
    avg_in, avg_out = tot_in / nsamp, tot_out / nsamp
    cost_sample = tot_in * IN_PRICE + tot_out * OUT_PRICE
    full = 716
    proj_interactive = (avg_in * full * IN_PRICE) + (avg_out * full * OUT_PRICE)
    print(f"\n--- measured ---")
    print(f"avg tokens/frame: in={avg_in:.0f} out={avg_out:.0f}")
    print(f"avg items/frame: {tot_items / nsamp:.1f}")
    print(f"this sample cost: ${cost_sample:.4f}")
    print(f"projected all {full} frames (interactive): ${proj_interactive:.2f}")
    print(f"projected all {full} frames (batch -50%):  ${proj_interactive/2:.2f}")


if __name__ == "__main__":
    main()
