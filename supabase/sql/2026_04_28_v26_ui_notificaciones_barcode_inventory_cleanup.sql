-- v26: UI notificaciones, contador, barcodes Code-128 y limpieza segura de duplicados de inventario.
-- Ejecutar una sola vez en Supabase SQL Editor antes/después de subir los archivos.

-- 1) Normaliza barcodes a solo numeros para nuevas altas.
create or replace function public.clean_numeric_barcode(p_value text)
returns text language sql immutable as $$
  select nullif(regexp_replace(coalesce(p_value,''), '[^0-9]', '', 'g'), '')
$$;

-- 2) Limpieza de duplicados YA cargados en inventory_assets.
-- Mantiene preferentemente los ACT históricos indicados y luego el más antiguo.
-- Borra primero tablas hijas para no violar FKs/checks.
do $$
declare
  v_keep_codes text[] := array['ACT-000002','ACT-000004','ACT-000008','ACT-000010','ACT-000012','ACT-000013'];
begin
  create temp table if not exists _inventory_assets_to_delete(id uuid primary key) on commit drop;
  truncate _inventory_assets_to_delete;

  insert into _inventory_assets_to_delete(id)
  with ranked as (
    select ia.id,
           row_number() over (
             partition by lower(coalesce(ia.asset_code,'')), coalesce(ia.barcode,''), ia.catalog_item_id, coalesce(ia.serial_number,''), coalesce(ia.location_detail,''), coalesce(ia.zone,'')
             order by case when ia.asset_code = any(v_keep_codes) then 0 else 1 end, ia.created_at asc nulls last, ia.id
           ) as rn
    from public.inventory_assets ia
    where ia.is_active is true
  )
  select id from ranked where rn > 1
  on conflict do nothing;

  delete from public.inventory_loan_items where asset_id in (select id from _inventory_assets_to_delete);
  delete from public.inventory_transaction_lines where asset_id in (select id from _inventory_assets_to_delete);
  delete from public.inventory_asset_status_history where asset_id in (select id from _inventory_assets_to_delete);
  delete from public.inventory_location_history where asset_id in (select id from _inventory_assets_to_delete);
  delete from public.inventory_maintenance_events where asset_id in (select id from _inventory_assets_to_delete);
  delete from public.inventory_barcode_labels where asset_id in (select id from _inventory_assets_to_delete);
  delete from public.inventory_assets where id in (select id from _inventory_assets_to_delete);
end $$;

-- 3) Generadores robustos: nunca reutilizan códigos existentes.
do $$
begin
  create sequence if not exists public.inventory_asset_seq start 1;
  create sequence if not exists public.inventory_numeric_barcode_seq start 1;
end $$;

select setval('public.inventory_asset_seq', greatest(
  coalesce((select max((regexp_match(asset_code, '^ACT-([0-9]+)$'))[1]::bigint) from public.inventory_assets where asset_code ~ '^ACT-[0-9]+$'), 0) + 1,
  1
), false);

select setval('public.inventory_numeric_barcode_seq', greatest(
  coalesce((select max((regexp_match(barcode, '^8435439([0-9]+)$'))[1]::bigint) from public.inventory_assets where barcode ~ '^8435439[0-9]+$'), 0) + 1,
  1
), false);

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

grant execute on function public.next_inventory_asset_code_v24() to authenticated, anon;
grant execute on function public.next_inventory_numeric_barcode_v24() to authenticated, anon;

-- 4) Vista de notificaciones con remitente garantizado para todos los usuarios.
drop view if exists public.notifications_frontend_view cascade;
create view public.notifications_frontend_view as
select n.id,
       n.recipient_profile_id,
       n.title,
       n.message,
       n.section,
       n.read_at,
       n.created_by,
       n.created_at,
       coalesce(nullif(p.full_name,''), 'Sistema') as sender,
       coalesce(nullif(p.full_name,''), 'Sistema') as sender_name,
       coalesce(nullif(p.full_name,''), 'Sistema') as created_by_name
from public.notifications n
left join public.profiles p on p.id = n.created_by
where n.recipient_profile_id = auth.uid() or n.recipient_profile_id is null;

grant select on public.notifications_frontend_view to authenticated;

grant update(read_at) on public.notifications to authenticated;

notify pgrst, 'reload schema';
