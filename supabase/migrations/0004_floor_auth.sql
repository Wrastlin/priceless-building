-- Floor people (Who is working) + append-only capture events for debug.
-- Service-role only — same pattern as item_private / staff_emails (0003).

create table if not exists public.floor_people (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  active     boolean not null default true,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists floor_people_active_idx
  on public.floor_people (active, name);

alter table public.floor_people enable row level security;

create table if not exists public.capture_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  session_id  text,
  request_id  text,
  actor_id    uuid references public.floor_people (id) on delete set null,
  actor_name  text,
  login_email text,
  login_role  text,
  item_id     text,
  sku         text,
  source      text not null,
  action      text not null,
  path        text,
  payload     jsonb,
  error       text
);

create index if not exists capture_events_created_at_idx
  on public.capture_events (created_at desc);

create index if not exists capture_events_sku_idx
  on public.capture_events (sku, created_at desc);

create index if not exists capture_events_actor_idx
  on public.capture_events (actor_id, created_at desc);

alter table public.capture_events enable row level security;
-- No policies for anon/authenticated — service role only.
