-- ISM Robosoft v19 - roles completos + condiciones persistentes + inventario cantidad/duplicado/edición masiva
-- Ejecutar completo en Supabase SQL Editor antes de reemplazar la webapp.

BEGIN;

-- 1) Permisos base completos para que aparezcan en Nuevo/Editar rol.
INSERT INTO public.permissions (code, name, module) VALUES
('dashboard.read','Ver dashboard','dashboard'),
('users.read','Ver usuarios','users'),
('users.manage','Gestionar usuarios','users'),
('roles.manage','Gestionar roles y permisos','roles'),
('teams.read','Ver equipos','teams'),
('teams.manage','Gestionar equipos','teams'),
('inventory.read','Ver inventario','inventory'),
('inventory.manage','Gestionar inventario','inventory'),
('inventory.loan','Solicitar préstamos de inventario','inventory'),
('inventory.approve','Aprobar préstamos de inventario','inventory'),
('loan.read','Ver gestión de préstamos','loans'),
('loan.create','Crear solicitudes de préstamo','loans'),
('loan.manage','Gestionar solicitudes de préstamo','loans'),
('notifications.read','Ver notificaciones','notifications'),
('notifications.send','Enviar notificaciones','notifications'),
('courses.read','Ver campus/cursos','courses'),
('courses.manage','Gestionar campus/cursos','courses'),
('modules.read','Ver módulos','modules'),
('modules.manage','Gestionar módulos','modules'),
('lessons.read','Ver lecciones','lessons'),
('lessons.manage','Gestionar lecciones','lessons'),
('library.read','Ver biblioteca','library'),
('library.manage','Gestionar biblioteca','library'),
('access.read','Ver control de acceso','access'),
('access.manage','Gestionar control de acceso','access'),
('settings.read','Ver configuración','settings'),
('settings.manage','Gestionar configuración','settings')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, module = EXCLUDED.module;

-- 2) Limpieza controlada de condiciones duplicadas por nombre normalizado.
WITH ranked AS (
  SELECT id, lower(trim(regexp_replace(name, '\s+', ' ', 'g'))) AS key_name,
         row_number() OVER (PARTITION BY lower(trim(regexp_replace(name, '\s+', ' ', 'g'))) ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC) AS rn
  FROM public.inventory_conditions
)
UPDATE public.inventory_conditions c
SET is_active = false, updated_at = now()
FROM ranked r
WHERE c.id = r.id AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS inventory_conditions_name_lower_active_uidx
ON public.inventory_conditions (lower(trim(regexp_replace(name, '\s+', ' ', 'g'))))
WHERE is_active = true;

-- 3) RPC definitivo para guardar/actualizar condiciones con color.
CREATE OR REPLACE FUNCTION public.inventory_condition_save_v19(
  p_name text,
  p_color text DEFAULT '#64748b',
  p_fail_on_duplicate boolean DEFAULT false
)
RETURNS TABLE(id uuid, name text, color text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text := trim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g'));
  v_color text := coalesce(nullif(trim(p_color), ''), '#64748b');
  v_existing public.inventory_conditions%ROWTYPE;
BEGIN
  IF v_name = '' THEN RAISE EXCEPTION 'Ingresá el nombre de la condición'; END IF;
  IF v_color !~ '^#[0-9A-Fa-f]{6}$' THEN v_color := '#64748b'; END IF;

  SELECT * INTO v_existing
  FROM public.inventory_conditions c
  WHERE lower(trim(regexp_replace(c.name, '\s+', ' ', 'g'))) = lower(v_name)
    AND c.is_active = true
  ORDER BY c.updated_at DESC NULLS LAST, c.created_at DESC NULLS LAST
  LIMIT 1;

  IF FOUND THEN
    IF p_fail_on_duplicate THEN
      RAISE EXCEPTION 'Condición duplicada: ya existe una condición con ese nombre.';
    END IF;
    UPDATE public.inventory_conditions c
       SET name = v_name, color = v_color, is_active = true, updated_at = now()
     WHERE c.id = v_existing.id
     RETURNING c.id, c.name, c.color INTO id, name, color;
    RETURN NEXT;
    RETURN;
  END IF;

  INSERT INTO public.inventory_conditions(name, color, sort_order, is_active, created_at, updated_at)
  VALUES (v_name, v_color, 100, true, now(), now())
  RETURNING inventory_conditions.id, inventory_conditions.name, inventory_conditions.color INTO id, name, color;
  RETURN NEXT;
END;
$$;
GRANT EXECUTE ON FUNCTION public.inventory_condition_save_v19(text,text,boolean) TO authenticated;

-- 4) Helpers para crear/actualizar inventario sin conflictos de firmas viejas.
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT oid::regprocedure AS sig FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname IN ('admin_update_inventory_asset','admin_create_inventory_asset') LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || r.sig || ' CASCADE';
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public._inventory_status_id(p_status text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM public.inventory_status_catalog
  WHERE lower(name)=lower(coalesce(p_status,'')) OR lower(frontend_status)=lower(coalesce(p_status,'')) OR lower(code)=lower(coalesce(p_status,''))
  ORDER BY sort_order NULLS LAST LIMIT 1;
  IF v_id IS NULL THEN
    INSERT INTO public.inventory_status_catalog(code, name, frontend_status, is_available, sort_order)
    VALUES (lower(regexp_replace(coalesce(nullif(p_status,''),'disponible'), '[^a-zA-Z0-9]+', '_', 'g')), coalesce(nullif(p_status,''),'Disponible'), coalesce(nullif(p_status,''),'Disponible'), true, 100)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, frontend_status = EXCLUDED.frontend_status
    RETURNING id INTO v_id;
  END IF;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public._inventory_location_id(p_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id uuid; v_code text := coalesce(nullif(p_code,''),'LAB-ROB');
BEGIN
  SELECT id INTO v_id FROM public.inventory_locations WHERE code = v_code OR lower(name)=lower(v_code) LIMIT 1;
  IF v_id IS NULL THEN
    INSERT INTO public.inventory_locations(code, name, is_active) VALUES (v_code, CASE WHEN v_code='LAB-ROB' THEN 'Laboratorio de Robótica' ELSE v_code END, true)
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, is_active = true RETURNING id INTO v_id;
  END IF;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public._inventory_catalog_id(
  p_name text, p_category text, p_brand text, p_supplier text, p_type text, p_image_url text DEFAULT null
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cat uuid; v_brand uuid; v_supplier uuid; v_item uuid; v_tracking text;
BEGIN
  IF nullif(trim(coalesce(p_category,'')), '') IS NOT NULL THEN
    INSERT INTO public.inventory_categories(name) VALUES (trim(p_category))
    ON CONFLICT (name) DO UPDATE SET updated_at = now() RETURNING id INTO v_cat;
  END IF;
  IF nullif(trim(coalesce(p_brand,'')), '') IS NOT NULL THEN
    INSERT INTO public.inventory_brands(name) VALUES (trim(p_brand))
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_brand;
  END IF;
  IF nullif(trim(coalesce(p_supplier,'')), '') IS NOT NULL THEN
    INSERT INTO public.inventory_suppliers(name, is_active) VALUES (trim(p_supplier), true)
    ON CONFLICT (name) DO UPDATE SET is_active = true RETURNING id INTO v_supplier;
  END IF;
  v_tracking := CASE WHEN lower(coalesce(p_type,'')) IN ('insumo','consumible') THEN 'consumible' WHEN lower(coalesce(p_type,'')) = 'lote' THEN 'lote' ELSE 'serializado' END;

  SELECT id INTO v_item FROM public.inventory_catalog_items
  WHERE lower(name)=lower(coalesce(nullif(trim(p_name),''),'Sin nombre'))
  ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST LIMIT 1;

  IF v_item IS NULL THEN
    INSERT INTO public.inventory_catalog_items(name, category_id, brand_id, supplier_id, tracking_mode, image_url, is_active, created_at, updated_at)
    VALUES (coalesce(nullif(trim(p_name),''),'Sin nombre'), v_cat, v_brand, v_supplier, v_tracking, p_image_url, true, now(), now())
    RETURNING id INTO v_item;
  ELSE
    UPDATE public.inventory_catalog_items SET
      name = coalesce(nullif(trim(p_name),''), name),
      category_id = coalesce(v_cat, category_id),
      brand_id = coalesce(v_brand, brand_id),
      supplier_id = coalesce(v_supplier, supplier_id),
      tracking_mode = coalesce(v_tracking, tracking_mode),
      image_url = coalesce(nullif(p_image_url,''), image_url),
      updated_at = now()
    WHERE id = v_item;
  END IF;
  RETURN v_item;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_create_inventory_asset(
  p_name text,
  p_category text DEFAULT 'General',
  p_asset_code text DEFAULT null,
  p_serial_number text DEFAULT null,
  p_barcode text DEFAULT null,
  p_location_code text DEFAULT 'LAB-ROB',
  p_condition_note text DEFAULT null,
  p_brand text DEFAULT null,
  p_supplier text DEFAULT null,
  p_location_detail text DEFAULT null,
  p_zone text DEFAULT null,
  p_image_url text DEFAULT null,
  p_quantity integer DEFAULT 1
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item uuid := public._inventory_catalog_id(p_name,p_category,p_brand,p_supplier,p_category,p_image_url);
  v_status uuid := public._inventory_status_id('Disponible');
  v_location uuid := public._inventory_location_id(p_location_code);
  v_id uuid; v_code text; v_barcode text; v_qty integer := greatest(coalesce(p_quantity,1),0);
BEGIN
  v_code := coalesce(nullif(trim(p_asset_code),''), 'ACT-' || lpad(nextval('inventory_asset_seq')::text, 6, '0'));
  v_barcode := coalesce(nullif(trim(p_barcode),''), 'ISMROB-' || lpad(nextval('inventory_asset_seq')::text, 6, '0'));
  INSERT INTO public.inventory_assets(catalog_item_id, asset_code, barcode, serial_number, status_id, condition_note, current_location_id, location_detail, zone, quantity, quantity_available, image_url, is_active, created_at, updated_at)
  VALUES (v_item, v_code, v_barcode, nullif(p_serial_number,''), v_status, nullif(p_condition_note,''), v_location, nullif(p_location_detail,''), nullif(p_zone,''), v_qty, v_qty, nullif(p_image_url,''), true, now(), now())
  RETURNING id INTO v_id;
  IF nullif(p_condition_note,'') IS NOT NULL THEN PERFORM public.inventory_condition_save_v19(p_condition_note, '#64748b', false); END IF;
  RETURN v_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_create_inventory_asset(text,text,text,text,text,text,text,text,text,text,text,text,integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_update_inventory_asset(
  p_asset_id uuid,
  p_barcode text DEFAULT null,
  p_brand text DEFAULT null,
  p_category text DEFAULT null,
  p_condition_note text DEFAULT null,
  p_location_code text DEFAULT null,
  p_location_detail text DEFAULT null,
  p_name text DEFAULT null,
  p_serial_number text DEFAULT null,
  p_status text DEFAULT null,
  p_supplier text DEFAULT null,
  p_zone text DEFAULT null,
  p_image_url text DEFAULT null,
  p_quantity integer DEFAULT null
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_asset public.inventory_assets%ROWTYPE;
  v_item uuid; v_status uuid; v_location uuid;
BEGIN
  SELECT * INTO v_asset FROM public.inventory_assets WHERE id = p_asset_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'No existe el activo %', p_asset_id; END IF;
  v_item := v_asset.catalog_item_id;
  IF coalesce(p_name,p_category,p_brand,p_supplier,p_image_url) IS NOT NULL THEN
    v_item := public._inventory_catalog_id(coalesce(p_name,(SELECT name FROM public.inventory_catalog_items WHERE id=v_asset.catalog_item_id)), p_category, p_brand, p_supplier, p_category, p_image_url);
  END IF;
  IF nullif(p_status,'') IS NOT NULL THEN v_status := public._inventory_status_id(p_status); END IF;
  IF nullif(p_location_code,'') IS NOT NULL THEN v_location := public._inventory_location_id(p_location_code); END IF;
  IF nullif(p_condition_note,'') IS NOT NULL THEN PERFORM public.inventory_condition_save_v19(p_condition_note, '#64748b', false); END IF;

  UPDATE public.inventory_assets SET
    catalog_item_id = coalesce(v_item, catalog_item_id),
    barcode = coalesce(nullif(p_barcode,''), barcode),
    serial_number = coalesce(nullif(p_serial_number,''), serial_number),
    status_id = coalesce(v_status, status_id),
    condition_note = coalesce(nullif(p_condition_note,''), condition_note),
    current_location_id = coalesce(v_location, current_location_id),
    location_detail = coalesce(nullif(p_location_detail,''), location_detail),
    zone = coalesce(nullif(p_zone,''), zone),
    image_url = coalesce(nullif(p_image_url,''), image_url),
    quantity = coalesce(greatest(p_quantity,0), quantity),
    quantity_available = coalesce(greatest(p_quantity,0), quantity_available),
    updated_at = now()
  WHERE id = p_asset_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text,text,integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.bulk_update_inventory_assets_v19(
  p_asset_ids uuid[],
  p_status text DEFAULT null,
  p_condition_note text DEFAULT null,
  p_brand text DEFAULT null,
  p_type text DEFAULT null,
  p_supplier text DEFAULT null,
  p_serial_number text DEFAULT null,
  p_location_code text DEFAULT null,
  p_location_detail text DEFAULT null,
  p_zone text DEFAULT null,
  p_quantity integer DEFAULT null
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid; v_status uuid; v_location uuid; v_asset public.inventory_assets%ROWTYPE; v_item uuid;
BEGIN
  IF p_asset_ids IS NULL OR array_length(p_asset_ids,1) IS NULL THEN RETURN; END IF;
  IF nullif(p_status,'') IS NOT NULL THEN v_status := public._inventory_status_id(p_status); END IF;
  IF nullif(p_location_code,'') IS NOT NULL THEN v_location := public._inventory_location_id(p_location_code); END IF;
  IF nullif(p_condition_note,'') IS NOT NULL THEN PERFORM public.inventory_condition_save_v19(p_condition_note, '#64748b', false); END IF;

  FOREACH v_id IN ARRAY p_asset_ids LOOP
    SELECT * INTO v_asset FROM public.inventory_assets WHERE id = v_id;
    IF FOUND THEN
      v_item := v_asset.catalog_item_id;
      IF coalesce(p_brand,p_supplier,p_type) IS NOT NULL THEN
        v_item := public._inventory_catalog_id((SELECT name FROM public.inventory_catalog_items WHERE id=v_asset.catalog_item_id), null, p_brand, p_supplier, p_type, null);
      END IF;
      UPDATE public.inventory_assets SET
        catalog_item_id = coalesce(v_item, catalog_item_id),
        status_id = coalesce(v_status, status_id),
        condition_note = coalesce(nullif(p_condition_note,''), condition_note),
        serial_number = coalesce(nullif(p_serial_number,''), serial_number),
        current_location_id = coalesce(v_location, current_location_id),
        location_detail = coalesce(nullif(p_location_detail,''), location_detail),
        zone = coalesce(nullif(p_zone,''), zone),
        quantity = coalesce(greatest(p_quantity,0), quantity),
        quantity_available = coalesce(greatest(p_quantity,0), quantity_available),
        updated_at = now()
      WHERE id = v_id;
    END IF;
  END LOOP;
END;
$$;
GRANT EXECUTE ON FUNCTION public.bulk_update_inventory_assets_v19(uuid[],text,text,text,text,text,text,text,text,text,integer) TO authenticated;

-- Compatibilidad: si la app vieja llama a bulk_update_inventory_assets, que no falle.
CREATE OR REPLACE FUNCTION public.bulk_update_inventory_assets(
  p_asset_ids uuid[], p_status text DEFAULT null, p_condition_note text DEFAULT null
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$ BEGIN
  PERFORM public.bulk_update_inventory_assets_v19(p_asset_ids,p_status,p_condition_note,null,null,null,null,null,null,null,null);
END; $$;
GRANT EXECUTE ON FUNCTION public.bulk_update_inventory_assets(uuid[],text,text) TO authenticated;

-- 5) Vista de inventario con cantidad y color de condición disponible para frontend.
DROP VIEW IF EXISTS public.inventory_frontend_view CASCADE;
CREATE OR REPLACE VIEW public.inventory_frontend_view AS
SELECT
  a.id,
  a.asset_code AS code,
  a.asset_code,
  ci.name AS item,
  ci.name AS name,
  CASE ci.tracking_mode WHEN 'consumible' THEN 'Insumo' WHEN 'lote' THEN 'Lote' ELSE 'Equipo' END AS type,
  a.serial_number AS serial,
  a.serial_number,
  a.barcode,
  COALESCE(sc.frontend_status, sc.name, 'Disponible') AS status,
  a.condition_note AS condition,
  a.condition_note,
  COALESCE(l.name, '-') AS location,
  a.location_detail,
  a.zone,
  c.name AS category,
  b.name AS brand,
  s.name AS supplier,
  a.quantity,
  a.quantity_available,
  COALESCE(a.image_url, ci.image_url) AS image_url,
  a.is_active,
  a.created_at,
  a.updated_at
FROM public.inventory_assets a
JOIN public.inventory_catalog_items ci ON ci.id = a.catalog_item_id
LEFT JOIN public.inventory_categories c ON c.id = ci.category_id
LEFT JOIN public.inventory_brands b ON b.id = ci.brand_id
LEFT JOIN public.inventory_suppliers s ON s.id = ci.supplier_id
LEFT JOIN public.inventory_status_catalog sc ON sc.id = a.status_id
LEFT JOIN public.inventory_locations l ON l.id = a.current_location_id;

GRANT SELECT ON public.inventory_frontend_view TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.inventory_conditions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.permissions TO authenticated;

NOTIFY pgrst, 'reload schema';
COMMIT;
