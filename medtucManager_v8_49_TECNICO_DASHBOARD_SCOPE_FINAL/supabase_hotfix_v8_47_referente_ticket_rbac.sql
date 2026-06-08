-- HOTFIX v8.47 - Referente: permisos, creación de tickets y RBAC por módulo
-- Ejecutar completo en Supabase SQL Editor.

-- 1) Evita duplicados en permisos por módulo para que upsert funcione.
ALTER TABLE public.role_module_permissions
ADD CONSTRAINT IF NOT EXISTS role_module_permissions_role_module_unique UNIQUE (role_name, module_key);

-- 2) Asegura roles Referente / Referentes.
INSERT INTO public.roles(name, description, is_system)
VALUES
  ('Referente','Perfil referente institucional: crea y consulta tickets propios', false),
  ('Referentes','Alias plural del perfil referente institucional', false)
ON CONFLICT (name) DO UPDATE SET updated_at = now();

-- 3) Permisos mínimos operativos para Referente y Referentes.
INSERT INTO public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export,updated_at)
VALUES
  ('Referente','dashboard',true,false,false,false,false,false,now()),
  ('Referente','tickets',true,true,false,false,false,false,now()),
  ('Referente','notifications',true,false,false,false,false,false,now()),
  ('Referente','profile',true,false,true,false,false,false,now()),
  ('Referentes','dashboard',true,false,false,false,false,false,now()),
  ('Referentes','tickets',true,true,false,false,false,false,now()),
  ('Referentes','notifications',true,false,false,false,false,false,now()),
  ('Referentes','profile',true,false,true,false,false,false,now())
ON CONFLICT (role_name,module_key) DO UPDATE SET
  can_view=EXCLUDED.can_view,
  can_create=EXCLUDED.can_create,
  can_edit=EXCLUDED.can_edit,
  can_delete=EXCLUDED.can_delete,
  can_import=EXCLUDED.can_import,
  can_export=EXCLUDED.can_export,
  updated_at=now();

-- 4) Permisos legacy opcionales para compatibilidad con pantallas anteriores.
INSERT INTO public.permissions(code,module,action,description)
VALUES
  ('tickets.view','tickets','view','Ver Soporte Ticket'),
  ('tickets.create','tickets','create','Crear Soporte Ticket'),
  ('dashboard.view','dashboard','view','Ver Dashboard'),
  ('notifications.view','notifications','view','Ver Notificaciones'),
  ('profile.view','profile','view','Ver Mi Perfil'),
  ('profile.edit','profile','edit','Editar Mi Perfil')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.code IN ('tickets.view','tickets.create','dashboard.view','notifications.view','profile.view','profile.edit')
WHERE r.name IN ('Referente','Referentes')
ON CONFLICT DO NOTHING;

-- 5) RPC opcional para conteo de notificaciones no leídas.
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::integer
  FROM public.notifications n
  WHERE n.is_read = false
    AND (
      n.target_user = auth.uid()
      OR n.target_user IS NULL
      OR n.target_role IN (SELECT p.role_name FROM public.profiles p WHERE p.id = auth.uid())
    );
$$;
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;
