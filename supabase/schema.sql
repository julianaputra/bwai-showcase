-- Karya (workshop participant submissions)
create table if not exists public.karya (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  url text not null check (url ~* '^https?://'),
  participant_name text not null check (char_length(participant_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists karya_created_at_idx on public.karya (created_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists karya_set_updated_at on public.karya;
create trigger karya_set_updated_at
  before update on public.karya
  for each row execute function public.set_updated_at();

-- Kesan (workshop impressions — open to all, no auth required)
create table if not exists public.kesan (
  id uuid primary key default gen_random_uuid(),
  word text not null check (char_length(word) between 1 and 30),
  created_at timestamptz not null default now()
);

create index if not exists kesan_word_idx on public.kesan (word);

alter table public.kesan enable row level security;

drop policy if exists kesan_select_all on public.kesan;
create policy kesan_select_all on public.kesan
  for select using (true);

drop policy if exists kesan_insert_all on public.kesan;
create policy kesan_insert_all on public.kesan
  for insert with check (auth.uid() is not null);

-- RLS
alter table public.karya enable row level security;

drop policy if exists karya_select_all on public.karya;
create policy karya_select_all on public.karya
  for select using (true);

drop policy if exists karya_insert_own on public.karya;
create policy karya_insert_own on public.karya
  for insert with check (auth.uid() = user_id);

drop policy if exists karya_update_own on public.karya;
create policy karya_update_own on public.karya
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists karya_delete_own on public.karya;
create policy karya_delete_own on public.karya
  for delete using (auth.uid() = user_id);
