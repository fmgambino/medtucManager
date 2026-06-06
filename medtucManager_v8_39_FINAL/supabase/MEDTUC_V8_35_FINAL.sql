
-- =====================================================
-- MEDTUC Ticket Manager v8.35 FINAL
-- RBAC estable + Excepciones + asignación automática + soporte público.
-- Ejecutar completo en Supabase SQL Editor.
-- =====================================================
create extension if not exists pgcrypto;

alter table public.roles drop constraint if exists roles_name_check;

create table if not exists public.role_module_permissions (
  id uuid primary key default gen_random_uuid(), role_name text not null, module_key text not null,
  can_view boolean not null default false, can_create boolean not null default false, can_edit boolean not null default false,
  can_delete boolean not null default false, can_import boolean not null default false, can_export boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists role_module_permissions_role_module_uidx on public.role_module_permissions(role_name,module_key);

insert into public.roles(name,description,is_system) values
('SuperAdmin','Acceso total',true),('Admin','Administración general',true),('Técnicos','Perfil técnico',true),('Usuarios','Usuario general',true),('Referentes','Carga de tickets públicos e internos',false)
on conflict(name) do update set description=excluded.description, updated_at=now();

create table if not exists public.task_types(
  id uuid primary key default gen_random_uuid(), name text not null unique, description text, weight integer not null default 1,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.technician_task_types(
  id uuid primary key default gen_random_uuid(), technician_id uuid not null references auth.users(id) on delete cascade,
  task_type_id uuid not null references public.task_types(id) on delete cascade, skill_level integer not null default 1,
  is_active boolean not null default true, created_at timestamptz not null default now(), unique(technician_id,task_type_id)
);
create table if not exists public.technician_exceptions(
  id uuid primary key default gen_random_uuid(), technician_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'Otra excepción', start_at timestamptz not null, end_at timestamptz,
  reason text, is_active boolean not null default true, created_by uuid references auth.users(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.technician_work_schedules(
  id uuid primary key default gen_random_uuid(), technician_id uuid not null references auth.users(id) on delete cascade,
  weekday integer not null check(weekday between 0 and 6), start_time time not null, end_time time not null,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(technician_id, weekday, start_time, end_time)
);

alter table public.profiles add column if not exists work_days text[] default array['1','2','3','4','5'];
alter table public.profiles add column if not exists work_start time default '08:00';
alter table public.profiles add column if not exists work_end time default '14:00';

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

insert into public.task_types(name,description,weight) values
('Armado de Kit PC','Preparación de kits de PC y periféricos',2),('Cableado Red','Cableado, conectividad y puntos de red',3),('Cambio SSD','Cambio o actualización de disco SSD',2),('Config. Impresora','Configuración de impresoras',1),('Config. Red','Configuración de red',2),('Config. Router/Switch','Configuración de router o switch',3),('Formateo y Reinstalación WIN10','Reinstalación de sistema operativo',2),('Limpieza de Equipos','Limpieza y mantenimiento preventivo',1)
on conflict(name) do update set description=excluded.description, weight=excluded.weight, updated_at=now();

create or replace function public.tm_is_superadmin() returns boolean language sql security definer set search_path=public as $$
  select exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin' and p.is_active=true);
$$;
grant execute on function public.tm_is_superadmin() to anon, authenticated;

insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
select r.role_name,m.module_key,
  case when r.role_name='SuperAdmin' then true when m.module_key='exceptions' then false else true end,
  case when r.role_name='SuperAdmin' then true when r.role_name='Admin' and m.module_key not in ('exceptions','settings') then true when r.role_name='Usuarios' and m.module_key in ('tickets','loans') then true when r.role_name='Referentes' and m.module_key='tickets' then true else false end,
  case when r.role_name='SuperAdmin' then true when r.role_name='Admin' and m.module_key not in ('exceptions','settings') then true when r.role_name='Técnicos' and m.module_key in ('orders','tickets','profile') then true else false end,
  case when r.role_name='SuperAdmin' then true else false end,
  case when r.role_name in ('SuperAdmin','Admin') and m.module_key<>'exceptions' then true when r.role_name='SuperAdmin' then true else false end,
  case when r.role_name in ('SuperAdmin','Admin') and m.module_key<>'exceptions' then true when r.role_name='SuperAdmin' then true else false end
from (values('SuperAdmin'),('Admin'),('Técnicos'),('Usuarios'),('Referentes')) r(role_name)
cross join (values('dashboard'),('users'),('roles'),('orders'),('inventory'),('loans'),('tickets'),('exceptions'),('notifications'),('offices'),('profile'),('settings')) m(module_key)
on conflict(role_name,module_key) do update set can_view=excluded.can_view, can_create=excluded.can_create, can_edit=excluded.can_edit, can_delete=excluded.can_delete, can_import=excluded.can_import, can_export=excluded.can_export, updated_at=now();
update public.role_module_permissions set can_view=true,can_create=true,can_edit=true,can_delete=true,can_import=true,can_export=true where role_name='SuperAdmin' and module_key='exceptions';
update public.role_module_permissions set can_view=false,can_create=false,can_edit=false,can_delete=false,can_import=false,can_export=false where role_name<>'SuperAdmin' and module_key='exceptions';

create or replace function public.get_unread_notification_count() returns integer language sql security definer set search_path=public as $$
  select count(*)::integer from public.notifications n left join public.profiles p on p.id=auth.uid()
  where coalesce(n.is_read,false)=false and (p.role_name='SuperAdmin' or n.target_user=auth.uid() or n.target_role=p.role_name or n.target_role is null);
$$;
grant execute on function public.get_unread_notification_count() to authenticated;

create or replace function public.pick_available_technicians(p_task_name text default null, p_equipment_count integer default 1)
returns table(primary_technician uuid, collaborator_technician uuid)
language plpgsql security definer set search_path=public as $$
declare main_id uuid; collab_id uuid; task_id uuid; dow text; now_time time;
begin
  select id into task_id from public.task_types where lower(name)=lower(coalesce(p_task_name,'')) limit 1;
  dow := extract(dow from now())::int::text; now_time := now()::time;
  select p.id into main_id
  from public.profiles p
  where p.role_name in ('Técnicos','Tecnicos') and p.is_active=true
    and (p.work_days is null or dow = any(p.work_days))
    and (p.work_start is null or p.work_end is null or now_time between p.work_start and p.work_end)
    and not exists(select 1 from public.technician_exceptions e where e.technician_id=p.id and e.is_active=true and now() between e.start_at and coalesce(e.end_at, now()+interval '100 years'))
    and (task_id is null or not exists(select 1 from public.technician_task_types tt where tt.technician_id=p.id) or exists(select 1 from public.technician_task_types tt where tt.technician_id=p.id and tt.task_type_id=task_id and tt.is_active=true))
  order by random() limit 1;
  if coalesce(p_equipment_count,1) > 7 then
    select p.id into collab_id
    from public.profiles p
    where p.role_name in ('Técnicos','Tecnicos') and p.is_active=true and p.id <> main_id
      and (p.work_days is null or dow = any(p.work_days))
      and (p.work_start is null or p.work_end is null or now_time between p.work_start and p.work_end)
      and not exists(select 1 from public.technician_exceptions e where e.technician_id=p.id and e.is_active=true and now() between e.start_at and coalesce(e.end_at, now()+interval '100 years'))
    order by random() limit 1;
  end if;
  return query select main_id, collab_id;
end $$;
grant execute on function public.pick_available_technicians(text,integer) to anon, authenticated;

create or replace function public.auto_create_order_from_ticket() returns trigger language plpgsql security definer set search_path=public as $$
declare tech uuid; collab uuid; st uuid; so_id uuid; tid uuid;
begin
  if new.service_order_id is not null then return new; end if;
  select primary_technician, collaborator_technician into tech, collab from public.pick_available_technicians(coalesce(new.service_type,new.incidence_type), coalesce(new.equipment_count,1));
  select id into tid from public.task_types where lower(name)=lower(coalesce(new.service_type,new.incidence_type,'')) limit 1;
  select id into st from public.service_order_statuses where lower(name) in ('pendiente','en proceso') order by case when lower(name)='pendiente' then 0 else 1 end limit 1;
  insert into public.service_orders(origin_ticket_id,status_id,assigned_to,technician_user_id,collaborator_assigned_to,requester_name,requester_email,requester_phone,office,equipment_type,brand,model,accessories,fault_description,priority,source,service_type,equipment_count,task_type_id,created_at,updated_at)
  values(new.id,st,tech,tech,collab,new.requester_name,new.requester_email,new.requester_phone,new.office,new.equipment_type,new.brand,new.model,new.accessories,coalesce(new.description,new.subject,'Ticket sin descripción'),coalesce(new.priority,'Media'),'TICKET_AUTO',coalesce(new.service_type,new.incidence_type),coalesce(new.equipment_count,1),tid,now(),now()) returning id into so_id;
  new.assigned_to := tech; new.collaborator_assigned_to := collab; new.task_type_id := tid; new.service_order_id := so_id;
  return new;
end $$;
drop trigger if exists trg_auto_create_order_from_ticket on public.support_tickets;
create trigger trg_auto_create_order_from_ticket before insert on public.support_tickets for each row execute function public.auto_create_order_from_ticket();

-- RLS y grants seguros.
do $$
declare t text; pol record;
begin
  foreach t in array array['roles','permissions','role_permissions','role_module_permissions','profiles','inventory_items','inventory_movements','service_orders','service_order_statuses','service_order_items','service_order_notes','service_order_history','support_tickets','loans','notifications','offices','inventory_conditions','task_types','technician_task_types','technician_exceptions','technician_work_schedules'] loop
    execute format('alter table public.%I enable row level security',t);
    for pol in select policyname from pg_policies where schemaname='public' and tablename=t loop execute format('drop policy if exists %I on public.%I',pol.policyname,t); end loop;
    execute format('grant select on public.%I to anon, authenticated',t);
    execute format('grant insert, update, delete on public.%I to authenticated',t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true)',t||'_read_v835',t);
    execute format('create policy %I on public.%I for insert to anon, authenticated with check (true)',t||'_insert_v835',t);
    execute format('create policy %I on public.%I for update to authenticated using (public.tm_is_superadmin() or auth.uid() is not null) with check (public.tm_is_superadmin() or auth.uid() is not null)',t||'_update_v835',t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.tm_is_superadmin())',t||'_delete_v835',t);
  end loop;
end $$;
grant usage on schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;

select 'V8_35_OK' as status,
 (select count(*) from public.role_module_permissions) as permisos,
 (select count(*) from public.task_types) as tareas,
 (select count(*) from public.technician_exceptions) as excepciones,
 (select count(*) from public.inventory_items) as inventario;
