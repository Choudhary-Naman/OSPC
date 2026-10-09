-- ============================================================================
-- MIGRATION 001 — Moderated fan wall
-- Safe to run on your existing project: it ADDS things, never drops or edits data.
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- ============================================================================

-- 1) Let visitors opt in to being featured. Existing rows default to "private" (false).
alter table public.fan_messages
  add column if not exists publish_consent boolean not null default false;

-- 2) A separate, public table that holds ONLY what is safe to show:
--    first name, category, message. No email, ever.
create table if not exists public.fan_wall (
  id bigint generated always as identity primary key,
  source_message_id bigint unique references public.fan_messages(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  category text not null,
  message text not null check (char_length(message) between 10 and 1200),
  published_at timestamptz not null default now()
);

alter table public.fan_wall enable row level security;

-- Anyone may READ the wall. There are deliberately NO insert/update/delete policies,
-- so visitors cannot write to it — only you (via Dashboard / SQL Editor) can.
drop policy if exists "Anyone can read the fan wall" on public.fan_wall;
create policy "Anyone can read the fan wall"
on public.fan_wall for select
to anon, authenticated
using (true);

-- 3) Moderator helper: copy ONE consented message onto the wall (first name only).
--    Only callable from the SQL Editor (execute is revoked from website visitors).
create or replace function public.publish_to_fan_wall(p_message_id bigint, p_display_name text default null)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.fan_messages%rowtype;
  v_id bigint;
begin
  select * into r from public.fan_messages where id = p_message_id;
  if not found then
    raise exception 'Message % not found', p_message_id;
  end if;
  if not r.publish_consent then
    raise exception 'Message % was sent privately (no publish consent) — not publishing.', p_message_id;
  end if;

  insert into public.fan_wall (source_message_id, display_name, category, message)
  values (
    r.id,
    left(coalesce(nullif(trim(p_display_name), ''), split_part(trim(r.name), ' ', 1)), 40),
    r.category,
    r.message
  )
  on conflict (source_message_id) do nothing
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.publish_to_fan_wall(bigint, text) from public, anon, authenticated;

-- ============================================================================
-- HOW TO MODERATE (run in SQL Editor whenever you like):
--
--   -- see messages waiting for a decision
--   select id, name, category, message, created_at
--   from public.fan_messages
--   where publish_consent and id not in (select source_message_id from public.fan_wall where source_message_id is not null)
--   order by created_at desc;
--
--   -- approve one (shows first name only)
--   select public.publish_to_fan_wall(42);
--
--   -- remove one from the wall (the private original stays)
--   delete from public.fan_wall where source_message_id = 42;
-- ============================================================================
