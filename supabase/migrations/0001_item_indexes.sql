-- Indexes for the storefront catalog queries (lib/items/store.ts).
--
-- The `items` table keeps the canonical CatalogItem in a `data` jsonb column
-- and mirrors status/brand/category/created_at/sku as plain columns so the
-- storefront can filter without scanning jsonb. Without the indexes below, the
-- paginated grids — .eq('status','published').order('created_at' desc).range()
-- plus the {count:'exact'} totals — do a sequential scan + sort of the whole
-- table on every request. Invisible at ~2k rows; a real per-request cost as the
-- catalog grows past several thousand.
--
-- Safe to run repeatedly (IF NOT EXISTS). Apply in the Supabase dashboard SQL
-- editor, or with `supabase db push` if you adopt the CLI.

-- "All published, newest first" + pagination (/shop, /search, sitemap)
create index if not exists items_status_created_at_idx
  on public.items (status, created_at desc);

-- Category / brand grids (/shop/[category], byCategory / byBrand)
create index if not exists items_status_brand_category_created_at_idx
  on public.items (status, brand, category, created_at desc);

-- Single-item lookups by sku (findPublished / findBySku).
-- NOTE: `sku` should ALSO have a UNIQUE constraint — the app relies on the
-- Postgres 23505 duplicate error to detect SKU collisions (see
-- lib/actions/staging.ts and lib/items/store.ts createDraft). If it doesn't
-- already, add it:  alter table public.items add constraint items_sku_key unique (sku);
create index if not exists items_sku_idx
  on public.items (sku);
