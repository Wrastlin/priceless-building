# Library map

Folder-by-folder inventory of every media source available for Price-Less
motion marketing, with counts and "use for" guidance. Counts taken directly
from the filesystem; re-run the `find`/`ls` commands below if the library
changes.

```
public/real-photos/
├── CURATED.md                      hand-reviewed pick list, star-rated. READ FIRST
├── MANIFEST.md                     full per-file descriptions (84 files, root-level focus)
├── (45 root media files)           logos, mural, storefront, community, brand video
├── business/                       144 files (143 images + FLOOR-SHOOT.md)
│   └── floor-*.jpg                 43 files, July 2026 department shoot
├── foursquared/                    14 files, promoted FB photo-tab pull
├── legacy/                         45 files, promoted Google/Houzz pull
└── _inbox/                         raw, mostly already cherry-picked
    ├── facebook/
    │   ├── priceless/               50 files
    │   ├── builders/                 5 files
    │   ├── foursquared/             317 files
    │   ├── posts/                   53 files
    │   └── json/                    13 metadata files (not images)
    ├── instagram/                    45 files
    └── legacy/                        0 files (fully promoted → real-photos/legacy/)

public/catalog-images/               93 files, AI-generated, per-SKU (PL-######-scene/hero)
public/test-images/                  19 files, AI-generated, studio category placeholders (01-19)

footage/
└── x5-walkthrough-2026-06-11/
    ├── *.mp4                        3 raw walkthrough videos
    ├── frames/                      717 extracted frame stills
    └── catalog_*.json               4 files, Gemini product catalog (raw/clean/grouped/by_department)
```

## Use-for guidance by source

### `public/real-photos/` root (45 files)

Logos (`logo-official.webp`, `logo-priceless-clean.webp`, `logo-builders-corner*.webp`,
`logo-4squared.jpg`, `seal-full.webp`, `sign-logo.webp`), the "Build Your
Future" mural (`mural-wide.webp`, `mural-detail.webp`, `mural-from-field.webp`),
storefront/building (`storefront-signage.webp`, `storefront-sign-on-brick.webp`,
`building-exterior.webp`, `building-back-walk.webp`), community
(`community-county-fair.webp`, `santa-at-storefront.webp`,
`grocery-giveaway-waow.webp`, `school-food-drive.webp`,
`paint-day-rainbow.webp`), owner voice (`letter-new-year-2023.webp`,
`thank-you-card-rosalie-noah.webp`), and the home brand video
(`storefront-bg.mp4`/`.webm`/`-poster.jpg`).

**Use for:** open/place beats, end cards, brand stings, footer/logo motion,
community warmth B-roll. Skip hours/holiday flyers, the hiring flyer, and
all owner/staff portraits (`josh-nickel.png`, `meet-josh-bio.jpg`, `team-*`)
per the standing exclude list in `CURATED.md`.

### `public/real-photos/business/` (144 files)

The largest single folder. Warehouse aisles, product detail shots, and
finished-room installs shot on phone at the actual store, plus 5 clean
`intake-*` product captures pulled from the intake app. Contains the
`floor-*` subset below.

**Use for:** Price-Less warehouse/department beats, product detail cutaways,
"one-of-a-kind find" moments. This is the default source for category films.

### `public/real-photos/business/floor-*.jpg` (43 files)

The July 2026 department inventory shoot. Fresh, consistent lighting,
already wired to department heroes and product-type tiles via
`lib/catalog-meta.ts` and `lib/department-photos.ts` (see
`business/FLOOR-SHOOT.md` for the hero-per-department table: doors, windows,
cabinets, vanities, countertops, hardware, lighting, trim).

**Use for:** the FIRST place to look for any department hero or category
opening shot. Prefer these over older warehouse frames when both fit.

### `public/real-photos/foursquared/` (14 files)

Best-of, promoted from a 317-file Facebook photo-tab pull
(`_inbox/facebook/foursquared/`). Finished kitchens, pergola/patio outdoor
installs.

**Use for:** 4 Squared "install craft" beats: finished rooms, outdoor living,
craftsmanship proof. This is the highest-density source of 4 Squared
material; no need to dig into the raw 317-file inbox behind it.

### `public/real-photos/legacy/` (45 files)

Promoted from an older Google Business/Houzz thumbnail pull. Small
resolution (mostly 223×160–223×373 Google search thumbnails) but real,
completed Builders Corner / 4 Squared jobs, plus store-interior aisle shots
from before the July 2026 shoot.

**Use for:** before/after variety, finished-room variety beyond `foursquared/`,
and a few irreplaceable aisle shots (`store-interior-chandelier-aisle.webp`,
`store-interior-doors.webp`, `store-interior-jeldwen-aisle.webp`). Expect to
upscale or use small in a grid; don't blow these up full-bleed if a
higher-res alternative exists.

### `public/real-photos/_inbox/` (raw, mostly already cherry-picked)

Every usable file from these dumps has already been reviewed once and
promoted into `business/`, `foursquared/`, or `legacy/` per the notes in
`CURATED.md`. Do not treat `_inbox/` as an unmined goldmine; it is mostly
duplicates, thumbnails, in-progress/people shots, and post-promo graphics
that were deliberately left behind.

- `_inbox/facebook/priceless/` (50): free-tier Apify cap, mostly Easter
  Bunny event + hours flyers + Meet Josh/Jamus. **Exclude people portraits.**
  Warehouse/product depth here is thin; a Meta export or album-targeted pull
  would be needed to get more.
- `_inbox/facebook/builders/` (5): logos + material samples only.
- `_inbox/facebook/foursquared/` (317): source pool for the promoted
  `foursquared/` folder; ~50 were usable-res, the rest are post thumbnails.
  Only re-open this if you need a specific beat `foursquared/` doesn't cover.
- `_inbox/facebook/posts/` (53): raw post captures, mixed content.
- `_inbox/facebook/json/` (13): Apify metadata, not usable imagery.
- `_inbox/instagram/` (45): many thumbs/dupes; 24 were flagged usable at
  intake, largely overlapping with what's already promoted.
- `_inbox/legacy/` (0): fully promoted already; folder kept for provenance,
  nothing left to review.

**Use for:** last resort only, when a specific beat has no coverage anywhere
else. Check `CURATED.md`'s notes on each `_inbox` pull before spending time
here.

### `public/catalog-images/` (93 files, AI-generated)

Per-SKU scene/hero renders named `PL-######-scene-01/02` or `PL-######-hero`.
Generated product imagery, not photos of actual inventory.

**Use for:** marketplace/listing stills for SKUs that don't yet have a real
product photo. Not for brand or category motion, see the AI flag policy in
`README.md`.

### `public/test-images/` (19 files, AI-generated)

Studio-clean, one-per-category placeholder renders (`01-interior-door-shaker.jpg`
through `19-calacatta-quartz-slab.jpg`), already used as `TYPE_PHOTOS` /
`DEPT_EXTRA` fallbacks in `lib/department-photos.ts` for product types with
no real photo yet.

**Use for:** walkthrough/category-page fallback fills only, same rule as
`catalog-images/`. Replace with a real photo as soon as one exists.

### `footage/x5-walkthrough-2026-06-11/` (3 videos + 717 frames + 4 JSON catalogs)

A real, unscripted phone walkthrough of the floor, already run through
Gemini for a product catalog (`catalog_raw.json` → `catalog_clean.json` →
`catalog_grouped.json` / `catalog_by_department.json`). The `frames/`
folder is auto-extracted stills from the videos, not hand-picked; treat
individual frames as raw material, not curated shots.

**Use for:** live aisle motion (referenced in
`docs/motion/storyboards/doors-category-v1.md` as "live aisle motion"),
walkthrough-style category openers, or as a source pool if a specific frame
turns out to be a great still. Not a substitute for the curated
`business/floor-*` stills as default department heroes.

## Re-running this inventory

```bash
find public/real-photos -maxdepth 1 -type f | wc -l
find public/real-photos/business -maxdepth 1 -type f | wc -l
find public/real-photos/business -maxdepth 1 -name 'floor-*' | wc -l
find public/real-photos/foursquared -type f | wc -l
find public/real-photos/legacy -type f | wc -l
find public/real-photos/_inbox -type f | wc -l
find public/catalog-images -type f | wc -l
find public/test-images -type f | wc -l
find footage -type f | wc -l
```
