-- ISM Robosoft v23 - Backend fix final
-- Ejecutar COMPLETO en Supabase SQL Editor antes de reemplazar la webapp.
-- Basado en el esquema actual: inventory_assets usa UUID como PK y tiene asset_code/barcode únicos.

create extension if not exists pgcrypto;

-- =====================================================
-- 0) LIMPIEZA / RESET DE INVENTARIO
-- =====================================================
-- IMPORTANTE: La columna id de inventory_assets es UUID y NO puede empezar en 1.
-- Lo que sí se reinicia a 1 es la secuencia usada para asset_code ACT-000001 y barcode numérico.
create sequence if not exists public.inventory_asset_seq start 1;
create sequence if not exists public.inventory_numeric_barcode_seq start 1;
alter sequence public.inventory_asset_seq restart with 1;
alter sequence public.inventory_numeric_barcode_seq restart with 1;

-- Limpia condiciones para cargarlas manualmente desde la app.
-- Mantiene los activos: solo borra el catálogo de condiciones.
delete from public.inventory_conditions;

alter table public.inventory_conditions
  add column if not exists color text not null default '#64748b',
  add column if not exists sort_order integer not null default 100,
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz default now();

-- Evita duplicados por mayúsculas/minúsculas/espacios.
drop index if exists public.inventory_conditions_name_lower_uidx;
create unique index inventory_conditions_name_lower_uidx
on public.inventory_conditions (lower(trim(name)));

-- Quita constraint que exigía serie cuando el barcode es autogenerado.
do $$ begin
  if exists(select 1 from pg_constraint where conname='assets_serial_or_generated') then
    alter table public.inventory_assets drop constraint assets_serial_or_generated;
  end if;
exception when others then null; end $$;

alter table public.inventory_assets add column if not exists image_url text;
alter table public.inventory_catalog_items add column if not exists image_url text;
alter table public.teams add column if not exists logo_url text;
alter table public.profiles add column if not exists disable_inventory_notifications boolean not null default false;

-- =====================================================
-- 1) CONDICIONES persistentes
-- =====================================================
drop function if exists public.inventory_condition_save_v23(text,text,boolean);
drop function if exists public.inventory_condition_save_v22(text,text,boolean);

create or replace function public.inventory_condition_save_v23(
  p_name text,
  p_color text default '#64748b',
  p_fail_on_duplicate boolean default false
)
returns table(id uuid, name text, color text, sort_order integer)
language plpgsql
security definer
set search_path=public
as $$
declare
  v_name text := trim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g'));
  v_color text := coalesce(nullif(trim(p_color),''),'#64748b');
  v_id uuid;
begin
  if v_name = '' then
    raise exception 'Ingresá el nombre de la condición';
  end if;
  if v_color !~ '^#[0-9A-Fa-f]{6}$' then
    v_color := '#64748b';
  end if;

  select c.id into v_id
  from public.inventory_conditions c
  where lower(trim(c.name)) = lower(v_name)
  limit 1;

  if v_id is not null then
    if p_fail_on_duplicate then
      raise exception 'Ya existe una condición con ese nombre';
    end if;
    update public.inventory_conditions
       set color=v_color, is_active=true, updated_at=now()
     where inventory_conditions.id=v_id;
  else
    insert into public.inventory_conditions(name,color,sort_order,is_active)
    values(v_name,v_color,100,true)
    returning inventory_conditions.id into v_id;
  end if;

  return query select c.id,c.name,c.color,c.sort_order
  from public.inventory_conditions c where c.id=v_id;
end $$;

create or replace function public.inventory_condition_save_v22(p_name text,p_color text default '#64748b',p_fail_on_duplicate boolean default false)
returns table(id uuid, name text, color text, sort_order integer)
language sql security definer set search_path=public as $$
  select * from public.inventory_condition_save_v23($1,$2,$3);
$$;

create or replace function public.list_inventory_conditions_v23()
returns table(id uuid, name text, color text, sort_order integer)
language sql security definer set search_path=public as $$
  select c.id,c.name,coalesce(c.color,'#64748b'),coalesce(c.sort_order,100)
  from public.inventory_conditions c
  where coalesce(c.is_active,true)=true
  order by coalesce(c.sort_order,100), lower(c.name);
$$;

-- =====================================================
-- 2) Barcode numérico compatible con pistola
-- =====================================================
create or replace function public.next_inventory_numeric_barcode()
returns text language plpgsql security definer set search_path=public as $$
declare v text;
begin
  loop
    -- 13 dígitos: 8435439 + 6 correlativos. No contiene letras ni guiones.
    v := '8435439' || lpad(nextval('public.inventory_numeric_barcode_seq')::text, 6, '0');
    exit when not exists(select 1 from public.inventory_assets where barcode = v);
  end loop;
  return v;
end $$;

create or replace function public.clean_numeric_barcode(p_barcode text)
returns text language sql immutable as $$
  select nullif(regexp_replace(coalesce($1,''),'[^0-9]','','g'),'')
$$;

-- =====================================================
-- 3) Funciones inventario create/update compatibles con payload actual
-- =====================================================
drop function if exists public.admin_create_inventory_asset_v23(text,text,text,text,text,text,text,text,text,text,text,text,integer,text);
drop function if exists public.admin_update_inventory_asset_v23(uuid,text,text,text,text,text,text,text,text,text,text,text,text,integer,text,text);
drop function if exists public.admin_create_inventory_asset_v22(text,text,text,text,text,text,text,text,text,text,text,text,integer,text);
drop function if exists public.admin_update_inventory_asset_v22(uuid,text,text,text,text,text,text,text,text,text,text,text,text,integer,text,text);

create or replace function public.ensure_catalog_bits_v23(
  p_name text, p_category text, p_brand text, p_supplier text, p_tracking text, p_image text
)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_cat uuid; v_brand uuid; v_sup uuid; v_item uuid; v_mode text; v_name text;
begin
  v_name := coalesce(nullif(trim(p_name),''),'Sin nombre');
  v_mode := case lower(coalesce(p_tracking,'')) when 'insumo' then 'consumible' when 'lote' then 'lote' else 'serializado' end;

  insert into public.inventory_categories(name) values(coalesce(nullif(trim(p_category),''),'General'))
  on conflict(name) do update set updated_at=now() returning id into v_cat;

  if nullif(trim(coalesce(p_brand,'')),'') is not null then
    insert into public.inventory_brands(name) values(trim(p_brand))
    on conflict(name) do update set name=excluded.name returning id into v_brand;
  end if;

  if nullif(trim(coalesce(p_supplier,'')),'') is not null then
    insert into public.inventory_suppliers(name) values(trim(p_supplier))
    on conflict(name) do update set name=excluded.name returning id into v_sup;
  end if;

  select id into v_item from public.inventory_catalog_items where lower(name)=lower(v_name) limit 1;
  if v_item is null then
    insert into public.inventory_catalog_items(name,category_id,brand_id,supplier_id,tracking_mode,image_url)
    values(v_name,v_cat,v_brand,v_sup,v_mode,p_image) returning id into v_item;
  else
    update public.inventory_catalog_items
       set category_id=coalesce(v_cat,category_id), brand_id=coalesce(v_brand,brand_id), supplier_id=coalesce(v_sup,supplier_id),
           tracking_mode=v_mode, image_url=coalesce(nullif(p_image,''),image_url), updated_at=now()
     where id=v_item;
  end if;
  return v_item;
end $$;

create or replace function public.admin_create_inventory_asset_v23(
  p_name text,
  p_category text default 'General',
  p_asset_code text default null,
  p_serial_number text default null,
  p_barcode text default null,
  p_location_code text default 'LAB-ROB',
  p_condition_note text default null,
  p_brand text default null,
  p_supplier text default null,
  p_location_detail text default null,
  p_zone text default null,
  p_image_url text default null,
  p_quantity integer default 1,
  p_tracking_mode text default 'Equipo'
)
returns uuid language plpgsql security definer set search_path=public as $$
declare
  v_item uuid; v_status uuid; v_loc uuid; v_id uuid; v_code text; v_bar text; v_qty int;
begin
  v_qty := greatest(coalesce(p_quantity,1),0);
  v_item := public.ensure_catalog_bits_v23(p_name,p_category,p_brand,p_supplier,p_tracking_mode,p_image_url);

  insert into public.inventory_status_catalog(code,name,frontend_status,is_available)
  values('available','Disponible','Disponible',true)
  on conflict(code) do update set name=excluded.name, frontend_status=excluded.frontend_status
  returning id into v_status;

  insert into public.inventory_locations(code,name)
  values(coalesce(nullif(p_location_code,''),'LAB-ROB'), case coalesce(nullif(p_location_code,''),'LAB-ROB') when 'LAB-ROB' then 'Laboratorio de Robótica' when 'DEP-01' then 'Depósito' else coalesce(nullif(p_location_code,''),'Laboratorio de Robótica') end)
  on conflict(code) do update set updated_at=now() returning id into v_loc;

  v_code := coalesce(nullif(trim(p_asset_code),''), 'ACT-' || lpad(nextval('public.inventory_asset_seq')::text, 6, '0'));
  v_bar := public.clean_numeric_barcode(p_barcode);
  if v_bar is null then
    v_bar := public.next_inventory_numeric_barcode();
  elsif exists(select 1 from public.inventory_assets where barcode=v_bar) then
    raise exception 'Ya existe un insumo/equipo con ese barcode: %', v_bar;
  end if;

  insert into public.inventory_assets(catalog_item_id,asset_code,barcode,serial_number,generated_barcode,status_id,condition_note,current_location_id,location_detail,zone,quantity,quantity_available,image_url,is_active)
  values(v_item,v_code,v_bar,nullif(trim(coalesce(p_serial_number,'')),''), true, v_status, nullif(trim(coalesce(p_condition_note,'')),''), v_loc, p_location_detail, p_zone, v_qty, v_qty, nullif(p_image_url,''), true)
  returning id into v_id;
  return v_id;
exception when unique_violation then
  raise exception 'Código interno o barcode duplicado. Cambialo o dejá el barcode vacío para generarlo automáticamente.';
end $$;

create or replace function public.admin_update_inventory_asset_v23(
  p_asset_id uuid,
  p_name text,
  p_category text default 'General',
  p_serial_number text default null,
  p_barcode text default null,
  p_status text default 'Disponible',
  p_condition_note text default null,
  p_location_code text default null,
  p_brand text default null,
  p_supplier text default null,
  p_location_detail text default null,
  p_zone text default null,
  p_image_url text default null,
  p_quantity integer default null,
  p_tracking_mode text default null,
  p_asset_code text default null
)
returns void language plpgsql security definer set search_path=public as $$
declare v_asset public.inventory_assets%rowtype; v_item uuid; v_status uuid; v_loc uuid; v_bar text; v_qty int;
begin
  select * into v_asset from public.inventory_assets where id=p_asset_id;
  if not found then raise exception 'No existe el activo %', p_asset_id; end if;

  v_item := public.ensure_catalog_bits_v23(coalesce(p_name,(select name from inventory_catalog_items where id=v_asset.catalog_item_id)),p_category,p_brand,p_supplier,p_tracking_mode,p_image_url);
  insert into public.inventory_status_catalog(code,name,frontend_status,is_available)
  values(lower(replace(coalesce(p_status,'Disponible'),' ','_')),coalesce(p_status,'Disponible'),coalesce(p_status,'Disponible'),true)
  on conflict(code) do update set name=excluded.name, frontend_status=excluded.frontend_status
  returning id into v_status;

  if nullif(p_location_code,'') is not null then
    insert into public.inventory_locations(code,name) values(p_location_code,p_location_code)
    on conflict(code) do update set updated_at=now() returning id into v_loc;
  else
    v_loc := v_asset.current_location_id;
  end if;

  v_bar := public.clean_numeric_barcode(p_barcode);
  if v_bar is null then v_bar := v_asset.barcode; end if;
  if exists(select 1 from public.inventory_assets where barcode=v_bar and id<>p_asset_id) then
    raise exception 'Ya existe otro activo con ese barcode: %', v_bar;
  end if;
  v_qty := greatest(coalesce(p_quantity,v_asset.quantity),0);

  update public.inventory_assets
     set catalog_item_id=v_item,
         asset_code=coalesce(nullif(trim(coalesce(p_asset_code,'')),''), asset_code),
         barcode=v_bar,
         serial_number=nullif(trim(coalesce(p_serial_number,'')),''),
         generated_barcode=true,
         status_id=v_status,
         condition_note=nullif(trim(coalesce(p_condition_note,'')),''),
         current_location_id=v_loc,
         location_detail=p_location_detail,
         zone=p_zone,
         image_url=coalesce(nullif(p_image_url,''), image_url),
         quantity=v_qty,
         quantity_available=least(quantity_available, v_qty),
         updated_at=now()
   where id=p_asset_id;
end $$;

-- aliases v22 para la webapp si todavía llama a v22
create or replace function public.admin_create_inventory_asset_v22(p_name text,p_category text default 'General',p_asset_code text default null,p_serial_number text default null,p_barcode text default null,p_location_code text default 'LAB-ROB',p_condition_note text default null,p_brand text default null,p_supplier text default null,p_location_detail text default null,p_zone text default null,p_image_url text default null,p_quantity integer default 1,p_tracking_mode text default 'Equipo')
returns uuid language sql security definer set search_path=public as $$ select public.admin_create_inventory_asset_v23($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14); $$;

create or replace function public.admin_update_inventory_asset_v22(p_asset_id uuid,p_name text,p_category text default 'General',p_serial_number text default null,p_barcode text default null,p_status text default 'Disponible',p_condition_note text default null,p_location_code text default null,p_brand text default null,p_supplier text default null,p_location_detail text default null,p_zone text default null,p_image_url text default null,p_quantity integer default null,p_tracking_mode text default null,p_asset_code text default null)
returns void language sql security definer set search_path=public as $$ select public.admin_update_inventory_asset_v23($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16); $$;

-- =====================================================
-- 4) Vistas / listado inventario
-- =====================================================
drop view if exists public.inventory_frontend_view cascade;
create view public.inventory_frontend_view as
select ia.id, ia.asset_code as code, ia.asset_code, ia.barcode, ia.serial_number as serial, ia.serial_number,
coalesce(ici.name,'Sin nombre') as item, coalesce(ici.tracking_mode,'serializado') as tracking_mode,
case coalesce(ici.tracking_mode,'serializado') when 'consumible' then 'Insumo' when 'lote' then 'Lote' else 'Equipo' end as type,
coalesce(isc.frontend_status,isc.name,'Disponible') as status, ia.condition_note as condition, ia.condition_note,
il.name as location, il.code as location_code, ia.location_detail, ia.zone, ib.name as brand, isp.name as supplier, ic.name as category,
ia.quantity, ia.quantity_available, coalesce(ia.image_url,ici.image_url) as image_url, ia.is_active, ia.created_at, ia.updated_at
from public.inventory_assets ia
join public.inventory_catalog_items ici on ici.id=ia.catalog_item_id
left join public.inventory_categories ic on ic.id=ici.category_id
left join public.inventory_brands ib on ib.id=ici.brand_id
left join public.inventory_suppliers isp on isp.id=ici.supplier_id
left join public.inventory_status_catalog isc on isc.id=ia.status_id
left join public.inventory_locations il on il.id=ia.current_location_id;

grant select on public.inventory_frontend_view to authenticated, anon;

-- =====================================================
-- 5) Equipos create/edit/delete + organigrama
-- =====================================================
drop function if exists public.admin_list_teams_full_v23();
drop function if exists public.admin_save_team_full_v23(uuid,text,text,text,uuid,uuid,uuid[],text);
drop function if exists public.admin_delete_team_v23(uuid);
drop function if exists public.admin_list_teams_full_v22();
drop function if exists public.admin_save_team_full_v22(uuid,text,text,text,uuid,uuid,uuid[],text);
drop function if exists public.admin_delete_team_v22(uuid);

create or replace function public.admin_list_teams_full_v23()
returns table(id uuid,name text,project text,description text,logo_url text,mentor_id uuid,mentor_backup_id uuid,student_ids uuid[],teachers text[],courses text[],divisions text[],members jsonb)
language sql security definer set search_path=public as $$
with members as (
  select t.id team_id, p.id, p.full_name, p.avatar_url, tm.role_in_team, c.name course, d.name division
  from public.teams t
  left join public.team_members tm on tm.team_id=t.id
  left join public.profiles p on p.id=tm.profile_id
  left join public.courses c on c.id=p.student_course_id
  left join public.divisions d on d.id=p.student_division_id
), team_courses as (
  select team_id,
         array_remove(array_agg(distinct course order by course), null) courses,
         array_remove(array_agg(distinct division order by division), null) divisions
  from members where role_in_team='student' group by team_id
)
select t.id,t.name,t.description as project,t.description,t.logo_url,t.teacher_id,t.backup_teacher_id,
  coalesce(array_agg(m.id order by m.full_name) filter(where m.role_in_team='student'),array[]::uuid[]) as student_ids,
  array_remove(array[p1.full_name,p2.full_name],null) as teachers,
  coalesce(tc.courses,array[]::text[]) as courses,
  coalesce(tc.divisions,array[]::text[]) as divisions,
  coalesce(jsonb_agg(jsonb_build_object('id',m.id,'full_name',m.full_name,'avatar_url',m.avatar_url,'role_in_team',m.role_in_team,'course',m.course,'division',m.division) order by case m.role_in_team when 'mentor' then 1 when 'mentor_backup' then 2 else 3 end, m.full_name) filter(where m.id is not null),'[]'::jsonb) as members
from public.teams t
left join public.profiles p1 on p1.id=t.teacher_id
left join public.profiles p2 on p2.id=t.backup_teacher_id
left join members m on m.team_id=t.id
left join team_courses tc on tc.team_id=t.id
where coalesce(t.status,'activo') <> 'archivado'
group by t.id,p1.full_name,p2.full_name,tc.courses,tc.divisions;
$$;

create or replace function public.admin_save_team_full_v23(p_team_id uuid default null,p_name text default null,p_project text default null,p_description text default null,p_mentor_id uuid default null,p_mentor_backup_id uuid default null,p_student_ids uuid[] default array[]::uuid[],p_logo_url text default null)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid; sid uuid;
begin
  if nullif(trim(coalesce(p_name,'')),'') is null then raise exception 'Ingresá el nombre del equipo'; end if;
  if p_team_id is null then
    insert into public.teams(name,description,teacher_id,backup_teacher_id,logo_url,status)
    values(trim(p_name),coalesce(nullif(p_project,''),p_description),p_mentor_id,p_mentor_backup_id,p_logo_url,'activo') returning id into v_id;
  else
    update public.teams set name=trim(p_name), description=coalesce(nullif(p_project,''),p_description), teacher_id=p_mentor_id, backup_teacher_id=p_mentor_backup_id, logo_url=coalesce(nullif(p_logo_url,''),logo_url), updated_at=now() where id=p_team_id returning id into v_id;
  end if;
  delete from public.team_members where team_id=v_id;
  if p_mentor_id is not null then insert into public.team_members(team_id,profile_id,is_leader,role_in_team) values(v_id,p_mentor_id,true,'mentor'); end if;
  if p_mentor_backup_id is not null then insert into public.team_members(team_id,profile_id,is_leader,role_in_team) values(v_id,p_mentor_backup_id,false,'mentor_backup'); end if;
  foreach sid in array coalesce(p_student_ids,array[]::uuid[]) loop
    insert into public.team_members(team_id,profile_id,is_leader,role_in_team) values(v_id,sid,false,'student');
  end loop;
  return v_id;
end $$;

create or replace function public.admin_delete_team_v23(p_team_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  delete from public.team_members where team_id=p_team_id;
  update public.teams set status='archivado', updated_at=now() where id=p_team_id;
end $$;

create or replace function public.admin_list_teams_full_v22() returns table(id uuid,name text,project text,description text,logo_url text,mentor_id uuid,mentor_backup_id uuid,student_ids uuid[],teachers text[],courses text[],divisions text[],members jsonb)
language sql security definer set search_path=public as $$ select * from public.admin_list_teams_full_v23(); $$;
create or replace function public.admin_save_team_full_v22(p_team_id uuid default null,p_name text default null,p_project text default null,p_description text default null,p_mentor_id uuid default null,p_mentor_backup_id uuid default null,p_student_ids uuid[] default array[]::uuid[],p_logo_url text default null)
returns uuid language sql security definer set search_path=public as $$ select public.admin_save_team_full_v23($1,$2,$3,$4,$5,$6,$7,$8); $$;
create or replace function public.admin_delete_team_v22(p_team_id uuid) returns void language sql security definer set search_path=public as $$ select public.admin_delete_team_v23($1); $$;

-- =====================================================
-- 6) Perfil alumno cursos/divisiones + notificaciones con remitente
-- =====================================================
insert into public.courses(name,level) values ('1°','Primario'),('2°','Primario'),('3°','Primario'),('4°','Primario'),('5°','Primario'),('6°','Primario'),('7°','Primario') on conflict do nothing;
insert into public.divisions(course_id,name)
select c.id, v.name from public.courses c cross join (values('A'),('B'),('C')) v(name)
on conflict do nothing;

drop view if exists public.notifications_frontend_view cascade;
create view public.notifications_frontend_view as
select n.*, p.full_name as sender, p.full_name as sender_name
from public.notifications n
left join public.profiles p on p.id=n.created_by
where n.recipient_profile_id = auth.uid() or n.recipient_profile_id is null;
grant select,update on public.notifications_frontend_view to authenticated;

-- =====================================================
-- Permisos y grants
-- =====================================================
grant select,insert,update,delete on public.inventory_conditions, public.inventory_assets, public.inventory_catalog_items, public.inventory_categories, public.inventory_brands, public.inventory_suppliers, public.inventory_locations, public.teams, public.team_members, public.profiles to authenticated;
grant usage, select, update on sequence public.inventory_asset_seq to authenticated;
grant usage, select, update on sequence public.inventory_numeric_barcode_seq to authenticated;
grant execute on all functions in schema public to authenticated, anon;
notify pgrst, 'reload schema';

-- Bulk update v23/v22
create or replace function public.bulk_update_inventory_assets_v23(p_asset_ids uuid[], p_status text default null, p_condition_note text default null, p_brand text default null, p_type text default null, p_supplier text default null, p_serial_number text default null, p_location_code text default null, p_location_detail text default null, p_zone text default null, p_quantity integer default null)
returns void language plpgsql security definer set search_path=public as $$
declare v_id uuid;
begin
  foreach v_id in array coalesce(p_asset_ids, array[]::uuid[]) loop
    perform public.admin_update_inventory_asset_v23(v_id,null,'General',p_serial_number,null,coalesce(p_status,'Disponible'),p_condition_note,p_location_code,p_brand,p_supplier,p_location_detail,p_zone,null,p_quantity,p_type,null);
  end loop;
end $$;
create or replace function public.bulk_update_inventory_assets_v22(p_asset_ids uuid[], p_status text default null, p_condition_note text default null, p_brand text default null, p_type text default null, p_supplier text default null, p_serial_number text default null, p_location_code text default null, p_location_detail text default null, p_zone text default null, p_quantity integer default null)
returns void language sql security definer set search_path=public as $$
  select public.bulk_update_inventory_assets_v23($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);
$$;
grant execute on all functions in schema public to authenticated, anon;
notify pgrst, 'reload schema';
