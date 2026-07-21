-- Append-only retail comps history (never overwrite evidence).
create table if not exists public.comps_snapshots (
  id uuid primary key default gen_random_uuid(),
  sku text not null,
  captured_at timestamptz not null default now(),
  query text not null,
  broadened boolean not null default false,
  raw_results jsonb not null default '[]'::jsonb,
  anchor numeric,
  median numeric,
  trimmed_mean numeric,
  n int not null default 0,
  actor_name text,
  login_email text
);

create index if not exists comps_snapshots_sku_idx
  on public.comps_snapshots (sku, captured_at desc);

alter table public.comps_snapshots enable row level security;
-- Service-role only (no policies for anon/authenticated).
