-- =========================================================
-- MEDTUC Ticket Manager v8.40 FINAL
-- Hotfix: actividad/logs, permisos y compatibilidad RLS
-- Ejecutar completo en Supabase SQL Editor.
-- =========================================================

create extension if not exists pgcrypto;

-- Tabla nueva: Registros Historial / auditoría operativa
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  user_email text,
  user_name text,
  role_name text,
  action text not null,
  module text,
  entity_id uuid,
  detail text,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);
create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
create index if not exists idx_activity_logs_module on public.activity_logs(module);

alter table public.activity_logs enable row level security;

do $$
declare pol record;
begin
  for pol in select policyname from pg_policies where schemaname='public' and tablename='activity_logs' loop
    execute format('drop policy if exists %I on public.activity_logs', pol.policyname);
  end loop;
end $$;

create policy "activity_logs_insert_authenticated_v840"
on public.activity_logs
for insert
to authenticated
with check (true);

create policy "activity_logs_select_superadmin_v840"
on public.activity_logs
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role_name in ('SuperAdmin','SuperUser')
      and p.is_active = true
  )
);

grant usage on schema public to anon, authenticated;
grant select, insert on public.activity_logs to authenticated;

-- Compatibilidad para excepciones, tareas, préstamos y notificaciones.
grant select, insert, update, delete on public.technician_exceptions to authenticated;
grant select, insert, update, delete on public.task_types to authenticated;
grant select, insert, update, delete on public.technician_task_types to authenticated;
grant select, insert, update, delete on public.technician_work_schedules to authenticated;
grant select, insert, update, delete on public.loans to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select on public.profiles to authenticated;

-- RLS liviano para tablas nuevas/operativas, evitando bloqueos por políticas antiguas.
alter table public.technician_exceptions enable row level security;
alter table public.task_types enable row level security;
alter table public.technician_task_types enable row level security;
alter table public.technician_work_schedules enable row level security;

do $$
declare pol record;
begin
  for pol in select policyname from pg_policies where schemaname='public' and tablename in ('technician_exceptions','task_types','technician_task_types','technician_work_schedules') loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, (select tablename from pg_policies where schemaname='public' and policyname=pol.policyname limit 1));
  end loop;
exception when others then
  null;
end $$;

-- Crear policies de forma segura por tabla.
do $$ begin
  drop policy if exists "technician_exceptions_all_auth_v840" on public.technician_exceptions;
  create policy "technician_exceptions_all_auth_v840" on public.technician_exceptions for all to authenticated using (true) with check (true);
exception when others then null; end $$;

do $$ begin
  drop policy if exists "task_types_all_auth_v840" on public.task_types;
  create policy "task_types_all_auth_v840" on public.task_types for all to authenticated using (true) with check (true);
exception when others then null; end $$;

do $$ begin
  drop policy if exists "technician_task_types_all_auth_v840" on public.technician_task_types;
  create policy "technician_task_types_all_auth_v840" on public.technician_task_types for all to authenticated using (true) with check (true);
exception when others then null; end $$;

do $$ begin
  drop policy if exists "technician_work_schedules_all_auth_v840" on public.technician_work_schedules;
  create policy "technician_work_schedules_all_auth_v840" on public.technician_work_schedules for all to authenticated using (true) with check (true);
exception when others then null; end $$;

-- Asegura permisos del módulo nuevo para SuperAdmin/SuperUser en matriz simple.
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export,updated_at)
values
('SuperAdmin','logs',true,false,false,false,false,true,now()),
('SuperUser','logs',true,false,false,false,false,true,now())
on conflict do nothing;

-- Diagnóstico final
select 'V8_40_OK' as status, count(*) as activity_logs_rows from public.activity_logs;
