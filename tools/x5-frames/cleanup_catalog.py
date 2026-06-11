#!/usr/bin/env python3
"""Local cleanup/QA of the catalog — no API.

The raw distinct-label counts are inflated by phrasing ("white door" vs
"white 6-panel interior door"). This maps every detection to a canonical
PRODUCT TYPE via a keyword taxonomy so we get honest type counts and real
sighting volume per type, normalizes brand casing, dedupes price strings,
and splits the "other" bucket into real merchandise vs room fixtures.
"""

import json
import re
from collections import defaultdict
from pathlib import Path

RAW = Path("footage/x5-walkthrough-2026-06-11/catalog_raw.json")
OUT = Path("footage/x5-walkthrough-2026-06-11/catalog_clean.json")

# canonical product type -> keywords (first match wins, order matters)
TAXONOMY = {
    "doors": [
        ("Bifold door", ["bifold", "bi-fold"]),
        ("Patio / sliding door", ["patio", "sliding"]),
        ("Exterior door", ["exterior", "entry", "steel door", "fiberglass door"]),
        ("Glass-panel door", ["glass panel", "glass door", "lite", "french"]),
        ("Door slab (unfinished)", ["slab"]),
        ("Prehung door", ["prehung", "pre-hung", "pre hung"]),
        ("Door frame / jamb", ["frame", "jamb"]),
        ("Interior door", ["interior", "6-panel", "6 panel", "panel door", "passage", "white door", "wood door"]),
    ],
    "windows": [
        ("Arched / round window", ["arch", "round", "circle"]),
        ("Double-hung window", ["double hung", "double-hung"]),
        ("Casement / vinyl window", ["casement", "vinyl"]),
        ("Wood-framed window", ["wood frame", "wooden", "wood-framed"]),
        ("Window (wrapped/new)", ["wrapped", "plastic"]),
        ("Window unit", ["window"]),
    ],
    "cabinets": [
        ("Wall cabinet", ["wall cabinet", "upper"]),
        ("Base cabinet", ["base cabinet", "base"]),
        ("Pantry / tall cabinet", ["pantry", "tall"]),
        ("Cabinet door / part", ["door", "drawer", "part"]),
        ("Cabinet (assorted)", ["cabinet"]),
    ],
    "vanities": [
        ("Vanity top w/ sink", ["top", "integrated", "sink"]),
        ("Vanity base cabinet", ["base", "cabinet", "vanity"]),
    ],
    "countertops": [
        ("Quartz countertop / sample", ["quartz", "viatera", "bella"]),
        ("Granite / stone countertop", ["granite", "marble", "stone"]),
        ("Laminate countertop", ["laminate"]),
        ("Butcher block / wood top", ["butcher", "wood", "live edge"]),
        ("Countertop (assorted)", ["countertop", "counter"]),
    ],
    "hardware": [
        ("Lockset / door hardware", ["lockset", "lock", "knob", "schlage", "kwikset", "titan", "keylock", "deadbolt", "handle"]),
        ("Railing / handrail", ["railing", "handrail", "rail", "baluster", "bracket"]),
        ("Cabinet pulls / knobs", ["pull", "amerock", "cabinet hardware"]),
        ("Electrical box / parts", ["electrical", "slater", "outlet", "box"]),
        ("Garage door parts", ["garage"]),
        ("Hardware (assorted)", ["hardware", "hinge", "screw", "fastener"]),
    ],
    "lighting": [
        ("Chandelier", ["chandelier", "sputnik"]),
        ("Pendant light", ["pendant"]),
        ("Ceiling fan", ["fan"]),
        ("Vanity / bath light", ["vanity light", "bath"]),
        ("Ceiling / hanging fixture", ["ceiling", "hanging", "flush"]),
        ("Light fixture (assorted)", ["light", "fixture", "lamp"]),
    ],
    "plumbing": [
        ("Vessel sink", ["vessel"]),
        ("Kitchen sink", ["kitchen", "double-bowl", "double bowl"]),
        ("Bathroom sink", ["bathroom", "drop-in", "undermount", "lavatory"]),
        ("Toilet", ["toilet"]),
        ("Faucet / fixture", ["faucet", "delta", "newport", "fixture"]),
        ("Utility / other sink", ["utility", "sink"]),
    ],
    "trim": [
        ("Newel post", ["newel"]),
        ("Baluster / spindle", ["baluster", "spindle"]),
        ("Edge banding / veneer", ["edge banding", "veneer"]),
        ("Trim / molding profile", ["trim", "molding", "board", "plank", "post"]),
    ],
    "molding": [
        ("Base shoe molding", ["base shoe", "shoe"]),
        ("Crown / profile molding", ["crown", "profile"]),
        ("Molding (assorted)", ["molding", "trim", "dowel"]),
    ],
}

FIXTURE_WORDS = ["dumpster", "trash", "bench", "plant", "barrel", "step stool",
                 "tv", "filing cabinet", "bucket", "tree cutout", "bowl",
                 "ladder", "fan ", "broom", "chair", "table", "cart", "sign"]


def canon(cat, label):
    l = label.lower()
    for name, kws in TAXONOMY.get(cat, []):
        if any(k in l for k in kws):
            return name
    return f"{cat} (uncategorized)"


def norm_brand(b):
    return b.strip().title().replace("Jeld-Wen", "Jeld-Wen").replace("Alcoa", "Alcoa")


def clean_prices(prices):
    out = set()
    for p in prices:
        out.add(re.sub(r"\s+", " ", p.replace("\n", " / ")).strip())
    return sorted(out)


def main():
    raw = json.loads(RAW.read_text())
    departments = {}
    for fr in raw:
        for it in fr.get("items", []):
            cat = it.get("category", "other")
            if cat == "other":
                continue
            t = canon(cat, it.get("label", ""))
            d = departments.setdefault(cat, {})
            g = d.setdefault(t, {"sightings": 0, "prices": set(), "brands": set(), "frames": set()})
            g["sightings"] += 1
            if it.get("price_text"):
                g["prices"].add(it["price_text"])
            if it.get("brand"):
                g["brands"].add(norm_brand(it["brand"]))
            g["frames"].add(fr["frame"])

    # triage 'other'
    real_other, fixtures = defaultdict(int), defaultdict(int)
    for fr in raw:
        for it in fr.get("items", []):
            if it.get("category") != "other":
                continue
            l = it.get("label", "").lower()
            if any(w in l for w in FIXTURE_WORDS):
                fixtures[it.get("label")] += 1
            else:
                real_other[it.get("label")] += 1

    clean = {}
    for cat, types in sorted(departments.items()):
        clean[cat] = {
            "product_types": len(types),
            "types": sorted(
                [{"type": t, "sightings": g["sightings"],
                  "prices": clean_prices(g["prices"]),
                  "brands": sorted(g["brands"]),
                  "frames_present": len(g["frames"])}
                 for t, g in types.items()],
                key=lambda x: -x["sightings"]),
        }
    clean["_other_triage"] = {
        "likely_merchandise": sorted(real_other.items(), key=lambda x: -x[1])[:25],
        "fixtures_ignored": sum(fixtures.values()),
    }
    OUT.write_text(json.dumps(clean, indent=1, default=list))

    print(f"saved {OUT}\n")
    for cat in sorted(departments, key=lambda c: -sum(g["sightings"] for g in departments[c].values())):
        print(f"### {cat.upper()}  ({clean[cat]['product_types']} product types)")
        for row in clean[cat]["types"]:
            pr = f"  ${row['prices']}" if row["prices"] else ""
            br = f"  {row['brands']}" if row["brands"] else ""
            print(f"   {row['sightings']:4d}x  {row['type']:30s}{pr}{br}")
        print()


if __name__ == "__main__":
    main()
