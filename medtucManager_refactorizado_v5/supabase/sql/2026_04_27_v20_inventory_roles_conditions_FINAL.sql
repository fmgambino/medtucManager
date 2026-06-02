-- ISM Robosoft v20 - Corrección final inventario/condiciones/roles/equipos
-- Ejecutar completo en Supabase SQL Editor.

-- Extensiones seguras
create extension if not exists pgcrypto;

-- Asegurar columnas usadas por la app
alter table if exists public.inventory_assets add column if not exists image_url text;
alter table if exists public.inventory_catalog_items add column if not exists image_url text;
alter table if exists public.inventory_loans add column if not exists use_date date;
alter table if exists public.inventory_loans add column if not exists from_time time;
alter table if exists public.inventory_loans add column if not exists to_time time;

-- Limpieza NO destructiva de condiciones duplicadas por mayúsculas/espacios.
-- Conserva la más reciente y activa.
with ranked as (
  select id,
         row_number() over (partition by lower(trim(regexp_replace(name, '\s+', ' ', 'g'))) order by is_active desc, updated_at desc nulls last, created_at desc nulls last, id) as rn
  from public.inventory_conditions
)
update public.inventory_conditions c
set is_active = false,
    updated_at = now()
from ranked r
where c.id = r.id and r.rn > 1;

-- Normalizar nombres y colores inválidos.
update public.inventory_conditions
set name = trim(regexp_replace(name, '\s+', ' ', 'g')),
    color = case when color ~* '^#[0-9a-f]{6}$' then color else '#64748b' end,
    is_active = coalesce(is_active, true),
    updated_at = now()
where name is not null;

-- Índice único para no duplicar condiciones activas con distinto case/espaciado.
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname='public' and indexname='ux_inventory_conditions_active_lower_name'
  ) then
    execute 'create unique index ux_inventory_conditions_active_lower_name on public.inventory_conditions (lower(trim(name))) where is_active = true';
  end if;
end $$;

-- Permisos básicos de tabla para perfiles autenticados.
grant select on public.inventory_conditions to authenticated, anon;
grant insert, update on public.inventory_conditions to authenticated;
grant select, insert, update on public.inventory_assets, public.inventory_catalog_items, public.inventory_categories, public.inventory_brands, public.inventory_suppliers, public.inventory_locations to authenticated;
grant select on public.permissions, public.roles, public.role_permissions, public.teams, public.team_members, public.profiles, public.courses, public.divisions to authenticated;

-- Catálogo completo de permisos visibles en popup de roles.
insert into public.permissions(code, name, module) values
('dashboard.read','Ver dashboard','dashboard'),
('users.read','Ver usuarios','users'),
('users.manage','Gestionar usuarios','users'),
('roles.read','Ver roles','roles'),
('roles.manage','Gestionar roles','roles'),
('teams.read','Ver equipos','teams'),
('teams.manage','Gestionar equipos','teams'),
('inventory.read','Ver inventario','inventory'),
('inventory.create','Crear inventario','inventory'),
('inventory.update','Editar inventario','inventory'),
('inventory.delete','Eliminar inventario','inventory'),
('inventory.manage','Gestionar inventario','inventory'),
('inventory.loan','Solicitar préstamos','inventory'),
('inventory.approve','Aprobar préstamos','inventory'),
('loan.read','Ver préstamos','loans'),
('loan.create','Crear préstamos','loans'),
('loan.manage','Gestionar préstamos','loans'),
('loans.manage','Gestionar préstamos','loans'),
('loan.approve','Aprobar préstamos','loans'),
('loan.return','Registrar devolución','loans'),
('notifications.read','Ver notificaciones','notifications'),
('notifications.send','Enviar notificaciones','notifications'),
('courses.read','Ver cursos','courses'),
('courses.manage','Gestionar cursos','courses'),
('modules.read','Ver módulos','modules'),
('modules.manage','Gestionar módulos','modules'),
('lessons.read','Ver lecciones','lessons'),
('lessons.manage','Gestionar lecciones','lessons'),
('library.read','Ver biblioteca','library'),
('library.manage','Gestionar biblioteca','library'),
('access.read','Ver accesos','access'),
('access.manage','Gestionar accesos','access'),
('settings.read','Ver configuración','settings'),
('settings.manage','Gestionar configuración','settings')
on conflict (code) do update set name=excluded.name, module=excluded.module;

-- Listado de condiciones por RPC security definer para evitar RLS/cache.
create or replace function public.list_inventory_conditions_v20()
returns table(id uuid, name text, color text, sort_order integer, is_active boolean, updated_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select c.id,
         trim(regexp_replace(c.name, '\s+', ' ', 'g')) as name,
         case when c.color ~* '^#[0-9a-f]{6}$' then c.color else '#64748b' end as color,
         c.sort_order,
         c.is_active,
         c.updated_at
  from public.inventory_conditions c
  where c.is_active = true
  order by c.sort_order, lower(c.name);
$$;

grant execute on function public.list_inventory_conditions_v20() to anon, authenticated;

-- Guardar/actualizar condición sin duplicados.
create or replace function public.inventory_condition_save_v20(
  p_name text,
  p_color text default '#64748b',
  p_fail_on_duplicate boolean default false
)
returns table(id uuid, name text, color text, sort_order integer, is_active boolean, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := trim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g'));
  v_color text := case when coalesce(p_color,'') ~* '^#[0-9a-f]{6}$' then p_color else '#64748b' end;
  v_existing public.inventory_conditions%rowtype;
  v_next_order integer;
begin
  if v_name = '' then
    raise exception 'Ingresá el nombre de la condición';
  end if;

  select * into v_existing
  from public.inventory_conditions c
  where lower(trim(c.name)) = lower(v_name)
  order by c.is_active desc, c.updated_at desc nulls last, c.created_at desc nulls last
  limit 1;

  if found then
    if p_fail_on_duplicate and v_existing.is_active then
      raise exception 'Condición duplicada: ya existe una condición con ese nombre.';
    end if;
    update public.inventory_conditions c
    set name = v_name,
        color = v_color,
        is_active = true,
        updated_at = now()
    where c.id = v_existing.id
    returning c.id, c.name, c.color, c.sort_order, c.is_active, c.updated_at
    into id, name, color, sort_order, is_active, updated_at;
    return next;
    return;
  end if;

  select coalesce(max(c.sort_order), 0) + 10 into v_next_order from public.inventory_conditions c;
  insert into public.inventory_conditions(name, color, sort_order, is_active, updated_at)
  values (v_name, v_color, v_next_order, true, now())
  returning inventory_conditions.id, inventory_conditions.name, inventory_conditions.color, inventory_conditions.sort_order, inventory_conditions.is_active, inventory_conditions.updated_at
  into id, name, color, sort_order, is_active, updated_at;
  return next;
end;
$$;

grant execute on function public.inventory_condition_save_v20(text,text,boolean) to authenticated, anon;

-- Helpers para IDs de catálogos.
create or replace function public._get_or_create_inventory_category(p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_name text := nullif(trim(coalesce(p_name,'General')), '');
begin
  v_name := coalesce(v_name, 'General');
  select id into v_id from public.inventory_categories where lower(name)=lower(v_name) limit 1;
  if v_id is null then insert into public.inventory_categories(name) values(v_name) returning id into v_id; end if;
  return v_id;
end; $$;

create or replace function public._get_or_create_inventory_brand(p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_name text := nullif(trim(coalesce(p_name,'')), '');
begin
  if v_name is null then return null; end if;
  select id into v_id from public.inventory_brands where lower(name)=lower(v_name) limit 1;
  if v_id is null then insert into public.inventory_brands(name) values(v_name) returning id into v_id; end if;
  return v_id;
end; $$;

create or replace function public._get_or_create_inventory_supplier(p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_name text := nullif(trim(coalesce(p_name,'')), '');
begin
  if v_name is null then return null; end if;
  select id into v_id from public.inventory_suppliers where lower(name)=lower(v_name) limit 1;
  if v_id is null then insert into public.inventory_suppliers(name) values(v_name) returning id into v_id; end if;
  return v_id;
end; $$;

create or replace function public._get_or_create_inventory_location(p_code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_code text := nullif(trim(coalesce(p_code,'LAB-ROB')), ''); v_name text;
begin
  v_code := coalesce(v_code, 'LAB-ROB');
  select id into v_id from public.inventory_locations where lower(coalesce(code,''))=lower(v_code) or lower(name)=lower(v_code) limit 1;
  if v_id is null then
    v_name := case upper(v_code) when 'LAB-ROB' then 'Laboratorio de Robótica' when 'DEP-01' then 'Depósito' when 'TALLER' then 'Taller revisión' else v_code end;
    insert into public.inventory_locations(code, name, is_active) values(v_code, v_name, true) returning id into v_id;
  end if;
  return v_id;
end; $$;

create or replace function public._get_status_id(p_status text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_name text := nullif(trim(coalesce(p_status,'Disponible')), ''); v_code text;
begin
  v_name := coalesce(v_name, 'Disponible');
  select id into v_id from public.inventory_status_catalog where lower(name)=lower(v_name) or lower(frontend_status)=lower(v_name) or lower(code)=lower(v_name) limit 1;
  if v_id is null then
    v_code := lower(regexp_replace(v_name, '[^a-zA-Z0-9]+', '_', 'g'));
    insert into public.inventory_status_catalog(code, name, frontend_status, is_available)
    values(v_code, v_name, v_name, lower(v_name)='disponible')
    on conflict (code) do update set name=excluded.name
    returning id into v_id;
  end if;
  return v_id;
end; $$;

-- RPC estable para crear activos: evita overloads viejos y guarda imagen/cantidad/condición.
create or replace function public.admin_create_inventory_asset_v20(
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
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_asset_id uuid;
  v_category_id uuid;
  v_brand_id uuid;
  v_supplier_id uuid;
  v_location_id uuid;
  v_status_id uuid;
  v_catalog_id uuid;
  v_asset_code text;
  v_barcode text;
  v_tracking text;
begin
  if nullif(trim(coalesce(p_name,'')), '') is null then raise exception 'Ingresá el nombre del insumo/equipo'; end if;
  if p_condition_note is not null and trim(p_condition_note) <> '' then
    perform public.inventory_condition_save_v20(p_condition_note, '#64748b', false);
  end if;
  v_category_id := public._get_or_create_inventory_category(p_category);
  v_brand_id := public._get_or_create_inventory_brand(p_brand);
  v_supplier_id := public._get_or_create_inventory_supplier(p_supplier);
  v_location_id := public._get_or_create_inventory_location(p_location_code);
  v_status_id := public._get_status_id('Disponible');
  v_tracking := case lower(coalesce(p_tracking_mode,'equipo')) when 'insumo' then 'consumible' when 'lote' then 'lote' else 'serializado' end;

  select id into v_catalog_id
  from public.inventory_catalog_items
  where lower(name)=lower(trim(p_name)) and coalesce(category_id, '00000000-0000-0000-0000-000000000000'::uuid)=coalesce(v_category_id, '00000000-0000-0000-0000-000000000000'::uuid)
  limit 1;
  if v_catalog_id is null then
    insert into public.inventory_catalog_items(name, category_id, brand_id, supplier_id, tracking_mode, image_url, is_active)
    values(trim(p_name), v_category_id, v_brand_id, v_supplier_id, v_tracking, nullif(p_image_url,''), true)
    returning id into v_catalog_id;
  else
    update public.inventory_catalog_items
    set brand_id=coalesce(v_brand_id, brand_id), supplier_id=coalesce(v_supplier_id, supplier_id), image_url=coalesce(nullif(p_image_url,''), image_url), updated_at=now()
    where id=v_catalog_id;
  end if;

  v_asset_code := nullif(trim(coalesce(p_asset_code,'')), '');
  if v_asset_code is null then v_asset_code := 'ACT-' || lpad(nextval('public.inventory_asset_seq')::text, 6, '0'); end if;
  v_barcode := nullif(trim(coalesce(p_barcode,'')), '');
  if v_barcode is null then v_barcode := 'ISMROB-' || lpad(nextval('public.inventory_asset_seq')::text, 6, '0'); end if;

  insert into public.inventory_assets(catalog_item_id, asset_code, barcode, serial_number, status_id, condition_note, current_location_id, location_detail, zone, image_url, quantity, quantity_available, is_active)
  values(v_catalog_id, v_asset_code, v_barcode, nullif(p_serial_number,''), v_status_id, nullif(p_condition_note,''), v_location_id, nullif(p_location_detail,''), nullif(p_zone,''), nullif(p_image_url,''), greatest(coalesce(p_quantity,1),0), greatest(coalesce(p_quantity,1),0), true)
  returning id into v_asset_id;
  return v_asset_id;
end;
$$;

grant execute on function public.admin_create_inventory_asset_v20(text,text,text,text,text,text,text,text,text,text,text,text,integer,text) to authenticated;

-- RPC estable para actualizar activos existentes.
create or replace function public.admin_update_inventory_asset_v20(
  p_asset_id uuid,
  p_name text default null,
  p_category text default null,
  p_serial_number text default null,
  p_barcode text default null,
  p_status text default null,
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
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_asset public.inventory_assets%rowtype;
  v_category_id uuid;
  v_brand_id uuid;
  v_supplier_id uuid;
  v_location_id uuid;
  v_status_id uuid;
  v_catalog_id uuid;
  v_tracking text;
begin
  select * into v_asset from public.inventory_assets where id = p_asset_id and is_active = true;
  if not found then raise exception 'No existe el activo %', p_asset_id; end if;

  if p_condition_note is not null and trim(p_condition_note) <> '' then
    perform public.inventory_condition_save_v20(p_condition_note, '#64748b', false);
  end if;
  v_category_id := case when p_category is not null then public._get_or_create_inventory_category(p_category) else null end;
  v_brand_id := case when p_brand is not null then public._get_or_create_inventory_brand(p_brand) else null end;
  v_supplier_id := case when p_supplier is not null then public._get_or_create_inventory_supplier(p_supplier) else null end;
  v_location_id := case when p_location_code is not null then public._get_or_create_inventory_location(p_location_code) else null end;
  v_status_id := case when p_status is not null then public._get_status_id(p_status) else null end;
  v_tracking := case lower(coalesce(p_tracking_mode,'')) when 'insumo' then 'consumible' when 'lote' then 'lote' when 'equipo' then 'serializado' else null end;

  if p_name is not null and trim(p_name) <> '' then
    select id into v_catalog_id from public.inventory_catalog_items
    where lower(name)=lower(trim(p_name)) and (v_category_id is null or category_id=v_category_id)
    limit 1;
    if v_catalog_id is null then
      insert into public.inventory_catalog_items(name, category_id, brand_id, supplier_id, tracking_mode, image_url, is_active)
      values(trim(p_name), coalesce(v_category_id, (select category_id from public.inventory_catalog_items where id=v_asset.catalog_item_id)), v_brand_id, v_supplier_id, coalesce(v_tracking,'serializado'), nullif(p_image_url,''), true)
      returning id into v_catalog_id;
    else
      update public.inventory_catalog_items
      set category_id=coalesce(v_category_id, category_id), brand_id=coalesce(v_brand_id, brand_id), supplier_id=coalesce(v_supplier_id, supplier_id), tracking_mode=coalesce(v_tracking, tracking_mode), image_url=coalesce(nullif(p_image_url,''), image_url), updated_at=now()
      where id=v_catalog_id;
    end if;
  end if;

  update public.inventory_assets
  set catalog_item_id = coalesce(v_catalog_id, catalog_item_id),
      asset_code = coalesce(nullif(trim(coalesce(p_asset_code,'')),''), asset_code),
      barcode = coalesce(nullif(trim(coalesce(p_barcode,'')),''), barcode),
      serial_number = nullif(coalesce(p_serial_number, serial_number, ''), ''),
      status_id = coalesce(v_status_id, status_id),
      condition_note = coalesce(nullif(p_condition_note,''), condition_note),
      current_location_id = coalesce(v_location_id, current_location_id),
      location_detail = coalesce(nullif(p_location_detail,''), location_detail),
      zone = coalesce(nullif(p_zone,''), zone),
      image_url = coalesce(nullif(p_image_url,''), image_url),
      quantity = coalesce(greatest(p_quantity,0), quantity),
      quantity_available = least(coalesce(greatest(p_quantity,0), quantity_available), coalesce(greatest(p_quantity,0), quantity)),
      updated_at = now()
  where id = p_asset_id;
end;
$$;

grant execute on function public.admin_update_inventory_asset_v20(uuid,text,text,text,text,text,text,text,text,text,text,text,text,integer,text,text) to authenticated;

-- Edición masiva robusta.
create or replace function public.bulk_update_inventory_assets_v20(
  p_asset_ids uuid[],
  p_status text default null,
  p_condition_note text default null,
  p_brand text default null,
  p_type text default null,
  p_supplier text default null,
  p_serial_number text default null,
  p_location_code text default null,
  p_location_detail text default null,
  p_zone text default null,
  p_quantity integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if p_asset_ids is null or array_length(p_asset_ids,1) is null then return; end if;
  foreach v_id in array p_asset_ids loop
    perform public.admin_update_inventory_asset_v20(
      v_id, null, coalesce(p_type, null), p_serial_number, null, p_status, p_condition_note, p_location_code, p_brand, p_supplier, p_location_detail, p_zone, null, p_quantity, p_type, null
    );
  end loop;
end;
$$;

grant execute on function public.bulk_update_inventory_assets_v20(uuid[],text,text,text,text,text,text,text,text,text,integer) to authenticated;

-- Vista de inventario con imagen, cantidad, marcas/proveedor y condición persistente.
drop view if exists public.inventory_frontend_view cascade;
create view public.inventory_frontend_view as
select
  ia.id,
  ia.asset_code as code,
  ia.asset_code,
  coalesce(ci.name, '-') as item,
  case ci.tracking_mode when 'consumible' then 'Insumo' when 'lote' then 'Lote' else 'Equipo' end as type,
  coalesce(ib.name, '-') as brand,
  coalesce(sup.name, '-') as supplier,
  coalesce(cat.name, '-') as category,
  ia.serial_number as serial,
  ia.barcode,
  coalesce(st.frontend_status, st.name, 'Disponible') as status,
  coalesce(ia.condition_note, 'Sin observaciones') as condition,
  ia.current_location_id,
  coalesce(loc.name, '-') as location,
  ia.location_detail,
  ia.zone,
  coalesce(ia.image_url, ci.image_url) as image_url,
  ia.quantity,
  ia.quantity_available,
  ia.is_active,
  ia.created_at,
  ia.updated_at
from public.inventory_assets ia
join public.inventory_catalog_items ci on ci.id = ia.catalog_item_id
left join public.inventory_categories cat on cat.id = ci.category_id
left join public.inventory_brands ib on ib.id = ci.brand_id
left join public.inventory_suppliers sup on sup.id = ci.supplier_id
left join public.inventory_status_catalog st on st.id = ia.status_id
left join public.inventory_locations loc on loc.id = ia.current_location_id;

grant select on public.inventory_frontend_view to authenticated, anon;

notify pgrst, 'reload schema';
