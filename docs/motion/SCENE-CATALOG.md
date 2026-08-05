# Scene catalog: Remotion mocks to Higgsfield plates

**Workflow (locked)**
1. Distill the reference Short into named scenes with explicit frame ranges.
2. Build the complete multi-scene timing, type, crop, and layout in Remotion (`motion-remotion/`).
3. Approve beats with Aaron.
4. Swap each placeholder for the correct real cutout or product plate.
5. Only then run Higgsfield for product plates / VFX that Remotion cannot do; assemble with Remotion or `explainer_video`.

**Non-negotiable timing rule:** A Short is a rapid sequence of distinct plates. Each scene is 60 frames or less at 30fps. Never hold one plate for most of the runtime.

**Type on every scene:** Montserrat/Gotham **300** lead-in + **700** brand. All caps. Indent line 2.

---

## Composition IDs (Remotion Studio)

| ID | Style | Brand | Duration | Status |
|----|-------|-------|----------|--------|
| `BC-claude-console-v1` | 01 Claude Console | Builders Corner | 10s | Eight-scene mock |
| `PL-claude-console-twin-v1` | 01 twin | Price-Less | 10s | Eight-scene mock |
| `PL-sunrise-archive-v1` | 02 Sunrise Archive | Price-Less | 10s | Mock ready |
| `PL-form-fetish-door-v1` | 03 Form Fetish | Price-Less | 12s | Mock ready |
| `PL-price-micro-v1` | 05 Price Micro | Price-Less | 6s | Mock ready |

Run: `cd motion-remotion && npm run dev`

---

## Claude Console scene cards

These cards are implemented identically in `BC-claude-console-v1` and `PL-claude-console-twin-v1`. Brand color and final copy vary.

### S01: Wide isolated hero
- **Frames:** 000-035
- **Duration:** 36f / 1.20s
- **Visual:** Oversized isolated console on parchment or cream, with a narrow vertical accent bar.
- **Type:** Small tracked BUILDERS CORNER or PRICE-LESS at top left.
- **Motion:** Product rises 28px, fades in, and pushes 4%.
- **Transition:** Hard cut to full-bleed ink.
- **Plate later:** Transparent product cutout, full-product crop.

### S02: Brand field
- **Frames:** 036-059
- **Duration:** 24f / 0.80s
- **Visual:** Full-bleed ink with a tall brass or rust rule.
- **Type:** PREMIER BRANDS / indented brand name, 300/700.
- **Motion:** Rule grows vertically; type slides from left.
- **Transition:** Hard cut to light macro crop.
- **Plate later:** None. Remotion type and geometry only.

### S03: Porcelain profile
- **Frames:** 060-104
- **Duration:** 45f / 1.50s
- **Visual:** Overscaled basin-rim crop on cream or parchment.
- **Type:** PORCELAIN / indented PROFILE, 300/700.
- **Motion:** Product pushes 2.5%; a diagonal light band crosses the rim.
- **Transition:** Hard cut to split accent field.
- **Plate later:** Tight crop from the cleaned product master.

### S04: Brass junction
- **Frames:** 105-149
- **Duration:** 45f / 1.50s
- **Visual:** Extreme leg and crossbar crop beside a 38% accent-color panel.
- **Type:** Vertical BRUSHED METAL.
- **Motion:** Product pushes 4%.
- **Transition:** Hard cut to framed inset.
- **Plate later:** Hardware macro from the cleaned product master.

### S05: Shelf insert
- **Frames:** 150-179
- **Duration:** 30f / 1.00s
- **Visual:** Light detail plate inside an ink surround and fine accent border.
- **Type:** CRAFT / DETAIL, 300/700.
- **Motion:** Inset scales from 94% to 100%.
- **Transition:** Hard cut to type card.
- **Plate later:** Shelf or lower-detail crop.

### S06: Product type stack
- **Frames:** 180-224
- **Duration:** 45f / 1.50s
- **Visual:** Full-bleed light field with a horizontal accent rule.
- **Type:** INTRODUCING / indented THE / CONSOLE COLLECTION, 300/700.
- **Motion:** Type rises and fades; rule draws left to right.
- **Transition:** Hard cut to accent-color field.
- **Plate later:** None. Remotion owns the entire card.

### S07: Fixture close
- **Frames:** 225-254
- **Duration:** 30f / 1.00s
- **Visual:** Full accent-color field with an oval light inset and overscaled top-product crop.
- **Type:** FIXTURE CLOSE.
- **Motion:** Inset scales from 86% to 100%; product pushes 3%.
- **Transition:** Hard cut to final hero.
- **Plate later:** Faucet or top-rim crop from the cleaned master.

### S08: Final lockup
- **Frames:** 255-299
- **Duration:** 45f / 1.50s
- **Visual:** Smaller isolated hero above the final lockup and top accent bar.
- **Type:** PREMIER BRANDS / BUILDERS CORNER, or IN-STORE PRICE / PRICE-LESS.
- **Motion:** Product and type rise 26px and settle.
- **Transition:** End or loop to S01.
- **Plate later:** Transparent product cutout. Numeric price appears only after verification.

## Other reusable scene cards

### S09: Finish field
- **Visual:** Entire frame uses the finish color; product silhouette uses a related tint.
- **Type:** DISCOVER / indented [FINISH], 300/700.
- **Duration:** 30-45f / 1.00-1.50s.
- **Motion:** Product silhouette pushes no more than 5%.
- **Transition:** Hard cut.
- **Plate later:** Optional monochrome product grade on a cutout.

### S10: End card, category or roof only
```
PRICE-LESS BUILDING CENTER
825 Washington St · Wausau, WI
PricelessBuilding.com
(715) 848-3855
```

---

## Style → scene sequences

| Style | Sequence |
|-------|----------|
| Claude Console BC | S01 → S02 → S03 → S04 → S05 → S06 → S07 → S08 |
| Claude twin PL | S01 → S02 → S03 → S04 → S05 → S06 → S07 → S08 |
| Sunrise Archive | Type card → S09 → final lockup |
| Form Fetish door | Hero → light detail → type stack → final lockup |
| Price Micro | Hero → type stack → verified price lock |

---

## Higgsfield handoff checklist

Only after the full multi-scene Remotion timing is approved:

- [ ] Real cutout PNG in `motion-remotion/public/products/`
- [ ] Props wired: `productSrc`, `productName`, `price`, `finish`
- [ ] Every scene has its own approved plate or Remotion-only card
- [ ] Aaron confirms which scenes need generative VFX versus Remotion-only
- [ ] Credit budget named for that run
- [ ] No aisle-pan models
