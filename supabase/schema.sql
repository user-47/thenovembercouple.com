-- The November Couple — database schema (Supabase / Postgres)
-- Run in the Supabase SQL editor. All access goes through server routes using the
-- service-role key; RLS is enabled with no policies so the anon key can read nothing.

create extension if not exists pgcrypto;

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  confirmed boolean not null default false,
  confirm_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  unsubscribe_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  newsletter_opt_in boolean not null default false,
  unsubscribed_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers (id) on delete cascade,
  destination_slug text not null,
  start_date date,
  end_date date,
  timezone text,
  share_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists trips_subscriber_idx on trips (subscriber_id);

create table if not exists trip_items (
  id bigint generated always as identity primary key,
  trip_id uuid not null references trips (id) on delete cascade,
  activity_slug text not null,
  visit_date date
);
create index if not exists trip_items_trip_idx on trip_items (trip_id);

create table if not exists reminders (
  id bigint generated always as identity primary key,
  trip_id uuid not null references trips (id) on delete cascade,
  activity_slug text not null,
  visit_date date not null,
  label text not null,
  send_at timestamptz not null,
  sent_at timestamptz,
  skipped boolean not null default false
);
create index if not exists reminders_due_idx on reminders (send_at) where sent_at is null;

create table if not exists brand_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text not null,
  website text,
  budget text,
  timeline text,
  deliverables text[],
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists affiliate_clicks (
  id bigint generated always as identity primary key,
  destination_slug text not null,
  activity_slug text not null,
  partner text,
  kind text,
  url text not null,
  created_at timestamptz not null default now()
);

alter table subscribers enable row level security;
alter table trips enable row level security;
alter table trip_items enable row level security;
alter table reminders enable row level security;
alter table brand_inquiries enable row level security;
alter table affiliate_clicks enable row level security;
