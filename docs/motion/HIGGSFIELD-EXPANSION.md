# Higgsfield expansion map (2026-07-23, from live `higgsfield model list`)

What we use today: gemini (isolation/placement, outside HF), image_background_remover, kling3_0 i2v, sonilo_music, product-photoshoot, soul_location. Below: unused capabilities mapped to our program, ordered by value.

## Tier 1: adopt now
- **Video upscale** (`bytedance_video_upscale` / `topaz_video`): kling clips come back ~860x1068; upscale to crisp 1080x1920+ before shipping. Every motion clip should pass through this.
- **Outpaint** (`outpaint`): extend real photos to 9:16 instead of center-crop zooming. Directly fixes "photos only displayed as zoomed versions". Targets: landscape install kitchens, the wide mural, category aisle shots.
- **Video background remover** (`video_background_remover` / `sam_3_video`): turn motion clips into TRANSPARENT product motion (a door swinging with alpha). Lets Remotion composite living products into designed type frames: true motion graphics, not static cutouts.
- **Image upscale** (`bytedance_image_upscale` / `topaz_image`): rescue the 45 legacy install photos stuck at 223px thumbs (Josh's best work, currently unusable).
- **SFX** (`seed_audio` / `mirelo_text_to_audio`): subtle organic sound: door wood creak, water into porcelain, fire crackle. Felt not noticed, under track A.
- **Virality scoring** (`brain_activity`): score finished cuts, keep hook winners (already planned rung 5).

## Tier 2: creative expansion
- **Reframe workflow**: 9:16 masters to 1:1 and 16:9 without re-generation (posting matrix).
- **Recraft V4.1** (`recraft_v4_1`): design-native model, strong at typography and vector: textured type lockups, poster art, logo treatments as ASSETS (final type still lives in Remotion for editability).
- **Color grading LUT** (`color_grading_lut`): one brand LUT applied across all clips for a consistent film look.
- **Flux Kontext / Nano Banana Pro / Seedream**: alternative editors for creative spins when Gemini's look plateaus.
- **Seedance 2.0 (+mini)**: premium hero motion for the one or two flagship beats per film.
- **Kling 3.0 Turbo**: cheaper drafts before committing 10cr full clips.
- **Video deflicker**: fix any shimmer in generated clips.

## Tier 3: later avenues
- **Image to 3D** (`multi_image_to_3d`, `tripo`, `hunyuan`): product turntables and camera-orbit beats from our multi-angle photos; also AR/website embeds.
- **Veo 3.1 / Gemini Omni / Wan / Hailuo**: alt i2v engines to A/B against Kling per motion type.
- **Clipify / transcriber**: auto-cutdowns and captions when narrated cuts exist.
- **TTS** (`inworld`, `qwen`, `text2speech_v2`): narration tests (plain, casual voice per the narration memory; no clever reframes).

## Standing policy
Never: Soul avatars/UGC/AI people. Every generated output passes the visual gate before shipping. Log spends in MASTER-EXECUTION-PLAN ledger.
