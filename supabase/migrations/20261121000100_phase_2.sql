begin;

-- Only a project administrator can designate a Supabase Auth user a coordinator.
create table public.coordinators (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.camps (
  id uuid primary key default gen_random_uuid(),
  coordinator_id uuid not null default auth.uid()
    references public.coordinators (user_id) on delete restrict,
  name text not null check (char_length(btrim(name)) between 1 and 150),
  description text,
  location text,
  start_date date,
  end_date date,
  meeting_time time,
  instructions text,
  public_slug text not null unique default gen_random_uuid()::text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index camps_coordinator_id_idx on public.camps (coordinator_id);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  camp_id uuid not null references public.camps (id) on delete cascade,
  filename text not null,
  storage_path text not null unique,
  processing_status text not null default 'pending'
    check (processing_status in ('pending', 'ready', 'failed')),
  created_at timestamptz not null default now(),
  unique (id, camp_id)
);

create index documents_camp_id_idx on public.documents (camp_id);

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  camp_id uuid not null,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null check (char_length(content) > 0),
  foreign key (document_id, camp_id)
    references public.documents (id, camp_id) on delete cascade,
  unique (document_id, chunk_index)
);

create index document_chunks_camp_id_idx on public.document_chunks (camp_id);

create function public.touch_camp_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger camps_touch_updated_at before update on public.camps
for each row execute function public.touch_camp_updated_at();

alter table public.coordinators enable row level security;
alter table public.camps enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;

revoke all on public.coordinators, public.camps, public.documents,
  public.document_chunks from public, anon, authenticated;

grant select on public.coordinators to authenticated;
grant select, insert, update, delete on public.camps, public.documents,
  public.document_chunks to authenticated;

create policy coordinator_reads_own_membership
on public.coordinators for select to authenticated
using (user_id = (select auth.uid()));

create policy coordinator_manages_own_camps
on public.camps for all to authenticated
using (
  coordinator_id = (select auth.uid())
  and exists (
    select 1 from public.coordinators where user_id = (select auth.uid())
  )
)
with check (
  coordinator_id = (select auth.uid())
  and exists (
    select 1 from public.coordinators where user_id = (select auth.uid())
  )
);

-- Subqueries inherit the camp policy, so only the camp owner can see a matching ID.
create policy coordinator_manages_own_documents
on public.documents for all to authenticated
using (camp_id in (select id from public.camps))
with check (camp_id in (select id from public.camps));

create policy coordinator_manages_own_chunks
on public.document_chunks for all to authenticated
using (camp_id in (select id from public.camps))
with check (camp_id in (select id from public.camps));

commit;
