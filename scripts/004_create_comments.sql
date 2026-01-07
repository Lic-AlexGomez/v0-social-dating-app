-- Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies
create policy "comments_select_all"
  on public.comments for select
  using (true);

create policy "comments_insert_own"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "comments_delete_own"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Indexes
create index comments_post_id_idx on public.comments(post_id);
create index comments_created_at_idx on public.comments(created_at desc);

-- Function to update comments count
create or replace function update_post_comments_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts set comments_count = comments_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.posts set comments_count = comments_count - 1 where id = OLD.post_id;
  end if;
  return null;
end;
$$ language plpgsql;

-- Trigger
drop trigger if exists update_comments_count on public.comments;
create trigger update_comments_count
  after insert or delete on public.comments
  for each row execute function update_post_comments_count();
