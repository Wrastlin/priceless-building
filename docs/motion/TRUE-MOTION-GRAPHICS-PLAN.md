# True Motion Graphics Plan

## Correction

The previous output was wrong. A Kling camera pan, dolly, or arc across a warehouse photograph is animated footage, not the product motion graphics Aaron requested. It leaves the aisle, floor, racks, clutter, and camera move as the subject. The product is still trapped inside a documentary warehouse plate.

The required baseline is different:

1. Isolate the real product.
2. Clean it without redesigning it.
3. Place that isolated product in a designed graphic world.
4. Animate type, light, measurements, price, masks, depth, and transitions around it.
5. Keep the product as the sole visual hero.

Apple-style product motion graphics means the visual logic used in a slim MacBook launch film: one precisely presented object, controlled negative space, deliberate edge lighting, restrained typography, exact feature callouts, elegant transitions, and motion that explains form. It does not mean copying Apple branding or pretending a warehouse photo is a studio film.

## Non-negotiable creative definition

**Motion graphics for Price-Less**

- A real product cutout or faithfully cleaned studio rendering is the hero.
- The background is a controlled graphic environment: ink, cream, soft gray, gradients, light bands, grids, masks, or abstract architectural planes.
- Motion belongs to designed elements: kinetic type, dimension lines, price numerals, category labels, lighting sweeps, shadows, parallax layers, wipes, reveals, and composited transitions.
- Product movement is restrained and purposeful: a slight rise, controlled turn, hinge-like reveal, masked detail crop, or subtle depth shift.
- Product facts remain true. Dimensions, price, brand, and savings appear only when verified.

**What we wrongly delivered**

- Full warehouse photographs sent to Kling for a synthetic pan, dolly, or arc.
- The aisle and floor remained visible and competed with the item.
- Camera movement was treated as the concept.
- There was little or no designed type, pricing, dimensional annotation, graphic environment, or product isolation.

Do not defend or repeat that approach. It may be useful as a one-second establishing shot later, but it is not the ad and it is not the motion-graphics baseline.

## Correct production pipeline

### 1. Select and preserve the source

- Choose the cleanest, highest-resolution real photo with the least overlap and the most accurate view of the product.
- Keep the original unchanged as the truth reference.
- Record product identity, finish, panel count, hardware holes, glass pattern, dimensions, price, and brand only from verified inventory data.
- Reject a source if essential edges are hidden by another object. Generative reconstruction is not permission to invent the missing product.

### 2. Create two product masters

Create both when the item allows it:

1. **Transparent cutout master:** RGBA PNG with clean edges and no warehouse.
2. **Clean studio master:** isolated product on a neutral studio background with a believable contact shadow.

The existing app already supports this:

- `POST /api/clean-background` calls `lib/ai/remove-background.ts`.
- Default `mode: "studio"` uses the fixed Gemini model and preserves glass by filling a clean studio wall behind panes.
- Explicit `mode: "cutout"` tries Photoroom, then remove.bg, then Gemini.
- The intake UI currently calls studio mode and appends the result without replacing the original.

Provider rules:

- **Opaque products:** start with Photoroom or Higgsfield `remove_background` for a true transparent cutout. The app's `mode: "cutout"` is also valid.
- **Doors or windows with glass:** use the app's Gemini studio mode first. Generic segmentation can turn glass into holes or retain warehouse junk through it.
- **Difficult edges:** compare Photoroom and Higgsfield `remove_background`; use the cleaner alpha, then repair locally if needed.
- **Never discard the original:** the cleaned image is a marketing derivative, not the inventory truth image.

### 3. Gemini hero cleanup

Use the existing Gemini clean-background route as a fidelity pass, not a redesign tool. The prompt must preserve exact materials, color, proportions, angle, panel layout, muntins, bore preparation, and hardware holes.

Target output:

- centered or deliberately offset product
- premium manufacturer-catalog lighting
- clean glass treatment where applicable
- subtle contact shadow
- no warehouse clutter
- no new fixtures, handles, logos, text, or architectural details

For a transparent asset, do not rely on Gemini to be the alpha-mask generator. Generate the clean studio master with Gemini, then isolate that simpler studio result with Photoroom, the app cutout mode, or Higgsfield `remove_background`.

### 4. Build a graphic environment

Use one of these controlled systems:

- ink-black field with a narrow cream rim light
- warm cream field with rust-red typographic accents
- soft graphite gradient with a faint architectural grid
- split field that reveals finish or category through a vertical wipe
- low-fidelity paper, halftone, blueprint, or dimensional-drawing language

Low fidelity must look intentional. Designed masks, crisp typography, stepped frame rates, simple 2.5D layers, and graphic shadows are acceptable. Fake realism, warped products, and AI people are not.

### 5. Animate the motion-graphics layer

**Vibe Motion is the primary Higgsfield tool** for:

- kinetic headlines
- verified price numerals
- dimension lines and labels
- logo and end-card motion
- category systems
- light bars, masks, wipes, grids, and graphic transitions

**Marketing Studio Hyper Motion product modes without avatars** may be tested on the isolated hero. The input must be the cutout or clean studio master, not a full warehouse scene. Reject any mode that introduces hands, presenters, invented rooms, altered product geometry, or unverified text.

**Cinema is secondary** and only operates on isolated or clean studio product plates. Acceptable use is a restrained micro push, controlled product turn, or detail reveal that supports the composition. Do not send a full warehouse plate to Cinema and call the result motion graphics.

**Higgsfield `remove_background`** is an isolation option, not an ad generator. Use it to produce or improve the cutout before motion work.

### 6. Composite with Remotion or HyperFrames

Vibe Motion can supply a rendered type or graphic layer, but the final ad does not need to remain trapped in Higgsfield.

Use Remotion or HyperFrames when exact timing, repeatable product swaps, verified data, or brand consistency matters:

- import the transparent product PNG as the hero layer
- place Vibe Motion output below or above it as a background, matte, or type layer
- use alpha-capable exports when available; otherwise use a solid keyed background or recreate critical type natively
- animate product scale, position, masked reveals, shadows, and light sweeps in code
- bind dimensions, prices, SKU, and category labels to verified inventory data
- keep logo, safe areas, end card, and platform aspect ratios deterministic
- reuse one composition across doors, vanities, sinks, and later category films

If Vibe Motion renders the kinetic type, Remotion/HyperFrames should still own the final product cutout, factual overlays, logo, end card, audio timing, and export. This avoids paying credits to regenerate an entire clip for a typo or price change.

### 7. Assemble upward

Build in this order:

1. 5 to 8 second single-product tests
2. 10 to 15 second category pulses using three approved product beats
3. 15 to 25 second category ads
4. 30 to 60 second Price-Less business ads assembled from the strongest category systems

Warehouse footage may appear briefly to establish real inventory, but it must cut into product-isolated design. It cannot become the dominant visual grammar.

## Prompt reference language

Use this language as the shared art direction:

> Modern premium product launch motion graphics inspired by the restraint of a slim MacBook reveal. One isolated building product is the sole hero. Deep negative space, precise edge lighting, subtle controlled reflections, elegant dimensional callouts, restrained kinetic typography, clean masks, deliberate pacing, and crisp transitions. The product remains geometrically and materially identical to the reference. No people, no hands, no warehouse, no lifestyle room, no invented hardware, no camera tour of a scene.

For lighter Price-Less work:

> Contemporary product motion design with intentional low-fidelity graphic language: isolated real product, cream and ink fields, rust accents, blueprint lines, bold Gotham-style type, stepped wipes, simple 2.5D depth, and verified price or dimensions. Designed, direct, and retail-clear. No photoreal human activity and no warehouse camera pan.

## First three test recipes

Each test gets one approved source, one isolation comparison, one 5 to 8 second motion test, and one still frame for fidelity review. Do not batch further variants until the product master passes inspection.

### Test 1: Black craftsman door

Purpose: prove edge lighting, panel fidelity, and a premium dark-field reveal.

Exact steps:

1. Use the best original black craftsman door intake photo. If `public/real-photos/business/intake-black-craftsman-door.jpg` is restored or available, treat it as the first candidate. Otherwise select the current inventory original and document its path.
2. Verify panel layout, glass pattern if present, bore preparation, finish, dimensions, and price.
3. Run `POST /api/clean-background` with `mode: "studio"` if the door contains glass. Run `mode: "cutout"` for a fully opaque slab.
4. If studio mode was required, run the clean studio output through Photoroom or Higgsfield `remove_background` to obtain a transparent PNG without punching out the glass.
5. Inspect at 200 percent: top corners, threshold, hinge edge, bore holes, muntins, and glass. Reject geometry changes.
6. Create a 9:16 ink-black composition. Door enters from near-black through a narrow cream edge-light sweep. Add a faint rust vertical rule behind it.
7. Animate the verified width and height as thin mono dimension lines. If dimensions are not verified, use the category label `CRAFTSMAN ENTRY DOOR` instead.
8. Add a restrained headline: `BUILT TO MAKE AN ENTRANCE.` Use Price-Less brand type, not generic AI lettering.
9. Finish on the real cutout, verified price if available, then the standard Price-Less end card.
10. Export 6 seconds. Review paused frames for panel drift and text accuracy before making variants.

Vibe Motion prompt:

> 9:16 premium product motion graphic. One isolated black craftsman entry door is the sole hero on an ink-black field. Slim-MacBook-launch restraint: precise cream rim-light sweep tracing the silhouette, subtle graphite floor reflection, large negative space, thin mono dimension lines, and a rust accent rule. Kinetic headline `BUILT TO MAKE AN ENTRANCE.` Product geometry must not change. No warehouse, room, people, hands, hardware invention, orbiting scene camera, or extra doors.

### Test 2: Vanity

Purpose: prove floating product composition, material callouts, and retail price hierarchy.

Exact steps:

1. Select the clearest real vanity photo with the whole cabinet and top visible. Record the exact source path when selected.
2. Verify finish, sink count, top material only if known, width, included hardware, brand, and price.
3. Create a transparent cutout with Photoroom, the app's `mode: "cutout"`, or Higgsfield `remove_background`.
4. Use Gemini studio mode only if the original requires cleanup of reflections or floor contamination. Preserve faucet holes, drawer count, pulls, toe kick, sink shape, and countertop profile.
5. Inspect the alpha around legs, toe kick, countertop, sink opening, and pulls.
6. Compose on warm cream with a soft graphite shadow and a low-contrast architectural grid.
7. Float the vanity upward by only a few pixels while a rust block wipes behind it. Reveal three verified callouts one at a time, such as width, finish, and included top.
8. Make the verified price the final large type event. If price is unavailable, use `REAL VALUE. READY FOR THE REMODEL.` with no number.
9. Transition out using the countertop edge as a horizontal mask into the end card.
10. Export 7 seconds in 9:16 and 1:1 from the same composition.

Vibe Motion prompt:

> Modern product-ad motion graphic for one isolated bathroom vanity. Warm cream background, soft graphite architectural grid, restrained rust-red block wipes, premium edge lighting, subtle contact shadow, precise material callouts, and large verified price typography. Elegant slim-laptop-launch pacing with intentional low-fidelity 2.5D movement. Keep drawer count, pulls, sink, countertop profile, finish, and proportions exact. No bathroom scene, people, hands, water, decorative props, or warehouse.

### Test 3: Kohler sink

Purpose: prove white-on-light separation, brand restraint, and shape fidelity.

Exact steps:

1. Select the clearest real Kohler sink photo and verify that the Kohler identity is visible in the source or inventory record. Do not add the brand from assumption.
2. Verify basin type, hole configuration, dimensions, included components, condition, and price.
3. Use the app's `mode: "cutout"` or Photoroom first. Compare against Higgsfield `remove_background` because white ceramic edges can disappear on light floors.
4. Use Gemini studio mode to clean cast, glare, or warehouse reflection only if needed. Preserve rim thickness, drain location, basin curvature, and faucet-hole count.
5. Inspect the alpha on the back rim, bowl interior, drain, and every faucet hole. Reject smoothed-away openings.
6. Place the sink on a graphite-to-ink gradient with a soft cream halo so the ceramic silhouette reads clearly.
7. Animate a narrow lighting sweep across the rim, then trace the verified basin outline with a thin cream line.
8. Bring in `KOHLER` only if verified, followed by verified dimensions or price. Keep logo treatment factual and restrained.
9. Use a circular drain-centered mask to transition to the Price-Less end card.
10. Export 5 to 6 seconds. The product must remain still enough to judge shape.

Vibe Motion prompt:

> 9:16 premium motion graphic for one isolated white Kohler sink, only if brand is verified. Graphite-to-ink gradient, soft cream halo, precise ceramic edge-light sweep, thin outline trace, restrained mono dimensions, and crisp price typography. The sink is the sole focus with modern slim-MacBook product-launch restraint. Preserve basin curvature, rim, drain, faucet holes, and proportions exactly. No kitchen, bathroom, water splash, people, hands, props, warehouse, or scene camera move.

## Credit-efficient Plus plan usage

Once the Plus plan is active, treat its roughly 1,000 monthly credits as a controlled test budget, not permission to spray variants.

- Use local selection, the existing Gemini route, Photoroom, and static compositing before any video generation.
- Make and approve one cutout master per product. Never pay to rediscover the crop or alpha in every generation.
- Storyboard with still frames first.
- Use Vibe Motion for typography and graphics, where iteration is the actual need.
- Generate the shortest viable 5 to 8 second test at the lowest useful resolution. Upscale only the approved final.
- Test one variable at a time: lighting, type timing, or transition, not all three.
- Use Hyper Motion only after the isolated master and static art direction are approved.
- Reserve Cinema for one secondary micro-shot on a cutout or studio master.
- Do not use premium Kling, Veo, or Sora generations for exploratory warehouse pans.
- Remember that MCP calls deduct credits even when a web product advertises an unlimited mode. Prefer eligible web unlimited modes when the plan actually includes them and the workflow can be reproduced there.
- Keep a generation ledger with source asset, tool, model or mode, duration, aspect ratio, prompt, credits, result, and accept or reject reason.
- Stop after two failed generations of the same concept. Fix the input, mask, prompt, or composition locally before spending again.

Suggested first-month cap:

- 10 percent for isolation and tool comparison
- 35 percent for the three single-product tests
- 35 percent for the first category assembly
- 20 percent held for approved revisions and final upscale

These are budget guardrails, not a promise of a fixed number of outputs. Credit prices and plan entitlements can change, so verify the displayed cost before every paid run.

## Rejection checklist

Reject the output immediately if any answer is yes:

- Is the warehouse, aisle, floor, or shelving still the main image?
- Is the only meaningful motion a camera pan, dolly, arc, zoom, or orbit?
- Did the model alter product geometry, panel count, holes, glass, pulls, finish, or logo?
- Did it invent a room, hardware, dimensions, price, savings claim, person, hand, or avatar?
- Is the type baked into generative imagery and misspelled?
- Does the product occupy too little of the frame to judge?
- Would the same clip work if the product were removed? If yes, it is not product-led enough.

## What not to generate

- No full-scene dolly, arc, orbit, or pan across a warehouse plate as the ad.
- No Kling camera tour of an aisle passed off as motion graphics.
- No AI presenters, UGC actors, hands, contractors, homeowners, or testimonials.
- No generated lifestyle room as the default product background.
- No exploding product, impossible assembly, liquid chrome, or geometry-warping effects.
- No invented prices, dimensions, discounts, availability, brands, or included parts.
- No batch of expensive variants before one product master passes a fidelity review.
- No final ad whose product could be replaced by any random object without changing the concept.

## Approval gate for future paid runs

Before any credit-bearing Higgsfield run, write down:

1. exact source asset
2. approved cutout or studio master
3. tool and mode
4. exact prompt
5. duration and aspect ratio
6. displayed credit cost
7. single variable being tested
8. rejection criteria

Aaron approves that specific run before execution. Approval of the overall campaign is not blanket approval to spend credits on additional variants.
