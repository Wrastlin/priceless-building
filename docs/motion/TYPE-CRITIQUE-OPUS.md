# Type Critique — Opus (One Roof / PunchClose)

**Reviewer:** Opus, lead motion-typography critic
**Date:** 2026-07-22
**Bar:** Kohler Shorts / Buff Motion. Type on void only.
**Scope:** `KohlerIntroStack.tsx` + `OneRoofSilentV3.tsx` PunchClose. Critique only, no source edits.

---

## Verdict up front

The close is amateur, and it is amateur for one measurable reason: **the type is roughly a third of the size it needs to be.** On a 1080×1920 frame, `FOR LESS` is rendering at 54px. That is ~5% of frame width. It reads as a caption someone forgot to finish, floating in a black ocean. Kohler's `Claude` in the reference occupies ~35–40% of frame width and owns the entire screen. Yours occupies ~28% and owns nothing.

"Type IS the graphic" was the stated intent. Right now the type is a footnote on a void, not a graphic. A graphic commands the frame. This one apologizes for being there.

Second failure: **`Quality` is a timid italic caption stacked on top of the punch.** It halves the impact of `FOR LESS` and reads like a subtitle, not a lead-in. The Kohler grammar is `italic lead → HUGE hero → skinny tag`. You copied the skeleton but starved the hero of size, so the "lead-in" now outweighs nothing and the hero doesn't land.

Third: **the slam is a lie.** `1.06 → 1.0` over 6 frames at 54px is a sub-3px move. Nobody sees it. It is neither a clean cut nor a real slam. It is motion you can only detect in the code.

---

## Exact recommended values — 1080×1920

These are absolute pixel values for the real composition (`W=1080, H=1920`), NOT "1080-baseline scaled" hedges. The `* scale` baseline in `KohlerIntroStack` is the root cause of the shrinkage — the "editorial, mobile-readable, never display-wall type" comment on line 67 is the amateur instinct. Kill it. Punch type on a void SHOULD be display-wall type. That is the entire point.

### Recommended layout: single hero phrase, two lines, no italic

| Property | Current | **Recommended** | Why |
|---|---|---|---|
| **bold px** | 54 | **210** (two-line `FOR` / `LESS`) or **150** (single line `FOR LESS`) | Hero must own ≥35% of frame width like `Claude`. |
| **italic px** | 24 | **58** (only if you keep a lead-in — see verdict) | Lead-in must read as intentional, not as a 24px whisper. |
| **skinny px** | 16 | **30** | Tracked tag legibility floor on mobile. |
| **letterSpacing — italic** | 0.01em | **0.02em** | Slight air; italic serifs breathe. |
| **letterSpacing — bold** | -0.03em | **-0.02em** | -0.03 crushes `R`/`L` junctions at display size. Back off. |
| **letterSpacing — skinny** | 0.2em | **0.28em** | Tracked caps tag needs real gaps to read as a label, not a word. |
| **lineHeight — bold** | 0.93 | **0.86** (two-line) / 0.90 (single line) | Two-line punch must lock into one tight block, not two floating rows. |
| **marginBottom after italic** | 20 | **34** | Current gap collapses lead-in into hero. |
| **marginTop before skinny** | 24 | **44** | Tag must sit clearly below the hero, Kohler `BATHROOM VANITY` style. |
| **maxWidth** | 720 | **936** | 1080 − (72×2). Give the hero room to be big. |
| **side padding (void punch)** | 56 (scene) / 8 (stack) | **72** each side | Consistent optical margin; matched to maxWidth math. |
| **slam** | 1.06→1.0 / 6f | **KILL on the close** (hard cut-in + hold). Reserve real slam (1.16→1.0, 4f) for mid-film product hits. | A bouncing closing word is a gimmick. Confidence = it just appears and holds. |

### Vertical placement (bonus, since it also reads amateur)

- Center is fine once the type is big, but nudge the block to **optical center ≈ 46% from top** (not geometric 50%). A large block dead-centered on 9:16 sags. Roughly `justifyContent: center` with a `translateY(-3%)` feel.

---

## The verdict you asked for: `Quality / FOR LESS` vs single `FOR LESS`

**Single punch wins. Drop `Quality`.**

- The North Star literally lists the allow-list example as "One punch word on a **void** (e.g. FOR LESS)". One punch. Not a two-tier caption sandwich.
- `Quality` as a 24px italic above the hero is the weakest possible placement — it reads as a hesitant qualifier, the opposite of punch. It steals the eye's first fixation and spends it on the small word.
- If — and only if — leadership insists the "quality at a discount" idea must appear in type, **do NOT** put it as an italic lead-in. Put `QUALITY` as the **skinny tracked tag BELOW** `FOR LESS`, exactly where `BATHROOM VANITY` sits under `CLAUDE`. Hero first, qualifier second, in the subordinate slot the grammar reserves for it.
- Best answer for the scroll: `FOR LESS`, huge, two lines, hard cut, hold 2.5s, cut to seal. Let the 12s of finished installs before it carry "quality." The void word carries "less." Don't make one word do both jobs.

Recommended final close type:

```
FOR        ← 210px, weight 700, -0.02em, lineHeight 0.86
LESS
```

Optional subordinate tag if forced:

```
FOR
LESS
QUALITY AT A DISCOUNT   ← 30px, weight 300, 0.28em, marginTop 44
```

---

## Top 5 fixes (in priority order)

1. **Triple the hero.** `FOR LESS` from 54px → 210px (two-line `FOR`/`LESS`, lineHeight 0.86) or 150px single line. This alone moves it from amateur to Kohler-adjacent. Rip out the `* scale` baseline logic that keeps it small.
2. **Delete `Quality`.** Ship single-punch `FOR LESS`. If the concept must appear, demote it to the 30px tracked tag slot below the hero, never as a 24px italic above it.
3. **Kill the fake slam on the close.** Hard cut-in, hold. Save a real slam (1.16→1.0, 4 frames) for mid-film product hits where it's earned.
4. **Fix spacing.** letterSpacing bold -0.02em (not -0.03), marginBottom 34 / marginTop 44, maxWidth 936, padding 72. The current gaps collapse the stack into one mushy clump.
5. **Raise the type floor everywhere.** italic 58 / bold 150–210 / skinny 30. Any punch-on-void type under ~120px bold on a 1080 frame will read as unfinished. Set that as the hard minimum for this brand.
