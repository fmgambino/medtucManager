-- =========================================================
-- Ticket Manager - Política para formulario público /soporteticket
-- Ejecutar luego de crear la tabla support_tickets.
-- Permite INSERT anónimo desde la anon key. Ajustar según políticas institucionales.
-- =========================================================

alter table public.support_tickets enable row level security;

drop policy if exists "public_insert_support_tickets" on public.support_tickets;
create policy "public_insert_support_tickets"
on public.support_tickets
for insert
to anon
with check (true);

-- Lectura/gestión quedan a cargo de las políticas administrativas existentes.
