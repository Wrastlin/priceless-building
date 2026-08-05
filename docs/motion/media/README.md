# Media workspace: Price-Less motion marketing

This is the map for everyone (human or agent) picking assets for Price-Less /
Builders Corner / 4 Squared motion work. It sits above the existing curation
docs (`public/real-photos/CURATED.md`, `MANIFEST.md`,
`public/real-photos/business/FLOOR-SHOOT.md`, `lib/department-photos.ts`);
read those first for per-file detail. This README explains how the folders
relate to each other and how to choose an asset without re-litigating
decisions that are already made.

## Why this exists

The library grew in layers: an old Google/Houzz thumbnail pull (`legacy/`),
a July 2026 phone shoot of the floor (`business/floor-*`), promoted
Facebook photo-tab pulls (`foursquared/`), raw Apify/export dumps
(`_inbox/`), AI-generated catalog art (`catalog-images/`, `test-images/`),
and a walkthrough video shoot (`footage/`). Each layer has a different
trust level and a different job. `LIBRARY-MAP.md` gives the folder-by-folder
counts and roles; this file gives the decision rules.

## Folder meanings, in one line each

| Folder | What it is | Trust |
|--------|-----------|-------|
| `public/real-photos/` (root) | Logos, mural, storefront, community, brand video | Real, hand-picked |
| `public/real-photos/business/` | Warehouse floor + product shots, includes the July 2026 `floor-*` shoot | Real, mostly hand-picked |
| `public/real-photos/foursquared/` | Best 4 Squared remodel/outdoor shots, promoted from a Facebook photo-tab pull | Real, promoted subset |
| `public/real-photos/legacy/` | Older finished-room + store-interior shots, promoted from a Google/Houzz pull | Real, small/thumbnail resolution |
| `public/real-photos/_inbox/` | Raw exports (Facebook, Instagram) not yet fully promoted | Real, unreviewed at the file level |
| `public/catalog-images/` | AI-generated per-SKU scene/hero renders (`PL-######-*`) | AI-generated |
| `public/test-images/` | AI-generated studio-clean category placeholders (`01-19`) | AI-generated |
| `footage/x5-walkthrough-2026-06-11/` | Raw walkthrough video + extracted frames + Gemini product catalog JSON | Real, raw footage |

## How to pick an asset

1. **Start in `AUDIT-real-photos.md` for motion plates**, then `CURATED.md` for
   broader ★★★ / ★★ / ★ coverage. Audit rejects override older ★ ratings
   (especially tiny `legacy/` thumbs).
2. **For department heroes and product-type tiles, prefer `business/floor-*`**
   (the July 2026 shoot). It is fresher and more consistent than older
   warehouse frames. `lib/department-photos.ts` and
   `public/real-photos/business/FLOOR-SHOOT.md` already wire this up per
   department; don't re-derive it, reuse it.
3. **Check `PIXEL-AUDIT.md`.** Prefer `strong_res` (long edge ≥ 1400). Do not
   enlarge Google-thumbnail legacy (~223px) into video heroes.
4. **Only reach into `_inbox/` if curated + floor shoot don't cover the beat.**
   `_inbox` is raw, not rejected, but it has already been cherry-picked once.
5. **Use `catalog-images/` and `test-images/` only when there is no real
   photo** and the brief allows a listing fallback. See
   `AI-GENERATED-INDEX.md` (116 flagged files). Never present AI as real
   inventory in brand/category/long-form motion.
6. **Use `footage/` walkthrough frames/video for live aisle motion**, not for
   static hero stills; that's what the phone shoot (`business/floor-*`) is
   for.
7. **Never use** owner/staff portraits, hours/holiday flyers, before/after
   text-stamped graphics, collages, or fake people/UGC avatars in marketing
   motion. These are excluded in `CURATED.md` and stay excluded here.

**Capture gaps:** clean landscape storefront + high-res straight-on mural.
Until then, place identity is mainly `storefront-sign-on-brick.webp` (low res).

## AI flag policy

Every asset gets an `ai` flag in its annotation (see `ANNOTATION-SCHEMA.md`):

- `ai: false`: everything under `public/real-photos/**` and
  `footage/**`. These are real photos/video of the real store, real
  inventory, and real finished jobs. Zero stock, zero invention.
- `ai: true`: everything under `public/catalog-images/**`,
  `public/test-images/**`, and `public/staging/**`. Authoritative list:
  `AI-GENERATED-INDEX.md` / `ai-generated-manifest.json`.

**Rule:** for brand and category motion (the work this docs/motion tree is
for), default to `ai: false` assets. Only pull an `ai: true` asset into a
motion cut if Aaron explicitly approves that file; never present an AI
render as a photo of actual inventory.

## Brand buckets

Every keepable asset belongs to one (or more, for shared place/logo assets)
of three brand buckets. These map directly to the three-business voice
already locked in `docs/motion/storyboards/whole-store-v1-review.md`.

### Price-Less (liquidation)

The warehouse. Doors, windows, cabinets, vanities, countertops, hardware,
lighting, trim, one-of-a-kind finds. The voice is scale, surplus, real
savings, inventory that changes constantly. Most of `business/`,
`business/floor-*`, and the warehouse shots in `legacy/store-interior-*`
belong here.

### Builders Corner (premier brands)

Premier brands and design, staged for real remodels. The voice is nice
brands, showroom quality, what goes into a real remodel. Showroom-grade
kitchen and bath stills such as `builders-corner-hero.jpg` and
`white-kitchen-marble-island.jpg` belong here. No em dashes in copy about
Builders Corner.

### 4 Squared (install craft)

The crew that installs it. The voice is craftsmanship, finished rooms,
quality and experience from the crew. Finished-room installs in
`foursquared/` and `legacy/install-*` belong here. No em dashes in copy
about 4 Squared.

### Shared / place

Logos, storefront, mural, and community photos serve all three brands and
don't belong to a single bucket. Tag these `shared` in `brand_bucket`.

## Keeping this workspace organized without moving files

This docs tree is an index layer, not a file mover. Don't relocate or
delete anything under `public/real-photos/`, `public/catalog-images/`,
`public/test-images/`, or `footage/` to "organize" it; the existing
curation docs and `lib/department-photos.ts` reference those exact paths.
Organization happens here, in `LIBRARY-MAP.md` and the annotation set, not
by rearranging the filesystem.

## Files in this workspace

- `README.md`: this file.
- `LIBRARY-MAP.md`: folder tree with counts and "use for" guidance.
- `ANNOTATION-SCHEMA.md`: the annotation fields every keepable asset should
  carry.
- `annotations/seed-annotations.json`: seed annotations (CURATED ★★★/★★ +
  floor heroes), synced with `AUDIT-real-photos.md` reject/hero notes.
- `AUDIT-real-photos.md`: visual scrutiny of key real frames.
- `PIXEL-AUDIT.md` / `PIXEL-AUDIT.json`: resolution pass across the library.
- `AI-GENERATED-INDEX.md` / `ai-generated-manifest.json`: AI/synthetic flag
  list (do not use in brand motion without per-file approval).

Also see `../AD-FORMATS.md`, `../HIGGSFIELD-MOTION-SKILLS.md`, and
`../renders/smoke-tests/` for format map and MCP smoke results.
