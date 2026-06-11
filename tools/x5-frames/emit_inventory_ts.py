#!/usr/bin/env python3
"""Transform the verified catalog_clean.json into a typed TS data module the
site can import. Honest by construction:

- price ranges are parsed from the literal price strings we READ off tags
  (only clean $NN.NN style values; messy multi-price boards are skipped for
  the range but kept as raw seen-prices),
- "selection" is a breadth descriptor from how many distinct frames a type
  appeared in (NOT a unit count — exact counts need an in-store tally),
- brands are de-duplicated and title-cased.

molding folds into trim; plumbing kept as its own bucket; 'other' dropped.
"""

import json
import re
from pathlib import Path

CLEAN = Path("footage/x5-walkthrough-2026-06-11/catalog_clean.json")
OUT = Path("lib/walkthrough-inventory.ts")

# map our detection categories onto the site's 8 routed departments
CAT_MAP = {"molding": "trim"}
SITE_CATS = ["doors", "windows", "cabinets", "vanities", "countertops",
             "hardware", "lighting", "trim"]

PRICE_RE = re.compile(r"\$?\s*(\d{1,4}(?:\.\d{2})?)")


def parse_prices(price_strings):
    vals = []
    for s in price_strings:
        # skip obviously multi-line / per-foot boards for the numeric range
        if "\n" in s or "/" in s or "FT" in s.upper() or "EACH" in s.upper():
            continue
        m = PRICE_RE.search(s.replace(",", ""))
        if m:
            v = float(m.group(1))
            if 1 <= v <= 5000:
                vals.append(v)
    return vals


def selection(frames_present):
    if frames_present >= 20:
        return "extensive"
    if frames_present >= 8:
        return "good"
    if frames_present >= 3:
        return "limited"
    return "few"


def main():
    clean = json.loads(CLEAN.read_text())
    depts = {}
    for cat, body in clean.items():
        if cat.startswith("_"):
            continue
        target = CAT_MAP.get(cat, cat)
        d = depts.setdefault(target, {"types": [], "brands": set()})
        for t in body.get("types", []):
            if "uncategorized" in t["type"]:
                continue
            prices = parse_prices(t.get("prices", []))
            d["types"].append({
                "name": t["type"],
                "priceLow": round(min(prices)) if prices else None,
                "priceHigh": round(max(prices)) if prices else None,
                "seenPrices": t.get("prices", [])[:6],
                "selection": selection(t.get("frames_present", 0)),
                "brands": sorted(t.get("brands", [])),
            })
            for b in t.get("brands", []):
                d["brands"].add(b)

    all_brands = sorted({b for d in depts.values() for b in d["brands"]})

    lines = [
        "// AUTO-GENERATED from the 2026-06-11 store walkthrough catalog.",
        "// Source: tools/x5-frames/emit_inventory_ts.py — do not hand-edit.",
        "// Prices are real values read off in-store tags; ranges skip messy",
        "// multi-price boards. 'selection' is a breadth signal, not a unit count.",
        "",
        "export interface InventoryType {",
        "  name: string;",
        "  priceLow: number | null;",
        "  priceHigh: number | null;",
        "  seenPrices: string[];",
        '  selection: "extensive" | "good" | "limited" | "few";',
        "  brands: string[];",
        "}",
        "export interface DepartmentInventory {",
        "  types: InventoryType[];",
        "  brands: string[];",
        "}",
        "",
        "export const WALKTHROUGH_INVENTORY: Record<string, DepartmentInventory> = {",
    ]
    for cat in SITE_CATS:
        d = depts.get(cat)
        if not d:
            continue
        d["types"].sort(key=lambda x: (x["priceLow"] is None, -(x["priceHigh"] or 0)))
        lines.append(f"  {cat}: {{")
        lines.append("    types: [")
        for t in d["types"]:
            lines.append("      " + json.dumps(t) + ",")
        lines.append("    ],")
        lines.append("    brands: " + json.dumps(sorted(d["brands"])) + ",")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    lines.append("// Every vendor/brand whose signage or packaging we could read in-store.")
    lines.append("export const VERIFIED_VENDORS: string[] = " + json.dumps(all_brands, indent=0) + ";")
    lines.append("")

    OUT.write_text("\n".join(lines))
    print(f"wrote {OUT}")
    for cat in SITE_CATS:
        d = depts.get(cat)
        if d:
            priced = sum(1 for t in d["types"] if t["priceLow"])
            print(f"  {cat:12s} {len(d['types'])} types, {priced} with price range, {len(d['brands'])} brands")
    print(f"  total verified vendors: {len(all_brands)}")


if __name__ == "__main__":
    main()
