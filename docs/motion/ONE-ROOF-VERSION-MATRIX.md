# One Roof — Version Matrix (v3 cuts)

**Status:** Design locked after Aaron rejected wordy labeled tours (2026-07-22).  
**Obeys:** [ONE-ROOF-CREATIVE-NORTH-STAR.md](./ONE-ROOF-CREATIVE-NORTH-STAR.md)  
**Plates:** [ONE-ROOF-PHOTO-AUDIT.md](./ONE-ROOF-PHOTO-AUDIT.md) (Versions A/B/C lists)  
**Deprecates:** on-photo category nouns (`DOORS` / `WINDOWS` / `CABINETS`) and “Ready to discover…” stacks in `ROOF-story-mg-v2`.

## Shared rules (all versions)

| Rule | Detail |
|------|--------|
| Master | **9:16** — 1080×1920 @ 30fps. 16:9 is a crop only after vertical works. |
| Type | Allowed **on void only** (ink or cream field). Never stamped on aisle / lifestyle plates. |
| Nouns | **Never** label a photo with its obvious category noun. |
| Job | Attention → *thousands of finds / hip competent store / come check us out* |
| Length | ~20–30s preferred (punch over tour) |
| Verify | Still frames + `scripts/verify-mp4-not-black.py` + Mac-safe `yuv420p` TV / BT.709 before claiming done |

---

## Version A — Silent Volume

**Thesis:** Photo rhythm *is* the message. Almost no type. Variety = “thousands of finds.”

| Field | Value |
|-------|--------|
| Composition id | `ROOF-silent-v3` |
| Scene | `motion-remotion/src/scenes/OneRoofSilentV3.tsx` |
| Duration | **900 frames** (~30s) |
| Master | 1080×1920 @ 30fps |

### Beat table

| Beat | Frames | Time | Visual | Type |
|------|--------|------|--------|------|
| Place punch | 0–90 | 0–3s | Storefront → mural crossfade | **None** (photo only) |
| Volume hunt | 90–720 | 3–24s | Rapid `PhotoBed` — floor / product / install plates, ~18–28f each, snappy overlaps | **None** |
| Punch void | 720–810 | 24–27s | Ink void | **FOR LESS** (void graphic only) |
| Seal | 810–900 | 27–30s | Cream field + logo + address | Address microcopy only (not category nouns) |

### Type allow map

| Zone | Allowed? |
|------|----------|
| Over photos | No |
| Ink / cream void | Yes — one punch: FOR LESS |
| End seal | Logo + address / URL / phone |

### Craft notes

- Light or zero wash on hunt bed (wash existed for type readability; silent cut does not need it).
- Prefer hard cut energy over long Ken Burns floats.
- Re-audit `public/real-photos/` and `motion-remotion/public/one-roof/` — do not freeze on the first 18 plates.

---

## Version B — Door Transform

**Thesis:** One product does something. Select → lift → slam. Type only if it earns a void beat.

| Field | Value |
|-------|--------|
| Composition id | `ROOF-door-mg-v3` |
| Scene | `OneRoofDoorMgV3.tsx` (scaffold later; reuse `DoorSelectLift` / `DoorHomeSlam`) |
| Duration | **780 frames** (~26s) |
| Master | 1080×1920 @ 30fps |

### Beat table

| Beat | Frames | Time | Visual | Type |
|------|--------|------|--------|------|
| Place | 0–60 | 0–2s | Mural / storefront flash | None |
| Select | 60–150 | 2–5s | Aisle; rust snap on door | None |
| Lift | 150–210 | 5–7s | Door pops to cream/ink void | None (or optional single void lockup) |
| Void hold | 210–270 | 7–9s | Isolated door on void | **Optional** void only — e.g. italic “Introducing” + bold “This door”. No aisle nouns. |
| Home slams | 270–600 | 9–20s | Door slams into 5 real rooms (~66f each) | **None** on rooms |
| Punch + seal | 600–780 | 20–26s | Ink FOR LESS → cream logo + address | Void punch + seal only |

### Type allow map

| Zone | Allowed? |
|------|----------|
| Aisle / home plates | No |
| Product void | Optional one Kohler stack max |
| Close | FOR LESS + seal |

### Craft notes

- Product motion carries the story; do not re-narrate “doors” on warehouse plates.
- Snappy springs / overshoot on select and slam (Buff grammar).

---

## Version C — Collage Payoff

**Thesis:** Short silent volume, then **one late mosaic** proves range. Viewer infers categories. No per-photo nouns.

| Field | Value |
|-------|--------|
| Composition id | `ROOF-collage-v3` |
| Scene | `OneRoofCollageV3.tsx` (scaffold later) |
| Duration | **840 frames** (~28s) |
| Master | 1080×1920 @ 30fps |

### Beat table

| Beat | Frames | Time | Visual | Type |
|------|--------|------|--------|------|
| Place | 0–75 | 0–2.5s | Mural punch | None |
| Mini hunt | 75–420 | 2.5–14s | Faster silent volume (fewer plates than A) | None |
| Collage slam | 420–630 | 14–21s | Mosaic / grid reveal — doors, windows, kitchens, lighting, vanities **together** | **None** on tiles. Optional single void word *after* mosaic if needed (not on tiles). |
| Punch + seal | 630–840 | 21–28s | FOR LESS on void → logo + address | Void + seal only |

### Type allow map

| Zone | Allowed? |
|------|----------|
| Hunt photos | No |
| Collage tiles | **No labels** — images only |
| Post-collage void | Optional one punch word |
| Close | FOR LESS + seal |

### Craft notes

- Collage is the range proof that replaces narrated department tours.
- Tiles can be hard-cut or scale-slam into place; avoid card chrome / captions.

---

## Comparison

| | A Silent Volume | B Door Transform | C Collage Payoff |
|--|-----------------|------------------|------------------|
| Hero idea | Rhythm of finds | One door MG arc | Late mosaic = “everything” |
| Words | Near zero | Near zero (+ optional void) | Near zero |
| Best when | Scroll stop via density | Product craft standout | “We have it all” payoff |
| Id | `ROOF-silent-v3` | `ROOF-door-mg-v3` | `ROOF-collage-v3` |

## Build order

1. **A** — stub wired (`OneRoofSilentV3`) for immediate silent cut review  
2. **B** — strip v2 residual labels; lean on existing door MG components  
3. **C** — new collage component; late mosaic only  

## Out of scope for this matrix

- Claiming a final MP4 ready (requires render + `verify-mp4-not-black.py` + Mac-safe encode)
- Restoring category noun stacks from v2
- Desktop-first 16:9 as master
