-- =========================================================
-- Ticket Manager MEDTUC v8.10 - Hotfix login + UI/PDF
-- Ejecutar DESPUÉS de v8.9 en Supabase SQL Editor.
-- Corrige políticas RLS de perfiles, funciones security definer,
-- trigger Auth robusto, logos oficiales y limpieza de textos heredados.
-- =========================================================

create extension if not exists pgcrypto;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Funciones robustas sin recursión RLS
create or replace function public.current_role_name()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role_name from public.profiles where id = auth.uid() and is_active = true limit 1;
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role_name = 'SuperAdmin' and is_active = true);
$$;

create or replace function public.is_admin_or_superadmin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role_name in ('SuperAdmin','Admin') and is_active = true);
$$;

create or replace function public.ensure_current_user_profile()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare u auth.users%rowtype;
begin
  select * into u from auth.users where id = auth.uid();
  if u.id is null then return; end if;

  insert into public.profiles(id,email,full_name,role_name,is_active,source)
  values(
    u.id,
    coalesce(u.email,''),
    coalesce(u.raw_user_meta_data->>'full_name', split_part(coalesce(u.email,''),'@',1), 'Usuario'),
    coalesce(u.raw_user_meta_data->>'role_name','Usuarios'),
    true,
    'AUTH'
  )
  on conflict(id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    full_name = coalesce(nullif(public.profiles.full_name,''), excluded.full_name),
    updated_at = now();
end;
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles(id,email,full_name,role_name,is_active,source)
  values(
    new.id,
    coalesce(new.email,''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,''),'@',1), 'Usuario'),
    coalesce(new.raw_user_meta_data->>'role_name','Usuarios'),
    true,
    'AUTH'
  )
  on conflict(id) do nothing;
  return new;
exception when others then
  -- Evita que falle el login/alta de Auth por un error de perfil.
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_ticket_manager on auth.users;
create trigger on_auth_user_created_ticket_manager
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

grant execute on function public.current_role_name() to authenticated;
grant execute on function public.is_superadmin() to authenticated;
grant execute on function public.is_admin_or_superadmin() to authenticated;
grant execute on function public.ensure_current_user_profile() to authenticated;

-- Políticas de profiles sin recursión problemática
alter table public.profiles enable row level security;
drop policy if exists profiles_read on public.profiles;
drop policy if exists profiles_insert on public.profiles;
drop policy if exists profiles_update on public.profiles;
drop policy if exists profiles_delete on public.profiles;

create policy profiles_read on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_admin_or_superadmin());

create policy profiles_insert on public.profiles
for insert to authenticated
with check (id = auth.uid() or public.is_admin_or_superadmin());

create policy profiles_update on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_admin_or_superadmin())
with check (id = auth.uid() or public.is_admin_or_superadmin());

create policy profiles_delete on public.profiles
for delete to authenticated
using (public.is_superadmin());

-- Logos oficiales
insert into public.app_settings(id, logo_light_url, logo_dark_url)
values (
  1,
  'https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/mnisteriodeeducacion.webp',
  'https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/MINISTERIO-DE-EDUCACION-blanco.png'
)
on conflict(id) do update set
  logo_light_url = excluded.logo_light_url,
  logo_dark_url = excluded.logo_dark_url,
  updated_at = now();

-- Limpieza de textos heredados no institucionales
update public.service_orders
set technical_report = nullif(trim(regexp_replace(regexp_replace(regexp_replace(coalesce(technical_report,''), 'Técnico\s+SATMANAGER\s*:\s*', 'Profesional técnico: ', 'gi'), '\s*\|?\s*Costo mano de obra original:\s*0(\.0)?', '', 'gi'), '\s*\|?\s*Entrega original:\s*0(\.0)?', '', 'gi')), ''),
    solution = nullif(trim(regexp_replace(regexp_replace(regexp_replace(coalesce(solution,''), 'Técnico\s+SATMANAGER\s*:\s*', 'Profesional técnico: ', 'gi'), '\s*\|?\s*Costo mano de obra original:\s*0(\.0)?', '', 'gi'), '\s*\|?\s*Entrega original:\s*0(\.0)?', '', 'gi')), ''),
    observations = nullif(trim(regexp_replace(regexp_replace(regexp_replace(coalesce(observations,''), 'Técnico\s+SATMANAGER\s*:\s*', 'Profesional técnico: ', 'gi'), '\s*\|?\s*Costo mano de obra original:\s*0(\.0)?', '', 'gi'), '\s*\|?\s*Entrega original:\s*0(\.0)?', '', 'gi')), '')
where coalesce(technical_report,'') ~* 'SATMANAGER|Costo mano de obra original|Entrega original'
   or coalesce(solution,'') ~* 'SATMANAGER|Costo mano de obra original|Entrega original'
   or coalesce(observations,'') ~* 'SATMANAGER|Costo mano de obra original|Entrega original';

-- Asegura SuperAdmin si el usuario ya existe en Auth
insert into public.profiles(id,email,full_name,role_name,office,is_active,source)
select u.id, 'fernando.m.gambino@gmail.com', 'Ing. Fernando Gambino', 'SuperAdmin', 'Dirección de Informática - Área Soporte Técnico', true, 'PWA'
from auth.users u
where lower(u.email)=lower('fernando.m.gambino@gmail.com')
on conflict(id) do update set
  role_name='SuperAdmin', full_name='Ing. Fernando Gambino', is_active=true, updated_at=now();
