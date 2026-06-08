
-- =====================================================
-- MEDTUC Ticket Manager v8.34 FINAL
-- RBAC + Excepciones + fixes de permisos, RLS, notificaciones.
-- Ejecutar completo en Supabase SQL Editor.
-- =====================================================

create extension if not exists pgcrypto;

-- 1) RBAC: asegurar tabla role_module_permissions compatible con ON CONFLICT.
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
      and conrelid = 'public.role_module_permissions'::regclass
  ) then
    alter table public.role_module_permissions
      add constraint role_module_permissions_role_module_key unique(role_name, module_key);
  end if;
end $$;

-- 2) Roles dinámicos.
alter table public.roles drop constraint if exists roles_name_check;
insert into public.roles(name, description, is_system)
values
('SuperAdmin','Acceso total',true),
('Admin','Administración general',true),
('Técnicos','Perfil técnico',true),
('Usuarios','Usuario general',true)
on conflict (name) do update set
  description = excluded.description,
  is_system = true,
  updated_at = now();

-- 3) Módulo Excepciones.
create table if not exists public.task_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  weight integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.technician_task_types (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references auth.users(id) on delete cascade,
  task_type_id uuid not null references public.task_types(id) on delete cascade,
  skill_level integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(technician_id, task_type_id)
);

create table if not exists public.technician_exceptions (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'Otra excepción',
  start_at timestamptz not null,
  end_at timestamptz,
  reason text,
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.task_types(name, description, weight)
values
('Soporte técnico general','Diagnóstico y resolución de tickets comunes',1),
('Preparación de equipos','Preparación, instalación y verificación de equipos',2),
('Cableado de red','Instalación, reparación o certificación básica de red',3),
('Mantenimiento de PC','Diagnóstico, limpieza, hardware y software',2)
on conflict (name) do nothing;

-- 4) Permisos iniciales.
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
select r.role_name, m.module_key,
       true,
       case when r.role_name in ('SuperAdmin','Admin') then true when r.role_name='Usuarios' and m.module_key in ('tickets','loans') then true else false end,
       case when r.role_name in ('SuperAdmin','Admin') then true when r.role_name='Técnicos' and m.module_key in ('orders','tickets','profile') then true else false end,
       case when r.role_name='SuperAdmin' then true else false end,
       case when r.role_name in ('SuperAdmin','Admin') then true else false end,
       case when r.role_name in ('SuperAdmin','Admin') then true else false end
from (values ('SuperAdmin'),('Admin'),('Técnicos'),('Usuarios')) r(role_name)
cross join (values
('dashboard'),('users'),('roles'),('orders'),('inventory'),('loans'),('tickets'),('notifications'),('offices'),('exceptions'),('profile'),('settings')
) m(module_key)
on conflict (role_name,module_key) do update set
  can_view = excluded.can_view,
  can_create = excluded.can_create,
  can_edit = excluded.can_edit,
  can_delete = excluded.can_delete,
  can_import = excluded.can_import,
  can_export = excluded.can_export,
  updated_at = now();

-- Ajustes específicos
update public.role_module_permissions set can_view=false where role_name <> 'SuperAdmin' and module_key='exceptions';
update public.role_module_permissions set can_view=true, can_create=true, can_edit=true, can_delete=true, can_import=true, can_export=true where role_name='SuperAdmin';

-- 5) RLS / grants robustos.
create or replace function public.tm_is_superadmin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role_name = 'SuperAdmin'
      and p.is_active = true
  );
$$;

grant execute on function public.tm_is_superadmin() to authenticated;

do $$
declare
  t text;
  pol record;
begin
  foreach t in array array[
    'roles','permissions','role_permissions','role_module_permissions',
    'profiles','inventory_items','inventory_movements',
    'service_orders','service_order_statuses','service_order_items','service_order_notes','service_order_history',
    'support_tickets','loans','notifications','offices','inventory_conditions',
    'task_types','technician_task_types','technician_exceptions'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    for pol in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy if exists %I on public.%I', pol.policyname, t);
    end loop;
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true)', t||'_read_v834', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.tm_is_superadmin() or auth.uid() is not null)', t||'_insert_v834', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.tm_is_superadmin() or auth.uid() is not null) with check (public.tm_is_superadmin() or auth.uid() is not null)', t||'_update_v834', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.tm_is_superadmin())', t||'_delete_v834', t);
  end loop;
end $$;

grant usage on schema public to anon, authenticated;
grant execute on all functions in schema public to authenticated;

-- 6) Notificaciones: función para contador.
create or replace function public.get_unread_notification_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.notifications n
  left join public.profiles p on p.id = auth.uid()
  where coalesce(n.is_read,false) = false
    and (
      p.role_name = 'SuperAdmin'
      or n.target_user = auth.uid()
      or n.target_role = p.role_name
      or n.target_role is null
    );
$$;
grant execute on function public.get_unread_notification_count() to authenticated;

-- 7) Asignación aleatoria de técnico disponible para tickets/órdenes.
create or replace function public.pick_available_technician(p_task_type text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  select p.id into v_id
  from public.profiles p
  where p.role_name in ('Técnicos','Tecnicos')
    and p.is_active = true
    and not exists (
      select 1 from public.technician_exceptions e
      where e.technician_id = p.id
        and e.is_active = true
        and now() between e.start_at and coalesce(e.end_at, now() + interval '100 years')
    )
  order by random()
  limit 1;
  return v_id;
end $$;
grant execute on function public.pick_available_technician(text) to anon, authenticated;

-- 8) Trigger: al crear ticket, asigna técnico y genera orden.
create or replace function public.auto_create_order_from_ticket()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tech uuid;
  st uuid;
  so_id uuid;
begin
  if new.service_order_id is not null then
    return new;
  end if;

  tech := public.pick_available_technician(new.incidence_type);

  select id into st
  from public.service_order_statuses
  where lower(name) in ('pendiente','en proceso')
  order by case when lower(name)='pendiente' then 0 else 1 end
  limit 1;

  insert into public.service_orders(
    origin_ticket_id,status_id,assigned_to,technician_user_id,requester_name,requester_email,requester_phone,
    office,fault_description,priority,source,created_at,updated_at
  )
  values(
    new.id, st, tech, tech, new.requester_name, new.requester_email, new.requester_phone,
    new.office, coalesce(new.description,new.subject,'Ticket sin descripción'), coalesce(new.priority,'Media'), 'TICKET_AUTO', now(), now()
  )
  returning id into so_id;

  new.assigned_to := tech;
  new.service_order_id := so_id;
  return new;
end $$;

drop trigger if exists trg_auto_create_order_from_ticket on public.support_tickets;
create trigger trg_auto_create_order_from_ticket
before insert on public.support_tickets
for each row execute function public.auto_create_order_from_ticket();

-- 9) Diagnóstico.
select 'V8_34_OK' as status,
       (select count(*) from public.role_module_permissions) as permisos,
       (select count(*) from public.task_types) as tareas,
       (select count(*) from public.inventory_items) as inventario,
       (select count(*) from public.notifications) as notificaciones;
