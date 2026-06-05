-- =====================================================
-- MEDTUC Ticket Manager v8.27
-- FIX DEFINITIVO: elimina funciones duplicadas is_superadmin
-- y reconstruye RLS de profiles sin recursión infinita.
-- Ejecutar completo en Supabase SQL Editor.
-- =====================================================

-- 1) Desactivar RLS para cortar recursión actual
alter table public.profiles disable row level security;

-- 2) Eliminar TODAS las policies actuales de profiles
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

-- 3) Eliminar TODAS las funciones public.is_superadmin duplicadas, sin importar firma
do $$
declare
  fn record;
begin
  for fn in
    select p.oid::regprocedure as proc_signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'is_superadmin'
  loop
    execute 'drop function if exists ' || fn.proc_signature || ' cascade';
  end loop;
end $$;

-- 4) Crear función con nombre nuevo para evitar ambigüedad
create or replace function public.tm_is_superadmin_v827()
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

grant execute on function public.tm_is_superadmin_v827() to authenticated;

-- 5) Reactivar RLS con policies NO recursivas
alter table public.profiles enable row level security;

-- Lectura: cualquier usuario autenticado puede leer perfiles necesarios para la PWA
create policy "profiles_read_authenticated_v827"
on public.profiles
for select
to authenticated
using (true);

-- Update propio
create policy "profiles_update_own_v827"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- SuperAdmin administra perfiles sin recursión directa
create policy "profiles_superadmin_all_v827"
on public.profiles
for all
to authenticated
using (public.tm_is_superadmin_v827())
with check (public.tm_is_superadmin_v827());

-- 6) Grants mínimos
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update, delete on public.profiles to authenticated;

-- 7) Diagnóstico final
select
  email,
  full_name,
  role_name,
  is_active,
  source
from public.profiles
order by role_name, full_name;
