-- =========================================================
-- Ticket Manager MEDTUC - actualización v8.7
-- Técnicos, oficinas/reparticiones, SATMANAGER y reportes
-- Ejecutar después del schema v8.6 existente.
-- =========================================================

create extension if not exists pgcrypto;

-- Oficinas / Reparticiones / Secretarías detectadas desde SATMANAGER o cargadas manualmente
create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  address text,
  phone text,
  email text,
  source text not null default 'PWA',
  is_active boolean not null default true,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profesionales técnicos históricos de SATMANAGER o cargados manualmente.
-- Para login real deben existir también como usuarios Auth y profiles.role_name='Técnicos'.
create table if not exists public.satmanager_tecnicos (
  id uuid primary key default gen_random_uuid(),
  codigo text,
  nombre text not null unique,
  email text,
  phone text,
  source text not null default 'SATMANAGER',
  is_active boolean not null default true,
  raw jsonb,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_orders add column if not exists technician_name text;
alter table public.service_orders add column if not exists technician_user_id uuid references auth.users(id);
alter table public.service_orders add column if not exists professional_technician text;
alter table public.service_orders add column if not exists office_id uuid references public.offices(id);
alter table public.service_orders add column if not exists satmanager_cliente_codigo text;
alter table public.service_orders add column if not exists satmanager_equipo_codigo text;
alter table public.service_orders add column if not exists satmanager_tecnico_codigo text;
alter table public.service_orders add column if not exists original_received_at timestamptz;
alter table public.service_orders add column if not exists original_finished_at timestamptz;
alter table public.service_orders add column if not exists original_delivered_at timestamptz;

-- Completar técnico histórico desde observations importadas anteriormente
update public.service_orders
set technician_name = nullif(trim((regexp_match(observations, 'Técnico SATMANAGER:\s*([^|]+)'))[1]), '')
where technician_name is null
  and observations ~* 'Técnico SATMANAGER:';

-- Poblar oficinas desde órdenes existentes
insert into public.offices (name, address, phone, source)
select distinct on (coalesce(nullif(office,''), nullif(requester_name,'')))
  coalesce(nullif(office,''), nullif(requester_name,'')) as name,
  max(address) as address,
  max(requester_phone) as phone,
  'SATMANAGER' as source
from public.service_orders
where coalesce(nullif(office,''), nullif(requester_name,'')) is not null
group by coalesce(nullif(office,''), nullif(requester_name,''))
on conflict (name) do update set
  address = coalesce(public.offices.address, excluded.address),
  phone = coalesce(public.offices.phone, excluded.phone),
  updated_at = now();

-- Poblar técnicos históricos desde órdenes existentes
insert into public.satmanager_tecnicos (codigo, nombre, source)
select distinct on (technician_name)
  max(satmanager_tecnico_codigo) as codigo,
  technician_name as nombre,
  'SATMANAGER' as source
from public.service_orders
where nullif(technician_name,'') is not null
group by technician_name
on conflict (nombre) do update set
  codigo = coalesce(public.satmanager_tecnicos.codigo, excluded.codigo),
  updated_at = now();

-- Perfiles permitidos únicamente
insert into public.roles (name, description, is_system) values
('SuperAdmin','Acceso institucional completo.', true),
('Admin','Administración operativa y seguimiento.', true),
('Técnicos','Atención técnica de órdenes y tickets asignados.', true),
('Usuarios','Oficinas, reparticiones y secretarías solicitantes.', true)
on conflict (name) do update set description = excluded.description, is_system = true, updated_at = now();

-- Realtime (ignora si la tabla ya estaba publicada)
do $$
begin
  begin alter publication supabase_realtime add table public.service_orders; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.notifications; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.support_tickets; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.inventory_items; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.offices; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.satmanager_tecnicos; exception when duplicate_object then null; end;
end $$;

-- RLS permisivo para etapa institucional interna autenticada
alter table public.offices enable row level security;
alter table public.satmanager_tecnicos enable row level security;

drop policy if exists "offices_authenticated_all" on public.offices;
create policy "offices_authenticated_all" on public.offices for all to authenticated using (true) with check (true);

drop policy if exists "satmanager_tecnicos_authenticated_all" on public.satmanager_tecnicos;
create policy "satmanager_tecnicos_authenticated_all" on public.satmanager_tecnicos for all to authenticated using (true) with check (true);

-- Nota: para crear cuentas reales de técnicos con contraseña tecnico123456 usar Authentication > Users
-- o una Edge Function con service_role. Luego asignar profiles.role_name='Técnicos'.
