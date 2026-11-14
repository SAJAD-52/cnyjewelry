-- ==============================================================================
-- MCGEE JEWELRY STUDIO - COMPLETE SUPABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this in the Supabase SQL Editor.
-- Configures all tables, strict Row Level Security (RLS), Pro check functions,
-- DB-level free tier enforcement, and the private 'piece-photos' storage bucket.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- 2. SUBSCRIPTIONS TABLE
-- Unforgeable Pro membership status managed exclusively via Stripe Webhook (service_role)
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null check (status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')),
  current_period_end timestamptz not null,
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

-- Users can only read their own subscription status; only service_role can insert/update/delete
create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- 3. ADMINS TABLE
-- Replaces hardcoded admin emails in client-side code
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notes text,
  created_at timestamptz default now()
);

alter table public.admins enable row level security;

create policy "Admins can read own entry"
  on public.admins for select
  using (auth.uid() = user_id);

-- 4. HELPER FUNCTION: is_pro_user(uid)
-- Returns true if user has an active/trialing subscription or is listed as an admin
create or replace function public.is_pro_user(uid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = uid
      and status in ('active', 'trialing')
      and current_period_end > now()
  ) or exists (
    select 1 from public.admins
    where user_id = uid
  );
$$;

-- 5. USER PROFILES TABLE
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email_reports boolean default true,
  currency text default 'USD',
  alert_threshold numeric,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create profile trigger on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (user_id, display_name, currency)
  values (new.id, split_part(new.email, '@', 1), 'USD')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. PIECES (JEWELRY BOX / VAULT) TABLE
-- Enforces free limit of 2 items max in database policy if user is not Pro
create table if not exists public.pieces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text default 'Other',
  karat text default '14k',
  weight_g numeric not null default 0,
  paid_price numeric default 0,
  notes text,
  photo_path text,
  purchased_on date,
  created_at timestamptz default now()
);

alter table public.pieces enable row level security;

create policy "Users can read own pieces"
  on public.pieces for select
  using (auth.uid() = user_id);

create policy "Users can update own pieces"
  on public.pieces for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own pieces"
  on public.pieces for delete
  using (auth.uid() = user_id);

create policy "Enforce 2-piece limit on insert for non-pro users"
  on public.pieces for insert
  with check (
    auth.uid() = user_id and (
      public.is_pro_user(auth.uid()) or
      (select count(*) from public.pieces where user_id = auth.uid()) < 2
    )
  );

-- 7. WEAR LOG (30-DAY WEAR HISTORY & CPW) TABLE
-- Enforces free limit of 3 wears max in database policy if user is not Pro
create table if not exists public.wear_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  piece_id uuid references public.pieces(id) on delete set null,
  piece_name text,
  vibe text default 'Everyday',
  worn_on date not null default current_date,
  created_at timestamptz default now()
);

alter table public.wear_log enable row level security;

create policy "Users can read own wear log"
  on public.wear_log for select
  using (auth.uid() = user_id);

create policy "Users can update own wear log"
  on public.wear_log for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own wear log"
  on public.wear_log for delete
  using (auth.uid() = user_id);

create policy "Enforce 3-wear limit on insert for non-pro users"
  on public.wear_log for insert
  with check (
    auth.uid() = user_id and (
      public.is_pro_user(auth.uid()) or
      (select count(*) from public.wear_log where user_id = auth.uid()) < 3
    )
  );

-- 8. WEEKLY PLAN (7-DAY LOOKBOOK) TABLE
-- Enforces free limit of Monday & Tuesday only if user is not Pro
create table if not exists public.weekly_plan (
  user_id uuid not null references auth.users(id) on delete cascade,
  day text not null check (day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  piece_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, day)
);

alter table public.weekly_plan enable row level security;

create policy "Users can read own weekly plan"
  on public.weekly_plan for select
  using (auth.uid() = user_id);

create policy "Users can delete own weekly plan"
  on public.weekly_plan for delete
  using (auth.uid() = user_id);

create policy "Enforce 2-day plan limit on upsert for non-pro users"
  on public.weekly_plan for insert
  with check (
    auth.uid() = user_id and (
      public.is_pro_user(auth.uid()) or
      day in ('Monday', 'Tuesday')
    )
  );

create policy "Enforce 2-day plan limit on update for non-pro users"
  on public.weekly_plan for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and (
      public.is_pro_user(auth.uid()) or
      day in ('Monday', 'Tuesday')
    )
  );

-- 9. WISHLIST TABLE
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item jsonb not null,
  share_token text unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz default now()
);

alter table public.wishlist enable row level security;

create policy "Users can read own wishlist items or public via share_token"
  on public.wishlist for select
  using (auth.uid() = user_id or share_token is not null);

create policy "Users can insert own wishlist items"
  on public.wishlist for insert
  with check (auth.uid() = user_id);

create policy "Users can update own wishlist items"
  on public.wishlist for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own wishlist items"
  on public.wishlist for delete
  using (auth.uid() = user_id);

-- 10. GOLD PRICES TABLE
-- Public read, updated daily via service_role cron or admin script
create table if not exists public.gold_prices (
  day date primary key default current_date,
  usd_per_oz numeric not null,
  created_at timestamptz default now()
);

alter table public.gold_prices enable row level security;

create policy "Public can read gold prices"
  on public.gold_prices for select
  using (true);

-- Seed initial gold benchmark price ($2,650 / oz ~ $85.20 / gram)
insert into public.gold_prices (day, usd_per_oz)
values (current_date, 2650.00)
on conflict (day) do update set usd_per_oz = excluded.usd_per_oz;

-- 11. STORAGE BUCKET: piece-photos
-- Private bucket with strictly scoped user folder policies: {user_id}/{filename}
insert into storage.buckets (id, name, public)
values ('piece-photos', 'piece-photos', false)
on conflict (id) do update set public = false;

drop policy if exists "Users can upload own piece photos" on storage.objects;
create policy "Users can upload own piece photos"
  on storage.objects for insert
  with check (
    bucket_id = 'piece-photos' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can read own piece photos" on storage.objects;
create policy "Users can read own piece photos"
  on storage.objects for select
  using (
    bucket_id = 'piece-photos' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own piece photos" on storage.objects;
create policy "Users can update own piece photos"
  on storage.objects for update
  using (
    bucket_id = 'piece-photos' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own piece photos" on storage.objects;
create policy "Users can delete own piece photos"
  on storage.objects for delete
  using (
    bucket_id = 'piece-photos' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 12. SCALING INDEXES & WEBHOOK EMAIL RESOLVER RPC
create index if not exists idx_pieces_user_id on public.pieces(user_id);
create index if not exists idx_wear_log_user_worn on public.wear_log(user_id, worn_on desc);
create index if not exists idx_wishlist_user_id on public.wishlist(user_id);
create index if not exists idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);
create index if not exists idx_subscriptions_stripe_sub on public.subscriptions(stripe_subscription_id);

-- Fast O(1) user lookup by email for Stripe webhooks (scales past listUsers 50-row cap)
create or replace function public.get_user_id_by_email(target_email text)
returns uuid
language sql
security definer
set search_path = public, auth
as $$
  select id from auth.users
  where lower(email) = lower(trim(target_email))
  limit 1;
$$;

revoke all on function public.get_user_id_by_email(text) from public;
grant execute on function public.get_user_id_by_email(text) to service_role;

