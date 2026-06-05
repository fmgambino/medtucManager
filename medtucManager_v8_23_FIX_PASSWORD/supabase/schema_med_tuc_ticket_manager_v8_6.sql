-- Ticket Manager v8.6 - Migración incremental Supabase
-- Ejecutar después del schema base v8.5.

alter table public.service_orders add column if not exists technician_name text;
alter table public.service_orders add column if not exists satmanager_cliente_codigo text;
alter table public.service_orders add column if not exists satmanager_equipo_codigo text;
alter table public.service_orders add column if not exists satmanager_tecnico_codigo text;
alter table public.service_orders add column if not exists original_received_at timestamp with time zone;
alter table public.service_orders add column if not exists original_finished_at timestamp with time zone;
alter table public.service_orders add column if not exists original_delivered_at timestamp with time zone;

-- Realtime
do $$
declare t text;
begin
  foreach t in array array['profiles','roles','permissions','role_permissions','inventory_items','inventory_movements','service_orders','service_order_history','support_tickets','loans','notifications','app_settings'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then
      null;
    end;
  end loop;
end $$;

-- Índices útiles para importación SATMANAGER
create index if not exists idx_service_orders_sat_order on public.service_orders(satmanager_order);
create index if not exists idx_service_orders_technician_name on public.service_orders(technician_name);
create index if not exists idx_service_orders_office on public.service_orders(office);
create index if not exists idx_notifications_unread on public.notifications(is_read, created_at desc);
