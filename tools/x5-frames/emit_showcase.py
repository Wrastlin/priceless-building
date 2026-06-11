#!/usr/bin/env python3
"""Build lib/store-showcase.ts — a scale-forward map of WHAT'S IN THE STORE,
grounded in the walkthrough frames. Not product listings: collections with
honest depth ("hundreds of cabinet knobs", "a wall of balusters").

Method: map every raw detection to a fine-grained collection, sum the
per-frame qty_estimates, and divide by 4 to de-overlap (each rack is seen in
~4 frames as you walk). That estimate runs CONSERVATIVE vs. the true floor
count, then we round DOWN to a clean "N+" so we never overclaim.
"""
import json, re
from collections import defaultdict
from pathlib import Path

RAW = Path("footage/x5-walkthrough-2026-06-11/catalog_raw.json")
OUT = Path("lib/store-showcase.ts")

# fine-grained collections: (department, collection name, keywords, unit kind)
COLLECTIONS = [
  ("Doors", "Interior door slabs", ["slab","interior door","6-panel","panel door"], "doors"),
  ("Doors", "Pre-hung doors", ["prehung","pre-hung","pre hung"], "doors"),
  ("Doors", "Exterior & entry doors", ["exterior","entry","steel door","fiberglass"], "doors"),
  ("Doors", "Glass-panel & French doors", ["glass panel","glass door","lite","french"], "doors"),
  ("Doors", "Bifold doors", ["bifold","bi-fold"], "doors"),
  ("Doors", "Patio & sliding doors", ["patio","sliding"], "doors"),
  ("Windows", "Double-hung windows", ["double hung","double-hung"], "windows"),
  ("Windows", "Casement & vinyl windows", ["casement","vinyl window","vinyl"], "windows"),
  ("Windows", "Wood-framed windows", ["wood frame","wooden window","wood-framed"], "windows"),
  ("Windows", "Arched & specialty windows", ["arch","round window","specialty"], "windows"),
  ("Cabinets", "Base cabinets", ["base cabinet"], "cabinets"),
  ("Cabinets", "Wall & upper cabinets", ["wall cabinet","upper cabinet"], "cabinets"),
  ("Cabinets", "Pantry & tall cabinets", ["pantry","tall cabinet"], "cabinets"),
  ("Cabinets", "Cabinet doors & parts", ["cabinet door","cabinet part","drawer front"], "cabinets"),
  ("Vanities", "Bathroom vanities", ["vanity"], "vanities"),
  ("Countertops", "Quartz & granite tops", ["quartz","granite","viatera","bella","stone"], "slabs"),
  ("Countertops", "Laminate & butcher block", ["laminate","butcher","wood top"], "slabs"),
  ("Hardware", "Cabinet knobs & pulls", ["pull","knob","amerock"], "pieces"),
  ("Hardware", "Locksets & door hardware", ["lockset","lock","schlage","kwikset","titan","deadbolt","keylock","weslock","handle"], "pieces"),
  ("Hardware", "Hinges & specialty hardware", ["hinge","soss","ives"], "pieces"),
  ("Hardware", "Electrical boxes & supplies", ["electrical","slater","outlet","leviton"], "pieces"),
  ("Hardware", "Garage door parts", ["garage"], "pieces"),
  ("Railing", "Balusters & spindles", ["baluster","spindle"], "pieces"),
  ("Railing", "Newel posts", ["newel"], "posts"),
  ("Railing", "Handrail & brackets", ["handrail","rail bracket","railing","afco","trex"], "pieces"),
  ("Trim & Molding", "Base shoe & molding", ["base shoe","shoe molding","molding","casing"], "feet"),
  ("Trim & Molding", "Trim & profiles", ["trim","profile"], "pieces"),
  ("Trim & Molding", "Edge banding & veneer", ["edge banding","veneer"], "rolls"),
  ("Lighting", "Chandeliers & pendants", ["chandelier","pendant","sputnik"], "fixtures"),
  ("Lighting", "Ceiling fans", ["fan"], "fixtures"),
  ("Lighting", "Vanity & ceiling fixtures", ["vanity light","ceiling light","flush","sconce"], "fixtures"),
  ("Sinks & Plumbing", "Vessel sinks", ["vessel"], "sinks"),
  ("Sinks & Plumbing", "Kitchen & bath sinks", ["kitchen sink","bathroom sink","double-bowl","drop-in","lavatory"], "sinks"),
  ("Sinks & Plumbing", "Toilets & fixtures", ["toilet","faucet","newport","delta","kohler"], "pieces"),
  ("Paint & Supplies", "Paint & stain", ["paint","stain","valspar","minwax","rust-oleum","superdeck"], "cans"),
]

def scale(u, kind):
    """(tier word, conservative 'N+' string). Rounds DOWN to stay honest."""
    if kind == "feet":
        if u >= 1000: return ("Thousands of feet", "")
        if u >= 300: return ("Hundreds of feet", "")
        return ("By the foot", "")
    if u >= 400: return ("A full wall", f"{u//100*100}+")
    if u >= 150: return ("Hundreds", f"{u//50*50}+")
    if u >= 60:  return ("Dozens", f"{u//25*25}+")
    if u >= 20:  return ("Stocked deep", f"{u//10*10}+")
    if u >= 5:   return ("In stock", "")
    return ("", "")  # too few — skip

def main():
    raw = json.loads(RAW.read_text())
    agg = defaultdict(lambda: {"q": 0, "frames": set(), "brands": set()})
    for fr in raw:
        for it in fr.get("items", []):
            l = it.get("label", "").lower(); q = it.get("qty_estimate", 1)
            for dept, name, kws, kind in COLLECTIONS:
                if any(k in l for k in kws):
                    key = (dept, name, kind)
                    agg[key]["q"] += q
                    agg[key]["frames"].add(fr["frame"])
                    if it.get("brand"):
                        agg[key]["brands"].add(it["brand"].strip().title())
                    break

    depts = defaultdict(list)
    for (dept, name, kind), a in agg.items():
        units = a["q"] // 4
        tier, approx = scale(units, kind)
        if not tier:
            continue
        depts[dept].append({
            "name": name, "tier": tier, "approx": approx, "kind": kind,
            "brands": sorted(a["brands"])[:6],
        })

    # order departments by total estimated depth
    order = sorted(depts, key=lambda d: -sum(
        (1000 if c["tier"].startswith(("A full","Thousands")) else
         300 if c["tier"].startswith("Hundreds") else
         60 if c["tier"]=="Dozens" else 20) for c in depts[d]))
    out = {d: sorted(depts[d], key=lambda c: -len(c["approx"])) for d in order}

    L = [
        "// AUTO-GENERATED by tools/x5-frames/emit_showcase.py from the store",
        "// walkthrough. Shows WHAT'S ON THE FLOOR at honest, conservative scale —",
        "// not product listings. Depth estimates are de-overlapped and rounded down.",
        "",
        "export interface Collection {",
        "  name: string;",
        '  tier: string;     // "A full wall" | "Hundreds" | "Dozens" | ...',
        '  approx: string;   // conservative "N+" or "" ',
        "  kind: string;",
        "  brands: string[];",
        "}",
        "export const STORE_SHOWCASE: Record<string, Collection[]> = " + json.dumps(out, indent=1) + ";",
        "",
        "export const SHOWCASE_DEPARTMENTS = " + json.dumps(list(out.keys())) + ";",
        "",
    ]
    OUT.write_text("\n".join(L))
    print(f"wrote {OUT}: {sum(len(v) for v in out.values())} collections in {len(out)} departments")
    for d in out:
        print(f"  {d}:")
        for c in out[d]:
            print(f"     {c['tier']:18} {c['approx']:6} {c['name']}")

if __name__ == "__main__":
    main()
