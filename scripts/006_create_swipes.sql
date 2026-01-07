-- Create swipes table for dating feature
create table if not exists public.swipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_user_id uuid not null references public.profiles(id) on delete cascade,
  direction text not null check (direction in ('left', 'right', 'super')),
  created_at timestamptz default now(),
  unique(user_id, target_user_id)
);

-- Enable RLS
alter table public.swipes enable row level security;

-- Policies
create policy "swipes_select_own"
  on public.swipes for select
  using (auth.uid() = user_id or auth.uid() = target_user_id);

create policy "swipes_insert_own"
  on public.swipes for insert
  with check (auth.uid() = user_id);

-- Indexes
create index swipes_user_id_idx on public.swipes(user_id);
create index swipes_target_user_id_idx on public.swipes(target_user_id);
