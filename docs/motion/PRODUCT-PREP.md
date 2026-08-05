# Individual product prep: roster, quality assessment, cutout masters

Built 2026-07-22 in Claude Code. Full library sweep of `public/real-photos/business/` (144 files) for true single-product shots. Every candidate was resolution-checked, sharpness-scored (Laplacian variance at 1200px), and visually inspected on contact sheets before selection. Cutout masters generated with Higgsfield `image_background_remover` (1 credit each) into `docs/motion/renders/cutouts/`.

## Tier A: 14 hero products (cutouts generated)

| # | Source file | Product | Px | Sharpness | Notes |
|---|---|---|---|---|---|
| 1 | intake-black-craftsman-door.jpg | Black craftsman door, white 4-lite grid | 1050x1400 | 461 | The signature door. Yellow tape on left edge is on the product. Glass shows original background, restage later. |
| 2 | floor-arched-eight-panel-door.jpg | Arched 8-panel door, dark molding | 1200x1600 | 373 | Cleanest background in the library, straight-on, fully visible. |
| 3 | floor-arched-iron-studded-doors.jpg | Arched iron-strapped plank door pair | 1200x1600 | 716 | Dramatic statement pair, scroll hinges + studs. Slight angle. |
| 4 | floor-barn-door-diamond-glass.jpg | Reclaimed barn door, diamond leaded glass + track hardware | 1052x1600 | 768 | Character hero. Minor floor clutter at base, cutout solves. |
| 5 | dark-wood-exterior-door-glass.jpg | Dark craftsman door, art-glass upper + dentil shelf | 1536x2048 | 816 | Rich, straight-on, complete. |
| 6 | blue-patterned-bath-sink.jpg | Blue paisley/lace patterned basin, gold drain | 1536x2048 | 3177 | Sharpest photo in the entire library. Showstopper product. |
| 7 | dragon-pattern-sink-basin.jpg | Blue dragon china basin + matching pitcher | 1536x2048 | 1080 | One-of-a-kind. Nickel widespread faucet in frame. |
| 8 | intake-kohler-floral-vessel-sink.jpg | Embossed cream floral vessel bowl | 1050x1400 | 422 | On granite remnant, top-down 3/4. |
| 9 | kohler-floral-sink-basin.jpg | Black/white floral undermount + chrome widespread | 2048x1536 | 1224 | Beautifully framed in dark wood top. |
| 10 | copper-sink-wood-counter-display.jpg | Hammered copper oval basin + ORB faucet | 1536x2048 | 235 | On butcher block. Warm hero for rustic lane. |
| 11 | kohler-vessel-sink-gold-faucet.jpg | White round vessel + brushed gold Kohler faucet | 1536x2048 | 147 | Known hero from One Roof. Smooth porcelain reads lower on the metric, visually clean. |
| 12 | floor-globe-crystal-chandelier.jpg | Crystal-banded globe chandelier, lit | 1200x1600 | 359 | Lit product shot, warm. |
| 13 | crystal-ceiling-fan-warehouse.jpg | French Empire crystal basket chandelier | 1536x2048 | 1219 | FILENAME MISLABEL: this is a chandelier, not a fan. Gorgeous product. |
| 14 | white-vanity-black-top.jpg | White shaker vanity, black stone-look top | 2048x1536 | 406 | Best single-vanity shot, straight-on. |

## Tier B: bench (good products, usable with caveats, no cutouts yet)

| Source file | Caveat |
|---|---|
| brown-exterior-door-decorative-glass.jpg | Sharp (1079) but foam corner protectors + wrap on product |
| wood-look-exterior-door-glass-insert.jpg | Sharp (993), same wrap issue |
| floor-dark-espresso-four-lite-doors.jpg | Striking espresso pair, angled |
| craftsman-door-warehouse.jpg | Oak craftsman 6-lite, angled + wrapped in stack |
| pedestal-sink-gold-faucet.jpg | Kohler-style pedestal, complete, plywood + boxes behind |
| floor-white-vessel-sink-black-table.jpg | Modern vessel on display table |
| patterned-sink-dark-wood.jpg | Crystal-texture basin, slightly dark exposure |
| intake-crystal-candelabra-chandelier.jpg | Complete but busy background, price tag |
| pendant-light-fixture-warehouse.jpg | Ring-pattern drum pendant, distinctive |
| red-sputnik-chandelier.jpg | Fun statement, crossing wires + tag clutter |
| reclaimed-wood-framed-mirror.jpg | Barnwood mirror w/ hooks, rustic lane |
| floor-barrel-glass-top-table.jpg | Whiskey barrel table, local-character piece |
| vanity-sink-black-faucet.jpg | Dark top + matte black faucet closeup (near-dupe: vanity-top-black-faucet) |
| dark-wood-vanity-white-top.jpg | Solid straight-on vanity |
| marble-vanity-black-legs.jpg | Console vanity, clutter below shelf |

## Rejected (with reasons)

- **Resolution fails (<1200px long edge):** intake-brushed-gold-cabinet-pulls (640x440), rustic-wood-bed-frame (1024x630), dark-wood-vanity-white-top-2 (1170x731), rustic-wood-kitchen-island (1242x709)
- **Wrap obscures product:** wrapped-wood-glass-door (shrink wrap over glass)
- **Occlusion:** knotty-pine-6-panel-door (support rail across face)
- **Commodity / weak hero:** ceiling-fan-warehouse-display, white-vanity-top-sink, grey-vanity-white-top, wood-vanity-white-sink, stainless-double-sink-chrome-faucet, surplus-stainless-double-sink, trough-sink-vanity-display (fine for listing photos, not motion heroes)
- **Row/inventory shots, not single product:** oak-double-vanity-warehouse, intake-butcher-block-stacks, floor-live-edge-wood-slabs
- **Wrong bucket:** double-sink-bathroom-vanity-black.webp (finished 4 Squared install, heavily compressed webp; belongs to install lane)
- **Near-duplicates dropped:** decorative-light-fixture-warehouse (same style as floor-globe-crystal-chandelier), vanity-top-black-faucet (same setup as vanity-sink-black-faucet)

## Known limitations of the cutout masters

- Glass panes keep whatever was behind them in the original photo (honest, but restage via product-photoshoot for hero use).
- Anything physically on the product (yellow tape, price tags) stays. Removal is an edit decision that needs Aaron's per-product OK, since tags/tape are purchasing reality.
- Cutout resolution equals source resolution. Upscale (`bytedance_image_upscale`) only if a specific deliverable needs it.

## Next steps (per HIGGSFIELD-CLAUDE-CODE-RUNBOOK.md, each needs approval before spend)

1. Studio catalog masters via `product-photoshoot --mode product_shot` on approved cutouts (7 credits each).
2. Remotion SKU micros using cutouts directly (free, `PL-sku-micro-v1`).
3. Kling motion plates on approved stills (10 credits per 5s).

## Studio masters verification (2026-07-22, sheet 02-studio-masters.jpg)

7 of 8 rendered (craftsman door retrying after transient 503). PASS: paisley basin, copper basin + faucet, Kohler vessel + gold, globe chandelier, French Empire chandelier, white vanity black top. FLAGGED: arched-eight-panel-door studio master shifted the finish lighter (honey oak) vs the real product's darker walnut; do NOT use for sale-item claims; re-run with explicit finish-fidelity prompt or use the raw cutout.

## Stage 2 results (2026-07-22, sheet 05-stage2-fixes-bench.jpg)

- Fixed + recut (PASS): iron-studded arch pair (NOTE: arch tops are nano-reconstructed, synthesized geometry, brand/category motion only, never the item listing), dark art-glass craftsman (string removed), dragon basin (pitcher removed), cream floral vessel (granite removed), barn door (clean, track hardware intact).
- All 8 studio masters complete; black craftsman studio master straightened with tape removed by restage.
- Bench cutouts: 14 of 14 in (pedestal retried OK). Marginal masks on candelabra chandelier, red sputnik, barnwood mirror (busy sources, bench only).
- Balance after stage 2 + music: 888 credits.

## Gemini studio masters (2026-07-22, sheets 08 + 09, dir renders/gemini-studio/)

All 25 products re-mastered via scripts/gemini-isolate.mjs (glass-safe studio prompt, API pennies, zero Higgsfield credits). This is now the master library for motion work.
- PASS (~20): both craftsman doors (tape/wrap gone), arched 8-panel (TRUE walnut, replaces flagged Higgsfield version), barn door + track, art-glass door (string gone), brown exterior (wrap gone), espresso pair, paisley/copper/cream/floral/patterned/white-vessel sinks, pedestal, globe + candelabra + sputnik + ring pendant lighting, barrel table, barnwood mirror, both vanities.
- REJECT: crystal-ceiling-fan-warehouse-gemini (Gemini merged the background ceiling fan INTO the chandelier, hybrid product). Use Higgsfield cutout or re-prompt without the fan.
- MOTION-ONLY (staging or detail invented, never listings): dragon basin (invented mini-vanity), vanity-sink-black-faucet (invented cabinet), kohler-vessel (faucet mount moved), iron-studded pair (hinge count), espresso pair (lite pattern simplified).
- STILL WRAPPED: wood-look-exterior-door (Gemini honestly kept the foam wrap; re-run with wrap-removal instruction if wanted).
- Standing gate: diff every Gemini master against its source before ANY listing use.

## Gemini alpha cutouts + full micro batch (2026-07-22 evening, sheets 10-14)

- 21 Gemini masters run through `image_background_remover` (1 credit each, 21 total) into `renders/gemini-cutouts/`. All 21 inspected on sheets 10-11: clean masks, glass and openwork preserved, price tags and mount wiring honestly kept (candelabra, sputnik, white-vessel table). These transparent PNGs are now the motion hero library; copies live in `motion-remotion/public/products/`.
- 21 SKU micros rendered from those cutouts via `PL-sku-micro-v1` (driver: `motion-remotion/scripts/render-micros.py`, the full 21-SKU manifest with approved copy; cutout as productSrc AND productCutoutSrc, brand grounds from tokens, ffmpeg normalize to yuv420p BT.709 tv-range baked in). 5 re-renders swap the old Higgsfield-master micros (paisley, copper, black craftsman, globe, white vanity) and 16 are new (arched 8-panel, barn door, art-glass craftsman, brown decorative-glass, oak craftsman, floral vessel bowl, floral undermount, crystal texture basin, modern white vessel, pedestal, candelabra, red sputnik, ring pendant, barrel table, barnwood mirror, espresso vanity).
- KEPT on Higgsfield masters, not swapped: empire chandelier (Gemini master rejected) and Kohler vessel (Gemini moved the faucet mount; motion-only). Both re-encoded to the standard below.
- White vanity note: the Gemini master shows the TRUE compact unit; the old Higgsfield studio master had invented a wider drawer layout. The swap corrects real product geometry.
- Every micro frame-verified on sheets 12-14 (scenes A/B/C per SKU) + scripted black-frame check. All 23 micros in `renders/review-sheets/` are yuv420p BT.709 limited range, 1080x1920@30, 3.5s, faststart.
- SKU-named micros only use fidelity-PASS masters. Motion-only masters (dragon basin, black-faucet vanity closeup, iron-studded pair, espresso four-lite pair) are reserved for category/brand beats, never SKU ads. Wood-look door still needs its wrap-removal re-run before it can join.

| tall-white-pantry-cabinet-cb-gen-0009 | MOTION-ONLY | upper section rendered 2-door vs 3-panel source; finish/shaker/hinges true; listings use real photos (listing-era rule) |
| white-vanity-top-34-vt-gen-0008 | PASS | true white cultured marble, oval bowl, 3 holes, backsplash and sticker preserved |
| wood-vanity-base-with-vt-gen-0001 | MOTION-ONLY | oak base, shaker door + 2 drawers, bronze knobs, tan granite all true; Gemini invented a lighter granite inset patch under the bowl (cloth in source) and a wood stem under the black plinth |

## Sinks + doors + lighting batch (2026-07-23 late, SK/DR/LT-GEN, sheet 31-sinks-lighting-kits.jpg)

Fidelity gate per Gemini studio master vs source (grade drives listing use; MOTION-ONLY still ships the full kit):

| white-ceramic-pedestal-sink-sk-gen-0001 | PASS | fluted column, crescent saddle top, stepped round foot, white glaze all true; price tag removed by restage |
| white-wall-cabinet-toilet-cb-gen-0001 | MOTION-ONLY | solid recessed panel + pale gray finish + single door true, sticker removed; box depth flattened to door-slab read (first attempt invented glass, rejected) |
| dark-wood-vanity-base-vt-gen-0002 | PASS | dark brown base, 3 left drawers, raised-panel door, integrated speckled copper-fleck bowl top all true; price sticker removed (restage precedent) |
| wood-wall-cabinet-cb-gen-0002 | MOTION-ONLY | 2 shaker doors true; finish rendered darker than cinnamon source; invented knob hole + side pin holes + plinth reveal |
| white-ceramic-pedestal-sink-sk-gen-0002 | MOTION-ONLY | oval bowl, twin fan soap wells, scalloped apron, high back rim all true; Gemini invented a clean wood display plinth under the leaning basin (staging), so never listings |
| cultured-marble-vanity-top-vt-gen-0009 | MOTION-ONLY | bowl interior recolored to speckled tan vs smooth almond source, faucet holes omitted; form/deck true (mold-occluded source required masking) |
| white-vanity-base-with-vt-gen-0003 | MOTION-ONLY | white shaker base, left door + 3 right drawers, glossy red cast top true; Gemini simplified the ornate winged bronze faucet handles into plain levers and muted the top speckle |
| wood-wall-cabinet-double-cb-gen-0003 | PASS | 2 upper shaker doors + 2-panel lift-front lower section + warm brown maple all true; sticker removed |
| green-marble-vanity-top-vt-gen-0010 | PASS | true dark green speckle, oval white bowl, 3 holes, backsplash kept; clutter removed |
| white-open-shelving-unit-cb-gen-0004 | MOTION-ONLY | arch top + 3 shelves + open base + unfinished maple left end all true; invented granite pedestal slab under unit (carried from source countertop) |
| white-vanity-base-with-vt-gen-0004 | PASS | 2nd isolate run (1st mangled bottom drawer + invented feet, discarded); 3 flat left drawers, 2 shaker doors, grey speckled top + backsplash, dark integrated oval bowl, raw toe kick honestly kept |
| grey-double-bowl-vanity-vt-gen-0011 | MOTION-ONLY | invented extra grey slab in foreground; bowls read glassy through source shrink-wrap; speckle/holes true |
| white-tall-cabinet-with-cb-gen-0005 | PASS | raised-panel door + knob + 2 drawers with nickel bar pulls + cream finish all true |
| white-vanity-base-with-vt-gen-0005 | MOTION-ONLY | 2nd isolate run (1st swapped the integrated dark bowl to white, discarded); layout true (2 shaker doors, 3 flat right drawers, false front) but the dark grey speckled top renders lighter than the near-black source |
| cream-ceramic-vessel-sink-sk-gen-0003 | MOTION-ONLY | cream glaze, conical bowl, concentric drain rings, black display stand all true; embossed floral relief was redrawn with rearranged/larger blooms vs the source's denser uniform pattern (pattern drift) |
| white-vanity-top-vt-gen-0012 | PASS | true glossy white, oval bowl with drain, 3 holes, backsplash; price sticker pre-masked out |
| wood-wall-cabinet-double-cb-gen-0006 | MOTION-ONLY | 2 shaker doors + square proportions true, sticker removed; finish rendered darker than light fawn maple source |
| double-sink-vanity-top-vt-gen-0006 | MOTION-ONLY | marble-look deck, 2 rectangular white integrated sinks, single hole each, backsplash + right return all true; Gemini staged it on an invented white display plinth (real item sits loose on particleboard build-up) and left softbox edges in frame |
| dark-wood-wall-cabinet-cb-gen-0007 | PASS | 2 shaker doors + charcoal oak grain + W2439 proportions true, sticker removed; stray softbox edge top-left of studio frame (gone after cutout) |
| speckled-vanity-top-49-vt-gen-0013 | MOTION-ONLY | wrapped undermount basin re-rendered as clean white bowl, deck hole count unverifiable; speckle/form true |
| dark-wood-vanity-base-vt-gen-0007 | PASS | 2nd isolate run (1st warmed the finish and whitened the almond bowl, discarded); grey-brown base, 2 shaker doors + full false front, white grey-veined top, almond rectangular bowl, 3 holes, backsplash all true |
| white-square-vessel-sink-sk-gen-0004 | PASS | square wading-pool vessel, upswept rim corners, center drain, white glaze true; Kohler sticky note + burl display board honestly kept from source; stray softbox edge top of studio frame (gone after cutout) |
| light-wood-vanity-base-cb-gen-0008 | MOTION-ONLY | greige finish + 2 shaker doors + 3 drawers + black pulls true; two separate base units merged into one run with shared counter/toe kick; softbox edges in studio frame (gone after cutout) |
| tan-speckled-vanity-top-vt-gen-0014 | MOTION-ONLY | faucet holes omitted and tone slightly lightened; form/bowl/backsplash true; sticker+occluders pre-masked |
| white-drop-in-sink-sk-gen-0005 | PASS | oval self-rimming drop-in, 3-hole widespread deck, center overflow, drain, white glaze all true; Kohler sticky note removed by restage; NOTE seed source-02 shows a different round undermount bowl, ignored |
| assorted-cabinet-doors-priced-cb-gen-0010 | REAL-PHOTO LOT | multi-item lot, isolation skipped by design; feed post uses real source-04 rack display; no master/cutout/placement |
| white-drop-in-sink-rectangular-sk-gen-0006 | PASS | rectangular bowl, clipped-corner rim, 3-hole side deck, triple overflow holes, installed chrome drain all true; store shadow band cleaned by restage |
| brown-marble-vanity-top-vt-gen-0015 | REJECT | single edge-on wrapped occluded photo; bowl/holes unverifiable, master rendered flat slab; SKU skipped, no deliverables |
| white-undermount-sink-oval-sk-gen-0007 | MOTION-ONLY | oval bowl, dark unfinished cast-iron undermount rim edge, center drain all true; glaze rendered warm greige (inherited the shelf's warm light) vs the white/biscuit product, softbox edges both sides of studio frame |
| black-double-bowl-drop-in-sk-gen-0008 | MOTION-ONLY | two rectangular bowls + black finish true; Gemini DROPPED the rear faucet deck and its holes (visible in source) and rendered the gloss more matte; single cropped source photo forced reconstruction |
| two-cabinet-doors-one-dr-gen-0001 | MOTION-ONLY | third-roll master adopted: grey cerused two-panel door (twin behind, true to photo) + dark knotty-alder two-panel door, both solid panels and mid-rails true; rolls 1-2 REJECTED (invented a third craftsman glass door / turned the grey door's upper panel to glass); residual store stock behind the pair kept honestly |
| five-light-chandelier-brushed-nickel-lt-gen-0001 | PASS | five curved square-profile arms, five up-facing frosted speckled trumpet shades, brushed nickel column + dome canopy, mount wires honestly kept; softbox walls at studio frame edges (gone after cutout) |

Batch notes: chandelier placement roll 1 drew SIX shades (arm-count drift) and was replaced by a five-shade re-roll before the feed post shipped; sk-gen-0007 and sk-gen-0008 placements were generated from the SOURCE photos (not the drifted masters) to keep true color/geometry. All 10 feed posts + textless plates encoded BT.709 yuv420p crf16 into PRICE-LESS DELIVERABLES 01/03.
