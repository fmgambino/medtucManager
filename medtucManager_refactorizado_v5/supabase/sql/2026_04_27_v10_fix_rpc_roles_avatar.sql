-- ISM Robosoft v10 - Corrección RPC inventario + refresco schema cache
-- Ejecutar completo en Supabase > SQL Editor.

begin;

-- El error "Could not choose the best candidate function" aparece porque existen
-- dos funciones admin_update_inventory_asset con los mismos parámetros pero tipos distintos.
-- Se elimina la versión vieja con text y se conserva/recrea la versión UUID compatible.
drop function if exists public.admin_update_inventory_asset(
  uuid, text, text, text, text, text, text, text, text, text, text, text
);

drop function if exists public.admin_update_inventory_asset(
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
  p_zone text
);

create or replace function public.admin_update_inventory_asset(
  p_asset_id uuid,
  p_barcode text default null,
  p_brand uuid default null,
  p_category uuid default null,
  p_condition_note text default null,
  p_location_code uuid default null,
  p_location_detail text default null,
  p_name text default null,
  p_serial_number text default null,
  p_status uuid default null,
  p_supplier uuid default null,
  p_zone text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.inventory_assets ia
  set
    barcode = coalesce(nullif(p_barcode, ''), ia.barcode),
    serial_number = nullif(p_serial_number, ''),
    condition_note = nullif(p_condition_note, ''),
    current_location_id = coalesce(p_location_code, ia.current_location_id),
    location_detail = nullif(p_location_detail, ''),
    zone = nullif(p_zone, ''),
    status_id = coalesce(p_status, ia.status_id),
    updated_at = now()
  where ia.id = p_asset_id;

  if p_name is not null or p_brand is not null or p_category is not null or p_supplier is not null then
    update public.inventory_catalog_items ci
    set
      name = coalesce(nullif(p_name, ''), ci.name),
      brand_id = coalesce(p_brand, ci.brand_id),
      category_id = coalesce(p_category, ci.category_id),
      supplier_id = coalesce(p_supplier, ci.supplier_id),
      updated_at = now()
    from public.inventory_assets ia
    where ia.id = p_asset_id
      and ci.id = ia.catalog_item_id;
  end if;
end;
$$;

grant execute on function public.admin_update_inventory_asset(uuid, text, uuid, uuid, text, uuid, text, text, text, uuid, uuid, text) to authenticated;

-- Asegura permisos mínimos para editar perfiles con avatar_url desde el ABM.
grant select, update on public.profiles to authenticated;

-- Refresca el schema cache de PostgREST/Supabase.
notify pgrst, 'reload schema';

commit;
