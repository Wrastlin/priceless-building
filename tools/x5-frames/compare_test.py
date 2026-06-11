#!/usr/bin/env python3
"""Quality/cost/speed bake-off before committing to the full catalog run.

Answers three questions empirically:
  1. Does packing several frames into ONE call lose detail vs one-call-per-frame?
     (runs the same N frames both ways, compares item counts)
  2. How do the 3.x Gemini models compare on items found, price reads, speed, cost?
  3. What does a single individual call actually cost + how long does it take?

NOTE on terminology: Gemini's *Batch API* (the 50%-off tier) is NOT the same as
putting many images in one prompt. In Batch mode every request is still one
image, fully independent, just scheduled within 24h. The detail-loss risk only
exists in multi-image-per-call, which is what test #1 actually probes.

Usage: python3 compare_test.py <frames_dir>
"""

import base64
import json
import os
import random
import re
import sys
import time
from pathlib import Path

import requests

MODELS = {
    "gemini-3.1-pro-preview": (2.00, 12.00),
    "gemini-3-flash-preview": (0.30, 2.50),   # pricing approx; refined from usage below
    "gemini-3.5-flash":        (0.30, 2.50),
}
EP = "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent"

SINGLE_PROMPT = """Catalog this surplus building-materials store frame. List EVERY
distinct sellable item or stacked lot visible. STRICT JSON only:
{"items":[{"label":str,"category":str,"price_visible":bool,"price_text":str,
"brand":str,"qty_estimate":int,"confidence":"high"|"medium"|"low"}]}
Only report visibly legible prices/brands. Do not invent."""

MULTI_PROMPT = """You are given {n} SEPARATE store frames. Catalog each one
independently. Do NOT merge them. STRICT JSON only:
{{"frames":[{{"index":int,"items":[{{"label":str,"category":str,
"price_visible":bool,"price_text":str,"brand":str,"confidence":str}}]}}]}}
index matches the order images were provided (0-based). Only legible prices/brands."""


def load_key():
    k = os.environ.get("GEMINI_API_KEY")
    if k:
        return k
    for line in (Path(__file__).resolve().parents[2] / ".env.local").read_text().splitlines():
        m = re.match(r"\s*GEMINI_API_KEY\s*=\s*(.+)$", line)
        if m:
            return m.group(1).strip().strip('"').strip("'")
    sys.exit("no key")


def b64(p):
    return base64.b64encode(p.read_bytes()).decode()


def call(key, model, parts):
    body = {"contents": [{"parts": parts}],
            "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}}
    t0 = time.perf_counter()
    r = requests.post(EP.format(model) + f"?key={key}", json=body, timeout=180)
    dt = time.perf_counter() - t0
    r.raise_for_status()
    j = r.json()
    u = j.get("usageMetadata", {})
    txt = j["candidates"][0]["content"]["parts"][0]["text"]
    try:
        parsed = json.loads(txt)
    except json.JSONDecodeError:
        parsed = {}
    return parsed, u, dt


def img_part(p):
    return {"inline_data": {"mime_type": "image/jpeg", "data": b64(p)}}


def main():
    key = load_key()
    frames = sorted(Path(sys.argv[1]).glob("*.jpg"))
    rng = random.Random(7)
    # two random sets of 3 frames each for the individual-vs-multi test
    sets = [rng.sample(frames, 3), rng.sample(frames, 3)]

    print("=" * 70)
    print("TEST 1 — individual vs multi-image (same frames), model=gemini-3.1-pro-preview")
    print("=" * 70)
    model = "gemini-3.1-pro-preview"
    for si, fset in enumerate(sets, 1):
        # individual
        indiv_counts, indiv_items = [], []
        for f in fset:
            p, u, dt = call(key, model, [{"text": SINGLE_PROMPT}, img_part(f)])
            items = p.get("items", [])
            indiv_counts.append(len(items))
            indiv_items.append({i.get("label", "?") for i in items})
        # multi (all 3 in one call)
        parts = [{"text": MULTI_PROMPT.format(n=len(fset))}] + [img_part(f) for f in fset]
        p, u, dt = call(key, model, parts)
        multi = {fr.get("index"): fr.get("items", []) for fr in p.get("frames", [])}
        print(f"\n  Set {si}:")
        for idx, f in enumerate(fset):
            mi = multi.get(idx, [])
            mset = {i.get("label", "?") for i in mi}
            lost = indiv_items[idx] - mset
            print(f"    {f.name[:42]}")
            print(f"      individual: {indiv_counts[idx]} items | in-batch: {len(mi)} items"
                  f" | {len(lost)} found solo but missed in batch")

    print("\n" + "=" * 70)
    print("TEST 2 — model bake-off (6 frames each, individual calls)")
    print("=" * 70)
    bake = rng.sample(frames, 6)
    for model in MODELS:
        tin = tout = nitems = npriced = 0.0
        tlat = []
        ok = True
        for f in bake:
            try:
                p, u, dt = call(key, model, [{"text": SINGLE_PROMPT}, img_part(f)])
            except Exception as e:
                print(f"  {model}: ERROR {str(e)[:80]}")
                ok = False
                break
            items = p.get("items", [])
            tin += u.get("promptTokenCount", 0)
            tout += u.get("candidatesTokenCount", 0)
            nitems += len(items)
            npriced += sum(1 for i in items if i.get("price_visible"))
            tlat.append(dt)
        if not ok:
            continue
        nf = len(bake)
        pin, pout = MODELS[model]
        per_frame_cost = (tin / nf * pin + tout / nf * pout) / 1e6
        full = per_frame_cost * 716
        print(f"\n  {model}")
        print(f"    items/frame: {nitems/nf:.1f}   priced/frame: {npriced/nf:.1f}")
        print(f"    tokens/frame: in={tin/nf:.0f} out={tout/nf:.0f}")
        print(f"    latency/frame: {sum(tlat)/len(tlat):.1f}s")
        print(f"    cost: ${per_frame_cost*100:.3f}/100 frames -> ${full:.2f} for all 716")


if __name__ == "__main__":
    main()
