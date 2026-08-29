-- AgroQuiz MVP schema for Supabase
create extension if not exists pgcrypto;

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  pin text unique not null,
  title text not null default 'Agricultura Regenerativa',
  status text not null default 'lobby' check (status in ('lobby','question','reveal','finished')),
  question_ids jsonb not null default '[]'::jsonb,
  current_index integer not null default -1,
  question_started_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  name text not null,
  score integer not null default 0,
  joined_at timestamptz not null default now(),
  unique(session_id,name)
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  question_id text not null,
  option_index integer not null,
  is_correct boolean not null,
  points integer not null default 0,
  answered_at timestamptz not null default now(),
  unique(player_id,question_id)
);

alter table public.sessions enable row level security;
alter table public.players enable row level security;
alter table public.answers enable row level security;

-- Classroom MVP: anonymous browser clients may participate.
-- For a production-grade version, teacher authentication and tighter policies should replace these.
create policy "public sessions read" on public.sessions for select using (true);
create policy "public sessions insert" on public.sessions for insert with check (true);
create policy "public sessions update" on public.sessions for update using (true) with check (true);
create policy "public players read" on public.players for select using (true);
create policy "public players insert" on public.players for insert with check (true);
create policy "public players update" on public.players for update using (true) with check (true);
create policy "public answers read" on public.answers for select using (true);
create policy "public answers insert" on public.answers for insert with check (true);

alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.answers;
