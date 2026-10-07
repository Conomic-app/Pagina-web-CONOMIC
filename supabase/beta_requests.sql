-- Ejecuta este archivo completo en SQL Editor. Sirve con o sin la tabla anterior.
begin;
create table if not exists public.beta_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now(),
  status text not null default 'pending',
  constraint valid_email check (
    char_length(email) <= 254 and email = lower(trim(email))
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  )
);
alter table public.beta_requests add column if not exists full_name text;
alter table public.beta_requests add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.beta_requests enable row level security;
revoke all on table public.beta_requests from anon, authenticated;
drop policy if exists "Public can request beta access" on public.beta_requests;

-- Los datos se obtienen del usuario autenticado, no del formulario.
create or replace function public.request_beta_access()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  account auth.users%rowtype;
begin
  select * into account from auth.users where id = auth.uid();
  if account.id is null or account.email is null or account.email_confirmed_at is null
     or not exists (select 1 from auth.identities where user_id = account.id and provider = 'google') then
    raise exception 'A verified Google account is required' using errcode = '42501';
  end if;
  insert into public.beta_requests(email, full_name, user_id)
  values (
    lower(trim(account.email)),
    left(coalesce(account.raw_user_meta_data ->> 'full_name', account.raw_user_meta_data ->> 'name', ''), 200),
    account.id
  )
  on conflict (email) do update
    set full_name = excluded.full_name, user_id = excluded.user_id;
  -- Conservar fecha y estado existentes cuando se repite la solicitud.
end;
$$;
revoke all on function public.request_beta_access() from public, anon;
grant execute on function public.request_beta_access() to authenticated;
-- Registro manual: no revela registros ni modifica solicitudes existentes.
create or replace function public.request_beta_access_manual(applicant_name text, applicant_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_name text := trim(applicant_name);
  clean_email text := lower(trim(applicant_email));
begin
  if clean_name is null or char_length(clean_name) not between 1 and 100
     or clean_email is null or char_length(clean_email) > 254
     or clean_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Invalid request' using errcode = '22023';
  end if;
  insert into public.beta_requests(email, full_name)
  values (clean_email, clean_name)
  on conflict (email) do nothing;
end;
$$;
revoke all on function public.request_beta_access_manual(text, text) from public;
grant execute on function public.request_beta_access_manual(text, text) to anon, authenticated;
commit;
