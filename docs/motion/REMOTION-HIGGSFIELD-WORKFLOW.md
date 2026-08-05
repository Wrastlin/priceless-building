# Remotion and Higgsfield workflow

## Remotion is the conductor

Remotion defines the ad before any generative plate exists. The Remotion project is the source of truth for:

- composition id and template family
- scene order, frame ranges, cuts, and total duration
- Montserrat 300 and 700 typography
- product crop, scale, safe area, color field, and factual overlays
- item JSON contract and image path
- final assembly and export

Higgsfield does not decide the ad. It can provide one approved plate to one named scene after the full Remotion timeline has passed review.

## Timeline-first sequence

1. Load one verified item record.
2. Map it to `ItemAdProps`.
3. Point `productSrc` to an approved cutout in `motion-remotion/public/products/`, or to an approved remote storage URL.
4. Render scene midpoint stills from the Remotion composition.
5. Approve the type, facts, crop, timing, and scene contrast.
6. Read `SCENE-HIGGSFIELD-MAP.md` and identify any scene Remotion cannot finish locally.
7. If needed, write one exact Higgsfield recipe and keep it prompt-only.
8. Record source, tool, prompt, duration, aspect ratio, displayed credit cost, and rejection criteria.
9. Get explicit approval for that specific paid run.
10. Return the approved plate to Remotion and assemble the final deliverable.

## SKU micro timing

`PL-sku-micro-v1` is 105 frames at 30fps, or 3.5 seconds.

- Scene A, frames 0 through 34: large product hero.
- Scene B, frames 35 through 69: distinct ink name stack and product crop.
- Scene C, frames 70 through 104: brand, verified facts, optional verified price.

All three scenes are 35 frames, approximately 1.17 seconds each. Empty price or dimensions fields do not render.

## Scene plate policy

- One Higgsfield output maps to one named Remotion scene.
- Product geometry must match the source.
- Item title, dimensions, price, finish, and brand remain native Remotion type.
- `remove_background` and studio clean are preparation skills, not advertisements.
- Vibe Motion or Hyper Motion product mode stays prompt-only until approved.
- No warehouse pan, aisle walk, AI person, hand, generated room, or unverified claim.

## Batch path to 100

The first batch is five approved item records through the same `PL-sku-micro-v1` composition.

```json
[
  {
    "title": "Verified item title",
    "subtitle": "Verified short subtitle",
    "description": "Approved one-line description",
    "dimensions": "Verified dimensions or empty string",
    "price": "Verified formatted price or empty string",
    "productSrc": "products/approved-item-cutout.png",
    "brand": "priceless",
    "templateId": "PL-sku-micro-v1"
  }
]
```

Render each JSON entry with the same composition id and a distinct output filename. Do not fork one component per SKU. After the first five pass, continue the catalog in `DELIVERABLES-100.md`. Add category, Builders twin, finish, door form, department loop, and end-card templates to the same registry as they become production-ready.

## Commands

```bash
cd "/Users/aaron/Priceless Building Center/priceless-building/motion-remotion"
npm run dev
```

Scene proof renders:

```bash
npx remotion still PL-sku-micro-v1 out/sku-micro-scenes/scene-a-product.png --frame=17
npx remotion still PL-sku-micro-v1 out/sku-micro-scenes/scene-b-name.png --frame=52
npx remotion still PL-sku-micro-v1 out/sku-micro-scenes/scene-c-brand-facts.png --frame=87
```
