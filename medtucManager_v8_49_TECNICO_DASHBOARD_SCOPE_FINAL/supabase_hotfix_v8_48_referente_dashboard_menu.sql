-- HOTFIX v8.48 · Referente RBAC + Soporte Ticket + Dashboard
-- Ejecutar completo en Supabase SQL Editor.

-- 1) UNIQUE compatible con PostgreSQL/Supabase
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'role_module_permissions_role_module_unique'
      AND conrelid = 'public.role_module_permissions'::regclass
  ) THEN
    ALTER TABLE public.role_module_permissions
      ADD CONSTRAINT role_module_permissions_role_module_unique
      UNIQUE (role_name, module_key);
  END IF;
END $$;

-- 2) Columnas esperadas por tickets y órdenes
ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS technician_user_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS collaborator_assigned_to uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS task_type_id uuid REFERENCES public.task_types(id),
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS equipment_count integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS equipment_type text,
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS accessories text,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS origin_ticket_id uuid,
  ADD COLUMN IF NOT EXISTS technician_user_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS collaborator_assigned_to uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS task_type_id uuid REFERENCES public.task_types(id),
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS equipment_count integer NOT NULL DEFAULT 1;

-- 3) Permisos para Referente / Referentes usando ambas claves: tickets y support_tickets
INSERT INTO public.role_module_permissions
(role_name, module_key, can_view, can_create, can_edit, can_delete, can_import, can_export)
VALUES
('Referente', 'dashboard', true, false, false, false, false, false),
('Referente', 'tickets', true, true, false, false, false, false),
('Referente', 'support_tickets', true, true, false, false, false, false),
('Referente', 'notifications', true, false, false, false, false, false),
('Referente', 'profile', true, false, true, false, false, false),
('Referentes', 'dashboard', true, false, false, false, false, false),
('Referentes', 'tickets', true, true, false, false, false, false),
('Referentes', 'support_tickets', true, true, false, false, false, false),
('Referentes', 'notifications', true, false, false, false, false, false),
('Referentes', 'profile', true, false, true, false, false, false)
ON CONFLICT (role_name, module_key)
DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete,
  can_import = EXCLUDED.can_import,
  can_export = EXCLUDED.can_export,
  updated_at = now();

-- 4) RLS mínima funcional para usuarios autenticados
ALTER TABLE public.role_module_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS role_module_permissions_select_policy ON public.role_module_permissions;
CREATE POLICY role_module_permissions_select_policy
ON public.role_module_permissions FOR SELECT TO authenticated USING (true);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS support_tickets_select_policy ON public.support_tickets;
DROP POLICY IF EXISTS support_tickets_insert_policy ON public.support_tickets;
DROP POLICY IF EXISTS support_tickets_update_policy ON public.support_tickets;
DROP POLICY IF EXISTS support_tickets_delete_policy ON public.support_tickets;

CREATE POLICY support_tickets_select_policy
ON public.support_tickets FOR SELECT TO authenticated USING (true);

CREATE POLICY support_tickets_insert_policy
ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY support_tickets_update_policy
ON public.support_tickets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY support_tickets_delete_policy
ON public.support_tickets FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role_name IN ('SuperAdmin', 'Admin')
  )
);

ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS service_orders_select_policy ON public.service_orders;
DROP POLICY IF EXISTS service_orders_insert_policy ON public.service_orders;
DROP POLICY IF EXISTS service_orders_update_policy ON public.service_orders;

CREATE POLICY service_orders_select_policy
ON public.service_orders FOR SELECT TO authenticated USING (true);

CREATE POLICY service_orders_insert_policy
ON public.service_orders FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY service_orders_update_policy
ON public.service_orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
