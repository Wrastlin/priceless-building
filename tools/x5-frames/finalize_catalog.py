#!/usr/bin/env python3
"""Write the clean department catalog from the grouped clusters (no API).

Collapses obvious dup clusters, keeps every legible price/brand, and turns
raw sighting counts into a conservative presence signal. Identical-item lots
(high sighting count, generic label like "wood cabinet") are flagged for a
human count rather than asserting an exact quantity.
"""

import json
from pathlib import Path

GROUPED = Path("footage/x5-walkthrough-2026-06-11/catalog_grouped.json")
RAW = Path("footage/x5-walkthrough-2026-06-11/catalog_raw.json")
OUT = Path("footage/x5-walkthrough-2026-06-11/catalog_by_department.json")


def main():
    grouped = json.loads(GROUPED.read_text())
    raw = json.loads(RAW.read_text())

    vendors = sorted({v.strip() for fr in raw for v in fr.get("vendor_signage", [])
                      if v.strip() and len(v.strip()) > 2 and not v.strip().isdigit()})

    departments = {}
    for cat, rows in grouped.items():
        items = []
        for r in rows:
            items.append({
                "label": r["labels"][0],
                "alt_labels": r["labels"][1:6],
                "sightings": r["count"],
                "prices_seen": r["prices"],
                "brands": r["brands"],
                "sample_frames": r["sample_frames"],
                "flag": "identical-lot: human count" if r["count"] >= 10 else "",
            })
        priced = [i for i in items if i["prices_seen"]]
        departments[cat] = {
            "distinct_items": len(items),
            "total_sightings": sum(i["sightings"] for i in items),
            "items_with_legible_price": len(priced),
            "items": items,
        }

    out = {
        "store": "Priceless Building Center / Builder's Corner, Wausau WI",
        "source": "Insta360 X5 walkthrough 2026-06-11, 716 frames, gemini vision",
        "frames_analyzed": len(raw),
        "frames_ok": sum(1 for f in raw if f.get("ok")),
        "total_raw_detections": sum(len(f.get("items", [])) for f in raw),
        "departments": departments,
        "vendors_seen": vendors,
    }
    OUT.write_text(json.dumps(out, indent=1))

    order = sorted(departments, key=lambda c: -departments[c]["total_sightings"])
    print(f"saved {OUT}")
    print(f"{'dept':14s}{'distinct':>9}{'sightings':>10}{'priced':>8}")
    for c in order:
        d = departments[c]
        print(f"{c:14s}{d['distinct_items']:>9}{d['total_sightings']:>10}"
              f"{d['items_with_legible_price']:>8}")
    print(f"\nvendors captured: {len(vendors)}")


if __name__ == "__main__":
    main()
