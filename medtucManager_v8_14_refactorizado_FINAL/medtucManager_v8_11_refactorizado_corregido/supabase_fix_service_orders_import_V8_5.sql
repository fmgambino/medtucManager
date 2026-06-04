-- FIX compatible para importación SATMANAGER -> service_orders
-- Ejecutar en Supabase SQL Editor antes de importar el CSV.

-- 1) Garantiza defaults útiles cuando el importador envía NULL explícito.
CREATE OR REPLACE FUNCTION public.service_orders_import_defaults()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.received_at := COALESCE(NEW.received_at, now());
  NEW.fault_description := COALESCE(NULLIF(BTRIM(NEW.fault_description), ''), 'Sin falla informada');
  NEW.priority := COALESCE(NULLIF(BTRIM(NEW.priority), ''), 'Media');
  NEW.source := COALESCE(NULLIF(BTRIM(NEW.source), ''), 'SATMANAGER');
  NEW.imported_at := COALESCE(NEW.imported_at, now());
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_service_orders_import_defaults ON public.service_orders;
CREATE TRIGGER trg_service_orders_import_defaults
BEFORE INSERT OR UPDATE ON public.service_orders
FOR EACH ROW
EXECUTE FUNCTION public.service_orders_import_defaults();

-- 2) Asegura que los defaults de tabla existan.
ALTER TABLE public.service_orders
  ALTER COLUMN received_at SET DEFAULT now(),
  ALTER COLUMN fault_description SET DEFAULT 'Sin falla informada',
  ALTER COLUMN priority SET DEFAULT 'Media',
  ALTER COLUMN source SET DEFAULT 'SATMANAGER',
  ALTER COLUMN imported_at SET DEFAULT now();

-- 3) Permisos RLS básicos para usuarios autenticados.
-- Ajustar según su política de roles si ya tiene RLS personalizado.
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_orders_select_authenticated" ON public.service_orders;
CREATE POLICY "service_orders_select_authenticated"
ON public.service_orders FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "service_orders_insert_authenticated" ON public.service_orders;
CREATE POLICY "service_orders_insert_authenticated"
ON public.service_orders FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "service_orders_update_authenticated" ON public.service_orders;
CREATE POLICY "service_orders_update_authenticated"
ON public.service_orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4) Verificación rápida luego de importar:
-- SELECT count(*) FROM public.service_orders WHERE source = 'SATMANAGER';
-- SELECT satmanager_order, received_at, requester_name, equipment_type, brand, model, fault_description FROM public.service_orders ORDER BY imported_at DESC LIMIT 20;
