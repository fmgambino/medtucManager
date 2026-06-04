-- =========================================================
-- Ticket Manager MEDTUC v8.9 - Correcciones integrales
-- Ejecutar DESPUÉS de v8.8 en Supabase SQL Editor.
-- Corrige login de perfiles técnicos, logos, RLS, oficinas/notas y realtime.
-- =========================================================

create extension if not exists pgcrypto;

-- Logos oficiales solicitados
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

-- Columnas seguras necesarias para perfiles técnicos y órdenes
alter table public.profiles
  add column if not exists must_change_password boolean not null default false,
  add column if not exists source text not null default 'PWA';

create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  address text,
  phone text,
  email text,
  source text not null default 'PWA',
  is_active boolean not null default true,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.satmanager_tecnicos (
  id uuid primary key default gen_random_uuid(),
  codigo text,
  nombre text not null unique,
  email text,
  phone text,
  source text not null default 'SATMANAGER',
  is_active boolean not null default true,
  raw jsonb,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_orders
  add column if not exists technician_name text,
  add column if not exists professional_technician text,
  add column if not exists technician_user_id uuid references auth.users(id),
  add column if not exists office_id uuid references public.offices(id),
  add column if not exists original_received_at timestamptz,
  add column if not exists original_finished_at timestamptz,
  add column if not exists original_delivered_at timestamptz,
  add column if not exists satmanager_tecnico_codigo text,
  add column if not exists satmanager_cliente_codigo text,
  add column if not exists satmanager_equipo_codigo text;

-- Funciones sin recursión RLS para evitar "Database error querying schema" en usuarios técnicos.
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
    coalesce(u.raw_user_meta_data->>'full_name', split_part(coalesce(u.email,''),'@',1)),
    coalesce(u.raw_user_meta_data->>'role_name','Usuarios'),
    true,
    'AUTH'
  )
  on conflict(id) do nothing;
end;
$$;

grant execute on function public.current_role_name() to authenticated;
grant execute on function public.is_superadmin() to authenticated;
grant execute on function public.is_admin_or_superadmin() to authenticated;
grant execute on function public.ensure_current_user_profile() to authenticated;

-- Políticas de oficinas y técnicos detectados
alter table public.offices enable row level security;
alter table public.satmanager_tecnicos enable row level security;

do $$
declare r record;
begin
  for r in select policyname from pg_policies where schemaname='public' and tablename in ('offices','satmanager_tecnicos') loop
    execute format('drop policy if exists %I on public.%I', r.policyname, case when r.policyname like 'offices_%' then 'offices' else 'satmanager_tecnicos' end);
  end loop;
exception when others then null;
end $$;

drop policy if exists offices_read on public.offices;
drop policy if exists offices_manage on public.offices;
drop policy if exists satmanager_tecnicos_read on public.satmanager_tecnicos;
drop policy if exists satmanager_tecnicos_manage on public.satmanager_tecnicos;

create policy offices_read on public.offices for select to authenticated using (true);
create policy offices_manage on public.offices for all to authenticated
  using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'))
  with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));

create policy satmanager_tecnicos_read on public.satmanager_tecnicos for select to authenticated using (true);
create policy satmanager_tecnicos_manage on public.satmanager_tecnicos for all to authenticated
  using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'))
  with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));

-- Limpieza de textos comerciales heredados en órdenes visibles/PDF.
update public.service_orders
set observations = nullif(trim(regexp_replace(regexp_replace(coalesce(observations,''), '\s*\|?\s*Costo mano de obra original:\s*0(\.0)?', '', 'gi'), '\s*\|?\s*Entrega original:\s*0(\.0)?', '', 'gi')), ''),
    solution = nullif(trim(regexp_replace(regexp_replace(coalesce(solution,''), '\s*\|?\s*Costo mano de obra original:\s*0(\.0)?', '', 'gi'), '\s*\|?\s*Entrega original:\s*0(\.0)?', '', 'gi')), '')
where coalesce(observations,'') ~* 'Costo mano de obra original|Entrega original'
   or coalesce(solution,'') ~* 'Costo mano de obra original|Entrega original';

-- Catálogo inicial de oficinas desde las órdenes existentes
insert into public.offices(name,address,phone,source)
select distinct trim(office), max(address), max(requester_phone), 'SERVICE_ORDERS'
from public.service_orders
where office is not null and trim(office) <> ''
group by trim(office)
on conflict(name) do update set
  address = coalesce(excluded.address, public.offices.address),
  phone = coalesce(excluded.phone, public.offices.phone),
  updated_at = now();

-- Vinculación de oficina y técnico cuando existan perfiles.
update public.service_orders so
set office_id = o.id,
    updated_at = now()
from public.offices o
where so.office_id is null and o.name = so.office;

update public.service_orders so
set professional_technician = coalesce(nullif(so.professional_technician,''), nullif(so.technician_name,'')),
    technician_user_id = p.id,
    updated_at = now()
from public.profiles p
where p.is_active = true
  and p.role_name in ('Técnicos','Admin','SuperAdmin')
  and lower(trim(p.full_name)) = lower(trim(coalesce(so.technician_name, so.professional_technician,'')));

-- Realtime recomendado
alter table if exists public.profiles replica identity full;
alter table if exists public.service_orders replica identity full;
alter table if exists public.notifications replica identity full;
alter table if exists public.offices replica identity full;
alter table if exists public.satmanager_tecnicos replica identity full;

do $$
begin
  begin alter publication supabase_realtime add table public.profiles; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.service_orders; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.notifications; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.offices; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.satmanager_tecnicos; exception when duplicate_object then null; end;
end $$;

-- Asegura el SuperAdmin si el usuario ya existe en Auth.
do $$
declare uid uuid;
begin
  select id into uid from auth.users where lower(email)=lower('fernando.m.gambino@gmail.com') limit 1;
  if uid is not null then
    insert into public.profiles(id,email,full_name,role_name,office,is_active,source)
    values(uid,'fernando.m.gambino@gmail.com','Ing. Fernando Gambino','SuperAdmin','Dirección de Informática - Área Soporte Técnico',true,'PWA')
    on conflict(id) do update set role_name='SuperAdmin', full_name='Ing. Fernando Gambino', is_active=true, updated_at=now();
  end if;
end $$;
