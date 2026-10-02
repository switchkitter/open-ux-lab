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
