#!/usr/bin/env python3
"""Mechanical clustering of raw detections so they're reviewable (no API).

This does NOT make judgments — it just normalizes labels and groups identical
ones so Claude can read a compact, frequency-ranked view per department and
write the real catalog. Collapses the 4,661 raw sightings into distinct
label-clusters with counts, prices seen, brands, and sample frames.
"""

import json
import re
from collections import defaultdict
from pathlib import Path

RAW = Path("footage/x5-walkthrough-2026-06-11/catalog_raw.json")
OUT = Path("footage/x5-walkthrough-2026-06-11/catalog_grouped.json")

STOP = {"a", "an", "the", "with", "of", "and", "in", "on"}


def norm(label: str) -> str:
    s = label.lower()
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    toks = [t for t in s.split() if t not in STOP]
    # crude singularize
    toks = [t[:-1] if len(t) > 4 and t.endswith("s") else t for t in toks]
    return " ".join(sorted(set(toks)))


def main():
    raw = json.loads(RAW.read_text())
    by_cat = defaultdict(lambda: defaultdict(lambda: {
        "count": 0, "prices": set(), "brands": set(), "frames": [], "labels": set()}))
    for fr in raw:
        for it in fr.get("items", []):
            cat = it.get("category", "other")
            key = norm(it.get("label", ""))
            g = by_cat[cat][key]
            g["count"] += 1
            g["labels"].add(it.get("label", ""))
            if it.get("price_text"):
                g["prices"].add(it["price_text"])
            if it.get("brand"):
                g["brands"].add(it["brand"])
            if len(g["frames"]) < 5:
                g["frames"].append(fr["frame"])

    out = {}
    for cat, groups in by_cat.items():
        rows = []
        for key, g in groups.items():
            rows.append({
                "norm": key,
                "labels": sorted(g["labels"]),
                "count": g["count"],
                "prices": sorted(g["prices"]),
                "brands": sorted(g["brands"]),
                "sample_frames": g["frames"],
            })
        rows.sort(key=lambda r: -r["count"])
        out[cat] = rows

    OUT.write_text(json.dumps(out, indent=1))
    # print a compact human view
    for cat in sorted(out, key=lambda c: -sum(r["count"] for r in out[c])):
        rows = out[cat]
        total = sum(r["count"] for r in rows)
        print(f"\n### {cat.upper()}  ({len(rows)} distinct label-clusters, {total} sightings)")
        for r in rows[:18]:
            pr = f"  prices={r['prices']}" if r["prices"] else ""
            br = f"  brands={r['brands']}" if r["brands"] else ""
            print(f"  [{r['count']:3d}] {r['labels'][0][:48]}{pr}{br}")


if __name__ == "__main__":
    main()
