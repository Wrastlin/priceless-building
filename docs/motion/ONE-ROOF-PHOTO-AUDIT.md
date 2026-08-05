# One Roof — Photo Inventory Audit

**Date:** 2026-07-22  
**North star:** `docs/motion/ONE-ROOF-CREATIVE-NORTH-STAR.md`  
**Sources scanned:**
- `public/real-photos/` (recursive)
- `motion-remotion/public/one-roof/` (recursive)

**Method:** PIL dimensions for every image file (`.jpg` / `.jpeg` / `.png` / `.webp` / `.gif`).  
**Hero SKIP rule:** long edge `< 800px` → do not use as a primary plate / hero / slam frame.

---

## Counts

| Bucket | Files | ≥800 long edge | SKIP (&lt;800) |
|--------|------:|---------------:|--------------:|
| `public/real-photos/` total | 722 | 295 | 427 |
| → `business/` | 143 | 138 | 5 |
| → `foursquared/` | 14 | 14 | 0 |
| → `legacy/` | 45 | **0** | **45** |
| → root-level | 43 | 15 | 28 |
| → `_inbox/` | 477 | 128 | 349 |
| `motion-remotion/public/one-roof/` | 18 | 15 | 3 |
| **Grand total** | **740** | **310** | **430** |

**Usable marketing pool** (real-photos only, long edge ≥800, excludes `_inbox`, flyers, logos, people/portraits, community flyers): **151 plates**.

### Category guess (usable pool of 151)

| Category | Count |
|----------|------:|
| bath/vanity | 46 |
| kitchen/cabinets | 25 |
| doors | 18 |
| lighting | 10 |
| countertops | 9 |
| other / misc | 8 |
| windows | 7 |
| paint | 6 |
| trim/millwork | 5 |
| outdoor (pergola) | 5 |
| warehouse / aisle misc | 4 |
| exterior/storefront | 3 |
| mural | 2 |
| hardware | 2 |
| flooring | 1 |

---

## Critical findings (for silent / collage cuts)

1. **`legacy/` is entirely SKIP for hero use.** All 45 files are Facebook-thumb size (~223×160–373). CURATED.md still rates many ★★★ — treat those ratings as *subject* quality, not *pixel* quality, until a hi-res re-export lands. Do **not** slam `legacy/install-*` or `legacy/store-interior-*` into 9:16 MG.
2. **Place punch is thin at usable res.** Best: `mural-wide.webp` (2048×874). Storefront brick sign, santa, mural-from-field, mural-detail are all SKIP. `building-exterior.webp` is only 640×1138 (passes long-edge rule but soft for a punch open).
3. **July 2026 floor shoot (`business/floor-*`, 43 plates @ ~1200–1600)** is the real rhythmic spine for Version A / C.
4. **Finished “home context” slam plates** that are actually sharp: `foursquared/*` kitchens + pergolas, `builders-corner-hero.jpg`, a handful of `business/*kitchen*` / vanity installs (~1242 long). Door *install* lifestyle is missing at hero res (legacy door installs are thumbs).
5. **`one-roof/` curated copies:** 15 OK, **3 SKIP** that should not be used as-is:
   - `A/storefront-sign-on-brick.webp` (223×373)
   - `D/install-kitchen-walnut-island-windows.webp` (223×160)
   - `E/logo-official@2x.webp` (640×640) — logo chrome OK at close, not a photo plate

---

## Inventory notes by folder (practical)

### `business/` — primary library (138 usable)

Dominant res: **1536×2048 / 2048×1536** (phone) and **1200×1600 / 1600×1200** (floor shoot). Strong across doors, windows, vanities, lighting, cabinets, paint, trim.

### `foursquared/` — finished-room heroes (14/14 usable)

All ≥1080 long edge. Best lifestyle slam set for Door MG home contexts and late collage “cool finished work.”

### `legacy/` — SKIP bank (0 usable)

Needs Meta/Google original export before any silent volume or slam uses these subjects.

### Root `real-photos/`

Keep for brand: `mural-wide.webp`, `builders-corner-hero.jpg`. Skip flyers, hours, portraits, most logos for photo plates (logos belong on void lockups only).

### `_inbox/`

128 files ≥800 (mostly raw FB/IG IDs + contact sheets). Not curated into named plates; prefer promoted `business/` / `foursquared/` copies. Do not pull anonymous `fb-*` into cuts without a visual pass.

### `motion-remotion/public/one-roof/` (18)

Already staged A–E beat folders. Prefer sourcing from `public/real-photos/...` originals when Remotion copies are SKIP or outdated; keep one-roof as the Remotion public mirror once hi-res plates are locked.

---

## Measured plate sampler (strong / usable)

Paths relative to `priceless-building/`. Dims = `WxH`. Category = filename guess.

### Place / brand

| Path | Dims | Cat | Notes |
|------|------|-----|-------|
| `public/real-photos/mural-wide.webp` | 2048×874 | mural | Best place punch (wide) |
| `public/real-photos/business/exterior-mural-build-your-future.webp` | 1271×666 | mural | Secondary mural |
| `public/real-photos/builders-corner-hero.jpg` | 2048×1536 | kitchen install | Premium finished kitchen |
| `public/real-photos/building-exterior.webp` | 640×1138 | exterior | Soft; last-resort open |
| `public/real-photos/storefront-sign-on-brick.webp` | 223×373 | exterior | **SKIP** |
| `public/real-photos/mural-from-field.webp` | 223×160 | mural | **SKIP** |
| `public/real-photos/mural-detail.webp` | 640×640 | mural | **SKIP** |

### Doors (warehouse / product)

| Path | Dims | Cat | Notes |
|------|------|-----|-------|
| `.../business/floor-door-aisle-light-and-dark.jpg` | 1200×1600 | doors | **Aisle hero** |
| `.../business/intake-black-craftsman-door.jpg` | 1050×1400 | doors | **MG select/lift candidate** |
| `.../business/floor-barn-door-diamond-glass.jpg` | 1052×1600 | doors | Statement product |
| `.../business/floor-arched-iron-studded-doors.jpg` | 1200×1600 | doors | Drama |
| `.../business/floor-arched-eight-panel-door.jpg` | 1200×1600 | doors | |
| `.../business/floor-door-inventory-ten-lite-rows.jpg` | 1200×1600 | doors | Volume |
| `.../business/floor-six-panel-oak-door-aisle.jpg` | 1200×1600 | doors | |
| `.../business/floor-dark-espresso-four-lite-doors.jpg` | 1200×1600 | doors | |
| `.../business/craftsman-door-warehouse.jpg` | 1536×2048 | doors | |
| `.../business/brown-exterior-door-decorative-glass.jpg` | 1536×2048 | doors | |
| `.../business/dark-wood-exterior-door-glass.jpg` | 1536×2048 | doors | |
| `.../business/door-inventory-collage.webp` | 1440×1800 | doors | Pre-made collage — avoid as “motion collage” source |

### Windows

| Path | Dims | Cat |
|------|------|-----|
| `.../business/floor-window-aisle-warehouse.jpg` | 1200×1600 | windows |
| `.../business/black-framed-windows-warehouse.jpg` | 1536×2048 | windows |
| `.../business/warehouse-assorted-windows.jpg` | 2048×1536 | windows |
| `.../business/floor-windows-stacked-blue-rack.jpg` | 1200×1600 | windows |
| `.../business/floor-wood-doublehung-arched-windows.jpg` | 1200×1600 | windows |
| `.../business/floor-thermotech-tan-grid-windows.jpg` | 1200×1600 | windows |
| `.../business/floor-jeldwen-boxed-windows.jpg` | 1600×1200 | windows |

### Kitchen / cabinets (warehouse + finished)

| Path | Dims | Cat | Notes |
|------|------|-----|-------|
| `.../business/dark-base-cabinets-warehouse-row.jpg` | 2048×1536 | kitchen | Signature surplus aisle |
| `.../business/white-base-cabinets-warehouse.jpg` | 2048×1536 | kitchen | |
| `.../business/grey-cabinets-warehouse.jpg` | 2048×1536 | kitchen | |
| `.../business/floor-white-and-wood-cabinet-displays.jpg` | 1200×1600 | kitchen | |
| `.../foursquared/kitchen-dark-shaker-marble-island.jpg` | 2048×1536 | kitchen | **Best remodel hero** |
| `.../foursquared/kitchen-white-island-shiplap.jpg` | 1440×1800 | kitchen | |
| `.../foursquared/kitchen-wood-island-black-pendants.jpg` | 1440×1800 | kitchen/lighting | |
| `.../foursquared/kitchen-white-open-wood-accents.jpg` | 1440×1800 | kitchen | |
| `.../business/white-kitchen-marble-island.jpg` | 1242×911 | kitchen | |
| `.../business/dark-cabinet-kitchen-install.jpg` | 1242×918 | kitchen | |

### Bath / vanity / sinks

| Path | Dims | Cat | Notes |
|------|------|-----|-------|
| `.../business/floor-vanity-row-mirrors-lights.jpg` | 1200×1600 | vanity | Floor hero |
| `.../business/kohler-vessel-sink-gold-faucet.jpg` | 1536×2048 | bath | Product punch |
| `.../business/dark-double-vanity-bathroom-install.jpg` | 1536×2048 | bath | Home context |
| `.../business/floor-vanity-floor-models-row.jpg` | 1200×1600 | vanity | Volume |
| `.../business/floor-vessel-and-drop-in-sinks.jpg` | 1600×1200 | sinks | |
| `.../business/red-sputnik` → see lighting | | | |

### Lighting / countertops / trim / paint / outdoor / hardware

| Path | Dims | Cat |
|------|------|-----|
| `.../business/floor-globe-crystal-chandelier.jpg` | 1200×1600 | lighting |
| `.../business/red-sputnik-chandelier.jpg` | 1536×2048 | lighting |
| `.../business/warehouse-lighting-inventory.jpg` | 1536×2048 | lighting |
| `.../business/floor-butcher-block-rack-stacks.jpg` | 1600×1200 | countertops |
| `.../business/discount-countertop-slabs.jpg` | 1536×2048 | countertops |
| `.../business/floor-lumber-millwork-room.jpg` | 1600×1200 | trim |
| `.../business/floor-stair-newels-and-balusters.jpg` | 1361×1600 | trim |
| `.../business/floor-hallman-lindsay-paint-stock.jpg` | 1200×1600 | paint |
| `.../business/floor-fusion-mineral-paint-display.jpg` | 1200×1600 | paint |
| `.../business/floor-door-hardware-lock-shelves.jpg` | 1600×1200 | hardware |
| `.../foursquared/pergola-patio-daylight.jpg` | 1440×1440 | outdoor |
| `.../foursquared/flooring-dark-plank-install.jpg` | 1440×1080 | flooring |

### `one-roof/` mirror (status)

| Path | Dims | Status |
|------|------|--------|
| `motion-remotion/public/one-roof/A/mural-wide.webp` | 2048×874 | OK |
| `.../A/storefront-sign-on-brick.webp` | 223×373 | **SKIP** |
| `.../B/*` (8 floor/intake plates) | 1050–2048 | OK |
| `.../C/builders-corner-hero.jpg` | 2048×1536 | OK |
| `.../C/kohler-vessel-sink-gold-faucet.jpg` | 1536×2048 | OK |
| `.../C/white-kitchen-marble-island.jpg` | 1242×911 | OK |
| `.../D/install-kitchen-walnut-island-windows.webp` | 223×160 | **SKIP** |
| `.../D/kitchen-white-island-shiplap.jpg` | 1440×1800 | OK |
| `.../D/kitchen-wood-island-black-pendants.jpg` | 1440×1800 | OK |
| `.../D/pergola-patio-daylight.jpg` | 1440×1440 | OK |
| `.../E/logo-official@2x.webp` | 640×640 | **SKIP as photo plate** |

---

## Version plate lists (proposed)

Paths relative to `priceless-building/public/real-photos/` unless noted. All listed plates are ≥800 long edge.

### Version A — Silent volume (26 plates)

Rhythmic hunt: place punch → surplus variety → product pops. Hard cuts, no labels.

1. `mural-wide.webp` — mural / place
2. `business/dark-base-cabinets-warehouse-row.jpg` — cabinet aisle
3. `business/floor-door-aisle-light-and-dark.jpg` — door aisle
4. `business/floor-window-aisle-warehouse.jpg` — windows
5. `business/floor-vanity-row-mirrors-lights.jpg` — vanity
6. `business/floor-globe-crystal-chandelier.jpg` — lighting
7. `business/floor-butcher-block-rack-stacks.jpg` — countertops
8. `business/floor-lumber-millwork-room.jpg` — millwork
9. `business/black-framed-windows-warehouse.jpg` — windows
10. `business/floor-barn-door-diamond-glass.jpg` — door product
11. `business/intake-black-craftsman-door.jpg` — door product
12. `business/kohler-vessel-sink-gold-faucet.jpg` — bath product
13. `business/red-sputnik-chandelier.jpg` — lighting punch
14. `business/floor-arched-iron-studded-doors.jpg` — doors
15. `business/floor-windows-stacked-blue-rack.jpg` — windows volume
16. `business/white-base-cabinets-warehouse.jpg` — cabinets
17. `business/floor-vanity-floor-models-row.jpg` — vanity volume
18. `business/warehouse-lighting-inventory.jpg` — lighting volume
19. `business/discount-countertop-slabs.jpg` — slabs
20. `business/floor-stair-newels-and-balusters.jpg` — trim
21. `business/floor-hallman-lindsay-paint-stock.jpg` — paint
22. `business/floor-door-hardware-lock-shelves.jpg` — hardware
23. `business/floor-white-and-wood-cabinet-displays.jpg` — cabinets
24. `business/copper-sink-wood-counter-display.jpg` — sink find
25. `foursquared/kitchen-dark-shaker-marble-island.jpg` — finished payoff beat
26. `builders-corner-hero.jpg` — finished payoff beat

**Alts / swaps:** `floor-six-panel-oak-door-aisle`, `floor-thermotech-tan-grid-windows`, `grey-cabinets-warehouse`, `dragon-pattern-sink-basin`, `floor-live-edge-wood-slabs`, `pergola-patio-daylight`.

---

### Version B — Door MG hero (aisle + door + 5 home contexts)

Silent select → lift → slam. No “DOORS” type on photo.

| Role | Path |
|------|------|
| Aisle | `business/floor-door-aisle-light-and-dark.jpg` |
| Door hero (lift) | `business/intake-black-craftsman-door.jpg` |
| Alt door hero | `business/floor-barn-door-diamond-glass.jpg` |
| Home 1 | `foursquared/kitchen-dark-shaker-marble-island.jpg` |
| Home 2 | `foursquared/kitchen-white-island-shiplap.jpg` |
| Home 3 | `foursquared/kitchen-wood-island-black-pendants.jpg` |
| Home 4 | `builders-corner-hero.jpg` |
| Home 5 | `business/dark-double-vanity-bathroom-install.jpg` |

**Gap:** true exterior *door install* lifestyle at hero res is missing (`legacy/install-blue-door-peggy`, `install-french-doors-exterior`, `install-door-arched-mahogany` are all SKIP thumbs). Optional 6th slam if needed: `business/dark-wood-exterior-door-glass.jpg` (warehouse product, not install) or `foursquared/pergola-patio-daylight.jpg` (outdoor living, not door).

**Optional open/close:** `mural-wide.webp` → void lockup → seal (not a photo plate).

---

### Version C — Category collage (12 plates)

One mosaic beat: “we have it all.” One plate per category, no noun labels.

1. `business/floor-door-aisle-light-and-dark.jpg` — doors  
2. `business/floor-window-aisle-warehouse.jpg` — windows  
3. `business/dark-base-cabinets-warehouse-row.jpg` — cabinets  
4. `business/floor-vanity-row-mirrors-lights.jpg` — vanities  
5. `business/floor-globe-crystal-chandelier.jpg` — lighting  
6. `business/floor-butcher-block-rack-stacks.jpg` — countertops  
7. `business/floor-lumber-millwork-room.jpg` — trim / millwork  
8. `business/floor-hallman-lindsay-paint-stock.jpg` — paint  
9. `business/floor-door-hardware-lock-shelves.jpg` — hardware  
10. `business/kohler-vessel-sink-gold-faucet.jpg` — plumbing / finds  
11. `foursquared/pergola-patio-daylight.jpg` — outdoor  
12. `foursquared/kitchen-dark-shaker-marble-island.jpg` — finished kitchen payoff  

**Expand to 16** (optional corners):  
`floor-windows-stacked-blue-rack`, `floor-stair-newels-and-balusters`, `floor-fusion-mineral-paint-display`, `flooring-dark-plank-install`.

---

## Exclude from all three versions

- Entire `legacy/` set until hi-res originals replace thumbs  
- Owner/staff portraits (`josh-*`, `meet-josh-*`, `team-*`)  
- Hours / hiring / holiday flyers  
- Pre-baked `door-inventory-collage.webp` (static collage fights motion collage)  
- `one-roof` SKIP copies listed above  
- `_inbox` anonymous FB IDs without a visual promote pass  

---

## Recommended next library moves

1. Re-export hi-res originals for the ★★★ `legacy/install-*` and `legacy/store-interior-*` subjects (especially door installs) — unblocks Version B slam authenticity.  
2. Replace `one-roof/A/storefront-sign-on-brick.webp` and `one-roof/D/install-kitchen-walnut-island-windows.webp` with ≥1200 long-edge sources (or drop those beats).  
3. Capture or locate one sharp **storefront / brick sign** vertical for place punch (current usable exteriors are soft or landscape-only mural).  

---

## Summary for handoff

| Metric | Value |
|--------|------:|
| Total images scanned | **740** |
| SKIP (&lt;800 long edge) | **430** |
| Usable marketing pool (named folders) | **151** |
| Version A plates | **26** |
| Version B plates | **8** (1 aisle + 1 door + 5 homes; +1 alt door) |
| Version C plates | **12** (expandable to 16) |
