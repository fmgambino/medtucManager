-- =====================================================
-- MEDTUC Ticket Manager v8.26
-- EMERGENCY FIX: elimina recursión infinita en RLS profiles
-- Ejecutar completo en Supabase SQL Editor.
-- =====================================================

-- 1) Cortar acceso recursivo inmediatamente
alter table public.profiles disable row level security;

-- 2) Eliminar TODAS las policies actuales sobre profiles
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', p.policyname);
  end loop;
end $$;

-- 3) Crear función segura para detectar SuperAdmin SIN recursión RLS
create or replace function public.is_superadmin()
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

grant execute on function public.is_superadmin() to authenticated;

-- 4) Reactivar RLS con policies NO recursivas
alter table public.profiles enable row level security;

-- Leer perfiles: usuarios autenticados pueden leer perfiles necesarios para la PWA
create policy "profiles_read_authenticated_v826"
on public.profiles
for select
to authenticated
using (true);

-- Cada usuario puede actualizar su propio perfil
create policy "profiles_update_own_v826"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- SuperAdmin puede administrar todos los perfiles usando función SECURITY DEFINER
create policy "profiles_superadmin_all_v826"
on public.profiles
for all
to authenticated
using (public.is_superadmin())
with check (public.is_superadmin());

-- 5) Grants mínimos
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update, delete on public.profiles to authenticated;

-- 6) Diagnóstico
select
  p.email,
  p.full_name,
  p.role_name,
  p.is_active,
  case
    when p.id = auth.uid() then 'CURRENT_USER'
    else 'OTHER'
  end as tipo
from public.profiles p
order by p.role_name, p.full_name;
