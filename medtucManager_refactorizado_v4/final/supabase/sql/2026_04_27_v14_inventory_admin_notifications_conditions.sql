-- ISM Robosoft v14 - Inventario: notificaciones a administradores y edición de colores de condiciones
-- Ejecutar completo en Supabase SQL Editor antes de publicar esta versión.

begin;

-- Asegura tabla de notificaciones compatible con el frontend actual.
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

alter table public.notifications add column if not exists recipient_profile_id uuid references public.profiles(id) on delete cascade;
alter table public.notifications add column if not exists section text default 'notifications';
alter table public.notifications add column if not exists read_at timestamptz;
alter table public.notifications add column if not exists created_by uuid references public.profiles(id);
alter table public.notifications add column if not exists created_at timestamptz default now();

create index if not exists notifications_recipient_created_idx on public.notifications(recipient_profile_id, created_at desc);

-- Permite guardar/editar colores de condiciones ya creadas desde la webapp.
grant select, insert, update on public.inventory_conditions to authenticated;

-- Reemplaza versiones conflictivas de RPC de inventario para evitar ambigüedad en PostgREST.
drop function if exists public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text);
drop function if exists public.admin_update_inventory_asset(uuid,text,uuid,uuid,text,uuid,text,text,text,uuid,uuid,text);

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
  p_zone text default null
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
begin
  if p_asset_id is null then
    raise exception 'Falta p_asset_id';
  end if;

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
  set
    name = coalesce(nullif(trim(p_name),''), ci.name),
    category_id = coalesce(v_category_id, ci.category_id),
    brand_id = coalesce(v_brand_id, ci.brand_id),
    supplier_id = coalesce(v_supplier_id, ci.supplier_id),
    updated_at = now()
  from public.inventory_assets ia
  where ia.id = p_asset_id and ci.id = ia.catalog_item_id;

  update public.inventory_assets
  set
    barcode = coalesce(nullif(trim(p_barcode),''), barcode),
    serial_number = nullif(trim(coalesce(p_serial_number,'')), ''),
    status_id = coalesce(v_status_id, status_id),
    condition_note = coalesce(nullif(trim(p_condition_note),''), condition_note),
    current_location_id = coalesce(v_location_id, current_location_id),
    location_detail = coalesce(nullif(trim(p_location_detail),''), location_detail),
    zone = coalesce(nullif(trim(p_zone),''), zone),
    updated_at = now()
  where id = p_asset_id;
end;
$$;

grant execute on function public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text) to authenticated;

-- Envía notificaciones SOLO a administradores activos.
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
declare
  v_count integer := 0;
begin
  insert into public.notifications(recipient_profile_id, title, message, section, created_by)
  select p.id, p_title, p_message, coalesce(p_section,'inventory'), p_created_by
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where r.code = 'administrator'
    and coalesce(p.is_active,true) is true;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.notify_admins(text,text,text,uuid) to authenticated;

-- Trigger: nuevo insumo/equipo, cambio de estado y cambio de condición.
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
    perform public.notify_admins(
      'Nuevo insumo/equipo cargado',
      coalesce(v_item,'Inventario') || ' (' || v_code || ') fue cargado en inventario.',
      'inventory',
      auth.uid()
    );
    return new;
  end if;

  if old.status_id is distinct from new.status_id then
    select coalesce(frontend_status, name, code) into v_old_status from public.inventory_status_catalog where id = old.status_id;
    select coalesce(frontend_status, name, code) into v_new_status from public.inventory_status_catalog where id = new.status_id;
    perform public.notify_admins(
      'Cambio de estado en inventario',
      coalesce(v_item,'Inventario') || ' (' || v_code || ') cambió de estado: ' || coalesce(v_old_status,'Sin estado') || ' → ' || coalesce(v_new_status,'Sin estado') || '.',
      'inventory',
      auth.uid()
    );
  end if;

  if coalesce(old.condition_note,'') is distinct from coalesce(new.condition_note,'') then
    perform public.notify_admins(
      'Cambio de condición en inventario',
      coalesce(v_item,'Inventario') || ' (' || v_code || ') cambió de condición: ' || coalesce(nullif(old.condition_note,''),'Sin condición') || ' → ' || coalesce(nullif(new.condition_note,''),'Sin condición') || '.',
      'inventory',
      auth.uid()
    );
  end if;

  return new;
end;
$$;

drop trigger if exists inventory_admin_notifications_iud on public.inventory_assets;
create trigger inventory_admin_notifications_iud
after insert or update of status_id, condition_note on public.inventory_assets
for each row execute function public.trg_inventory_admin_notifications();

-- Vista de notificaciones actualizada.
drop view if exists public.notifications_frontend_view cascade;
create view public.notifications_frontend_view as
select
  n.id,
  n.recipient_profile_id,
  n.title,
  n.message,
  coalesce(n.section,'notifications') as section,
  n.read_at,
  n.created_by,
  n.created_at
from public.notifications n
where n.recipient_profile_id = auth.uid()
   or exists (
     select 1 from public.profiles p join public.roles r on r.id = p.role_id
     where p.id = auth.uid() and r.code = 'administrator'
   );

grant select on public.notifications_frontend_view to authenticated;
grant select, insert, update on public.notifications to authenticated;

commit;
notify pgrst, 'reload schema';
