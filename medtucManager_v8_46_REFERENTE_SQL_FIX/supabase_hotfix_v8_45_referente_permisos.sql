-- =========================================================
-- MEDTUC MANAGER v8.45 - HOTFIX REFERENTE / PERMISOS
-- Ejecutar completo en Supabase SQL Editor.
-- Corrige que el rol Referente/Referentes pueda ver y crear Soporte Ticket.
-- =========================================================

-- 1) Evita error ON CONFLICT en role_module_permissions
create unique index if not exists role_module_permissions_role_module_uidx
on public.role_module_permissions(role_name, module_key);

-- 2) Roles base Referente / Referentes
insert into public.roles(name, description, is_system)
values
  ('Referente', 'Usuario referente habilitado para crear y consultar tickets de soporte.', false),
  ('Referentes', 'Alias compatible del rol Referente.', false)
on conflict (name) do update set
  description = excluded.description,
  updated_at = now();

-- 3) Permisos legacy por código, para compatibilidad con loadPermissions()
insert into public.permissions(code, module, action, description)
values
  ('dashboard.view', 'dashboard', 'view', 'Ver Dashboard'),
  ('tickets.view', 'tickets', 'view', 'Ver Soporte Ticket'),
  ('tickets.create', 'tickets', 'create', 'Crear Soporte Ticket'),
  ('tickets.edit', 'tickets', 'edit', 'Editar Soporte Ticket'),
  ('notifications.view', 'notifications', 'view', 'Ver Notificaciones'),
  ('notifications.create', 'notifications', 'create', 'Crear Notificaciones'),
  ('profile.view', 'profile', 'view', 'Ver Mi Perfil'),
  ('profile.edit', 'profile', 'edit', 'Editar Mi Perfil')
on conflict (code) do update set
  module = excluded.module,
  action = excluded.action,
  description = excluded.description;

-- 4) Vincular permisos legacy a Referente y Referentes
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'dashboard.view',
  'tickets.view',
  'tickets.create',
  'tickets.edit',
  'notifications.view',
  'notifications.create',
  'profile.view',
  'profile.edit'
)
where r.name in ('Referente','Referentes')
on conflict (role_id, permission_id) do nothing;

-- 5) Permisos usados por el módulo visual Roles y Permisos
insert into public.role_module_permissions
  (role_name, module_key, can_view, can_create, can_edit, can_delete, can_import, can_export, updated_at)
values
  ('Referente',  'dashboard',     true,  false, false, false, false, false, now()),
  ('Referente',  'tickets',       true,  true,  true,  false, false, false, now()),
  ('Referente',  'notifications', true,  true,  false, false, false, false, now()),
  ('Referente',  'profile',       true,  false, true,  false, false, false, now()),
  ('Referentes', 'dashboard',     true,  false, false, false, false, false, now()),
  ('Referentes', 'tickets',       true,  true,  true,  false, false, false, now()),
  ('Referentes', 'notifications', true,  true,  false, false, false, false, now()),
  ('Referentes', 'profile',       true,  false, true,  false, false, false, now())
on conflict (role_name, module_key) do update set
  can_view   = excluded.can_view,
  can_create = excluded.can_create,
  can_edit   = excluded.can_edit,
  can_delete = excluded.can_delete,
  can_import = excluded.can_import,
  can_export = excluded.can_export,
  updated_at = now();

-- 6) Vista rápida de control
select role_name, module_key, can_view, can_create, can_edit, can_delete, can_import, can_export
from public.role_module_permissions
where role_name in ('Referente','Referentes')
order by role_name, module_key;
