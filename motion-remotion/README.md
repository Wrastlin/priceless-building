# Price-Less motion orchestrator

Remotion owns scene timing, product placement, factual type, template selection, and final exports. Higgsfield is an optional per-scene plate service after the Remotion timeline is approved.

## Studio

```bash
cd "/Users/aaron/Priceless Building Center/priceless-building/motion-remotion"
npm run dev
```

Open the Studio URL printed by Remotion and select `SKU-Micro` then `PL-sku-micro-v1`.

## Composition registry

`src/compositionRegistry.ts` records each composition id, family, duration, and scene count. Current ids:

- `PL-sku-micro-v1`
- `PL-price-micro-v1`
- `BC-claude-console-v1`
- `PL-claude-console-twin-v1`
- `PL-sunrise-archive-v1`
- `PL-form-fetish-door-v1`

## Real cutouts and item JSON

1. Export an approved cutout from the existing clean-background flow.
2. Put local assets in `public/products/`.
3. Set `productSrc` to a public-root path such as `products/PL-FLOOR-002.png`. `ProductAsset` resolves local public assets with `staticFile()`. Approved remote storage URLs also work.
4. Map the app item record to `ItemAdProps`:

```ts
const props: ItemAdProps = {
  title: item.title,
  subtitle: item.subtitle,
  description: item.description,
  dimensions: item.dimensions,
  price: item.price > 0 ? currency.format(item.price) : "",
  productSrc: "products/PL-FLOOR-002.png",
  brand: item.brand,
  templateId: "PL-sku-micro-v1",
};
```

The formatter is an application concern. Never infer or synthesize a missing fact inside a composition.

For a batch, serialize one `ItemAdProps` object per approved item and render all entries through the same composition id with CLI `--props` or the Remotion Node renderer. Start with five records, approve all scene midpoints, then expand toward the catalog in `../docs/motion/DELIVERABLES-100.md`.

The included `public/products/sample-vessel-sink.svg` is a conspicuous full-frame placeholder. It proves local image wiring and must be replaced before a production ad ships.

## Proof renders

```bash
npx remotion still PL-sku-micro-v1 out/sku-micro-scenes/scene-a-product.png --frame=17
npx remotion still PL-sku-micro-v1 out/sku-micro-scenes/scene-b-name.png --frame=52
npx remotion still PL-sku-micro-v1 out/sku-micro-scenes/scene-c-brand-facts.png --frame=87
npx tsc --noEmit
```
