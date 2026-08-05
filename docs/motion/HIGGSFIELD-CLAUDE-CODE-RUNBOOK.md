# Higgsfield in Claude Code: production runbook

Set up and verified 2026-07-22. This is the execution companion to `SCENE-HIGGSFIELD-MAP.md`, `ONE-ROOF-CREATIVE-NORTH-STAR.md`, and `BRAND-MOTION-STYLES.md`. Those docs own the creative rules; this doc owns the commands.

## Current state

- CLI `@higgsfield/cli` v1.1.19 installed globally as `higgsfield` / `hf`, authenticated (arothwell7271@gmail.com), workspace `3ee72898-dfe8-4310-a34c-d60ce487532b` selected.
- 7 official skills installed at `.agents/skills/`, symlinked into `.claude/skills/` for Claude Code.
- Credits at setup: 0.5. Nothing below runs until the Plus top-up (~1,000 credits) lands.
- Re-auth quirk: `higgsfield auth login` requires callback port 8765. If a stale `python3 -m http.server 8765` is squatting it (leftover Cursor task), kill it first: `pkill -f "http.server 8765"`.

## Skill routing for Price-Less

| Job | Skill / command | Backend model |
|---|---|---|
| Cutout / RGBA master from floor photo | `higgsfield generate create image_background_remover --image <path> --wait` | dedicated remover |
| Studio catalog master, lifestyle room scene, hero banner | `higgsfield product-photoshoot create --mode <mode> ...` | gpt_image_2 @2k |
| eBay / Marketplace / Craigslist listing sets | `higgsfield marketplace-cards create --scope <scope> ...` | nano_banana_2 |
| Motion plate from an approved still (restrained dolly, hero reveal) | `higgsfield generate create kling3_0 --start-image <path> ...` | Kling 3.0 |
| Premium hero motion (rare, expensive) | `seedance_2_0` | Seedance 2.0 |
| Empty Wisconsin room environments (door home-slam beats, no people) | `soul_location` | Soul Location |
| Aspect variants of a finished cut (9:16 to 1:1 / 16:9) | `higgsfield generate workflow reframe --aspect_ratio <ar> ...` | reframe workflow |
| Hook / retention scoring of a finished cut | `higgsfield generate create brain_activity --video <path> --wait` | Virality Predictor |
| Cheap idea drafts before spending on quality | `z_image` | Z Image |

Skills NOT used for Price-Less brand work: `higgsfield-soul-id` (no AI people), Marketing Studio UGC/avatar modes (same reason), `higgsfield-websites`, `higgsfield-game-generation`.

## Verified credit costs (quoted live 2026-07-22)

| Item | Credits |
|---|---|
| image_background_remover | 1 |
| gpt_image_2 @ 2k (each product-photoshoot image) | 7 |
| nano_banana_2 (each marketplace-cards image) | 2 |
| nano_banana_pro | 2 |
| soul_location environment still | 0.12 |
| z_image draft | 0.15 |
| kling3_0, 5s | 10 |
| seedance_2_0, 5s @ 1080p | 45 |
| brain_activity | no pre-quote (runs at job time) |

Rule of thumb: a full single-product package (cutout + studio master + lifestyle scene + one 5s Kling plate) is about 25 credits, roughly 40 products per 1,000-credit month if every one gets motion. Category films amortize far better: mock in Remotion free, buy only approved plates.

## The gate (do not skip)

Per `SCENE-HIGGSFIELD-MAP.md`: Remotion owns the timeline, all type, all facts (title, dimensions, price, savings). Higgsfield is a plate service. Before ANY paid run:

1. Remotion scene still approved by Aaron.
2. Exact source file named.
3. One skill named for the run.
4. Prompt, duration, aspect ratio, and displayed credit cost recorded.
5. Aaron approves that one run.

Never bake product facts or brand type into generated pixels. Never claim 40% off. All of Aaron's motion standards apply (product-cutout motion graphics, 300/700 type, 9:16 master, minimal words, no AI people, verify every render plays).

## First run after top-up: black craftsman door proof (~18 credits)

Source: `public/real-photos/business/intake-black-craftsman-door.jpg` (verified on disk).

```bash
# 1. Cutout master (1 credit)
higgsfield generate create image_background_remover \
  --image "public/real-photos/business/intake-black-craftsman-door.jpg" --wait

# 2. Studio catalog master on neutral field (7 credits)
higgsfield product-photoshoot create --mode product_shot \
  --prompt "black craftsman-style door with white lite grid, clean studio catalog shot on warm cream background, subtle grounded shadow, straight-on, room for type" \
  --image <cutout-from-step-1>

# 3. Remotion: drop the cutout into PL-sku-micro-v1, render scene stills, get approval. Free.

# 4. Motion plate only after approval (10 credits)
higgsfield generate create kling3_0 \
  --start-image <approved-still> \
  --prompt "slow restrained dolly-in on the door, camera only, geometry locked, no added hardware" \
  --duration 5 --aspect_ratio 9:16 --wait

# 5. Assemble in Remotion, render, VERIFY PLAYBACK, then score (free-ish)
higgsfield generate create brain_activity --video <final.mp4> --wait
```

Aspect variants afterward via `reframe`, not re-generation.

## CLI habits

- Always `--wait` so the command blocks and prints the result URL.
- Media flags accept local paths (auto-upload) or prior job UUIDs.
- `higgsfield generate cost <model> [flags]` quotes before spending; `higgsfield account status` shows balance.
- `higgsfield model get <model>` for exact params when unsure.
- Never call `gpt_image_2` directly for product shots; the `product-photoshoot` command's backend prompt enhancer is meaningfully better.
