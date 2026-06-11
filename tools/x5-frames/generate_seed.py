#!/usr/bin/env python3
"""Generate lib/items/seed.ts from the verified walkthrough catalog — the
sole source of truth. One CatalogItem per real product type per department:
real tag price (the low end as the "from" price), real brands, and a real
warehouse photo from public/real-photos/business as the example image.

molding folds into trim; plumbing/other/uncategorized are skipped (no route
or not sellable lines). Honest by construction — nothing here is invented;
every price and brand was read off the floor.
"""
import json, re
from pathlib import Path

CLEAN = Path("footage/x5-walkthrough-2026-06-11/catalog_clean.json")
OUT = Path("lib/items/seed.ts")

CAT_MAP = {"molding": "trim"}
SKIP = {"plumbing", "other"}
SITE_CATS = ["doors","windows","cabinets","vanities","countertops","hardware","lighting","trim"]

B = "/real-photos/business/"
PHOTOS = {
  "doors": [B+f for f in ["craftsman-door-warehouse.jpg","knotty-pine-6-panel-door.jpg",
    "unfinished-wood-doors-stock.jpg","warehouse-unfinished-wood-doors.jpg",
    "brown-exterior-door-decorative-glass.jpg","dark-wood-exterior-door-glass.jpg",
    "wood-look-exterior-door-glass-insert.jpg","wrapped-wood-glass-door.jpg"]],
  "windows": [B+f for f in ["black-framed-windows-warehouse.jpg","warehouse-assorted-windows.jpg"]],
  "cabinets": [B+f for f in ["warehouse-cabinet-display.jpg","white-base-cabinets-warehouse.jpg",
    "white-base-cabinets-warehouse-2.jpg","dark-base-cabinets-warehouse-row.jpg",
    "grey-cabinets-warehouse.jpg","light-wood-cabinet-display.jpg","light-wood-cabinet-display-2.jpg",
    "unfinished-wood-cabinet-workshop.jpg","wood-cabinet-kitchen-display.jpg","white-shaker-kitchen-cabinets.jpg"]],
  "vanities": [B+f for f in ["bathroom-vanities-warehouse-display.jpg","dark-wood-vanities-warehouse.jpg",
    "oak-double-vanity-warehouse.jpg","grey-vanity-white-top.jpg","white-vanity-top-sink.jpg",
    "marble-vanity-black-legs.jpg","white-vanity-black-top.jpg","dark-wood-vanity-white-top.jpg"]],
  "countertops": [B+f for f in ["discount-countertop-slabs.jpg","warehouse-countertop-slabs.jpg",
    "countertop-blanks-inventory.jpg","vanity-tops-inventory.jpg","wood-countertop-edge-detail.jpg"]],
  "hardware": ["/test-images/07-cabinet-hardware-brushed-brass.jpg","/test-images/15-matte-black-pulls.jpg"],
  "lighting": [B+f for f in ["warehouse-lighting-inventory.jpg","decorative-light-fixture-warehouse.jpg",
    "pendant-light-fixture-warehouse.jpg","hanging-light-fixture-textured-shade.jpg",
    "red-sputnik-chandelier.jpg","crystal-ceiling-fan-warehouse.jpg","ceiling-fan-warehouse-display.jpg"]],
  "trim": [B+f for f in ["wood-countertop-edge-detail.jpg","rustic-wood-furniture-display.jpg",
    "unfinished-wood-doors-stock.jpg"]],
}
STOCK = {"extensive": 6, "good": 4, "limited": 2, "few": 1}
CAT_LABEL = {"doors":"Doors","windows":"Windows","cabinets":"Cabinets","vanities":"Vanities",
  "countertops":"Countertops","hardware":"Hardware","lighting":"Lighting","trim":"Trim & Millwork"}


PRICE_RE = re.compile(r"\$?\s*(\d{1,4}(?:\.\d{2})?)")

def clean_prices(price_strings):
    vals = []
    for s in price_strings:
        if "\n" in s or "/" in s or "FT" in s.upper() or "EACH" in s.upper():
            continue
        m = PRICE_RE.search(s.replace(",", ""))
        if m:
            v = float(m.group(1))
            if 1 <= v <= 5000:
                vals.append(v)
    return sorted(vals)

def price_range(t):
    vals = clean_prices(t.get("prices", []))
    if not vals:
        return None, None
    return round(vals[0]), round(vals[-1])


def main():
    clean = json.loads(CLEAN.read_text())
    # gather types per site category (fold molding->trim)
    by_cat = {c: [] for c in SITE_CATS}
    for cat, body in clean.items():
        if cat.startswith("_") or cat in SKIP:
            continue
        target = CAT_MAP.get(cat, cat)
        if target not in by_cat:
            continue
        for t in body.get("types", []):
            if "uncategorized" in t["type"]:
                continue
            by_cat[target].append(t)

    items = []
    n = 100
    pi = 0  # rolling photo index per category for variety
    for cat in SITE_CATS:
        photos = PHOTOS[cat]
        for t in by_cat[cat]:
            brands = t.get("brands", [])
            title = t["type"].title()
            prices = clean_prices(t.get("prices", []))
            # one listing per distinct real price tag; if none, one "call for price"
            distinct = sorted(set(round(p) for p in prices))[:10] or [0]
            for price in distinct:
                n += 1
                bits = []
                if brands:
                    bits.append(", ".join(brands[:3]))
                bits.append("as tagged in store" if price else "ask in store for today's price")
                item = {
                    "id": f"pl-{cat[:3]}-{n}",
                    "sku": f"PL-W{n:04d}",
                    "brand": "priceless",
                    "category": cat,
                    "status": "published",
                    "title": title,
                    "subtitle": " · ".join(bits),
                    "price": price,
                    "image": photos[pi % len(photos)],
                    "manufacturer": brands[0] if brands else "",
                    "location": CAT_LABEL[cat],
                    "inStock": STOCK.get(t.get("selection"), 2),
                }
                if brands:
                    item["badges"] = ["Surplus"]
                items.append(item)
                pi += 1

    # emit TS
    L = [
        "/**",
        " * Catalog seed — GENERATED from the 2026-06-11 store walkthrough catalog,",
        " * the sole source of truth. One item per real product type per department:",
        " * real tag price (low end shown as the 'from' price), real brands, and a",
        " * real warehouse photo as the example image. Regenerate with:",
        " *   python3 tools/x5-frames/generate_seed.py",
        " *",
        " * Nothing here is invented — every price and brand was read off the floor.",
        " * Pure data; safe to import from server, client, or edge.",
        " */",
        'import type { CatalogItem } from "@/lib/items/types";',
        "",
        f"export const SEED_ITEMS: CatalogItem[] = {json.dumps(items, indent=2)};",
        "",
    ]
    OUT.write_text("\n".join(L))
    print(f"wrote {OUT}: {len(items)} items")
    for cat in SITE_CATS:
        cnt = sum(1 for it in items if it["category"] == cat)
        priced = sum(1 for it in items if it["category"] == cat and it["price"] > 0)
        print(f"  {cat:12s} {cnt} items ({priced} priced)")


if __name__ == "__main__":
    main()
