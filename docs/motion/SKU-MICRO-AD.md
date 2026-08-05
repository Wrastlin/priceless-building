# SKU Micro Ad — capability demos + category learning

**Role today:** Not for selling inventoried SKUs (nothing inventoried yet). Use micros to **demonstrate** Remotion + type + cutout workflows and to learn how beats assemble into **category** and **One Roof** films.

**Primary business deliverable now:** the whole-business film — see [`ONE-ROOF-FILM.md`](ONE-ROOF-FILM.md) and [`storyboards/whole-store-v1-review.md`](storyboards/whole-store-v1-review.md). Hundreds of real photos are already on disk.

When inventory exists, the same micro template becomes the per-item graphic ad (3–4s, 2–3 scenes).

---

## Two-step product (when inventory is live)

### 1. Still → facts (already in app)

Take the floor still and bake inventory fields:

- title / subtitle
- description (AI-assisted, staff-editable)
- dimensions
- manufacturer / finish / color when known
- price (verified only)
- category / department
- clean studio or cutout master (`/api/clean-background`)

No ad without these facts. Copy and type pull from the item record — never invent.

### 2. Graphic micro-ad (3–4s max · 2–3 scenes)

Kohler-easy: isolated product + weight-stack type. Not a mini commercial.

| Rule | Value |
|------|--------|
| Total length | **3–4 seconds max** |
| Scene count | **2 or 3** |
| Per-scene max | **≤2s** (usually 1.0–1.5s) |
| Hero | Real cutout / cleaned still only |
| Type | Montserrat/Gotham **300 / 700** |
| Brand | PRICE-LESS (+ optional Builders Corner twin later) |
| Motion | Soft push or cut; type fade/slide — no aisle pans |

## Default 3-scene recipe (≈3.5s @ 30fps)

| Scene | Frames | Time | Visual | Type |
|-------|--------|------|--------|------|
| **A · Product** | 0–35 | 0–1.2s | Cream ground · product centered · soft shadow · slight scale 1→1.03 | — |
| **B · Name** | 35–70 | 1.2–2.3s | Same product (or tighter crop) | Skinny: INTRODUCING / THE · Bold: **[ITEM NAME]** |
| **C · Brand + facts** | 70–105 | 2.3–3.5s | Product holds or soft pullback | **PRICE-LESS** · dim line · price in rust if verified |

Optional 2-scene cut (≈3s): merge B+C — name stack + PRICE-LESS + price on one card over the product.

## What overlays (from item record)

Always when present:

- Price-Less Building Center / PRICE-LESS
- Item name (title)
- Short description or subtitle (one line max)
- Dimensions (mono / 300)
- Price (rust 700) — only if verified

Never:

- Fake % off
- AI people
- Warehouse pan as the ad
- More than 3 scenes
- Holds longer than ~1.5s on a static box with no type change

## Remotion

Composition: `PL-sku-micro-v1` in `motion-remotion/`  
Props later: `productSrc`, `title`, `subtitle`, `dimensions`, `price`

## Higgsfield

Only after Remotion timing approved: optional cutout/clean assist. Type and scene cuts stay Remotion.
