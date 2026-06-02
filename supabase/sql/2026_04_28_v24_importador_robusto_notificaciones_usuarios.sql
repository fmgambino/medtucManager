-- v24: importador robusto, remitente en notificaciones y preparación para curso/división de alumnos

-- Genera códigos ACT y barcodes que no colisionan aunque las secuencias hayan quedado desfasadas.
create or replace function public.next_inventory_asset_code_v24()
returns text language plpgsql security definer set search_path=public as $$
declare v_n bigint; v_code text;
begin
  loop
    v_n := nextval('public.inventory_asset_seq');
    v_code := 'ACT-' || lpad(v_n::text, 6, '0');
    if not exists(select 1 from public.inventory_assets where asset_code = v_code) then
      return v_code;
    end if;
  end loop;
end $$;

create or replace function public.next_inventory_numeric_barcode_v24()
returns text language plpgsql security definer set search_path=public as $$
declare v_n bigint; v_bar text;
begin
  loop
    v_n := nextval('public.inventory_numeric_barcode_seq');
    v_bar := '8435439' || lpad(v_n::text, 6, '0');
    if not exists(select 1 from public.inventory_assets where barcode = v_bar) then
      return v_bar;
    end if;
  end loop;
end $$;

create or replace function public.admin_create_inventory_asset_v24(
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

  v_code := nullif(trim(coalesce(p_asset_code,'')),'');
  if v_code is null or exists(select 1 from public.inventory_assets where asset_code = v_code) then
    v_code := public.next_inventory_asset_code_v24();
  end if;

  v_bar := public.clean_numeric_barcode(p_barcode);
  if v_bar is null or exists(select 1 from public.inventory_assets where barcode = v_bar) then
    v_bar := public.next_inventory_numeric_barcode_v24();
  end if;

  insert into public.inventory_assets(catalog_item_id,asset_code,barcode,serial_number,generated_barcode,status_id,condition_note,current_location_id,location_detail,zone,quantity,quantity_available,image_url,is_active)
  values(v_item,v_code,v_bar,nullif(trim(coalesce(p_serial_number,'')),''), true, v_status, nullif(trim(coalesce(p_condition_note,'')),''), v_loc, p_location_detail, p_zone, v_qty, v_qty, nullif(p_image_url,''), true)
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.admin_update_inventory_asset_v24(
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
returns void language sql security definer set search_path=public as $$
  select public.admin_update_inventory_asset_v23($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16);
$$;

drop view if exists public.notifications_frontend_view cascade;
create view public.notifications_frontend_view as
select n.*, coalesce(p.full_name,'Sistema') as sender, coalesce(p.full_name,'Sistema') as sender_name
from public.notifications n
left join public.profiles p on p.id = n.created_by
where n.recipient_profile_id = auth.uid() or n.recipient_profile_id is null;
grant select,update on public.notifications_frontend_view to authenticated;

grant execute on function public.next_inventory_asset_code_v24() to authenticated, anon;
grant execute on function public.next_inventory_numeric_barcode_v24() to authenticated, anon;
grant execute on function public.admin_create_inventory_asset_v24(text,text,text,text,text,text,text,text,text,text,text,text,integer,text) to authenticated, anon;
grant execute on function public.admin_update_inventory_asset_v24(uuid,text,text,text,text,text,text,text,text,text,text,text,text,integer,text,text) to authenticated, anon;
notify pgrst, 'reload schema';
