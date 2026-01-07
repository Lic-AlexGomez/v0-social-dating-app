-- Create stories table
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  media_url text not null,
  media_type text check (media_type in ('image', 'video')),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.stories enable row level security;

-- Policies
create policy "stories_select_active"
  on public.stories for select
  using (expires_at > now());

create policy "stories_insert_own"
  on public.stories for insert
  with check (auth.uid() = user_id);

create policy "stories_delete_own"
  on public.stories for delete
  using (auth.uid() = user_id);

-- Indexes
create index stories_user_id_idx on public.stories(user_id);
create index stories_expires_at_idx on public.stories(expires_at);
