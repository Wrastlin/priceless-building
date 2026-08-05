# One Roof Silent v3 — Craft Critique (Claude Opus)

**Reviewer:** Claude Opus, second parallel reviewer, focused on OVERALL craft (not only type).
**Date:** 2026-07-22
**Scope:** `motion-remotion/src/scenes/OneRoofSilentV3.tsx` (+ `PhotoBed`, `KohlerIntroStack`, `DoorSelectLift`).
**Method:** Read against [ONE-ROOF-CREATIVE-NORTH-STAR.md](./ONE-ROOF-CREATIVE-NORTH-STAR.md) and [ONE-ROOF-VERSION-MATRIX.md](./ONE-ROOF-VERSION-MATRIX.md). Timing derived from code (frames at 30fps).
**Caveat:** The referenced stills (`out/one-roof/silent-v3-*.png`) do not exist in the repo, and no `silent-v3` render was found. This critique is from code and intent, not sampled frames. Render + verify before treating any fix as done.

---

## Verdict in one line

The spine is correct (install cake first, then store volume, then a void punch), but the *execution* is one uniform crossfade-plus-slow-zoom treatment applied to every plate. That is the exact "Ken Burns montage as motion graphics" pattern the North Star bans. It reads as a tasteful slideshow, not as Buff/Kohler motion graphics.

---

## 1. Does silent-v3 honor install-first hierarchy?

**Yes, structurally. Not yet in feel.**

- Timeline order is right: Place (0–75), Install cake (75–450), Store volume (450–705), Punch + seal (705–900). Install is not buried at the end.
- Install gets the most screen time and the slowest pace: 375 frames (~12.5s) at a 36f step vs store's 255 frames (~8.5s) at a 14f step. Priority 1 correctly outweighs priority 2 on the clock.
- **But** install and store use the *same* `PhotoBed` grammar: identical 8f crossfade, identical `scale(1 -> 1.04)` push, identical easing. The only thing separating "the cake" from "the volume" is step speed. There is no shift in motion *language* to tell the eye "this is the craft peak." So the hierarchy exists on paper and in pacing, but the peak never lands as a peak. It reads as "the slow part of the same montage."

## 2. Timing: are install holds long enough to feel premium vs warehouse flashes?

**No. The install holds are too short and too uniform to read as premium.**

- `buildSequence(installSrcs, hold=42, step=36)` over 10 plates. With PhotoBed's 8f fade and the 6f plate overlap (42 window − 36 step), each finished room gets roughly **1s of effective screen time** and a constant 4% zoom. Premium interior/product films let a hero shot breathe for 1.5–3s and give at least one shot a signature move. Here 10 kitchens each get ~1s and the identical push, so none of them becomes "the shot."
- 10 install plates is too many for a 12.5s cake. It becomes a real-estate photo carousel of near-equivalent kitchens rather than 5–6 deliberate hero rooms.
- The store beat (hold=22, step=14, 8f fade) is genuinely rapid (~0.47s/plate), which is right for "thousands of finds." The problem there is not the speed, it is that the crossfades turn the speed into mush (see below), not snap.
- Seam sloppiness undercuts the premium read: install's last plate ends at abs frame ~441 while store starts at 450, leaving ~9 frames (0.3s) of dead ink; and the final store plate (`intake-black-craftsman`, i=17) runs to local 260 inside a 255-frame Sequence, so it gets truncated mid-transition.

## 3. What still feels like a slideshow vs motion graphics?

1. **Everything dissolves; nothing cuts.** Every plate transition is an 8f crossfade. The matrix explicitly says "Prefer hard cut energy over long Ken Burns floats." A universal dissolve is the number one slideshow tell.
2. **Uniform Ken Burns on every plate.** Same `scale(1 -> 1.04)`, same direction, same `bezier(0.45,0,0.55,1)` on all ~28 plates. That is a screensaver, and it is the "Ken Burns montage as motion graphics" item on the ban list.
3. **Crossfade mush on the fast beat.** Store step=14 with 8f in and 8f out means ~57% of frames are mid-dissolve double-exposures. Rapid density becomes ghosty and soft instead of punchy.
4. **No product does anything.** There is zero select/lift/slam and zero isolated-product-on-void in v3, even though the allow list and `DoorSelectLift`/`DoorHomeSlam` components exist for exactly this. Images appear and fade; they never transform. That is the difference between montage and MG.
5. **One flat tempo, no rhythm.** No accent on any cut (no scale slam, whip, or directional variation), no acceleration into the punch. MG needs rhythmic contrast; this is a metronome.
6. **Wash still on silent beds.** `washOpacity` 0.04–0.06 is applied though there is no type over photos. The matrix says the silent cut does not need wash. It slightly deadens plate contrast for no reason.

## 4. Top 5 iterative improvements for next pass (concrete Remotion changes)

1. **Hard-cut the store volume; reserve dissolves for the cake.** Extend `PhotoBed` with a `transition: 'cut' | 'dissolve'` (or per-plate `fade`) prop. For `storeBed` set `fade` to 1–2f and `step === hold` (no overlap) so plates snap. Keep gentle dissolves only on the install bed. This alone removes most of the slideshow feel and delivers Buff hard-cut energy.

2. **Make the install cake a distinct, premium motion language.** Cut `installSrcs` from 10 to ~5–6 curated hero rooms and slow it: `buildSequence(installSrcs, hold≈66, step≈56)` for ~2s each. Add per-plate `scaleFrom`/`scaleTo` and `objectPosition` drift to `PhotoBedPlate` so the push alternates in-vs-out and direction, instead of an identical 4% zoom on every shot. Give one room a slightly bigger, slower move so it reads as the emotional peak.

3. **Insert one true MG hero beat between cake and volume.** Add a Sequence (~450–540) using the existing `DoorSelectLift` (rust select snap, lift to void) and then slam that product into one of Josh's finished rooms via `DoorHomeSlam`. A single select -> lift -> slam converts the piece from montage to motion graphics and literally bridges "great installs" into "thousands of finds."

4. **Give the store beat a build, not a metronome.** Replace the constant `step=14` with a decreasing step array (e.g. start ~18f, ramp to ~8f) so plate density visibly accelerates into `FOR LESS`, selling "thousands of items" as a crescendo. Add a short overshoot on each hard cut in `PhotoBed` (quick `scale 1.06 -> 1.00` spring over 3–4f) for snap.

5. **Clean the seams, drop the wash, and cut into the punch on the beat.** Set `washOpacity={0}` for the silent beds so plates read at full contrast. Fix counts/durations so install ends exactly where store begins (no 9f ink gap) and the last store plate is not truncated. Then hard-cut (do not soft-fade) from the final store plate into `PunchClose` so `FOR LESS` lands on the beat instead of dissolving in.

---

## Return: top 5 bullets

- **Hard-cut the store volume, keep dissolves only for the install cake** (add a `cut`/`dissolve` mode to `PhotoBed`). Universal crossfades are the main slideshow tell.
- **Rebuild the install cake as ~5–6 slower (~2s) hero rooms with varied push direction**, not 10 near-identical kitchens on one uniform 4% zoom, so the emotional peak actually breathes and reads premium.
- **Add one real select -> lift -> slam MG beat** using the existing `DoorSelectLift`/`DoorHomeSlam` to bridge cake into volume; nothing in v3 currently transforms, which is why it feels like montage, not motion graphics.
- **Turn the store beat into an accelerating build** (decreasing step + a 3–4f scale-overshoot per hard cut) so density crescendos into the punch, selling "thousands of finds."
- **Clean the craft details:** set `washOpacity` to 0 on silent beds, remove the ~9f dead-ink gap and the truncated final store plate, and hard-cut into `FOR LESS` on the beat rather than dissolving.
