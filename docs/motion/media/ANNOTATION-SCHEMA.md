# Annotation schema

Every keepable asset (real or AI) gets one annotation record. This is the
consistent shape used by `annotations/seed-annotations.json` and any future
annotation batch. Keep the field set stable so tooling and future agents can
rely on it.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|--------------|
| `id` | string | yes | Stable, unique slug for this asset. Kebab-case, no file extension, no spaces. Convention: `<source>-<short-descriptor>` (e.g. `business-dark-base-cabinets-warehouse-row`). |
| `path` | string | yes | Web-root-relative path, matching how the codebase references it (e.g. `/real-photos/business/dark-base-cabinets-warehouse-row.jpg`, `/catalog-images/PL-000112-hero.jpg`, `/test-images/06-double-hung-window.jpg`). For `footage/`, use the repo-relative path since it isn't served from `public/` (e.g. `footage/x5-walkthrough-2026-06-11/VID_20260611_125812_00_002.mp4`). |
| `brand_bucket` | enum | yes | One of `price_less`, `builders_corner`, `four_squared`, `shared`. See `README.md` for the definition of each bucket. Use `shared` for logos, storefront, mural, and community assets that serve all three brands. |
| `dept` | enum \| null | yes | One of `doors`, `windows`, `cabinets`, `vanities`, `countertops`, `hardware`, `lighting`, `trim`, `place`, `logo`, `finished`, `outdoor`, or `null` when no department applies (e.g. a pure brand/community shot that isn't `place` or `logo` either). `place` = storefront/building/mural/warehouse-atmosphere shots that aren't about a specific department. `finished` = completed room/install shots (kitchen, bath) that aren't tied to one department. `outdoor` = pergola/patio/exterior living installs. |
| `quality` | enum | yes | One of `hero`, `strong`, `usable`, `reject`. Maps from `CURATED.md` stars: ★★★ → `hero`, ★★ → `strong`, ★ → `usable`. `reject` is for assets reviewed and found not usable (excluded categories, duplicates, low quality), kept in the annotation set so nobody re-reviews them. |
| `sharpness` | enum | yes | One of `sharp`, `soft`, `low_res`. `sharp` = full-resolution phone/camera capture in focus (most of `business/`, `foursquared/`, `footage/` frames). `soft` = in focus but compressed/re-encoded or slightly hazy. `low_res` = small source resolution, typically Google/Houzz search thumbnails (most of `legacy/`, ~223px on the short edge). |
| `people` | enum | yes | One of `none`, `crowd_ok`, `exclude_faces`. `none` = no people in frame. `crowd_ok` = incidental members of the public / customers in a community moment, fine to use (e.g. kids at the county fair). `exclude_faces` = contains a staff/owner portrait or identifiable staff face that should not be used per the standing owner/staff exclusion in `CURATED.md`, kept annotated so the exclusion is explicit and machine-checkable, not just tribal knowledge. |
| `ai` | boolean | yes | `false` for every real photo/video (`public/real-photos/**`, `footage/**`). `true` for every AI-generated render (`public/catalog-images/**`, `public/test-images/**`). Never mixed within one asset. |
| `good_for` | string[] | yes | Array of format tags this asset is fit for. Use only values from the controlled list below; an asset can carry several. |
| `notes` | string | yes | One short sentence: what's in frame and why it's rated the way it is. Pull from `CURATED.md` / `MANIFEST.md` / `FLOOR-SHOOT.md` where available rather than re-describing from scratch. |

## `good_for` controlled vocabulary

| Tag | Format |
|-----|--------|
| `site_micro_1_5s` | Tiny 1-2s site micro-interactions (hover states, loading beats, category icons in motion) |
| `feed_still_motion` | Social feed post with light motion applied to a still (Ken Burns / parallax) |
| `category_20s` | Category campaign film (see `doors-category-v1.md`, 15-30s cuts) |
| `brand_60s` | Full-business brand cut (the "One roof in Wausau" style 30-60s master) |
| `ebay_hero` | Marketplace listing hero image (eBay, Facebook Marketplace) |
| `marketplace_card` | Marketplace/listing grid card, smaller supporting image |

## Enum quick reference

```
brand_bucket : price_less | builders_corner | four_squared | shared
dept         : doors | windows | cabinets | vanities | countertops | hardware
               | lighting | trim | place | logo | finished | outdoor | null
quality      : hero | strong | usable | reject
sharpness    : sharp | soft | low_res
people       : none | crowd_ok | exclude_faces
ai           : true | false
good_for[]   : site_micro_1_5s | feed_still_motion | category_20s | brand_60s
               | ebay_hero | marketplace_card
```

## Example record

```json
{
  "id": "business-dark-base-cabinets-warehouse-row",
  "path": "/real-photos/business/dark-base-cabinets-warehouse-row.jpg",
  "brand_bucket": "price_less",
  "dept": "cabinets",
  "quality": "hero",
  "sharpness": "sharp",
  "people": "none",
  "ai": false,
  "good_for": ["category_20s", "brand_60s", "feed_still_motion"],
  "notes": "Dramatic surplus cabinet aisle, deep perspective. THE signature Price-Less warehouse shot."
}
```

## Adding new annotations

1. Assign a stable `id` before anything else. Other docs/tooling will
   reference assets by `id`, not by path, so paths can move without
   breaking links.
2. Default new real-photo entries to `ai: false`; default new
   `catalog-images`/`test-images` entries to `ai: true`. Never guess.
3. If an asset is in the standing exclude list in `CURATED.md` (owner/staff
   portraits, hours flyers, before/after stamped graphics, collages), still
   annotate it with `quality: reject` and the matching `people` /`notes`
   value rather than omitting it. An explicit reject is more useful than
   silence.
4. Keep `notes` to one sentence. Longer description belongs in
   `MANIFEST.md`, not here.
