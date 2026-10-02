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
