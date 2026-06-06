-- MEDTUC Ticket Manager v8.39 FINAL
-- Hotfix compatible con esquema v8.38/v8.37.
-- No requiere cambios destructivos de base de datos.
-- Mantiene tablas existentes: profiles, service_orders, support_tickets, inventory_items, offices,
-- notifications, role_module_permissions, task_types, technician_exceptions y technician_work_schedules.

-- Asegura permisos de lectura/escritura usados por la PWA.
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated;
