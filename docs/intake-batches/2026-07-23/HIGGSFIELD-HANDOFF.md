# Production handoff — first real-stock batch (62 items, 2026-07-23)

Paste-ready brief for the Higgsfield/Gemini production chat (the one with the master doc). This is
the START of running marketing on REAL, current in-store stock and pushing it to every channel.

---

## Paste this into the production chat

> **New job: turn our first batch of real in-store inventory into marketing deliverables.**
>
> We just inventoried 62 real items from a July-23 store walk (photographed on the floor, tags read,
> prices captured). They're live in the Price-Less admin as drafts and are all sitting in the
> marketing **seed queue**. Every one is a permanent library seed — process them through the
> compounding pipeline (Gemini studio master → alpha cutout → in-room placement → Remotion feed
> post/story + Higgsfield kling motion clip), one permanent slug per item, nothing overwritten.
>
> **Work the queue from `priceless-building/`:**
> 1. `node scripts/marketing-seeds.mjs list` — the 70 seeds (62 new + 8 prior), newest first, with the minted slug.
> 2. `node scripts/marketing-seeds.mjs pull <SKU>` — mints the slug + downloads the real store photos to `docs/motion/seeds/<slug>/` with a `seed.json` (title, category, dimensions, tag price).
> 3. Run the `product-ad` skill on the best source photo (VIEW the photos first). It does: Gemini master → fidelity gate → cutout → placement scene → Remotion `PL-feed-post-v2` (serif Kohler stack) + optional Higgsfield `kling3_0` motion clip. Recipes in `PRICE-LESS DELIVERABLES/PRODUCTION-RECIPES.md`.
> 4. `node scripts/marketing-seeds.mjs done <SKU> --deliverables master,cutout,placement,feed-post[,micro,motion-clip]` — flips the item to "Ad kit ready" in `/admin/marketing`.
>
> **Hard rules (creative law — see agent memory `priceless-creative-directives`):** real product fidelity gate before anything ships; no AI people; no warehouse pans; type = serif Kohler stack, navy/gold, Wausau · Price-Less; text lives in props (never baked into pixels); verify every render plays before shipping. Only show a price when we actually have the tag price — never fabricate a discount.
>
> **Channels this feeds:** Instagram/Facebook feed posts + stories, marketplace listings (FB/eBay/Craigslist/OfferUp), 9:16 micros/motion clips for reels, and printable sell sheets.

---

## The batch (what's in the queue)

62 real items, all with real store photos + tag prices where legible. Category breakdown:

- **Vanities (VT-GEN-0001…0015)** — 7 vanity bases w/ tops + 8 standalone vanity tops. Strongest hero material.
- **Cabinets (CB-GEN-0001…0010)** — wall/base cabinets, tall pantry, open shelving, + 1 assorted-doors record.
- **Sinks (SK-GEN-0001…0008)** — pedestal, vessel, drop-in, undermount.
- **Countertops (CT-GEN-0001…0027)** — solid oak/walnut butcher-block slabs, one SKU per size, $16–$85 each.
- **Doors (DR-GEN-0001)** + **Lighting (LT-GEN-0001)** — cabinet-door pair + a 5-light brushed-nickel chandelier.

### Priority hero shortlist (shoot these first — photogenic single items with real prices)
| SKU | Item | Price | Why it leads |
|---|---|---|---|
| CB-GEN-0009 | Tall white pantry cabinet | $1,285 | Big statement piece, clean lines |
| VT-GEN-0006 | Double-sink marble-look vanity top | $675 | Wide hero, aspirational |
| VT-GEN-0001 | Wood vanity base + granite top + vessel sink | $485 | Complete vignette, sells the look |
| CB-GEN-0003 | Wood wall cabinet, double doors | $715 | Warm wood, strong form |
| LT-GEN-0001 | Five-light brushed-nickel chandelier | — | Lighting glows on motion (kling clip) |
| SK-GEN-0004 | White square vessel sink | — | Clean cutout, great placement scene |
| VT-GEN-0009 / 0010 | Cultured-marble / green-marble vanity tops | $139 / $89 | Affordable, high-volume social posts |

### Category story (not per-SKU)
The **27 butcher-block slabs** share the same rack — market them as ONE category story
("Solid oak & walnut butcher block, from $16") rather than 27 separate posts. One placement +
one feed post + one motion clip for the category; the individual SKUs stay in inventory for sale.

### Notes for fidelity
- Prices came off physical tags; dimensions only where a tag showed them; manufacturer is blank where it wasn't printed — **don't invent** specs in copy.
- Source photos are real store/rack shots (some angled). Use the Gemini master + placement to make them clean; keep the real product's true form (grid counts, finish, bowl shape) through the fidelity gate.

**Originals live in** `REAL-ORIGINALS/2026-07-23-july-store-drop/` (123 HEIC) and the item photos are in Supabase Storage (`item-photos` bucket). Seed pull grabs the stored photos automatically.
