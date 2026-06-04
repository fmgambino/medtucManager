-- MEDTUC Ticket Manager v8.4 - Supabase update + Realtime + SATMANAGER compatibility
-- Ejecutar después del schema principal v7/v8.

create extension if not exists pgcrypto;

-- Campos requeridos para importar SATMANAGER respetando fecha original e indicando fecha de importación.
alter table public.service_orders add column if not exists imported_at timestamptz;
alter table public.service_orders add column if not exists satmanager_table text;
alter table public.service_orders add column if not exists satmanager_raw jsonb;

-- Staging compatible con nombres SATMANAGER / Microsoft Access.
-- Permite conservar el respaldo con nombres similares y mapear luego a service_orders.
create table if not exists public.satmanager_reparaciones (
  id uuid primary key default gen_random_uuid(),
  orden text,
  fecha text,
  tecnico text,
  cliente text,
  direccion text,
  telefono text,
  numero_de_serie text,
  tipo_de_equipo text,
  marca text,
  modelo text,
  accesorios text,
  falla text,
  informe text,
  estado text,
  fecha_terminada text,
  fecha_entregada text,
  raw jsonb,
  imported_at timestamptz not null default now()
);

create table if not exists public.satmanager_clientes (
  id uuid primary key default gen_random_uuid(),
  cliente text,
  direccion text,
  telefono text,
  email text,
  raw jsonb,
  imported_at timestamptz not null default now()
);

create table if not exists public.satmanager_equipos (
  id uuid primary key default gen_random_uuid(),
  numero_de_serie text,
  tipo_de_equipo text,
  marca text,
  modelo text,
  cliente text,
  raw jsonb,
  imported_at timestamptz not null default now()
);

-- Función auxiliar para convertir fechas dd/mm/yy o dd/mm/yyyy.
create or replace function public.tm_parse_sat_date(value text)
returns timestamptz
language plpgsql
as $$
declare
  d text;
  p text[];
  yy int;
begin
  if value is null or btrim(value) = '' then return null; end if;
  d := replace(split_part(value, ' ', 1), '-', '/');
  p := string_to_array(d, '/');
  if array_length(p,1) = 3 then
    yy := p[3]::int;
    if yy < 100 then yy := 2000 + yy; end if;
    return make_timestamptz(yy, p[2]::int, p[1]::int, 0, 0, 0, current_setting('TIMEZONE'));
  end if;
  return value::timestamptz;
exception when others then
  return null;
end;
$$;

-- Importa desde staging satmanager_reparaciones a service_orders respetando fecha original.
create or replace function public.import_satmanager_reparaciones()
returns integer
language plpgsql
security definer
as $$
declare
  inserted_count integer;
begin
  insert into public.service_orders (
    satmanager_order, received_at, imported_at, requester_name, office, address, requester_phone,
    equipment_type, brand, model, serial_number, accessories, fault_description, technical_report,
    source, satmanager_table, satmanager_raw
  )
  select
    r.orden,
    coalesce(public.tm_parse_sat_date(r.fecha), now()),
    r.imported_at,
    r.cliente,
    r.cliente,
    r.direccion,
    r.telefono,
    r.tipo_de_equipo,
    r.marca,
    r.modelo,
    r.numero_de_serie,
    r.accesorios,
    coalesce(nullif(r.falla,''),'Importado desde SATMANAGER'),
    r.informe,
    'SATMANAGER',
    'satmanager_reparaciones',
    r.raw
  from public.satmanager_reparaciones r
  where not exists (
    select 1 from public.service_orders so
    where so.source = 'SATMANAGER'
      and coalesce(so.satmanager_order,'') = coalesce(r.orden,'')
      and coalesce(so.serial_number,'') = coalesce(r.numero_de_serie,'')
  );
  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

-- Realtime: agregar tablas a publicación.
do $$
declare t text;
begin
  foreach t in array array[
    'roles','permissions','role_permissions','profiles','app_settings','inventory_items','inventory_movements',
    'service_order_statuses','service_orders','service_order_items','service_order_notes','service_order_history',
    'support_tickets','loans','notifications','satmanager_reparaciones','satmanager_clientes','satmanager_equipos'
  ] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- Replica identity recomendada para updates/deletes realtime.
alter table public.profiles replica identity full;
alter table public.roles replica identity full;
alter table public.inventory_items replica identity full;
alter table public.service_orders replica identity full;
alter table public.support_tickets replica identity full;
alter table public.loans replica identity full;
alter table public.notifications replica identity full;

-- Policies simples para desarrollo institucional autenticado.
alter table public.satmanager_reparaciones enable row level security;
alter table public.satmanager_clientes enable row level security;
alter table public.satmanager_equipos enable row level security;

do $$
begin
  create policy "satmanager authenticated all" on public.satmanager_reparaciones for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$
begin
  create policy "satmanager clientes authenticated all" on public.satmanager_clientes for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$
begin
  create policy "satmanager equipos authenticated all" on public.satmanager_equipos for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;

-- Perfil SuperAdmin helper.
insert into public.roles(name, description, is_system) values
('SuperAdmin','Acceso institucional completo',true),
('Admin','Administración operativa',true),
('Técnicos','Atención técnica y seguimiento de órdenes/tickets',true),
('Usuarios','Oficinas y reparticiones solicitantes',true)
on conflict(name) do update set description=excluded.description, is_system=true, updated_at=now();

-- =========================================================
-- v8.5 Realtime y soporte importación SATMANAGER
-- Ejecutar luego del schema principal si ya existe la base.
-- =========================================================

alter table if exists public.service_orders replica identity full;
alter table if exists public.support_tickets replica identity full;
alter table if exists public.notifications replica identity full;
alter table if exists public.inventory_items replica identity full;
alter table if exists public.loans replica identity full;
alter table if exists public.profiles replica identity full;
alter table if exists public.app_settings replica identity full;

do $$
begin
  begin alter publication supabase_realtime add table public.service_orders; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.support_tickets; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.notifications; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.inventory_items; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.loans; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.profiles; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.app_settings; exception when duplicate_object then null; end;
end $$;
