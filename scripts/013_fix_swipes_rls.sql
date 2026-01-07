-- Fix RLS policies for swipes to allow proper inserts
drop policy if exists "swipes_insert_own" on public.swipes;

create policy "swipes_insert_own"
  on public.swipes for insert
  with check (
    auth.uid() = user_id 
    and auth.uid() != target_user_id
  );

-- Add update policy in case needed
create policy "swipes_update_own"
  on public.swipes for update
  using (auth.uid() = user_id);
