-- ISM Robosoft v15 - Inventario: condiciones persistentes, colores editables, imagen de insumo y vistas/RPC limpias.
-- Ejecutar completo en Supabase SQL Editor antes de publicar la webapp.

begin;

-- 1) Columnas necesarias para imagen del insumo/equipo.
alter table public.inventory_catalog_items add column if not exists image_url text;
alter table public.inventory_assets add column if not exists image_url text;

-- 2) Condiciones persistentes y colores editables.
create table if not exists public.inventory_conditions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#64748b',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

grant select, insert, update on public.inventory_conditions to authenticated;

-- RPC segura para crear/actualizar condición, evita problemas de RLS y persiste color.
create or replace function public.upsert_inventory_condition(
  p_name text,
  p_color text default '#64748b'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text := nullif(trim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g')), '');
  v_color text := case when coalesce(p_color,'') ~* '^#[0-9a-f]{6}$' then p_color else '#64748b' end;
begin
  if v_name is null then
    raise exception 'Ingresá el nombre de la condición';
  end if;

  select id into v_id
  from public.inventory_conditions
  where lower(name) = lower(v_name)
  limit 1;

  if v_id is null then
    insert into public.inventory_conditions(name, color, is_active, updated_at)
    values (v_name, v_color, true, now())
    returning id into v_id;
  else
    update public.inventory_conditions
    set name = v_name, color = v_color, is_active = true, updated_at = now()
    where id = v_id;
  end if;

  return v_id;
end;
$$;

grant execute on function public.upsert_inventory_condition(text,text) to authenticated;

-- 3) Elimina RPC conflictivas y recrea firma única con imagen.
drop function if exists public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text);
drop function if exists public.admin_update_inventory_asset(uuid,text,uuid,uuid,text,uuid,text,text,text,uuid,uuid,text);
drop function if exists public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text,text);

create or replace function public.admin_update_inventory_asset(
  p_asset_id uuid,
  p_barcode text default null,
  p_brand text default null,
  p_category text default null,
  p_condition_note text default null,
  p_location_code text default null,
  p_location_detail text default null,
  p_name text default null,
  p_serial_number text default null,
  p_status text default null,
  p_supplier text default null,
  p_zone text default null,
  p_image_url text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category_id uuid;
  v_brand_id uuid;
  v_supplier_id uuid;
  v_location_id uuid;
  v_status_id uuid;
  v_old_condition text;
  v_old_status uuid;
begin
  if p_asset_id is null then raise exception 'Falta p_asset_id'; end if;

  select condition_note, status_id into v_old_condition, v_old_status from public.inventory_assets where id = p_asset_id;

  if nullif(trim(coalesce(p_category,'')),'') is not null then
    insert into public.inventory_categories(name)
    values (trim(p_category))
    on conflict (name) do update set updated_at = now()
    returning id into v_category_id;
  end if;

  if nullif(trim(coalesce(p_brand,'')),'') is not null then
    insert into public.inventory_brands(name)
    values (trim(p_brand))
    on conflict (name) do update set name = excluded.name
    returning id into v_brand_id;
  end if;

  if nullif(trim(coalesce(p_supplier,'')),'') is not null then
    insert into public.inventory_suppliers(name)
    values (trim(p_supplier))
    on conflict (name) do update set name = excluded.name
    returning id into v_supplier_id;
  end if;

  if nullif(trim(coalesce(p_location_code,'')),'') is not null then
    select id into v_location_id from public.inventory_locations where code = trim(p_location_code) or name = trim(p_location_code) limit 1;
  end if;

  if nullif(trim(coalesce(p_status,'')),'') is not null then
    select id into v_status_id from public.inventory_status_catalog
    where lower(name) = lower(trim(p_status)) or lower(frontend_status) = lower(trim(p_status)) or lower(code) = lower(trim(p_status))
    limit 1;
    if v_status_id is null then
      insert into public.inventory_status_catalog(code, name, frontend_status)
      values (lower(regexp_replace(trim(p_status),'\s+','_','g')), trim(p_status), trim(p_status))
      on conflict (code) do update set name = excluded.name, frontend_status = excluded.frontend_status
      returning id into v_status_id;
    end if;
  end if;

  update public.inventory_catalog_items ci
  set name = coalesce(nullif(trim(p_name),''), ci.name),
      category_id = coalesce(v_category_id, ci.category_id),
      brand_id = coalesce(v_brand_id, ci.brand_id),
      supplier_id = coalesce(v_supplier_id, ci.supplier_id),
      image_url = coalesce(nullif(trim(p_image_url),''), ci.image_url),
      updated_at = now()
  from public.inventory_assets ia
  where ia.id = p_asset_id and ci.id = ia.catalog_item_id;

  update public.inventory_assets
  set barcode = coalesce(nullif(trim(p_barcode),''), barcode),
      serial_number = nullif(trim(coalesce(p_serial_number,'')), ''),
      status_id = coalesce(v_status_id, status_id),
      condition_note = coalesce(nullif(trim(p_condition_note),''), condition_note),
      current_location_id = coalesce(v_location_id, current_location_id),
      location_detail = coalesce(nullif(trim(p_location_detail),''), location_detail),
      zone = coalesce(nullif(trim(p_zone),''), zone),
      image_url = coalesce(nullif(trim(p_image_url),''), image_url),
      updated_at = now()
  where id = p_asset_id;
end;
$$;

grant execute on function public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text,text) to authenticated;

-- 4) Re-crea alta de inventario con imagen.
drop function if exists public.admin_create_inventory_asset(text,text,text,text,text,text,text,text,text,text,text);
drop function if exists public.admin_create_inventory_asset(text,text,text,text,text,text,text,text,text,text,text,text);

create or replace function public.admin_create_inventory_asset(
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
  p_image_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_catalog_id uuid;
  v_asset_id uuid;
  v_category_id uuid;
  v_brand_id uuid;
  v_supplier_id uuid;
  v_location_id uuid;
  v_status_id uuid;
  v_asset_code text;
  v_barcode text;
begin
  if nullif(trim(coalesce(p_name,'')),'') is null then raise exception 'Falta nombre'; end if;

  insert into public.inventory_categories(name) values (coalesce(nullif(trim(p_category),''),'General'))
  on conflict (name) do update set updated_at = now() returning id into v_category_id;

  if nullif(trim(coalesce(p_brand,'')),'') is not null then
    insert into public.inventory_brands(name) values (trim(p_brand)) on conflict (name) do update set name = excluded.name returning id into v_brand_id;
  end if;
  if nullif(trim(coalesce(p_supplier,'')),'') is not null then
    insert into public.inventory_suppliers(name) values (trim(p_supplier)) on conflict (name) do update set name = excluded.name returning id into v_supplier_id;
  end if;
  select id into v_location_id from public.inventory_locations where code = coalesce(nullif(trim(p_location_code),''),'LAB-ROB') or name = coalesce(nullif(trim(p_location_code),''),'LAB-ROB') limit 1;
  if v_location_id is null then
    insert into public.inventory_locations(code, name) values (coalesce(nullif(trim(p_location_code),''),'LAB-ROB'), coalesce(nullif(trim(p_location_code),''),'Laboratorio de Robótica')) returning id into v_location_id;
  end if;
  select id into v_status_id from public.inventory_status_catalog where lower(frontend_status)='disponible' or lower(name)='disponible' limit 1;
  if v_status_id is null then
    insert into public.inventory_status_catalog(code, name, frontend_status) values ('disponible','Disponible','Disponible') returning id into v_status_id;
  end if;

  insert into public.inventory_catalog_items(name, category_id, brand_id, supplier_id, tracking_mode, image_url)
  values (trim(p_name), v_category_id, v_brand_id, v_supplier_id, 'serializado', nullif(trim(coalesce(p_image_url,'')),''))
  returning id into v_catalog_id;

  v_asset_code := coalesce(nullif(trim(p_asset_code),''), 'ACT-' || lpad(nextval('public.inventory_asset_seq')::text, 6, '0'));
  v_barcode := coalesce(nullif(trim(p_barcode),''), 'ISMROB-' || lpad(nextval('public.inventory_asset_seq')::text, 6, '0'));

  insert into public.inventory_assets(catalog_item_id, asset_code, barcode, serial_number, status_id, condition_note, current_location_id, location_detail, zone, image_url)
  values (v_catalog_id, v_asset_code, v_barcode, nullif(trim(coalesce(p_serial_number,'')),''), v_status_id, nullif(trim(coalesce(p_condition_note,'')),''), v_location_id, nullif(trim(coalesce(p_location_detail,'')),''), nullif(trim(coalesce(p_zone,'')),''), nullif(trim(coalesce(p_image_url,'')),''))
  returning id into v_asset_id;

  return v_asset_id;
end;
$$;

grant execute on function public.admin_create_inventory_asset(text,text,text,text,text,text,text,text,text,text,text,text) to authenticated;

-- 5) Secuencia usada por alta si no existía.
create sequence if not exists public.inventory_asset_seq;
grant usage, select on sequence public.inventory_asset_seq to authenticated;

-- 6) Notificaciones a administradores por alta/cambio estado/cambio condición.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  section text default 'notifications',
  read_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

grant select, insert, update on public.notifications to authenticated;

create or replace function public.notify_admins(
  p_title text,
  p_message text,
  p_section text default 'inventory',
  p_created_by uuid default auth.uid()
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_count integer := 0;
begin
  insert into public.notifications(recipient_profile_id, title, message, section, created_by)
  select p.id, p_title, p_message, coalesce(p_section,'inventory'), p_created_by
  from public.profiles p join public.roles r on r.id = p.role_id
  where r.code = 'administrator' and coalesce(p.is_active,true) is true;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.notify_admins(text,text,text,uuid) to authenticated;

create or replace function public.trg_inventory_admin_notifications()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item text;
  v_old_status text;
  v_new_status text;
  v_code text;
begin
  select ci.name into v_item from public.inventory_catalog_items ci where ci.id = new.catalog_item_id;
  v_code := coalesce(new.asset_code, new.barcode, new.id::text);
  if tg_op = 'INSERT' then
    perform public.notify_admins('Nuevo insumo/equipo cargado', coalesce(v_item,'Inventario') || ' (' || v_code || ') fue cargado en inventario.', 'inventory', auth.uid());
    return new;
  end if;
  if old.status_id is distinct from new.status_id then
    select coalesce(frontend_status, name, code) into v_old_status from public.inventory_status_catalog where id = old.status_id;
    select coalesce(frontend_status, name, code) into v_new_status from public.inventory_status_catalog where id = new.status_id;
    perform public.notify_admins('Cambio de estado en inventario', coalesce(v_item,'Inventario') || ' (' || v_code || ') cambió de estado: ' || coalesce(v_old_status,'Sin estado') || ' → ' || coalesce(v_new_status,'Sin estado') || '.', 'inventory', auth.uid());
  end if;
  if coalesce(old.condition_note,'') is distinct from coalesce(new.condition_note,'') then
    perform public.notify_admins('Cambio de condición en inventario', coalesce(v_item,'Inventario') || ' (' || v_code || ') cambió de condición: ' || coalesce(nullif(old.condition_note,''),'Sin condición') || ' → ' || coalesce(nullif(new.condition_note,''),'Sin condición') || '.', 'inventory', auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists inventory_admin_notifications_iud on public.inventory_assets;
create trigger inventory_admin_notifications_iud after insert or update of status_id, condition_note on public.inventory_assets for each row execute function public.trg_inventory_admin_notifications();

-- 7) Vistas de inventario limpias con image_url.
drop view if exists public.inventory_assets_frontend_view cascade;
drop view if exists public.inventory_frontend_view cascade;

create view public.inventory_frontend_view as
select
  ia.id,
  ia.asset_code as code,
  ia.asset_code,
  ci.name as item,
  ci.name as name,
  case when ci.tracking_mode = 'consumible' then 'Insumo' else 'Equipo' end as type,
  ia.serial_number as serial,
  ia.serial_number,
  ia.barcode,
  coalesce(sc.frontend_status, sc.name, 'Disponible') as status,
  ia.condition_note as condition,
  ia.condition_note,
  ia.current_location_id,
  coalesce(loc.name, loc.code, '-') as location,
  cat.name as category,
  b.name as brand,
  sup.name as supplier,
  ia.location_detail,
  ia.zone,
  coalesce(ia.image_url, ci.image_url) as image_url,
  ia.is_active,
  ia.created_at,
  ia.updated_at
from public.inventory_assets ia
join public.inventory_catalog_items ci on ci.id = ia.catalog_item_id
left join public.inventory_categories cat on cat.id = ci.category_id
left join public.inventory_brands b on b.id = ci.brand_id
left join public.inventory_suppliers sup on sup.id = ci.supplier_id
left join public.inventory_status_catalog sc on sc.id = ia.status_id
left join public.inventory_locations loc on loc.id = ia.current_location_id;

create view public.inventory_assets_frontend_view as select * from public.inventory_frontend_view;

grant select on public.inventory_frontend_view to authenticated;
grant select on public.inventory_assets_frontend_view to authenticated;

grant select, insert, update on public.inventory_assets, public.inventory_catalog_items, public.inventory_categories, public.inventory_brands, public.inventory_suppliers, public.inventory_locations, public.inventory_status_catalog to authenticated;

commit;
notify pgrst, 'reload schema';
