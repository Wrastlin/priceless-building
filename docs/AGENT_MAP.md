# Agent Map

Living index of every server-side route / action / module that an AI
agent or human dev needs to reason about. Append to this file in the
same commit as any new route, action, or store module.

For each entry: purpose, IO, side effects, when-to-use.

---

## lib/items/store.ts — File-backed item store

**Purpose.** Single source of truth for catalog items in dev. Reads
JSON synchronously at module init so the storefront's legacy sync
helpers keep working. Writes go through atomic tmp-file + rename so
the file can't end up half-written.

**Schema.** `CatalogItem` (see `lib/items/store.ts` for the full
type). New field: `status: "draft" | "staged" | "published" | "archived"`.

**Storage.** `data/items.json` at repo root. Gitignored. Auto-seeded
from `SEED_ITEMS` (the 16 original catalog items, all `published`) on
first read. If the file is corrupt, the loader throws on boot.

**Sync reads** (safe in any server component, no await):
- `loadAll()` → every item, any status
- `listPublished()` → status === "published"
- `listDrafts()` → status === "draft"
- `listStaged()` → status === "staged"
- `findBySku(sku)` → any status (admin needs to find archived items)
- `byBrand(brand)` → published only
- `byCategory(brand, category)` → published only

**Async writes** (call from server actions only):
- `createDraft(input)` → appends a new item, defaults `status: "draft"` and stamps `createdAt`. Throws on duplicate SKU.
- `setStatus(sku, status)` → flip an existing item's status.
- `updateItem(sku, partial)` → patch any fields except SKU.
- `deleteItem(sku)` → remove from disk and cache.

**Side effects.** Every write calls `revalidatePath('/')`,
`revalidatePath('/shop', 'layout')`, `revalidatePath('/admin/staging')`,
`revalidatePath('/admin/inventory')`. The `revalidatePath` call is
swallowed if invoked outside a request context (lets ad-hoc node
scripts use the store too).

**Concurrency.** Single-process only. Multi-process / multi-region
prod must migrate to Supabase. Tracked.

**When to use.** Any code that needs catalog data should read through
this module (directly, or via the `lib/catalog.ts` facade). Don't
import the JSON file directly.

---

## lib/catalog.ts — Legacy facade (kept stable for storefront imports)

**Purpose.** Re-exports the sync helpers from `lib/items/store.ts` so
that every existing `import { CATALOG, byBrand, byCategory, findItem,
CATEGORIES } from "@/lib/catalog"` callsite compiles unchanged.

**Notable behavior change.** `CATALOG`, `byBrand`, and `byCategory`
now return PUBLISHED items only. Drafts live in /admin/staging.

`CATALOG` is implemented as a Proxy that forwards to
`listPublished()` on every property access so it always reflects the
latest store state (including post-write).

`CATEGORIES` is still defined inline here — it's static config.

**When to use.** Don't add new callsites here. Import from
`lib/items/store.ts` directly in new code. This facade exists to
avoid touching ~25 storefront files.

---

## lib/actions/staging.ts — Staging server actions

All `"use server"` actions for the draft → staged → published flow.

### `approveDraftAction(sku)`
- **IO.** Takes a SKU string. Returns void.
- **Side effects.** Calls `setStatus(sku, "published")` which writes
  to disk and revalidates storefront + staging paths.
- **When to use.** Wire to the Approve button on each card in
  `/admin/staging`.

### `rejectDraftAction(sku)`
- **IO.** SKU string in, void out.
- **Side effects.** Calls `setStatus(sku, "archived")`. The item
  disappears from `/admin/staging` but stays in the JSON so we can
  audit later.
- **When to use.** Reject button on each draft card.

### `createDraftFromFormAction(formData)`
- **IO.** FormData with required fields: `title`, `category`,
  `image` (data URL). Optional: `subtitle`, `manufacturer`, `price`,
  `msrp`, `location`, `inStock`, `comparable_price`,
  `comparable_url`, `comparable_retailer`.
- **Side effects.** Generates a SKU via `formatSKU` (prefix inferred
  from category — cabinets/countertops → BC, everything else → PL).
  Persists via `createDraft`. Redirects to `/admin/staging` on
  success.
- **When to use.** Wire to the "Save to staging" button on
  `/admin/inventory/new`. The button can either submit a `<form
  action={...}>` or build a FormData and call the action via
  `startTransition` (which is what the current client form does, so it
  can keep its capture/comparables state across the submit).

---

## /admin/staging — Manager review queue

- Server component. Renders `listDrafts()`.
- Each card binds `approveDraftAction.bind(null, sku)` /
  `rejectDraftAction.bind(null, sku)` and wraps them in `<form
  action={...}>` so they post without JS.
- Empty state when there are no drafts.

---

(Append future entries below this line as new modules ship.)
