-- ISM Robosoft v18 - persistencia de notificaciones, condiciones, equipos y edicion masiva
-- Ejecutar completo en Supabase SQL Editor.

-- Permisos base
insert into public.permissions (code, name, module) values
  ('dashboard.read','Ver dashboard','dashboard'),
  ('users.read','Ver usuarios','users'),
  ('users.manage','Administrar usuarios','users'),
  ('roles.manage','Administrar roles','roles'),
  ('teams.read','Ver equipos','teams'),
  ('teams.manage','Administrar equipos','teams'),
  ('inventory.read','Ver inventario','inventory'),
  ('inventory.manage','Administrar inventario','inventory'),
  ('inventory.loan','Solicitar prestamos','inventory'),
  ('inventory.approve','Aprobar prestamos','inventory'),
  ('loan.read','Ver prestamos','loans'),
  ('loan.create','Crear prestamos','loans'),
  ('loan.manage','Gestionar prestamos','loans'),
  ('notifications.read','Ver notificaciones','notifications'),
  ('notifications.send','Enviar notificaciones','notifications'),
  ('courses.read','Ver campus','courses'),
  ('courses.manage','Gestionar campus','courses'),
  ('library.read','Ver biblioteca','library'),
  ('library.manage','Gestionar biblioteca','library')
on conflict (code) do update set name = excluded.name, module = excluded.module;

-- Condiciones iniciales normalizadas. No borra condiciones existentes.
insert into public.inventory_conditions (name, color, sort_order, is_active) values
  ('Nuevo', '#22c55e', 10, true),
  ('Usado', '#6366f1', 20, true),
  ('Reparado', '#06b6d4', 30, true),
  ('Falta piezas', '#f59e0b', 40, true),
  ('Defectuoso', '#ef4444', 50, true),
  ('Usado, completo', '#7c3aed', 60, true),
  ('Usado, completo, faltantes', '#f97316', 70, true),
  ('Roto', '#dc2626', 80, true)
on conflict (name) do update set color = excluded.color, sort_order = excluded.sort_order, is_active = true, updated_at = now();

-- RPC de persistencia real para condiciones y color.
drop function if exists public.save_inventory_condition_v18(text,text);
drop function if exists public.save_inventory_condition_v16(text,text);
drop function if exists public.upsert_inventory_condition(text,text);

create or replace function public.save_inventory_condition_v18(p_name text, p_color text default '#64748b')
returns table(id uuid, name text, color text, sort_order integer, is_active boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := trim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g'));
  v_color text := lower(coalesce(nullif(trim(p_color),''), '#64748b'));
  v_id uuid;
begin
  if v_name = '' then
    raise exception 'Nombre de condicion obligatorio';
  end if;
  if v_color !~ '^#[0-9a-f]{6}$' then
    v_color := '#64748b';
  end if;

  select c.id into v_id
  from public.inventory_conditions c
  where lower(trim(c.name)) = lower(v_name)
  order by c.created_at asc
  limit 1;

  if v_id is null then
    insert into public.inventory_conditions(name, color, sort_order, is_active, updated_at)
    values(v_name, v_color, 100, true, now())
    returning inventory_conditions.id into v_id;
  else
    update public.inventory_conditions c
       set name = v_name, color = v_color, is_active = true, updated_at = now()
     where c.id = v_id;
  end if;

  return query
  select c.id, c.name, c.color, c.sort_order, c.is_active
  from public.inventory_conditions c
  where c.id = v_id;
end;
$$;

create or replace function public.upsert_inventory_condition(p_name text, p_color text default '#64748b')
returns table(id uuid, name text, color text, sort_order integer, is_active boolean)
language sql
security definer
set search_path = public
as $$
  select * from public.save_inventory_condition_v18(p_name, p_color);
$$;

grant execute on function public.save_inventory_condition_v18(text,text) to authenticated;
grant execute on function public.upsert_inventory_condition(text,text) to authenticated;
grant select, insert, update on public.inventory_conditions to authenticated;

-- Marcar notificaciones como leidas de forma persistente con seguridad por usuario.
drop function if exists public.mark_notification_read(uuid);
create or replace function public.mark_notification_read(p_notification_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notifications
     set read_at = coalesce(read_at, now())
   where id = p_notification_id
     and (recipient_profile_id = auth.uid() or exists (
       select 1 from public.profiles p join public.roles r on r.id = p.role_id
       where p.id = auth.uid() and r.code = 'administrator'
     ));
end;
$$;
grant execute on function public.mark_notification_read(uuid) to authenticated;
grant select, update on public.notifications to authenticated;

-- Vista de notificaciones por usuario actual / administradores.
create or replace view public.notifications_frontend_view as
select n.*
from public.notifications n
where n.recipient_profile_id = auth.uid()
   or exists (
     select 1 from public.profiles p join public.roles r on r.id = p.role_id
     where p.id = auth.uid() and r.code = 'administrator'
   );
grant select on public.notifications_frontend_view to authenticated;

-- Listado completo de equipos con miembros para editar correctamente.
drop function if exists public.admin_list_teams_full();
create or replace function public.admin_list_teams_full()
returns table(
  id uuid,
  name text,
  description text,
  project text,
  mentor_id uuid,
  mentor_backup_id uuid,
  student_ids uuid[],
  teachers text[],
  courses text[],
  divisions text[],
  students integer,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    t.id,
    t.name,
    t.description,
    t.description as project,
    t.teacher_id as mentor_id,
    t.backup_teacher_id as mentor_backup_id,
    coalesce(array_agg(tm.profile_id) filter (where tm.profile_id is not null), '{}'::uuid[]) as student_ids,
    array_remove(array[pt.full_name, pb.full_name], null) as teachers,
    array_remove(array[c.name], null) as courses,
    array_remove(array[d.name], null) as divisions,
    count(tm.profile_id)::int as students,
    t.created_at
  from public.teams t
  left join public.profiles pt on pt.id = t.teacher_id
  left join public.profiles pb on pb.id = t.backup_teacher_id
  left join public.courses c on c.id = t.course_id
  left join public.divisions d on d.id = t.division_id
  left join public.team_members tm on tm.team_id = t.id
  group by t.id, pt.full_name, pb.full_name, c.name, d.name
  order by t.created_at desc;
$$;
grant execute on function public.admin_list_teams_full() to authenticated;

-- Guardado completo de equipos. Usa description como proyecto/observacion si no hay columna project.
drop function if exists public.admin_save_team_full(uuid,text,text,text,uuid,uuid,uuid[]);
create or replace function public.admin_save_team_full(
  p_team_id uuid default null,
  p_name text default null,
  p_project text default null,
  p_description text default null,
  p_mentor_id uuid default null,
  p_mentor_backup_id uuid default null,
  p_student_ids uuid[] default '{}'::uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_student uuid;
begin
  if nullif(trim(coalesce(p_name,'')), '') is null then
    raise exception 'Nombre de equipo obligatorio';
  end if;
  if coalesce(array_length(p_student_ids, 1), 0) > 5 then
    raise exception 'El equipo no puede tener mas de 5 alumnos';
  end if;

  if p_team_id is null then
    insert into public.teams(name, description, teacher_id, backup_teacher_id, status, updated_at)
    values(trim(p_name), coalesce(nullif(trim(p_description), ''), nullif(trim(p_project), '')), p_mentor_id, p_mentor_backup_id, 'activo', now())
    returning id into v_id;
  else
    update public.teams
       set name = trim(p_name),
           description = coalesce(nullif(trim(p_description), ''), nullif(trim(p_project), ''), description),
           teacher_id = p_mentor_id,
           backup_teacher_id = p_mentor_backup_id,
           updated_at = now()
     where id = p_team_id
     returning id into v_id;
    if v_id is null then raise exception 'Equipo no encontrado'; end if;
    delete from public.team_members where team_id = v_id;
  end if;

  foreach v_student in array coalesce(p_student_ids, '{}'::uuid[]) loop
    insert into public.team_members(team_id, profile_id, is_leader, role_in_team)
    values(v_id, v_student, false, 'student')
    on conflict do nothing;
  end loop;

  return v_id;
end;
$$;
grant execute on function public.admin_save_team_full(uuid,text,text,text,uuid,uuid,uuid[]) to authenticated;
grant select, insert, update, delete on public.teams to authenticated;
grant select, insert, update, delete on public.team_members to authenticated;

-- Edicion masiva / baja logica de inventario.
drop function if exists public.bulk_soft_delete_inventory_assets(uuid[]);
create or replace function public.bulk_soft_delete_inventory_assets(p_asset_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.inventory_assets
     set is_active = false, updated_at = now()
   where id = any(coalesce(p_asset_ids, '{}'::uuid[]));
end;
$$;
grant execute on function public.bulk_soft_delete_inventory_assets(uuid[]) to authenticated;

drop function if exists public.bulk_update_inventory_assets(uuid[],text,text);
create or replace function public.bulk_update_inventory_assets(p_asset_ids uuid[], p_status text default null, p_condition_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status_id uuid;
begin
  if p_status is not null and trim(p_status) <> '' then
    select id into v_status_id from public.inventory_status_catalog
    where lower(name) = lower(p_status) or lower(frontend_status) = lower(p_status) or lower(code) = lower(p_status)
    order by sort_order limit 1;
  end if;

  update public.inventory_assets
     set status_id = coalesce(v_status_id, status_id),
         condition_note = coalesce(nullif(trim(p_condition_note), ''), condition_note),
         updated_at = now()
   where id = any(coalesce(p_asset_ids, '{}'::uuid[]));
end;
$$;
grant execute on function public.bulk_update_inventory_assets(uuid[],text,text) to authenticated;

grant select, insert, update on public.inventory_assets to authenticated;

do $$ begin perform pg_notify('pgrst', 'reload schema'); end $$;
