-- Liquidation inventory system: private cost/margin/sold data + a DB-backed
-- staff allowlist.
--
-- Apply in the Supabase dashboard SQL editor (Database → SQL) or with
-- `supabase db push`. Safe to run repeatedly (IF NOT EXISTS + policy re-create).
--
-- Why two new tables instead of new columns on `items`:
--   The storefront reads `public.items` with the ANON (publishable) key, which
--   can return the full `data` jsonb of every published row. Anything private
--   (what we paid, sold price, which liquidation lot) must therefore live in a
--   table the `anon` role cannot read at all. RLS below denies anon entirely
--   and allows only the `authenticated` role (signed-in staff). The real
--   who-can-write boundary stays at the app layer (requireAdminSession), which
--   mirrors how `public.items` writes already work.

-- ─────────────────────────────────────────────────────────────────────────
-- 0. Ensure items.sku is unique so item_private can reference it. The app
--    already relies on the 23505 duplicate error on sku, so this normally
--    already exists; guarded so re-running is safe.
-- ─────────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_constraint where conrelid = 'public.items'::regclass and contype in ('p', 'u')
      and conkey = array[(select attnum from pg_attribute where attrelid = 'public.items'::regclass and attname = 'sku')]
  ) then
    alter table public.items add constraint items_sku_key unique (sku);
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. item_private — cost / source lot / sold record. One row per SKU.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.item_private (
  sku         text primary key references public.items (sku) on delete cascade,
  cost        numeric,               -- what we paid (per unit)
  source_lot  text,                  -- which liquidation buy / source it came from
  sold_at     timestamptz,           -- when it was marked sold
  sold_price  numeric,               -- actual sale price (per unit)
  sold_by     text,                  -- staff email who rang it
  updated_at  timestamptz not null default now()
);

-- Velocity queries scan by sold_at ("sold this week", avg days-to-sell).
create index if not exists item_private_sold_at_idx
  on public.item_private (sold_at desc);

alter table public.item_private enable row level security;

-- Only signed-in staff (authenticated role) may touch it. No anon policy =>
-- the publishable/anon key gets nothing (RLS default-deny).
drop policy if exists item_private_authenticated_all on public.item_private;
create policy item_private_authenticated_all
  on public.item_private for all
  to authenticated
  using (true) with check (true);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. staff_emails — DB-backed admin allowlist (env ALLOWED_EMAILS still works
--    as the always-on bootstrap fallback so we can't lock ourselves out).
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.staff_emails (
  email     text primary key,        -- store lowercased
  added_by  text,                    -- staff email who added them
  added_at  timestamptz not null default now(),
  active    boolean not null default true
);

alter table public.staff_emails enable row level security;

-- Readable/writable by authenticated staff only; app-level requireAdminSession
-- is the real write gate (same trust model as public.items). Anon: no policy.
drop policy if exists staff_emails_authenticated_all on public.staff_emails;
create policy staff_emails_authenticated_all
  on public.staff_emails for all
  to authenticated
  using (true) with check (true);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Allow the 'sold' item status.
--    `public.items.status` is free-text today, so a distinct 'sold' status
--    (separate from 'archived') just works and lets velocity reports tell
--    "sold" apart from "withdrawn". If you later add a CHECK constraint on
--    status, include 'sold' in the allowed set:
--      alter table public.items drop constraint if exists items_status_check;
--      alter table public.items add constraint items_status_check
--        check (status in ('draft','staged','published','archived','sold'));
-- ─────────────────────────────────────────────────────────────────────────
