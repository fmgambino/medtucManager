-- HOTFIX v8.43 - Compatibilidad Soporte Ticket -> Orden de Servicio
-- Ejecutar en Supabase SQL Editor antes de probar la PWA.

alter table public.support_tickets
  add column if not exists technician_user_id uuid references auth.users(id);

-- Índices recomendados para asignación y consultas.
create index if not exists idx_support_tickets_technician_user_id on public.support_tickets(technician_user_id);
create index if not exists idx_service_orders_assigned_to on public.service_orders(assigned_to);
create index if not exists idx_service_orders_technician_user_id on public.service_orders(technician_user_id);
create index if not exists idx_service_orders_collaborator_assigned_to on public.service_orders(collaborator_assigned_to);
create index if not exists idx_technician_exceptions_range on public.technician_exceptions(technician_id,start_at,end_at) where is_active = true;

-- Refresca PostgREST/schema cache.
notify pgrst, 'reload schema';
