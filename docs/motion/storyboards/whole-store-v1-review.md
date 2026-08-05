# Whole-store motion ad — asset review (pre-Higgsfield)

Status: **DRAFT FOR AARON APPROVAL**. Nothing sent to Higgsfield yet.

## Library snapshot (already on disk)

| Source | Approx count | Role |
|--------|--------------|------|
| `real-photos/business/` | 144 | Warehouse floor, products, some installs |
| `real-photos/business/floor-*` | 43 | July 2026 department shoot (preferred aisle/dept) |
| `real-photos/foursquared/` | 14 | Best remodel / outdoor installs (promoted from FB) |
| `real-photos/legacy/` | 45 | Older store interiors + finished rooms |
| `real-photos/` root | logos, mural, storefront, community | Brand + place |
| `_inbox/facebook/` | ~430 | Raw FB pull (mostly event/thumbs; curated subset already promoted) |
| `_inbox/instagram/` | ~45 | Raw IG (many thumbs/dupes) |
| `footage/x5-walkthrough-2026-06-11/` | walkthrough MP4s + frames | Optional live aisle motion |
| `catalog-images/` / `test-images/` | AI / studio | **Out of this ad** unless you explicitly want cutouts later |

Existing hand reviews: `CURATED.md`, `MANIFEST.md`, `business/FLOOR-SHOOT.md`, `lib/department-photos.ts`.

## Hard excludes (locked)

- Owner/staff portraits (`josh-nickel`, `meet-josh-bio`, `team-*`)
- Hours / holiday flyers
- BEFORE/AFTER text-stamped graphics
- Collages and blurry tag-heavy intake leftovers
- AI catalog/test images for this cut
- Fake people / UGC avatars

## Three businesses (voice for type cards)

| Brand | Job in the ad | How we talk about it |
|-------|---------------|----------------------|
| **Price-Less** | Liquidation warehouse. Doors, windows, cabinets, vanities, lighting, finds. | Scale, surplus, real savings, inventory that changes. |
| **Builders Corner** | Premier brands and design. Staging for professional remodels. | Nice brands, showroom quality, what goes into a real remodel. |
| **4 Squared** | The crew that installs it. | Craftsmanship, finished rooms, quality and experience from the crew. |

No em dashes in on-screen copy about Builders Corner or 4 Squared.

---

## Proposed cut: “One roof in Wausau” (30s / 16:9 master)

Also cut later: 15s and 9:16 from the same plates.

### Narrative arc

1. Place (storefront + mural)
2. The hunt (warehouse departments, Price-Less)
3. The finish (Builders Corner showroom energy + 4 Squared craft)
4. Proof of craft (finished kitchens / bath / outdoor)
5. Come see it (address + site)

Motion graphics only: kinetic type, measurement lines, brand cards, whip/wipes over **real photos**. Photos stay photos. Optional later: BG remove a few hero products for graphic plates. Not required for v1.

---

## Proposed shot list (review these)

Paths relative to `public/real-photos/`.

### A. Open / place (0–4s)

| # | File | Why |
|---|------|-----|
| A1 | `storefront-sign-on-brick.webp` | Best place identity plate (low res; upscale or reshoot later). |
| A2 | `mural-wide.webp` only | Community mural. Do **not** use `mural-from-field` or `mural-detail` (AUDIT rejects). |
| A3 | Skip `building-exterior.webp` | AUDIT reject: soft, weak identity. Capture gap. |

**Type:** `WAUSAU · SINCE 1978` then `THREE BUSINESSES. ONE ROOF.`

### B. Price-Less warehouse (4–14s) — department run

| # | File | Dept beat |
|---|------|-----------|
| B1 | `business/dark-base-cabinets-warehouse-row.jpg` ★★★ | Signature surplus depth |
| B2 | `business/floor-door-aisle-light-and-dark.jpg` | Doors |
| B3 | `business/floor-window-aisle-warehouse.jpg` | Windows |
| B4 | `business/floor-vanity-row-mirrors-lights.jpg` | Vanities |
| B5 | `business/floor-globe-crystal-chandelier.jpg` or `legacy/store-interior-chandelier-aisle.webp` | Lighting |
| B6 | `business/floor-butcher-block-rack-stacks.jpg` | Countertops |
| B7 | `business/floor-lumber-millwork-room.jpg` | Trim |
| B8 | `business/intake-black-craftsman-door.jpg` | One-of-a-kind detail |

**Type cards:** `DOORS` · `WINDOWS` · `CABINETS` · `VANITIES` · `LIGHTING` · `HUNDREDS OF FINDS` · `INVENTORY CHANGES CONSTANTLY`

Optional secondary (if pacing allows): `floor-barn-door-diamond-glass.jpg`, `black-framed-windows-warehouse.jpg`, `discount-countertop-slabs.jpg`.

### C. Builders Corner (14–18s)

| # | File | Why |
|---|------|-----|
| C1 | `builders-corner-hero.jpg` | Premium finished kitchen (same family as 4 Squared hero; use once) |
| C2 | `business/white-kitchen-marble-island.jpg` or `foursquared/kitchen-white-island-shiplap.jpg` | Bright showroom-quality kitchen |
| C3 | `business/kohler-vessel-sink-gold-faucet.jpg` | Premier fixture detail |

**Type:** `BUILDERS CORNER` · `PREMIER BRANDS FOR REAL REMODELS`

Note: `builders-corner-hero.jpg` and `foursquared/kitchen-dark-shaker-marble-island.jpg` are essentially the same kitchen. Pick **one** for the dark kitchen beat.

### D. 4 Squared craft (18–24s)

| # | File | Why |
|---|------|-----|
| D1 | `foursquared/kitchen-wood-island-black-pendants.jpg` ★★★ | Finished remodel craft |
| D2 | `foursquared/kitchen-white-island-shiplap.jpg` ★★★ | Alternate finished kitchen |
| D3 | `legacy/install-kitchen-walnut-island-windows.webp` or `legacy/install-kitchen-soapstone-island.webp` | More finish variety |
| D4 | `foursquared/pergola-patio-daylight.jpg` | Outdoor install / crew range |
| D5 | `business/kitchen-remodel-before-after.jpg` | Optional: real remodel journey (only if the stamp/text is acceptable; otherwise skip) |

**Type:** `4 SQUARED` · `INSTALLED BY OUR CREW` · `CRAFTSMANSHIP YOU CAN SEE`

### E. Close (24–30s)

| # | File | Why |
|---|------|-----|
| E1 | `logo-official.webp` | Circular seal |
| E2 | `sign-logo.webp` (optional) | Hand-painted wordmark texture |
| E3 | End card (motion graphic, not a photo) | Address + site + phone |

**Type:**  
`PRICE-LESS · BUILDERS CORNER · 4 SQUARED`  
`825 WASHINGTON ST · WAUSAU`  
`PRICELESSBUILDING.COM`  
`(715) 848-3855`

---

## Motion design wireframe (no AI people)

```
[A1 storefront] --wipe--> [A2 mural]
        type: WAUSAU · SINCE 1978

[B1 cabinets aisle] --kinetic dept labels over plates-->
[B2 doors] [B3 windows] [B4 vanities] [B5 lighting]
        type: THE WAREHOUSE · PRICE-LESS

[C1 or C2 kitchen] --soft hold-->
        type: BUILDERS CORNER · PREMIER BRANDS

[D1 + D2 finish] --cut to--> [D4 pergola]
        type: 4 SQUARED · THE CREW THAT BUILDS IT

[E1 logo] --> end card
        type: COME SEE IT · PRICELESSBUILDING.COM
```

Tools later (after you approve the list):

1. **Motion graphics layer** (Vibe Motion / Remotion / HyperFrames): type, timing, brand cards
2. **Optional plate motion** (Higgsfield image-to-video): shallow dolly on 3–5 stills only
3. **Optional cutouts** (Gemini BG remove): 2–3 product heroes for graphic moments, not the whole film

v1 recommendation: **stills + motion graphics only**. Add camera moves and cutouts in v2 once the edit is locked.

---

## Community / warmth (optional B-roll, not required for v1)

Only if you want a “local” beat: `community-county-fair.webp`, `santa-at-storefront.webp`, `paint-day-rainbow.webp`. Easy to drop without hurting the product story.

## Not using in this cut

- `_inbox/facebook` raw dump (already cherry-picked into `foursquared/` + business)
- Hours flyers, hiring flyer, grocery giveaway promo art
- Team portraits
- `door-inventory-collage.webp`
- `catalog-images/` and `test-images/`

---

## Decisions needed from you

1. **Approve or swap** the A–E shot list above.
2. Dark kitchen: use `builders-corner-hero.jpg` **or** `foursquared/kitchen-dark-shaker-marble-island.jpg` (not both).
3. Include before/after (`kitchen-remodel-before-after.jpg`) or skip stamped graphics?
4. Include outdoor pergola as the 4 Squared range beat, or keep it kitchens-only?
5. Length: lock **30s master** first?
6. After approval: generate motion graphics + plates, or motion graphics only first?

When you sign off, we send only the approved files into Higgsfield / the motion pipeline.
