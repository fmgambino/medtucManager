-- =====================================================
-- MEDTUC Ticket Manager v8.37 FINAL
-- Hotfix urgente: Dashboard calendario, Excepciones, notificaciones,
-- asignación técnica, préstamos, horarios laborales y permisos.
-- Ejecutar COMPLETO en Supabase SQL Editor como postgres.
-- =====================================================

create extension if not exists pgcrypto;

-- Columnas y tablas necesarias
alter table public.profiles add column if not exists work_days text[] default array['1','2','3','4','5'];
alter table public.profiles add column if not exists work_start time default '08:00';
alter table public.profiles add column if not exists work_end time default '14:00';

create table if not exists public.task_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  weight integer not null default 1,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.technician_task_types (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references auth.users(id) on delete cascade,
  task_type_id uuid not null references public.task_types(id) on delete cascade,
  skill_level integer not null default 1,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);
create unique index if not exists technician_task_types_tech_task_uidx
on public.technician_task_types(technician_id, task_type_id);

create table if not exists public.technician_exceptions (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'Otra excepción',
  start_at timestamp with time zone not null,
  end_at timestamp with time zone,
  reason text,
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.technician_work_schedules (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references auth.users(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
create unique index if not exists technician_work_schedules_uidx
on public.technician_work_schedules(technician_id, weekday, start_time, end_time);

alter table public.support_tickets add column if not exists service_type text;
alter table public.support_tickets add column if not exists equipment_count integer not null default 1;
alter table public.support_tickets add column if not exists equipment_type text;
alter table public.support_tickets add column if not exists brand text;
alter table public.support_tickets add column if not exists model text;
alter table public.support_tickets add column if not exists accessories text;
alter table public.support_tickets add column if not exists collaborator_assigned_to uuid references auth.users(id);
alter table public.support_tickets add column if not exists task_type_id uuid references public.task_types(id);

alter table public.service_orders add column if not exists service_type text;
alter table public.service_orders add column if not exists equipment_count integer not null default 1;
alter table public.service_orders add column if not exists collaborator_assigned_to uuid references auth.users(id);
alter table public.service_orders add column if not exists task_type_id uuid references public.task_types(id);

alter table public.loans add column if not exists returned_at timestamp with time zone;

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
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
create unique index if not exists role_module_permissions_role_module_uidx
on public.role_module_permissions(role_name,module_key);

-- Roles base
insert into public.roles(name,description,is_system) values
('SuperAdmin','Acceso total',true),
('Admin','Administración general',true),
('Técnicos','Perfil técnico',true),
('Usuarios','Usuario general',true),
('Referentes','Referentes solicitantes',true)
on conflict (name) do update set description=excluded.description, updated_at=now();

-- Tareas base
insert into public.task_types(name,description,weight,is_active) values
('Armado de Kit PC','Preparación de kits de PC y periféricos',2,true),
('Cableado de red','Instalación, reparación o certificación básica de red',3,true),
('Cambio SSD','Cambio o actualización de disco SSD',2,true),
('Config. Impresora','Configuración de impresoras',1,true),
('Config. Red','Configuración de red',2,true),
('Config. Router/Switch','Configuración de router o switch',3,true),
('Formateo y Reinstalación WIN10','Reinstalación de sistema operativo',2,true),
('Limpieza de Equipos','Limpieza y mantenimiento preventivo',1,true),
('Mantenimiento de PC','Diagnóstico, limpieza, hardware y software',2,true),
('Preparación de equipos','Preparación, instalación y verificación de equipos',2,true),
('Soporte técnico general','Diagnóstico y resolución de tickets comunes',1,true)
on conflict (name) do update set description=excluded.description, weight=excluded.weight, is_active=true, updated_at=now();

-- Técnicos habilitados por defecto para todas las tareas
insert into public.technician_task_types(technician_id, task_type_id, skill_level, is_active)
select p.id, t.id, 1, true
from public.profiles p
cross join public.task_types t
where p.role_name in ('Técnicos','Tecnicos') and p.is_active=true
on conflict (technician_id, task_type_id) do nothing;

-- Permisos base
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
select 'SuperAdmin', m, true,true,true,true,true,true
from unnest(array['dashboard','users','roles','orders','inventory','loans','tickets','notifications','offices','exceptions','settings']) m
on conflict (role_name,module_key) do update set can_view=true,can_create=true,can_edit=true,can_delete=true,can_import=true,can_export=true,updated_at=now();

insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export) values
('Admin','dashboard',true,false,false,false,false,false),('Admin','users',true,true,true,false,false,true),('Admin','roles',true,false,false,false,false,false),('Admin','orders',true,true,true,false,true,true),('Admin','inventory',true,true,true,false,true,true),('Admin','loans',true,true,true,false,false,true),('Admin','tickets',true,true,true,false,true,true),('Admin','notifications',true,true,true,false,false,true),('Admin','offices',true,true,true,false,true,true),
('Técnicos','dashboard',true,false,false,false,false,false),('Técnicos','orders',true,true,true,false,false,true),('Técnicos','inventory',true,true,true,false,false,true),('Técnicos','loans',true,true,true,false,false,true),('Técnicos','tickets',true,true,true,false,false,true),('Técnicos','notifications',true,true,true,false,false,false),('Técnicos','offices',true,false,false,false,false,false),
('Usuarios','dashboard',true,false,false,false,false,false),('Usuarios','loans',true,true,false,false,false,false),('Usuarios','tickets',true,true,false,false,false,false),('Usuarios','notifications',true,false,false,false,false,false),('Usuarios','offices',true,false,false,false,false,false),
('Referentes','dashboard',true,false,false,false,false,false),('Referentes','tickets',true,true,false,false,false,false),('Referentes','notifications',true,false,false,false,false,false),('Referentes','offices',true,false,false,false,false,false)
on conflict (role_name,module_key) do update set
can_view=excluded.can_view, can_create=excluded.can_create, can_edit=excluded.can_edit,
can_delete=excluded.can_delete, can_import=excluded.can_import, can_export=excluded.can_export,
updated_at=now();

-- Grants / RLS institucional
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant select on public.offices, public.task_types to anon;
grant execute on all functions in schema public to authenticated;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','roles','permissions','role_permissions','role_module_permissions',
    'inventory_items','inventory_movements','loans','notifications',
    'support_tickets','service_orders','service_order_statuses','service_order_items','service_order_notes','service_order_history',
    'offices','task_types','technician_task_types','technician_exceptions','technician_work_schedules'
  ] loop
    if exists(select 1 from information_schema.tables where table_schema='public' and table_name=t) then
      execute format('alter table public.%I disable row level security', t);
    end if;
  end loop;
end $$;

-- Contador de notificaciones por usuario/rol
create or replace function public.get_unread_notification_count()
returns integer
language sql
security definer
set search_path=public
as $$
  select count(*)::integer
  from public.notifications n
  left join public.profiles p on p.id = auth.uid()
  where n.is_read=false
    and (
      p.role_name='SuperAdmin'
      or n.target_user=auth.uid()
      or n.target_role=p.role_name
      or n.target_role is null
    );
$$;
grant execute on function public.get_unread_notification_count() to authenticated;

select 'V8_37_OK' as status,
  (select count(*) from public.profiles) as profiles,
  (select count(*) from public.service_orders) as service_orders,
  (select count(*) from public.task_types) as task_types,
  (select count(*) from public.technician_exceptions) as exceptions,
  (select count(*) from public.role_module_permissions) as permissions;
