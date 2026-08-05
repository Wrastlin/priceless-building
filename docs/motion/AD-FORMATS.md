# Ad formats, brands, and sales channels

## Current production priority

The primary deliverable is `ROOF-brand-30-v1`, the 30-second One Roof whole-business film. It brings Price-Less, Builders Corner, and 4 Squared together over existing real photography. See `ONE-ROOF-FILM.md`.

SKU micros are capability demos and a learning track until real inventory is loaded. They remain useful building blocks for future category work, but they are not the sales deliverable being shipped today.

## Correction

The baseline is **product-isolated motion graphics**, not camera pans across warehouse scenes. Start with a real product cutout or faithful Gemini-cleaned studio master, then design kinetic type, verified prices or dimensions, lighting sweeps, graphic environments, masks, and transitions around that isolated hero.

A full-scene Kling, Cinema, or image-to-video dolly, arc, orbit, or pan is not the requested ad. Warehouse plates may be brief establishing context, but they cannot be the primary visual or substitute for product isolation and motion design. See `TRUE-MOTION-GRAPHICS-PLAN.md`.

Price-Less motion system map. Real photos + motion graphics. No AI people.
AI stills only if Aaron explicitly approves a file from `AI-GENERATED-INDEX.md`.

## Creative ladder (what we actually make)

### Capability demos

| Tier | Length | Scenes | Feel |
|------|--------|--------|------|
| **SKU micro-ad** | **3–4s max** | **2–3** | Still → facts → Kohler-easy graphic: product + PRICE-LESS + name + dims/price. See `SKU-MICRO-AD.md` |

### Follow-on formats

| Tier | Length | Feel | Primary use |
|------|--------|------|-------------|
| **Feed / category** | 8–20s | Multi-beat category story | IG Reels when we expand |
| **Brand film** | ~60s | One roof / sister brands | Site homepage, YouTube |
| **Listing still** | still | Honest product + price | eBay, Marketplace, Craigslist |

Most posts are **not** 20-photo dumps. They are **one strong creative** (or a tiny set) that carries the brand, then listing copy does the sell.

## Three brands, three jobs

| Brand | Ad job | Visual language |
|-------|--------|-----------------|
| **Price-Less** | Liquidation finds. Hunt energy. Savings vs big box (verified language only). | Light luxurious product isolation on cream; rust on price only. See `BRAND-MOTION-STYLES.md` |
| **Builders Corner** | Premier brands and design staging for professional remodels. | Kohler-adjacent: parchment, brass, calm serif, product as furniture |
| **4 Squared** | Craftsmanship and experience from the install crew. | Warm daylight craft macros → finished vignettes |

Do not mash all three into every short. Micros and feed pulses are usually **one brand**. The 60s “one roof” film is where they meet.

## Channel matrix

| Channel | Best formats | Notes |
|---------|--------------|-------|
| **Instagram** | Micro loops, feed pulse 7–12s, category 15–20s 9:16 | Motion graphics over real photos; Reels-first |
| **Facebook Page** | Same as IG + 60s brand | Can pin brand film |
| **Facebook Marketplace** | Listing still + optional 5–8s | Automation limited; keep honest, product-led |
| **eBay** | Still hero + gallery; rare short video | Prefer clean cutout / catalog still |
| **Craigslist** | Still + text | Motion less useful; export still frames from creatives |
| **Nextdoor** | Feed pulse / still | Local Wausau voice; place + savings |
| **pricelessbuilding.com** | Micros on dept tiles, 60s on home, category on shop | Highest control over motion |

## Higgsfield vs Remotion (decision)

From `HIGGSFIELD-MOTION-SKILLS.md` and live MCP (`explainer_video`):

| Need | Tool |
|------|------|
| Kinetic type, logo, price cards, 1.5s micros | **Vibe Motion** (structured motion; Remotion-like editability in HF) |
| Shallow camera on a real still | **Cinema / image-to-video** (restrained presets only) |
| Join approved clips end to end | **`explainer_video`** (free stitch; optional VO) |
| Complex 60s brand film with precise brand kit reuse | **Remotion / HyperFrames** as compositor when HF assembly is not enough |
| Fake UGC / AI presenters | **Never** |

Practical rule:
- **Micros + feed + category:** Higgsfield-first (generate plates + type, stitch with `explainer_video`).
- **60s one-roof / sister-brand films:** generate plates in Higgsfield, **composite in Remotion** if timing/typography must stay pixel-perfect across revisions.

MCP always burns credits (no “unlimited” through MCP). For real volume, **Ultra** (~3,000 credits) is the production tier.

## Build order (after media audit lands)

1. Finish media workspace: pixel audit, AI index, annotations
2. Brand kit micros (logo, end card, claim card) × 3 brands
3. Price-Less department micros (doors, windows, cabinets, vanities, lighting…)
4. One Price-Less feed pulse (warehouse hunt)
5. One Builders Corner feed pulse (premier remodel staging)
6. One 4 Squared feed pulse (crew craft)
7. Category 20s: Doors (Price-Less)
8. Brand 60s: One roof in Wausau
9. Listing templates that pull stills from the same plates

## Naming convention for outputs

```
PL-micro-doors-v1-9x16
PL-feed-warehouse-v1-9x16
BC-feed-premier-kitchen-v1-1x1
FS-feed-craft-kitchen-v1-9x16
PL-cat-doors-v1-9x16
ROOF-brand-60-v1-16x9
```

Store renders under `docs/motion/renders/` (gitignored if large) or a Drive folder; keep prompts/storyboards in `docs/motion/`.

## Truth rules (unchanged)

- Verified comparison language only
- No blanket “40% off” unless checked
- No owner/staff faces
- Real photos lead; AI stills flagged and excluded from brand motion by default
