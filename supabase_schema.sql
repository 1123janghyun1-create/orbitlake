-- Supabase Schema for OrbitLake Cloud Universes
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/orotfbqowqoveaetfmop/sql

-- 1. Create universes table
create table if not exists public.universes (
  id text primary key,
  user_id uuid references auth.users not null default auth.uid(),
  title text not null default '나만의 우주',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.universes enable row level security;

-- 3. Create RLS Policies
create policy "Users can view their own universes"
  on public.universes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own universes"
  on public.universes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own universes"
  on public.universes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own universes"
  on public.universes for delete
  using (auth.uid() = user_id);

-- 4. Enable Realtime (optional)
alter publication supabase_realtime add table public.universes;
