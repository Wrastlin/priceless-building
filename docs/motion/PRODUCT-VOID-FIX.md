# Product Void Fix — Price-Less Door MG (critique for Sol v4)

**Reviewer:** Opus. Critique only. Sol implements v4.
**Date:** 2026-07-22
**Trigger:** ~0:15 of `out/one-roof/WATCH-ME.mp4` (frame ~450, 30fps). The black craftsman door reads as a tiny vertical strip floating on a large empty cream/gray void. Aaron: "don't know what we're gonna do there."
**Scope:** `motion-remotion/src/components/one-roof/DoorSelectLift.tsx`, `DoorHomeSlam.tsx`, and their usage in `OneRoofSilentV3.tsx` (→ v4).
**Bar:** Apple / Kohler product-on-void. The product commands the frame; the void is a designed graphic field, not leftover empty space.

---

## Diagnosis: why 0:15 fails

The referenced frame is the held end-state of `DoorSelectLift` (Sequence `from={402} durationInFrames={48}`), just before `DoorHomeSlam`.

Two compounding faults:

1. **Postage-stamp product.** The lifted door crop is hard-coded to `width: 268, height: 510` and tops out at `doorScale = 0.95` (`DoorSelectLift.tsx` ~133-138). Effective size ≈ 255×485px. On a 1080×1920 frame that is **~24% of frame width and ~6% of frame area**. That is the exact "postage-stamp door in gray emptiness" banned by `ONE-ROOF-STORY-SPINE.md` hard craft rule #4.

2. **Undesigned void.** The background is `radial-gradient(ellipse at 50% 42%, cream 0%, parchment 36%, ink 88%)` (`DoorSelectLift.tsx` ~84). Because the bright core is a fixed ellipse and the product is tiny, the cream field is not anchored to anything. It reads as accidental empty gray/cream, not a composed stage. Apple/Kohler voids never have dead space; the light field is sized and placed *for the product*.

Net: the product does not own the frame, and the void is not designed. Both spine rules for section B (Price-Less product hero MG) are violated in one shot.

---

## Fix principles (the rule to hold Sol to)

1. **The door owns the frame.** On void, a single hero SKU fills the tall axis. Product ≥ ~55% frame height, target ~75%. No product-on-void beat below that floor ships.
2. **The void is a designed graphic field, not background.** Radial cream→ink, but the bright core is *sized and centered to the product* so there is no empty margin larger than the product. Ink reaches all four edges (no gray corner reads as "unfinished").
3. **Rust is an accent, never decoration** (optional, one per beat).
4. **Then slam into homes.** After the door owns the void, hard-cut/composite it into real rooms. The void beat is the "isolate," the slam is the "in context."
5. **Ban postage-stamp product.** Any door-on-void under ~1250px tall on this comp is a bug, not a style choice.

---

## Top 3 size / layout numbers — 1080×1920

**These are what to return to the parent and lock in v4.**

1. **Door hero size (owns frame):** height **1440px** (75% of 1920), width by the door's native aspect (`intake-black-craftsman-door.jpg` ≈ 0.43 → **~620px**, ~57% of 1080). Hard floor: never below **1250px tall** / 55% frame height. This replaces the `268×510 @ 0.95` crop, a ~7x area increase.

2. **Designed void core:** `radial-gradient(ellipse ~640px × ~1000px at 50% 44%, cream 0% → parchment ~40% → ink ~90%)`. The bright core width tracks door width (~620-640px) so light hugs the product; ink hits every edge. No bright region larger than the door.

3. **Optical margins / centering:** door block max **840px wide** (≥120px breathing each side), vertically **optical-centered at ~46% from top** (apply ~`translateY(-3%)` so the tall block does not sag). Land the lift at scale **1.0**, not 0.95.

---

## Concrete Remotion changes for `DoorSelectLift.tsx`

- Replace the fixed crop box:

```tsx
// was: width: 268, height: 510, ... scale(0.95)
const DOOR_H = 1440;            // 75% of 1920, floor 1250
const DOOR_W = Math.round(DOOR_H * 0.43); // native aspect ~620
// container centered; end scale 1.0, not 0.95
transform: `translateY(${doorY}px) scale(${doorScale})`, // doorScale -> [.., 1.0]
```

- Widen the lift range so the end reads full-size: `doorScale` target `1.0` (currently 0.95), `doorY` still settling to 0.
- Rebuild the void so the core is product-sized and edges go ink:

```tsx
background: `radial-gradient(ellipse 640px 1000px at 50% 44%,
  ${colors.cream} 0%, ${colors.parchment} 40%, ${colors.ink} 90%)`,
```

- Optical center: wrap the door in a flex column with `justifyContent: 'center'` + `transform: translateY(-3%)`.
- Keep `padding` math consistent with the punch beats (72px sides) so margins match `KineticVoidPunch`.

## Optional rust accent rule (one per beat, or skip)

Rust (`colors.rust` `#d04727`) may appear **once** as a deliberate accent, never as chrome:
- Keep the existing 2px rust select rect on the aisle plate (that is the "select" language, correct).
- On the void, allow at most **one** rust element: a thin rust plinth line under the door (~3-4px tall, ~door width, ≥40px below the door) OR a short rust underline tag. Total rust ≤ ~4% of frame. If it does not read as intentional at first glance, cut it. Default: no rust on the void, rust only on the aisle select.

## Then slam into homes (`DoorHomeSlam.tsx`)

Different rule from the void: here the door is *in context*, so it should read as a believable door in the room, not a hero cutout.
- Current `doorWidth={200}` at `doorLeft="62%"` is too small/floaty for the room. Size the door to the room's perspective so it looks installed (roughly 30-40% of visible room width, bottom-anchored, `transformOrigin: center bottom` is already right).
- Keep the hard slam energy (`1.28 → 1.0` overshoot). Hard-cut in from the void beat; do not dissolve.
- v4 direction (per spine section B): after the single home slam, allow a short **multi-home** composite (same door dropped into 2-3 real rooms) to sell "designer brand, now in your house." Higgsfield product-in-context plates only when Aaron approves the exact run.

---

## How this fits the Price-Less section of `ONE-ROOF-STORY-SPINE.md`

This beat is the literal payload of **Act B — Price-Less** and of the Price-Less brand role ("thousands of designer brands at liquidation prices ... cool product MG (isolate → homes)").

- Spine section B spells out the exact arc this fix restores: **"Select on aisle → lift into designed full-frame graphic field → then slam / composite into multiple real homes."** Today the middle step (own-the-frame graphic field) is where it breaks; fixing the door size + designed void makes that step real.
- It directly satisfies **hard craft rule #4**: "Product on void must own the frame (large, designed field) — no postage-stamp door in gray emptiness."
- Narrative meaning: the door-on-void says **designer brand**; the slam-into-homes says **and it goes in real houses, for less**. That is the whole Price-Less pitch (premier product, discount price) in one MG beat, without a noun label.
- **Higgsfield stays later / approved only.** The Remotion void + slam must stand on its own first. Higgsfield is reserved for the product-in-context home plates, and only on Aaron's OK with proposed prompts + limits (spine "Higgsfield" note + rule #6). Do not build v4 dependent on a Higgsfield render.
