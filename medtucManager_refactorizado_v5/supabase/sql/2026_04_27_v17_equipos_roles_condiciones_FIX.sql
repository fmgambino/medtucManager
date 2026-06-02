-- ISM Robosoft v17 - Equipos, Roles/Permisos y Condiciones persistentes
-- Ejecutar completo en Supabase SQL Editor.

-- =============================
-- 1) Permisos base completos
-- =============================
insert into public.permissions (code, name, module) values
  ('dashboard.read','Ver dashboard','dashboard'),
  ('users.read','Ver usuarios','users'),
  ('users.manage','Gestionar usuarios','users'),
  ('roles.read','Ver roles y permisos','roles'),
  ('roles.manage','Gestionar roles y permisos','roles'),
  ('teams.read','Ver equipos','teams'),
  ('teams.manage','Gestionar equipos','teams'),
  ('inventory.read','Ver inventario','inventory'),
  ('inventory.manage','Gestionar inventario','inventory'),
  ('inventory.loan','Solicitar préstamos','inventory'),
  ('inventory.approve','Aprobar préstamos','inventory'),
  ('loan.read','Ver gestión de préstamos','loans'),
  ('loan.create','Crear solicitudes de préstamo','loans'),
  ('loan.manage','Gestionar préstamos','loans'),
  ('notifications.read','Ver notificaciones','notifications'),
  ('notifications.send','Enviar notificaciones','notifications'),
  ('library.read','Ver biblioteca digital','library'),
  ('library.manage','Gestionar biblioteca digital','library'),
  ('campus.read','Ver campus docente','campus'),
  ('campus.manage','Gestionar campus docente','campus'),
  ('settings.read','Ver configuraciones','settings'),
  ('settings.manage','Gestionar configuraciones','settings')
on conflict (code) do update set
  name = excluded.name,
  module = excluded.module;

-- =============================
-- 2) Condiciones persistentes con color
-- =============================
create or replace function public.save_inventory_condition_v17(
  p_name text,
  p_color text
)
returns public.inventory_conditions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := nullif(regexp_replace(trim(coalesce(p_name,'')), '\s+', ' ', 'g'), '');
  v_color text := lower(trim(coalesce(p_color, '#64748b')));
  v_existing_id uuid;
  v_row public.inventory_conditions;
begin
  if v_name is null then
    raise exception 'El nombre de la condición es obligatorio';
  end if;

  if v_color !~ '^#[0-9a-f]{6}$' then
    v_color := '#64748b';
  end if;

  select id into v_existing_id
  from public.inventory_conditions
  where lower(trim(name)) = lower(v_name)
  limit 1;

  if v_existing_id is not null then
    update public.inventory_conditions
       set name = v_name,
           color = v_color,
           is_active = true,
           updated_at = now()
     where id = v_existing_id
     returning * into v_row;
  else
    insert into public.inventory_conditions (name, color, sort_order, is_active, created_at, updated_at)
    values (
      v_name,
      v_color,
      coalesce((select max(sort_order) + 10 from public.inventory_conditions), 100),
      true,
      now(),
      now()
    )
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

grant execute on function public.save_inventory_condition_v17(text,text) to authenticated;
grant select, insert, update on public.inventory_conditions to authenticated;

-- Wrapper legacy por si alguna pantalla vieja todavía lo invoca.
drop function if exists public.upsert_inventory_condition(text,text);
create function public.upsert_inventory_condition(
  p_name text,
  p_color text
)
returns public.inventory_conditions
language sql
security definer
set search_path = public
as $$
  select public.save_inventory_condition_v17(p_name, p_color);
$$;
grant execute on function public.upsert_inventory_condition(text,text) to authenticated;

-- =============================
-- 3) Equipos: listar y guardar desde ABM
-- =============================
drop function if exists public.admin_list_teams_full();
create function public.admin_list_teams_full()
returns table (
  id uuid,
  name text,
  project text,
  description text,
  mentor_id uuid,
  mentor_backup_id uuid,
  student_ids uuid[],
  teachers text[],
  students integer,
  courses text[],
  divisions text[]
)
language sql
security definer
set search_path = public
as $$
  select
    t.id,
    t.name,
    coalesce(t.description,'') as project,
    coalesce(t.description,'') as description,
    t.teacher_id as mentor_id,
    t.backup_teacher_id as mentor_backup_id,
    coalesce(array_agg(tm.profile_id) filter (where tm.role_in_team = 'student'), '{}'::uuid[]) as student_ids,
    coalesce(array_agg(p.full_name) filter (where tm.role_in_team = 'teacher' or tm.is_leader), '{}'::text[]) as teachers,
    count(tm.profile_id) filter (where tm.role_in_team = 'student')::integer as students,
    coalesce(array_agg(distinct c.name) filter (where c.name is not null), '{}'::text[]) as courses,
    coalesce(array_agg(distinct d.name) filter (where d.name is not null), '{}'::text[]) as divisions
  from public.teams t
  left join public.team_members tm on tm.team_id = t.id
  left join public.profiles p on p.id = tm.profile_id
  left join public.courses c on c.id = t.course_id
  left join public.divisions d on d.id = t.division_id
  group by t.id
  order by t.created_at desc;
$$;
grant execute on function public.admin_list_teams_full() to authenticated;

-- Elimina firmas problemáticas/anteriores si existieran.
drop function if exists public.admin_save_team_full(uuid,text,text,text,uuid,uuid,uuid[]);
drop function if exists public.admin_save_team_full(uuid,text,text,text,uuid,uuid,text[]);
drop function if exists public.admin_save_team_full(text,text,text,text,text,text,text[]);

create function public.admin_save_team_full(
  p_team_id uuid,
  p_name text,
  p_project text,
  p_description text,
  p_mentor_id uuid,
  p_mentor_backup_id uuid,
  p_student_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
  v_student uuid;
begin
  if nullif(trim(coalesce(p_name,'')), '') is null then
    raise exception 'El nombre del equipo es obligatorio';
  end if;

  if p_team_id is null then
    insert into public.teams (name, description, teacher_id, backup_teacher_id, status, created_at, updated_at)
    values (trim(p_name), nullif(coalesce(p_description, p_project), ''), p_mentor_id, p_mentor_backup_id, 'activo', now(), now())
    returning id into v_team_id;
  else
    update public.teams
       set name = trim(p_name),
           description = nullif(coalesce(p_description, p_project), ''),
           teacher_id = p_mentor_id,
           backup_teacher_id = p_mentor_backup_id,
           updated_at = now()
     where id = p_team_id
     returning id into v_team_id;

    if v_team_id is null then
      raise exception 'Equipo no encontrado';
    end if;
  end if;

  delete from public.team_members where team_id = v_team_id;

  if p_mentor_id is not null then
    insert into public.team_members (team_id, profile_id, is_leader, role_in_team)
    values (v_team_id, p_mentor_id, true, 'teacher')
    on conflict do nothing;
  end if;

  if p_mentor_backup_id is not null and p_mentor_backup_id is distinct from p_mentor_id then
    insert into public.team_members (team_id, profile_id, is_leader, role_in_team)
    values (v_team_id, p_mentor_backup_id, false, 'teacher')
    on conflict do nothing;
  end if;

  foreach v_student in array coalesce(p_student_ids, '{}'::uuid[]) loop
    if v_student is not null then
      insert into public.team_members (team_id, profile_id, is_leader, role_in_team)
      values (v_team_id, v_student, false, 'student')
      on conflict do nothing;
    end if;
  end loop;

  return v_team_id;
end;
$$;
grant execute on function public.admin_save_team_full(uuid,text,text,text,uuid,uuid,uuid[]) to authenticated;
grant select, insert, update, delete on public.teams, public.team_members to authenticated;

-- =============================
-- 4) RPC inventario: asegurar que no haya duplicados ambiguos
-- =============================
drop function if exists public.admin_update_inventory_asset(uuid,text,uuid,uuid,text,uuid,text,text,text,uuid,uuid,text);
drop function if exists public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text);
drop function if exists public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text,text);
drop function if exists public.admin_update_inventory_asset(uuid,text,uuid,uuid,text,uuid,text,text,text,uuid,uuid,text,text);

create function public.admin_update_inventory_asset(
  p_asset_id uuid,
  p_barcode text,
  p_brand text,
  p_category text,
  p_condition_note text,
  p_location_code text,
  p_location_detail text,
  p_name text,
  p_serial_number text,
  p_status text,
  p_supplier text,
  p_zone text,
  p_image_url text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_catalog_id uuid;
  v_category_id uuid;
  v_brand_id uuid;
  v_supplier_id uuid;
  v_location_id uuid;
  v_status_id uuid;
begin
  if p_asset_id is null then
    raise exception 'Asset requerido';
  end if;

  insert into public.inventory_categories(name)
  values (coalesce(nullif(trim(p_category),''),'General'))
  on conflict (name) do update set updated_at = now()
  returning id into v_category_id;

  if nullif(trim(coalesce(p_brand,'')), '') is not null then
    insert into public.inventory_brands(name) values (trim(p_brand))
    on conflict (name) do update set name = excluded.name
    returning id into v_brand_id;
  end if;

  if nullif(trim(coalesce(p_supplier,'')), '') is not null then
    insert into public.inventory_suppliers(name) values (trim(p_supplier))
    on conflict (name) do update set name = excluded.name
    returning id into v_supplier_id;
  end if;

  if nullif(trim(coalesce(p_location_code,'')), '') is not null then
    insert into public.inventory_locations(code, name)
    values (trim(p_location_code), trim(p_location_code))
    on conflict (code) do update set updated_at = now()
    returning id into v_location_id;
  end if;

  if nullif(trim(coalesce(p_status,'')), '') is not null then
    select id into v_status_id from public.inventory_status_catalog
    where lower(name)=lower(trim(p_status)) or lower(frontend_status)=lower(trim(p_status)) or lower(code)=lower(trim(p_status))
    limit 1;
    if v_status_id is null then
      insert into public.inventory_status_catalog(code, name, frontend_status)
      values (lower(regexp_replace(trim(p_status),'\s+','_','g')), trim(p_status), trim(p_status))
      on conflict (code) do update set name=excluded.name
      returning id into v_status_id;
    end if;
  end if;

  select catalog_item_id into v_catalog_id from public.inventory_assets where id = p_asset_id;
  if v_catalog_id is not null then
    update public.inventory_catalog_items
       set name = coalesce(nullif(trim(p_name),''), name),
           category_id = coalesce(v_category_id, category_id),
           brand_id = v_brand_id,
           supplier_id = v_supplier_id,
           image_url = coalesce(nullif(trim(coalesce(p_image_url,'')), ''), image_url),
           updated_at = now()
     where id = v_catalog_id;
  end if;

  update public.inventory_assets
     set barcode = coalesce(nullif(trim(coalesce(p_barcode,'')),''), barcode),
         serial_number = nullif(trim(coalesce(p_serial_number,'')),''),
         status_id = coalesce(v_status_id, status_id),
         condition_note = coalesce(nullif(trim(coalesce(p_condition_note,'')),''), condition_note),
         current_location_id = coalesce(v_location_id, current_location_id),
         location_detail = nullif(trim(coalesce(p_location_detail,'')),''),
         zone = nullif(trim(coalesce(p_zone,'')),''),
         image_url = coalesce(nullif(trim(coalesce(p_image_url,'')), ''), image_url),
         updated_at = now()
   where id = p_asset_id;

  if nullif(trim(coalesce(p_condition_note,'')), '') is not null then
    perform public.save_inventory_condition_v17(trim(p_condition_note), '#64748b')
    where not exists (select 1 from public.inventory_conditions where lower(trim(name)) = lower(trim(p_condition_note)));
  end if;
end;
$$;
grant execute on function public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text,text) to authenticated;

notify pgrst, 'reload schema';
