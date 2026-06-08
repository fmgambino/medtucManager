-- =========================================================
-- MEDTUC Ticket Manager v8.30
-- RBAC por módulos/acciones + Oficinas/Reparticiones + asignación aleatoria de tickets a técnicos
-- Ejecutar COMPLETO en Supabase SQL Editor como postgres.
-- =========================================================

create extension if not exists pgcrypto;

-- 1) Oficinas/Reparticiones: ampliar tabla existente public.offices
alter table public.offices add column if not exists department text;
alter table public.offices add column if not exists repartition text;
alter table public.offices add column if not exists office_name text;
alter table public.offices add column if not exists dependency text;
alter table public.offices add column if not exists room text;
alter table public.offices add column if not exists normalized_name text;

update public.offices
set office_name = coalesce(nullif(office_name,''), name),
    normalized_name = lower(trim(coalesce(name, office_name, ''))),
    updated_at = now()
where office_name is null or normalized_name is null;

create unique index if not exists offices_normalized_name_uidx on public.offices(normalized_name) where normalized_name is not null and normalized_name <> '';

-- 2) Sincronizar oficinas desde órdenes de servicio existentes
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
  on conflict (normalized_name) do update set
    address = coalesce(excluded.address, public.offices.address),
    office_name = coalesce(public.offices.office_name, excluded.office_name),
    updated_at = now();
end;
$$;

grant execute on function public.sync_offices_from_service_orders() to authenticated;
select public.sync_offices_from_service_orders();

-- 3) RBAC: permisos por rol, módulo y acción
create table if not exists public.role_module_permissions (
  id uuid primary key default gen_random_uuid(),
  role_name text not null check (role_name in ('SuperAdmin','Admin','Técnicos','Tecnicos','Usuarios')),
  module_key text not null,
  can_view boolean not null default false,
  can_create boolean not null default false,
  can_edit boolean not null default false,
  can_delete boolean not null default false,
  can_import boolean not null default false,
  can_export boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(role_name, module_key)
);

-- Permisos SuperAdmin completos
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
select 'SuperAdmin', m, true,true,true,true,true,true
from unnest(array['dashboard','users','roles','orders','inventory','loans','tickets','offices','notifications','profile','settings']) m
on conflict(role_name,module_key) do update set can_view=true, can_create=true, can_edit=true, can_delete=true, can_import=true, can_export=true, updated_at=now();

-- Admin operativo
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export) values
('Admin','dashboard',true,false,false,false,false,false),
('Admin','orders',true,true,true,false,true,true),
('Admin','inventory',true,true,true,false,true,true),
('Admin','loans',true,true,true,false,true,true),
('Admin','tickets',true,true,true,false,true,true),
('Admin','offices',true,false,false,false,false,true),
('Admin','notifications',true,true,false,false,false,false),
('Admin','profile',true,false,true,false,false,false)
on conflict(role_name,module_key) do nothing;

-- Técnicos: ver/actualizar tareas asignadas, inventario y tickets
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export) values
('Técnicos','dashboard',true,false,false,false,false,false),
('Técnicos','orders',true,false,true,false,false,false),
('Técnicos','inventory',true,false,false,false,false,false),
('Técnicos','tickets',true,false,true,false,false,false),
('Técnicos','notifications',true,false,false,false,false,false),
('Técnicos','profile',true,false,true,false,false,false)
on conflict(role_name,module_key) do nothing;

-- Usuario general: tickets, préstamos, notificaciones y perfil
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export) values
('Usuarios','dashboard',true,false,false,false,false,false),
('Usuarios','tickets',true,true,false,false,false,false),
('Usuarios','loans',true,true,false,false,false,false),
('Usuarios','notifications',true,false,false,false,false,false),
('Usuarios','profile',true,false,true,false,false,false)
on conflict(role_name,module_key) do nothing;

-- 4) Funciones seguras de permiso
create or replace function public.tm_is_superadmin_v830()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin' and p.is_active=true);
$$;

grant execute on function public.tm_is_superadmin_v830() to authenticated;

create or replace function public.tm_has_permission(p_module text, p_action text default 'view')
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce((
    select case
      when p.role_name='SuperAdmin' then true
      when p_action='view' then rmp.can_view
      when p_action='create' then rmp.can_create
      when p_action='edit' then rmp.can_edit
      when p_action='delete' then rmp.can_delete
      when p_action='import' then rmp.can_import
      when p_action='export' then rmp.can_export
      else false
    end
    from public.profiles p
    left join public.role_module_permissions rmp on rmp.role_name=p.role_name and rmp.module_key=p_module
    where p.id=auth.uid() and p.is_active=true
    limit 1
  ), false);
$$;

grant execute on function public.tm_has_permission(text,text) to authenticated;

-- 5) RLS básica no recursiva
alter table public.role_module_permissions enable row level security;
drop policy if exists role_module_permissions_read on public.role_module_permissions;
drop policy if exists role_module_permissions_superadmin_write on public.role_module_permissions;
create policy role_module_permissions_read on public.role_module_permissions for select to authenticated using (true);
create policy role_module_permissions_superadmin_write on public.role_module_permissions for all to authenticated using (public.tm_is_superadmin_v830()) with check (public.tm_is_superadmin_v830());

grant select on public.role_module_permissions to authenticated;
grant insert, update, delete on public.role_module_permissions to authenticated;

alter table public.offices enable row level security;
drop policy if exists offices_read_authenticated on public.offices;
drop policy if exists offices_write_permitted on public.offices;
create policy offices_read_authenticated on public.offices for select to authenticated using (true);
create policy offices_write_permitted on public.offices for all to authenticated using (public.tm_has_permission('offices','edit') or public.tm_has_permission('offices','create') or public.tm_is_superadmin_v830()) with check (public.tm_has_permission('offices','edit') or public.tm_has_permission('offices','create') or public.tm_is_superadmin_v830());

grant select on public.offices to authenticated;
grant insert, update, delete on public.offices to authenticated;

-- 6) Asignar ticket a técnico y crear orden de servicio automáticamente
create or replace function public.pick_random_active_technician()
returns uuid
language sql
security definer
set search_path = public
as $$
  select id from public.profiles
  where is_active=true and role_name in ('Técnicos','Tecnicos')
  order by random()
  limit 1;
$$;

grant execute on function public.pick_random_active_technician() to authenticated, anon;

create or replace function public.create_service_order_from_ticket()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tech uuid;
  default_status uuid;
  new_order uuid;
begin
  if new.service_order_id is not null then
    return new;
  end if;

  tech := public.pick_random_active_technician();
  select id into default_status from public.service_order_statuses order by sort_order nulls last, created_at limit 1;

  insert into public.service_orders(
    origin_ticket_id, status_id, assigned_to, technician_user_id, requester_name, requester_email,
    requester_phone, office, fault_description, priority, source, created_at, updated_at
  ) values (
    new.id, default_status, tech, tech, new.requester_name, new.requester_email,
    new.requester_phone, coalesce(new.office,new.area), coalesce(new.description,new.subject,'Sin falla informada'),
    coalesce(new.priority,'Media'), 'SOPORTE_TICKET_AUTO', now(), now()
  ) returning id into new_order;

  new.assigned_to := tech;
  new.service_order_id := new_order;
  return new;
end;
$$;

drop trigger if exists trg_support_ticket_assign_order on public.support_tickets;
create trigger trg_support_ticket_assign_order
before insert on public.support_tickets
for each row execute function public.create_service_order_from_ticket();

-- 7) Normalizar técnicos existentes para login estable
update public.profiles set role_name='Técnicos', is_active=true, updated_at=now() where role_name='Tecnicos';
update auth.users u set aud='authenticated', role='authenticated', email_confirmed_at=coalesce(email_confirmed_at,now()), updated_at=now()
from public.profiles p where p.id=u.id and p.role_name='Técnicos';

-- 8) Diagnóstico
select p.email,p.full_name,p.role_name,p.is_active, exists(select 1 from auth.identities i where i.user_id=p.id and i.provider='email') as has_email_identity from public.profiles p order by p.role_name,p.full_name;
