-- MEDTUC Ticket Manager v8.38 FINAL
-- Hotfix de dashboard, popups y guardado robusto de excepciones.
-- Compatible con esquema v8.37. No elimina datos.

create extension if not exists pgcrypto;

-- Asegura permisos de lectura/escritura requeridos por dashboard y excepciones.
grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.service_orders, public.service_order_statuses, public.support_tickets, public.inventory_items, public.notifications, public.task_types, public.technician_exceptions to authenticated;
grant insert, update, delete on public.technician_exceptions, public.task_types to authenticated;

-- Asegura columnas esperadas en excepciones.
alter table if exists public.technician_exceptions
  alter column type set default 'Otra excepción',
  alter column is_active set default true;

-- Diagnóstico final.
select 'MEDTUC_V8_38_READY' as status, now() as executed_at;
