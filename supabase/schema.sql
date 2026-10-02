-- Open UX Lab: cloud progress sync.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Each learner has one row holding their progress as JSON. Row level security means people can only
-- read and write their own row, which is what makes the publishable key safe to ship in the browser.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

grant select, insert, update on public.progress to authenticated;

drop policy if exists "Read own progress" on public.progress;
create policy "Read own progress" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Insert own progress" on public.progress;
create policy "Insert own progress" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Update own progress" on public.progress;
create policy "Update own progress" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Account deletion. The browser can't delete users directly, so this function runs with the owner's
-- rights but only ever deletes the caller's own account. Their progress row goes with it (on delete cascade).
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Anonymous usage counts. One row per day, event and key (a lesson or exercise ID) with a count.
-- No user, device, IP or timestamp is stored. Anyone can add to a count through track_event();
-- nobody can read the table through the public API (no select policy), so stats are read in the
-- Supabase dashboard (see supabase/stats.sql).
create table if not exists public.usage_counts (
  day date not null default current_date,
  event text not null check (event in ('visit', 'lesson_opened', 'lesson_completed', 'exercise_right', 'exercise_wrong', 'review_completed')),
  key text not null default '' check (length(key) <= 64),
  count integer not null default 0,
  primary key (day, event, key)
);

alter table public.usage_counts enable row level security;
revoke all on public.usage_counts from anon, authenticated;

create or replace function public.track_event(event_name text, event_key text default '')
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.usage_counts (day, event, key, count)
  values (current_date, event_name, coalesce(left(event_key, 64), ''), 1)
  on conflict (day, event, key) do update set count = public.usage_counts.count + 1;
$$;

revoke all on function public.track_event(text, text) from public;
grant execute on function public.track_event(text, text) to anon, authenticated;
