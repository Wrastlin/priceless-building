# One Roof brand film

Primary whole-business deliverable. **Master format: 9:16 mobile Shorts** (post-first).

Craft bar: Buff punch + Kohler centered type. Sparse copy — motion does the talking. See [`ONE-ROOF-V2-STORY-MG.md`](ONE-ROOF-V2-STORY-MG.md).

## Compositions

### Active — Story MG v2 (mobile master)

- `ROOF-story-mg-v2`: **1080×1920**, 30 fps, **1200 frames (~40s)**
- `ROOF-story-mg-v2-16x9`: 1920×1080 crop of the same edit (secondary)

Scene: `motion-remotion/src/scenes/OneRoofStoryMg.tsx`

### Copy rules (v2 rewrite)

- Hold *"Ready to discover"* — only swap **Doors / Windows / Cabinets**
- Open: *Wausau* + **ONE ROOF** only
- Sisters: brand names only
- Door void: *Introducing* + **THIS DOOR**
- Home slams: **no type** (MG slam is the message)
- Punch: **FOR LESS** → logo + address (no multi-line essay, no UI card)

### Preview and render

```sh
cd motion-remotion
npx remotion still ROOF-story-mg-v2 out/one-roof/v2-discover.png --frame=200
npx remotion render ROOF-story-mg-v2 out/one-roof/ROOF-story-mg-v2.mp4 --pixel-format=yuv420p
# Mac QuickTime: force limited-range if black
ffmpeg -y -i out/one-roof/ROOF-story-mg-v2.mp4 -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" -c:v libx264 -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -movflags +faststart out/one-roof/ROOF-story-mg-v2.mp4
python3 scripts/verify-mp4-not-black.py out/one-roof/ROOF-story-mg-v2.mp4
```
