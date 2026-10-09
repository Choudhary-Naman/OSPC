-- ============================================================================
-- BASE SCHEMA — private fan messages
-- Already applied on your project. Safe to re-run (it won't drop data).
-- For the fan wall, also run: supabase/migrations/001_fan_wall.sql
-- ============================================================================
create table if not exists public.fan_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) <= 254),
  category text not null check (category in ('Training question','Transformation story','Video idea','Other')),
  message text not null check (char_length(message) between 10 and 1200),
  created_at timestamptz not null default now()
);

alter table public.fan_messages enable row level security;

-- Public visitors may submit a message, but cannot read submissions.
drop policy if exists "Anyone can submit fan messages" on public.fan_messages;
create policy "Anyone can submit fan messages"
on public.fan_messages for insert
to anon, authenticated
with check (
  char_length(name) between 1 and 80
  and char_length(email) between 3 and 254
  and category in ('Training question','Transformation story','Video idea','Other')
  and char_length(message) between 10 and 1200
);

-- Do NOT add a SELECT policy to fan_messages. Review submissions only through the Supabase Dashboard.
-- The public fan wall reads from the separate public.fan_wall table instead (see migration 001).
