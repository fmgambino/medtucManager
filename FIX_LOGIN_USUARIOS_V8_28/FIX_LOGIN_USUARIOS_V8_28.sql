-- =====================================================
-- MEDTUC Ticket Manager v8.28
-- FIX LOGIN USUARIOS NO SUPERADMIN
-- Objetivo:
-- 1) Eliminar recursión/errores en policies de profiles.
-- 2) Desactivar triggers custom sobre auth.users que rompen el login.
-- 3) Dejar profiles/app_settings legibles para usuarios autenticados.
--
-- Ejecutar COMPLETO en Supabase SQL Editor como postgres.
-- =====================================================

-- =====================================================
-- A) Cortar recursión en public.profiles
-- =====================================================

alter table public.profiles disable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', pol.policyname);
  end loop;
end $$;

-- Eliminar funciones antiguas ambiguas relacionadas a superadmin
do $$
declare
  fn record;
begin
  for fn in
    select p.oid::regprocedure as proc_signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('is_superadmin', 'tm_is_superadmin_v827', 'tm_is_superadmin_v828')
  loop
    execute 'drop function if exists ' || fn.proc_signature || ' cascade';
  end loop;
end $$;

-- Función no recursiva.
-- IMPORTANTE: security definer para evitar RLS al consultar profiles.
create or replace function public.tm_is_superadmin_v828()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role_name = 'SuperAdmin'
      and p.is_active = true
  );
$$;

grant execute on function public.tm_is_superadmin_v828() to authenticated;

alter table public.profiles enable row level security;

create policy "profiles_read_authenticated_v828"
on public.profiles
for select
to authenticated
using (true);

create policy "profiles_insert_superadmin_v828"
on public.profiles
for insert
to authenticated
with check (public.tm_is_superadmin_v828());

create policy "profiles_update_own_or_superadmin_v828"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.tm_is_superadmin_v828())
with check (auth.uid() = id or public.tm_is_superadmin_v828());

create policy "profiles_delete_superadmin_v828"
on public.profiles
for delete
to authenticated
using (public.tm_is_superadmin_v828());

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update, delete on public.profiles to authenticated;

-- =====================================================
-- B) App settings: la PWA lo consulta al cargar.
-- =====================================================

alter table public.app_settings enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_settings'
  loop
    execute format('drop policy if exists %I on public.app_settings', pol.policyname);
  end loop;
end $$;

create policy "app_settings_read_all_v828"
on public.app_settings
for select
to anon, authenticated
using (true);

create policy "app_settings_superadmin_write_v828"
on public.app_settings
for all
to authenticated
using (public.tm_is_superadmin_v828())
with check (public.tm_is_superadmin_v828());

grant select on public.app_settings to anon, authenticated;
grant insert, update, delete on public.app_settings to authenticated;

-- =====================================================
-- C) Desactivar triggers custom sobre auth.users.
-- Motivo:
-- El error "Database error querying schema" en /auth/v1/token
-- normalmente aparece cuando un trigger/function custom sobre auth.users
-- falla al actualizar last_sign_in_at o datos de login.
-- =====================================================

do $$
declare
  trg record;
begin
  for trg in
    select
      t.tgname,
      n.nspname as function_schema,
      p.proname as function_name
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace cn on cn.oid = c.relnamespace
    join pg_proc p on p.oid = t.tgfoid
    join pg_namespace n on n.oid = p.pronamespace
    where cn.nspname = 'auth'
      and c.relname = 'users'
      and not t.tgisinternal
      and n.nspname = 'public'
  loop
    execute format('drop trigger if exists %I on auth.users', trg.tgname);
  end loop;
end $$;

-- =====================================================
-- D) Normalizar perfiles y Auth mínimo.
-- No tocar confirmed_at porque es columna generada.
-- =====================================================

update public.profiles
set
  is_active = true,
  role_name = case
    when role_name = 'Tecnicos' then 'Técnicos'
    when role_name in ('SuperAdmin','Admin','Técnicos','Usuarios') then role_name
    else 'Usuarios'
  end,
  updated_at = now()
where email is not null;

update auth.users u
set
  aud = coalesce(nullif(u.aud, ''), 'authenticated'),
  role = coalesce(nullif(u.role, ''), 'authenticated'),
  email_confirmed_at = coalesce(u.email_confirmed_at, now()),
  raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('provider','email','providers',array['email']),
  raw_user_meta_data = coalesce(u.raw_user_meta_data, '{}'::jsonb)
    || jsonb_build_object(
      'full_name', coalesce(p.full_name, split_part(u.email,'@',1)),
      'role_name', coalesce(p.role_name, 'Usuarios'),
      'office', p.office
    ),
  updated_at = now()
from public.profiles p
where p.id = u.id;

-- =====================================================
-- E) Diagnóstico final
-- =====================================================

select
  lower(u.email) as email,
  p.full_name,
  p.role_name,
  p.is_active,
  u.email_confirmed_at is not null as email_confirmed,
  exists (
    select 1
    from auth.identities i
    where i.user_id = u.id
      and i.provider = 'email'
  ) as has_email_identity,
  'OK_CHECK' as estado
from auth.users u
join public.profiles p on p.id = u.id
order by p.role_name, p.full_name;
