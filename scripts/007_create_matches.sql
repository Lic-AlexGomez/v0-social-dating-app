-- Create matches table
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references public.profiles(id) on delete cascade,
  user2_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user1_id, user2_id),
  check (user1_id < user2_id)
);

-- Enable RLS
alter table public.matches enable row level security;

-- Policies
create policy "matches_select_own"
  on public.matches for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Indexes
create index matches_user1_id_idx on public.matches(user1_id);
create index matches_user2_id_idx on public.matches(user2_id);

-- Function to create match when both users swipe right
create or replace function create_match_on_mutual_like()
returns trigger as $$
declare
  other_swipe record;
begin
  if NEW.direction = 'right' or NEW.direction = 'super' then
    select * into other_swipe from public.swipes
    where user_id = NEW.target_user_id
    and target_user_id = NEW.user_id
    and direction in ('right', 'super');
    
    if found then
      insert into public.matches (user1_id, user2_id)
      values (
        least(NEW.user_id, NEW.target_user_id),
        greatest(NEW.user_id, NEW.target_user_id)
      )
      on conflict do nothing;
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Trigger
drop trigger if exists check_mutual_like on public.swipes;
create trigger check_mutual_like
  after insert on public.swipes
  for each row execute function create_match_on_mutual_like();
