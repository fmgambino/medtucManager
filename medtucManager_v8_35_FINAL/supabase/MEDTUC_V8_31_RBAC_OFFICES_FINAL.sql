-- =====================================================
-- MEDTUC Ticket Manager v8.31
-- RBAC + Dtos/Oficinas/Reparticiones + Fix ON CONFLICT + RLS
-- Ejecutar completo en Supabase SQL Editor.
-- =====================================================

create extension if not exists pgcrypto;

-- ---------- OFFICES: columnas jerárquicas y normalización ----------
alter table public.offices add column if not exists department text;
alter table public.offices add column if not exists repartition text;
alter table public.offices add column if not exists office_name text;
alter table public.offices add column if not exists dependency text;
alter table public.offices add column if not exists room text;
alter table public.offices add column if not exists normalized_name text;

update public.offices
set
  office_name = coalesce(nullif(office_name,''), name),
  normalized_name = lower(trim(coalesce(nullif(normalized_name,''), name, office_name))),
  updated_at = now()
where normalized_name is null or office_name is null;

-- Fix del error 42P10: ON CONFLICT requiere índice unique/exclusion.
create unique index if not exists offices_normalized_name_uidx
on public.offices (normalized_name)
where normalized_name is not null;

-- ---------- FUNCIONES SEGURAS ----------
do $$
declare fn record;
begin
  for fn in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname in ('tm_is_superadmin_v831','tm_can_v831','sync_offices_from_service_orders','assign_random_technician')
  loop
    execute 'drop function if exists ' || fn.sig || ' cascade';
  end loop;
end $$;

create or replace function public.tm_is_superadmin_v831()
returns boolean
language sql
security definer
set search_path=public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role_name = 'SuperAdmin'
      and p.is_active = true
  );
$$;

create or replace function public.tm_can_v831(p_code text)
returns boolean
language sql
security definer
set search_path=public
as $$
  select coalesce(public.tm_is_superadmin_v831(), false)
    or exists (
      select 1
      from public.profiles pr
      join public.roles r on r.name = pr.role_name
      join public.role_permissions rp on rp.role_id = r.id
      join public.permissions pe on pe.id = rp.permission_id
      where pr.id = auth.uid()
        and pr.is_active = true
        and pe.code = p_code
    );
$$;

grant execute on function public.tm_is_superadmin_v831() to authenticated;
grant execute on function public.tm_can_v831(text) to authenticated;

-- ---------- PERMISOS BASE ----------
insert into public.roles(name, description, is_system)
values
('SuperAdmin','Acceso total',true),
('Admin','Administración general',true),
('Técnicos','Perfil técnico',true),
('Usuarios','Usuario general',true)
on conflict (name) do update set description=excluded.description, is_system=excluded.is_system, updated_at=now();

insert into public.permissions(code,module,action,description)
select m||'.'||a, m, a, initcap(a)||' '||m
from unnest(array['dashboard','users','roles','orders','inventory','loans','tickets','notifications','offices','settings']) m
cross join unnest(array['view','create','edit','delete','export','import']) a
on conflict (code) do update set module=excluded.module, action=excluded.action, description=excluded.description;

-- SuperAdmin: todo
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.name='SuperAdmin'
on conflict do nothing;

-- Admin: todo salvo borrar roles críticos por frontend; BD conserva permiso amplio de gestión
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.name='Admin'
on conflict do nothing;

-- Técnicos: operativo
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r join public.permissions p on p.code in (
 'dashboard.view','orders.view','orders.edit','orders.export',
 'inventory.view','inventory.edit',
 'tickets.view','tickets.edit','tickets.create',
 'loans.view','loans.create','loans.edit',
 'notifications.view','profile.view','offices.view'
)
where r.name='Técnicos'
on conflict do nothing;

-- Usuarios: lectura/solicitudes básicas
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r join public.permissions p on p.code in (
 'dashboard.view','tickets.view','tickets.create','loans.view','loans.create','notifications.view','profile.view','offices.view'
)
where r.name='Usuarios'
on conflict do nothing;

-- ---------- SYNC OFFICES DESDE ÓRDENES ----------
create or replace function public.sync_offices_from_service_orders()
returns void
language plpgsql
security definer
set search_path=public
as $$
begin
  insert into public.offices(name, office_name, address, source, is_active, normalized_name, created_at, updated_at)
  select distinct
    trim(so.office) as name,
    trim(so.office) as office_name,
    max(nullif(trim(so.address),'')) as address,
    'SYNC_SERVICE_ORDERS' as source,
    true,
    lower(trim(so.office)) as normalized_name,
    now(), now()
  from public.service_orders so
  where nullif(trim(coalesce(so.office,'')),'') is not null
  group by lower(trim(so.office)), trim(so.office)
  on conflict (normalized_name) where normalized_name is not null do update set
    address = coalesce(excluded.address, public.offices.address),
    office_name = coalesce(public.offices.office_name, excluded.office_name),
    name = coalesce(public.offices.name, excluded.name),
    updated_at = now();
end $$;

grant execute on function public.sync_offices_from_service_orders() to authenticated;

select public.sync_offices_from_service_orders();

-- ---------- ASIGNACIÓN ALEATORIA DE TÉCNICO ----------
create or replace function public.assign_random_technician()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  tech uuid;
begin
  if new.assigned_to is null and new.attended_by is null then
    select p.id into tech
    from public.profiles p
    where p.role_name in ('Técnicos','Tecnicos')
      and p.is_active = true
    order by random()
    limit 1;

    if tech is not null then
      new.assigned_to := tech;
      new.technician_user_id := tech;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_assign_random_technician_support on public.support_tickets;
create trigger trg_assign_random_technician_support
before insert on public.support_tickets
for each row execute function public.assign_random_technician();

-- ---------- RLS ----------
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.offices enable row level security;

do $$
declare pol record;
begin
  for pol in select schemaname,tablename,policyname from pg_policies where schemaname='public' and tablename in ('roles','permissions','role_permissions','offices')
  loop
    execute format('drop policy if exists %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;

create policy roles_read_auth_v831 on public.roles for select to authenticated using (true);
create policy roles_write_super_v831 on public.roles for all to authenticated using (public.tm_is_superadmin_v831()) with check (public.tm_is_superadmin_v831());

create policy permissions_read_auth_v831 on public.permissions for select to authenticated using (true);
create policy permissions_write_super_v831 on public.permissions for all to authenticated using (public.tm_is_superadmin_v831()) with check (public.tm_is_superadmin_v831());

create policy role_permissions_read_auth_v831 on public.role_permissions for select to authenticated using (true);
create policy role_permissions_write_super_v831 on public.role_permissions for all to authenticated using (public.tm_is_superadmin_v831()) with check (public.tm_is_superadmin_v831());

create policy offices_read_auth_v831 on public.offices for select to authenticated using (true);
create policy offices_insert_perm_v831 on public.offices for insert to authenticated with check (public.tm_can_v831('offices.create'));
create policy offices_update_perm_v831 on public.offices for update to authenticated using (public.tm_can_v831('offices.edit')) with check (public.tm_can_v831('offices.edit'));
create policy offices_delete_perm_v831 on public.offices for delete to authenticated using (public.tm_can_v831('offices.delete'));

-- Mantener profiles sin recursión
alter table public.profiles enable row level security;
do $$
declare pol record;
begin
  for pol in select policyname from pg_policies where schemaname='public' and tablename='profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', pol.policyname);
  end loop;
end $$;
create policy profiles_read_auth_v831 on public.profiles for select to authenticated using (true);
create policy profiles_insert_super_v831 on public.profiles for insert to authenticated with check (public.tm_is_superadmin_v831());
create policy profiles_update_self_or_super_v831 on public.profiles for update to authenticated using (auth.uid()=id or public.tm_is_superadmin_v831()) with check (auth.uid()=id or public.tm_is_superadmin_v831());
create policy profiles_delete_super_v831 on public.profiles for delete to authenticated using (public.tm_is_superadmin_v831());

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to authenticated;
grant insert, update, delete on public.roles, public.role_permissions, public.offices, public.profiles to authenticated;

-- Diagnóstico final
select 'V8_31_OK' as estado, count(*) filter(where normalized_name is not null) as oficinas_normalizadas from public.offices;
