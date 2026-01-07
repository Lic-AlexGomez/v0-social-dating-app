-- Function to create notification on like
create or replace function create_like_notification()
returns trigger as $$
declare
  post_owner_id uuid;
begin
  -- Get the post owner
  select user_id into post_owner_id from public.posts where id = NEW.post_id;
  
  -- Don't notify if user likes their own post
  if post_owner_id != NEW.user_id then
    insert into public.notifications (user_id, type, from_user_id, post_id)
    values (post_owner_id, 'like', NEW.user_id, NEW.post_id);
  end if;
  
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_like_created on public.likes;
create trigger on_like_created
  after insert on public.likes
  for each row execute function create_like_notification();

-- Function to create notification on comment
create or replace function create_comment_notification()
returns trigger as $$
declare
  post_owner_id uuid;
begin
  -- Get the post owner
  select user_id into post_owner_id from public.posts where id = NEW.post_id;
  
  -- Don't notify if user comments on their own post
  if post_owner_id != NEW.user_id then
    insert into public.notifications (user_id, type, from_user_id, post_id)
    values (post_owner_id, 'comment', NEW.user_id, NEW.post_id);
  end if;
  
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_comment_created on public.comments;
create trigger on_comment_created
  after insert on public.comments
  for each row execute function create_comment_notification();

-- Function to create notification on follow
create or replace function create_follow_notification()
returns trigger as $$
begin
  insert into public.notifications (user_id, type, from_user_id)
  values (NEW.following_id, 'follow', NEW.follower_id);
  
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_follow_created on public.follows;
create trigger on_follow_created
  after insert on public.follows
  for each row execute function create_follow_notification();

-- Function to create notification on match
create or replace function create_match_notification()
returns trigger as $$
begin
  -- Notify both users
  insert into public.notifications (user_id, type, from_user_id, match_id)
  values 
    (NEW.user1_id, 'match', NEW.user2_id, NEW.id),
    (NEW.user2_id, 'match', NEW.user1_id, NEW.id);
  
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_match_created on public.matches;
create trigger on_match_created
  after insert on public.matches
  for each row execute function create_match_notification();

-- Function to create notification on message (only for first message in conversation)
create or replace function create_message_notification()
returns trigger as $$
declare
  other_user_id uuid;
  message_count int;
begin
  -- Get the other user in the match
  select case 
    when user1_id = NEW.sender_id then user2_id 
    else user1_id 
  end into other_user_id
  from public.matches
  where id = NEW.match_id;
  
  -- Count existing messages in this conversation
  select count(*) into message_count
  from public.messages
  where match_id = NEW.match_id;
  
  -- Only notify on first message
  if message_count = 1 then
    insert into public.notifications (user_id, type, from_user_id, match_id)
    values (other_user_id, 'message', NEW.sender_id, NEW.match_id);
  end if;
  
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_message_created on public.messages;
create trigger on_message_created
  after insert on public.messages
  for each row execute function create_message_notification();
