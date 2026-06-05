-- =====================================================
-- MEDTUC Ticket Manager v8.33 FINAL
-- Hotfix integral: RBAC, permisos por módulo, RLS, oficinas,
-- inventario/préstamos/tickets/notificaciones.
-- Ejecutar completo en Supabase SQL Editor.
-- =====================================================

create extension if not exists pgcrypto;

-- 1) Roles dinámicos
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.roles(name,description,is_system) values
('SuperAdmin','Acceso total',true),
('Admin','Administración general',true),
('Técnicos','Perfil técnico',true),
('Usuarios','Usuario general',true)
on conflict (name) do update set
  description=excluded.description,
  is_system=excluded.is_system,
  updated_at=now();

-- 2) Tabla de permisos por módulo
create table if not exists public.role_module_permissions (
  id uuid primary key default gen_random_uuid(),
  role_name text not null,
  module_key text not null,
  can_view boolean not null default false,
  can_create boolean not null default false,
  can_edit boolean not null default false,
  can_delete boolean not null default false,
  can_import boolean not null default false,
  can_export boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'role_module_permissions_role_module_key'
  ) then
    alter table public.role_module_permissions
    add constraint role_module_permissions_role_module_key unique(role_name,module_key);
  end if;
end $$;

-- 3) Asegurar estructura de offices
alter table public.offices add column if not exists department text;
alter table public.offices add column if not exists repartition text;
alter table public.offices add column if not exists office_name text;
alter table public.offices add column if not exists dependency text;
alter table public.offices add column if not exists room text;
alter table public.offices add column if not exists normalized_name text;

update public.offices
set
  office_name = coalesce(office_name, name),
  normalized_name = coalesce(normalized_name, lower(trim(coalesce(name, office_name, '')))),
  updated_at = now()
where normalized_name is null or office_name is null;

create unique index if not exists offices_normalized_name_uidx
on public.offices(normalized_name)
where normalized_name is not null;

-- 4) Sincronizar oficinas desde órdenes
create or replace function public.sync_offices_from_service_orders()
returns void
language plpgsql
security definer
set search_path = public
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
    updated_at = now();
end $$;

grant execute on function public.sync_offices_from_service_orders() to anon, authenticated;
select public.sync_offices_from_service_orders();

-- 5) Seed de permisos por defecto
with modules(module_key) as (
  values ('dashboard'),('users'),('roles'),('orders'),('inventory'),('loans'),('tickets'),('notifications'),('offices'),('profile'),('settings')
)
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
select 'SuperAdmin', module_key, true,true,true,true,true,true from modules
on conflict (role_name,module_key) do update set
  can_view=true, can_create=true, can_edit=true, can_delete=true, can_import=true, can_export=true, updated_at=now();

insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export) values
('Admin','dashboard',true,false,false,false,false,false),
('Admin','users',true,true,true,false,false,true),
('Admin','roles',true,false,false,false,false,false),
('Admin','orders',true,true,true,false,true,true),
('Admin','inventory',true,true,true,false,true,true),
('Admin','loans',true,true,true,false,true,true),
('Admin','tickets',true,true,true,false,true,true),
('Admin','notifications',true,true,true,false,false,true),
('Admin','offices',true,true,true,false,true,true),
('Admin','profile',true,false,true,false,false,false),
('Admin','settings',true,false,true,false,false,false),
('Técnicos','dashboard',true,false,false,false,false,false),
('Técnicos','orders',true,false,true,false,false,true),
('Técnicos','inventory',true,false,false,false,false,false),
('Técnicos','tickets',true,false,true,false,false,false),
('Técnicos','notifications',true,false,true,false,false,false),
('Técnicos','profile',true,false,true,false,false,false),
('Usuarios','dashboard',true,false,false,false,false,false),
('Usuarios','tickets',true,true,false,false,false,false),
('Usuarios','loans',true,true,false,false,false,false),
('Usuarios','notifications',true,false,true,false,false,false),
('Usuarios','profile',true,false,true,false,false,false)
on conflict (role_name,module_key) do nothing;

-- 6) Grants y RLS estables para evitar 400/404 por schema cache/RLS
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated;

alter table public.role_module_permissions enable row level security;
drop policy if exists "rmp_read_auth_v833" on public.role_module_permissions;
drop policy if exists "rmp_write_auth_v833" on public.role_module_permissions;
create policy "rmp_read_auth_v833" on public.role_module_permissions for select to authenticated using (true);
create policy "rmp_write_auth_v833" on public.role_module_permissions for all to authenticated using (true) with check (true);

alter table public.roles enable row level security;
drop policy if exists "roles_read_auth_v833" on public.roles;
drop policy if exists "roles_write_auth_v833" on public.roles;
create policy "roles_read_auth_v833" on public.roles for select to authenticated using (true);
create policy "roles_write_auth_v833" on public.roles for all to authenticated using (true) with check (true);

alter table public.inventory_items enable row level security;
drop policy if exists "inventory_read_auth_v833" on public.inventory_items;
drop policy if exists "inventory_write_auth_v833" on public.inventory_items;
create policy "inventory_read_auth_v833" on public.inventory_items for select to authenticated using (true);
create policy "inventory_write_auth_v833" on public.inventory_items for all to authenticated using (true) with check (true);

alter table public.offices enable row level security;
drop policy if exists "offices_read_auth_v833" on public.offices;
drop policy if exists "offices_write_auth_v833" on public.offices;
create policy "offices_read_auth_v833" on public.offices for select to authenticated using (true);
create policy "offices_write_auth_v833" on public.offices for all to authenticated using (true) with check (true);

alter table public.notifications enable row level security;
drop policy if exists "notifications_read_auth_v833" on public.notifications;
drop policy if exists "notifications_write_auth_v833" on public.notifications;
create policy "notifications_read_auth_v833" on public.notifications for select to authenticated using (true);
create policy "notifications_write_auth_v833" on public.notifications for all to authenticated using (true) with check (true);

alter table public.loans enable row level security;
drop policy if exists "loans_read_auth_v833" on public.loans;
drop policy if exists "loans_write_auth_v833" on public.loans;
create policy "loans_read_auth_v833" on public.loans for select to authenticated using (true);
create policy "loans_write_auth_v833" on public.loans for all to authenticated using (true) with check (true);

alter table public.support_tickets enable row level security;
drop policy if exists "tickets_read_auth_v833" on public.support_tickets;
drop policy if exists "tickets_write_auth_v833" on public.support_tickets;
create policy "tickets_read_auth_v833" on public.support_tickets for select to authenticated using (true);
create policy "tickets_write_auth_v833" on public.support_tickets for all to authenticated using (true) with check (true);

-- 7) Verificación
select 'roles' as tabla, count(*) as registros from public.roles
union all select 'role_module_permissions', count(*) from public.role_module_permissions
union all select 'offices', count(*) from public.offices
union all select 'inventory_items', count(*) from public.inventory_items
union all select 'notifications', count(*) from public.notifications;
