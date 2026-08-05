# Price-Less Motion System

Category-first motion identity for Price-Less Building Center.
Not per-SKU Hollywood commercials. Not AI presenters.

## Strategy hierarchy

1. **Category campaigns** — Doors, Windows, Kitchen & Bath, Exterior, then others
2. **Full-business campaign** — stitches category sequences into 15s / 30s / 60s brand cuts
3. **Lightweight inventory** — stills, price cards, templated micro-motion, weekly roundups

Desire comes from the category films. Transactions come from listings.

## Creative thesis

> Big-box-quality products discovered inside a constantly changing warehouse, presented with premium design, sold at liquidation prices.

Products stay real. Movement around them is designed.

Motion graphics beat AI people here: viewers already accept animated type, composites, and theatrical transitions as advertising language. Fake spokespeople imply endorsements that did not happen.

## Brand kit (locked for motion)

| Token | Value | Role |
|-------|-------|------|
| Ink | `#1a1818` | Primary text, logo linework, dark grounds |
| Rust | `#d04727` | Savings, urgency, accents only |
| Cream | `#f7f5f1` | Light grounds, type on dark |
| Soft | `#57534f` | Secondary text |
| Logo green | from `logo-official.webp` | Keep when using the circular seal |

**Type for motion**

- Display / kinetic headlines: Gotham Bold or Utopia (match storefront)
- Data / dimensions / prices: JetBrains Mono or Gotham Medium
- Never Inter / Roboto / Arial as the brand face

**Logo assets**

- `public/real-photos/logo-official.webp` — circular Price-Less + Builders Corner seal
- `public/real-photos/logo-priceless-clean.webp` — clean wordmark variants

**Required end card**

```
PRICE-LESS BUILDING CENTER
825 Washington St · Wausau, WI
PricelessBuilding.com
(715) 848-3855
```

## Higgsfield role map

| Job | Tool | Use for Price-Less? |
|-----|------|---------------------|
| Structured type, prices, dims, logo motion | **Vibe Motion** | **Primary** — category templates |
| Camera moves on real product stills | Cinema Studio / image-to-video | Secondary — shallow Hero Cam, Dolly In, Arc |
| Product page → launch clip | Marketing video generator | Category page URLs, not every SKU |
| Reference ad → structure | Video analyzer | Steal pacing only, never branding |
| Hook scoring | Virality / hook predictor | Test 3 openings per category cut |
| AI avatars / fake UGC | Marketing Studio UGC | **Do not use for SKU or category ads** |
| Character training | Soul | Skip for now |

MCP endpoint: `https://mcp.higgsfield.ai/mcp`  
Auth: OAuth via Higgsfield account (no API key in env).  
Credits: same pool as higgsfield.ai. **Unlimited marketplace modes do not apply through MCP.**

You already have Remotion MCP in Cursor for code-owned templates if we later harden a cut in Remotion/HyperFrames.

## Truth rules (non-negotiable)

```
gross_margin_percent   = (sale_price - cost) / sale_price
customer_savings_percent = (comparison_price - sale_price) / comparison_price
```

- Never invent dimensions, condition, quantity, warranty, delivery, or comparison prices.
- Never claim a blanket “40% off” unless the specific claim is verified for that creative.
- Category ads should say **pay less than big-box** / **real savings** / **inventory changes constantly** — not fake per-item percentages.
- Lead with **real warehouse photos**. Lifestyle / installed visualizations are secondary and must be labeled internally as concepts.
- Preserve panel count, glass pattern, finish, bore prep. No fake hardware or brand logos on products.

## Build order

1. Brand motion kit (logo, type, price card, end card)
2. **Doors** category film (hero category)
3. Kitchen & Bath (cabinets + vanities)
4. Windows / exterior
5. Full Price-Less business cut (combine strongest beats)
6. Weekly roundup template fed by real inventory stills

## Cost envelope (category vs per item)

| Layer | Approx cost | Notes |
|-------|-------------|-------|
| Employee photo + intake | ~$1.00 / item | Already in ops |
| Gemini classify / cleanup | ~$0.01–0.02 | Existing app routes |
| SERP comps (5–10, not 30) | ~$0.01–0.05 | Existing SerpApi |
| Listing stills + copy | ~$0.05–0.15 | Existing marketing studio |
| **Category Vibe Motion iteration** | **~$2–8 per finished cut** | Amortized across hundreds of SKUs |
| Per-item cinematic video | $0.40–2.00+ | Avoid as default |

Category films are the efficient spend. Per-item Higgsfield video is reserved for standouts and roundup inserts.

## Source footage already on disk

Warehouse aisle + door inventory (use first):

- `public/real-photos/business/floor-door-aisle-light-and-dark.jpg`
- `public/real-photos/business/floor-door-inventory-ten-lite-rows.jpg`
- `public/real-photos/business/floor-six-panel-oak-door-aisle.jpg`
- `public/real-photos/business/craftsman-door-warehouse.jpg`
- `public/real-photos/business/intake-black-craftsman-door.jpg`
- `public/real-photos/business/warehouse-unfinished-wood-doors.jpg`
- `public/real-photos/business/door-inventory-collage.webp`
- Walkthrough: `footage/x5-walkthrough-2026-06-11/*.mp4`

## Related app code

Inventory → Gemini → SERP → still marketing already lives in:

- `app/admin/marketing/`
- `lib/marketing/templates.ts`
- `app/api/marketing-variants/route.ts`
- `app/api/analyze-and-price/route.ts`

Higgsfield does **not** replace that pipeline. It sits above it for brand / category motion.
