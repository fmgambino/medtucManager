-- ISM Robosoft v22 - FIX FINAL inventario/equipos/perfil
-- Ejecutar COMPLETO en Supabase SQL Editor.

create extension if not exists pgcrypto;

-- =========================
-- Limpieza de condiciones
-- =========================
-- Borra condiciones duplicadas/anteriores para que puedas cargarlas manualmente desde cero.
delete from public.inventory_conditions;

alter table public.inventory_conditions
  add column if not exists color text not null default '#64748b',
  add column if not exists sort_order integer not null default 100,
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz default now();

create unique index if not exists inventory_conditions_name_lower_uidx
on public.inventory_conditions (lower(trim(name)));

create or replace function public.list_inventory_conditions_v22()
returns table(id uuid, name text, color text, sort_order integer)
language sql security definer set search_path=public as $$
  select c.id, c.name, coalesce(c.color,'#64748b'), coalesce(c.sort_order,100)
  from public.inventory_conditions c
  where coalesce(c.is_active,true)=true
  order by coalesce(c.sort_order,100), c.name;
$$;

drop function if exists public.inventory_condition_save_v22(text,text,boolean);
create or replace function public.inventory_condition_save_v22(p_name text, p_color text default '#64748b', p_fail_on_duplicate boolean default true)
returns table(id uuid, name text, color text, sort_order integer)
language plpgsql security definer set search_path=public as $$
declare v_name text := trim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g')); v_color text := coalesce(nullif(trim(p_color),''),'#64748b'); v_id uuid;
begin
  if v_name = '' then raise exception 'Ingresá el nombre de la condición'; end if;
  if v_color !~ '^#[0-9A-Fa-f]{6}$' then v_color := '#64748b'; end if;
  select c.id into v_id from public.inventory_conditions c where lower(trim(c.name)) = lower(v_name) limit 1;
  if v_id is not null and p_fail_on_duplicate then
    update public.inventory_conditions set color=v_color, is_active=true, updated_at=now() where id=v_id;
  elsif v_id is not null then
    update public.inventory_conditions set color=v_color, is_active=true, updated_at=now() where id=v_id;
  else
    insert into public.inventory_conditions(name,color,sort_order,is_active) values(v_name,v_color,100,true) returning inventory_conditions.id into v_id;
  end if;
  return query select c.id,c.name,c.color,c.sort_order from public.inventory_conditions c where c.id=v_id;
end; $$;

-- =========================
-- Campos extra
-- =========================
alter table public.inventory_assets add column if not exists image_url text;
alter table public.inventory_catalog_items add column if not exists image_url text;
alter table public.teams add column if not exists logo_url text;
alter table public.profiles add column if not exists disable_inventory_notifications boolean not null default false;

-- Secuencia para barcodes NUMÉRICOS compatibles con pistola
create sequence if not exists public.inventory_numeric_barcode_seq start 1;
create or replace function public.next_inventory_numeric_barcode()
returns text language plpgsql security definer set search_path=public as $$
declare v text;
begin
  loop
    v := '8435439' || lpad((nextval('public.inventory_numeric_barcode_seq') % 1000000)::text, 6, '0');
    exit when not exists(select 1 from public.inventory_assets where barcode=v);
  end loop;
  return v;
end; $$;

-- Evita constraint conflictivo cuando no hay serie manual.
do $$ begin
  if exists(select 1 from pg_constraint where conname='assets_serial_or_generated') then
    alter table public.inventory_assets drop constraint assets_serial_or_generated;
  end if;
exception when others then null; end $$;

-- =========================
-- Funciones inventario
-- =========================
drop function if exists public.admin_create_inventory_asset_v22(text,text,text,text,text,text,text,text,text,text,text,text,integer,text);
drop function if exists public.admin_update_inventory_asset_v22(uuid,text,text,text,text,text,text,text,text,text,text,text,text,integer,text);

create or replace function public.ensure_catalog_bits(p_name text, p_category text, p_brand text, p_supplier text, p_tracking text, p_image text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_cat uuid; v_brand uuid; v_sup uuid; v_item uuid; v_mode text;
begin
  v_mode := case lower(coalesce(p_tracking,'')) when 'insumo' then 'consumible' when 'lote' then 'lote' else 'serializado' end;
  insert into public.inventory_categories(name) values(coalesce(nullif(trim(p_category),''),'General')) on conflict(name) do update set updated_at=now() returning id into v_cat;
  if nullif(trim(coalesce(p_brand,'')),'') is not null then insert into public.inventory_brands(name) values(trim(p_brand)) on conflict(name) do update set name=excluded.name returning id into v_brand; end if;
  if nullif(trim(coalesce(p_supplier,'')),'') is not null then insert into public.inventory_suppliers(name) values(trim(p_supplier)) on conflict(name) do update set name=excluded.name returning id into v_sup; end if;
  select id into v_item from public.inventory_catalog_items where lower(name)=lower(coalesce(nullif(trim(p_name),''),'Sin nombre')) limit 1;
  if v_item is null then
    insert into public.inventory_catalog_items(name,category_id,brand_id,supplier_id,tracking_mode,image_url)
    values(coalesce(nullif(trim(p_name),''),'Sin nombre'),v_cat,v_brand,v_sup,v_mode,p_image) returning id into v_item;
  else
    update public.inventory_catalog_items set category_id=coalesce(v_cat,category_id), brand_id=coalesce(v_brand,brand_id), supplier_id=coalesce(v_sup,supplier_id), tracking_mode=v_mode, image_url=coalesce(p_image,image_url), updated_at=now() where id=v_item;
  end if;
  return v_item;
end; $$;

create or replace function public.admin_create_inventory_asset_v22(
 p_name text, p_category text default 'General', p_asset_code text default null, p_serial_number text default null, p_barcode text default null,
 p_location_code text default 'LAB-ROB', p_condition_note text default null, p_brand text default null, p_supplier text default null,
 p_location_detail text default null, p_zone text default null, p_image_url text default null, p_quantity integer default 1, p_tracking_mode text default 'Equipo')
returns uuid language plpgsql security definer set search_path=public as $$
declare v_item uuid; v_status uuid; v_loc uuid; v_id uuid; v_code text; v_bar text; v_qty int;
begin
  v_qty := greatest(coalesce(p_quantity,1),0);
  v_item := public.ensure_catalog_bits(p_name,p_category,p_brand,p_supplier,p_tracking_mode,p_image_url);
  insert into public.inventory_status_catalog(code,name,frontend_status,is_available) values('available','Disponible','Disponible',true) on conflict(code) do update set name=excluded.name returning id into v_status;
  insert into public.inventory_locations(code,name) values(coalesce(nullif(p_location_code,''),'LAB-ROB'), case coalesce(nullif(p_location_code,''),'LAB-ROB') when 'LAB-ROB' then 'Laboratorio de Robótica' when 'DEP-01' then 'Depósito' else coalesce(nullif(p_location_code,''),'Laboratorio de Robótica') end) on conflict(code) do update set updated_at=now() returning id into v_loc;
  v_code := coalesce(nullif(trim(p_asset_code),''), 'ACT-' || lpad(nextval('public.inventory_numeric_barcode_seq')::text, 6, '0'));
  v_bar := regexp_replace(coalesce(nullif(trim(p_barcode),''), public.next_inventory_numeric_barcode()), '[^0-9]', '', 'g');
  if v_bar='' then v_bar := public.next_inventory_numeric_barcode(); end if;
  insert into public.inventory_assets(catalog_item_id,asset_code,barcode,serial_number,generated_barcode,status_id,condition_note,current_location_id,location_detail,zone,quantity,quantity_available,image_url,is_active)
  values(v_item,v_code,v_bar,nullif(trim(coalesce(p_serial_number,'')),''),true,v_status,nullif(trim(coalesce(p_condition_note,'')),''),v_loc,p_location_detail,p_zone,v_qty,v_qty,p_image_url,true)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public.admin_update_inventory_asset_v22(
 p_asset_id uuid, p_name text, p_category text default 'General', p_serial_number text default null, p_barcode text default null, p_status text default 'Disponible',
 p_condition_note text default null, p_location_code text default null, p_brand text default null, p_supplier text default null, p_location_detail text default null,
 p_zone text default null, p_image_url text default null, p_quantity integer default null, p_tracking_mode text default null, p_asset_code text default null)
returns void language plpgsql security definer set search_path=public as $$
declare v_asset public.inventory_assets%rowtype; v_item uuid; v_status uuid; v_loc uuid; v_bar text;
begin
  select * into v_asset from public.inventory_assets where id=p_asset_id;
  if not found then raise exception 'No existe el activo %', p_asset_id; end if;
  v_item := public.ensure_catalog_bits(p_name,p_category,p_brand,p_supplier,p_tracking_mode,p_image_url);
  insert into public.inventory_status_catalog(code,name,frontend_status,is_available) values(lower(coalesce(p_status,'Disponible')),coalesce(p_status,'Disponible'),coalesce(p_status,'Disponible'),true) on conflict(code) do update set name=excluded.name returning id into v_status;
  if nullif(p_location_code,'') is not null then insert into public.inventory_locations(code,name) values(p_location_code,p_location_code) on conflict(code) do update set updated_at=now() returning id into v_loc; else v_loc := v_asset.current_location_id; end if;
  v_bar := coalesce(nullif(regexp_replace(coalesce(p_barcode,''),'[^0-9]','','g'),''), v_asset.barcode, public.next_inventory_numeric_barcode());
  update public.inventory_assets set catalog_item_id=v_item, asset_code=coalesce(nullif(p_asset_code,''),asset_code), barcode=v_bar, serial_number=nullif(trim(coalesce(p_serial_number,'')),''), generated_barcode=true, status_id=v_status, condition_note=nullif(trim(coalesce(p_condition_note,'')),''), current_location_id=v_loc, location_detail=p_location_detail, zone=p_zone, image_url=coalesce(p_image_url,image_url), quantity=coalesce(p_quantity,quantity), quantity_available=least(coalesce(p_quantity,quantity_available), coalesce(p_quantity,quantity)), updated_at=now() where id=p_asset_id;
end; $$;

create or replace function public.bulk_update_inventory_assets_v22(p_asset_ids uuid[], p_status text default null, p_condition_note text default null, p_brand text default null, p_type text default null, p_supplier text default null, p_serial_number text default null, p_location_code text default null, p_location_detail text default null, p_zone text default null, p_quantity integer default null)
returns void language plpgsql security definer set search_path=public as $$
declare v_id uuid;
begin
  foreach v_id in array coalesce(p_asset_ids, array[]::uuid[]) loop
    perform public.admin_update_inventory_asset_v22(v_id,null,'General',p_serial_number,null,coalesce(p_status,'Disponible'),p_condition_note,p_location_code,p_brand,p_supplier,p_location_detail,p_zone,null,p_quantity,p_type,null);
  end loop;
end; $$;

-- aliases por compatibilidad
create or replace function public.admin_create_inventory_asset(p_name text, p_category text default 'General', p_asset_code text default null, p_serial_number text default null, p_barcode text default null, p_location_code text default 'LAB-ROB', p_condition_note text default null, p_brand text default null, p_supplier text default null, p_location_detail text default null, p_zone text default null, p_image_url text default null, p_quantity integer default 1, p_tracking_mode text default 'Equipo')
returns uuid language sql security definer as $$ select public.admin_create_inventory_asset_v22($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14); $$;

-- =========================
-- Vista inventario
-- =========================
drop view if exists public.inventory_frontend_view cascade;
create or replace view public.inventory_frontend_view as
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

-- =========================
-- Equipos
-- =========================
drop function if exists public.admin_list_teams_full_v22();
create or replace function public.admin_list_teams_full_v22()
returns table(id uuid,name text,project text,description text,logo_url text,mentor_id uuid,mentor_backup_id uuid,student_ids uuid[],teachers text[],courses text[],divisions text[],members jsonb)
language sql security definer set search_path=public as $$
select t.id,t.name,t.description as project,t.description,t.logo_url,t.teacher_id,t.backup_teacher_id,
  coalesce(array_agg(tm.profile_id) filter(where tm.role_in_team='student'),array[]::uuid[]) as student_ids,
  array_remove(array[p1.full_name,p2.full_name],null) as teachers,
  coalesce(array_agg(distinct c.name) filter(where c.name is not null),array[]::text[]) as courses,
  coalesce(array_agg(distinct d.name) filter(where d.name is not null),array[]::text[]) as divisions,
  coalesce(jsonb_agg(distinct jsonb_build_object('id',p.id,'full_name',p.full_name,'avatar_url',p.avatar_url,'role_in_team',coalesce(tm.role_in_team,case when p.id=t.teacher_id then 'mentor' when p.id=t.backup_teacher_id then 'mentor_backup' else 'student' end),'course',c.name,'division',d.name)) filter(where p.id is not null),'[]'::jsonb) as members
from public.teams t
left join public.profiles p1 on p1.id=t.teacher_id
left join public.profiles p2 on p2.id=t.backup_teacher_id
left join public.team_members tm on tm.team_id=t.id
left join public.profiles p on p.id=tm.profile_id or p.id=t.teacher_id or p.id=t.backup_teacher_id
left join public.courses c on c.id=p.student_course_id or c.id=t.course_id
left join public.divisions d on d.id=p.student_division_id or d.id=t.division_id
group by t.id,p1.full_name,p2.full_name;
$$;

drop function if exists public.admin_save_team_full_v22(uuid,text,text,text,uuid,uuid,uuid[],text);
create or replace function public.admin_save_team_full_v22(p_team_id uuid default null,p_name text default null,p_project text default null,p_description text default null,p_mentor_id uuid default null,p_mentor_backup_id uuid default null,p_student_ids uuid[] default array[]::uuid[],p_logo_url text default null)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid; sid uuid;
begin
  if nullif(trim(coalesce(p_name,'')),'') is null then raise exception 'Ingresá el nombre del equipo'; end if;
  if p_team_id is null then
    insert into public.teams(name,description,teacher_id,backup_teacher_id,logo_url,status) values(trim(p_name),coalesce(p_project,p_description),p_mentor_id,p_mentor_backup_id,p_logo_url,'activo') returning id into v_id;
  else
    update public.teams set name=trim(p_name), description=coalesce(p_project,p_description), teacher_id=p_mentor_id, backup_teacher_id=p_mentor_backup_id, logo_url=coalesce(p_logo_url,logo_url), updated_at=now() where id=p_team_id returning id into v_id;
  end if;
  delete from public.team_members where team_id=v_id;
  if p_mentor_id is not null then insert into public.team_members(team_id,profile_id,is_leader,role_in_team) values(v_id,p_mentor_id,true,'mentor') on conflict do nothing; end if;
  if p_mentor_backup_id is not null then insert into public.team_members(team_id,profile_id,is_leader,role_in_team) values(v_id,p_mentor_backup_id,false,'mentor_backup') on conflict do nothing; end if;
  foreach sid in array coalesce(p_student_ids,array[]::uuid[]) loop insert into public.team_members(team_id,profile_id,is_leader,role_in_team) values(v_id,sid,false,'student') on conflict do nothing; end loop;
  return v_id;
end; $$;

drop function if exists public.admin_delete_team_v22(uuid);
create or replace function public.admin_delete_team_v22(p_team_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  delete from public.team_members where team_id=p_team_id;
  delete from public.teams where id=p_team_id;
end; $$;

-- Cursos/divisiones base para perfil alumno
insert into public.courses(name,level) values ('1°','Primario'),('2°','Primario'),('3°','Primario'),('4°','Primario'),('5°','Primario'),('6°','Primario'),('7°','Primario') on conflict do nothing;
insert into public.divisions(course_id,name) select c.id, v.name from public.courses c cross join (values('A'),('B'),('C')) v(name) on conflict do nothing;

-- Permisos
insert into public.permissions(code,name,module) values
('notifications.inventory.read','Leer notificaciones de inventario','notifications'),
('notifications.inventory.mute','Desactivar notificaciones de inventario','notifications'),
('teams.manage','Gestionar equipos','teams'),('inventory.create','Crear inventario','inventory'),('inventory.update','Editar inventario','inventory'),('inventory.delete','Eliminar inventario','inventory')
on conflict(code) do update set name=excluded.name,module=excluded.module;

grant select,insert,update,delete on public.inventory_conditions, public.inventory_assets, public.inventory_catalog_items, public.inventory_categories, public.inventory_brands, public.inventory_suppliers, public.inventory_locations, public.teams, public.team_members, public.profiles to authenticated;
grant execute on all functions in schema public to authenticated;
notify pgrst, 'reload schema';
