-- MedTuc Ticket Manager PWA · Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.tm_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('SuperAdmin','Administrador','Tecnicos','Usuarios')) default 'Usuarios',
  office text,
  phone text,
  status text not null default 'Activo'
);

create table if not exists public.tm_roles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null unique,
  users_permission text, orders_permission text, inventory_permission text,
  loans_permission text, tickets_permission text, reports_permission text
);

create table if not exists public.tm_service_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  number text, date date, client text, equipment text, serial text,
  fault text, technician text, status text default 'Pendiente',
  satmanager_payload jsonb default '{}'::jsonb
);

create table if not exists public.tm_inventory (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text, equipment text, brand text, model text, serial text, office text, status text
);

create table if not exists public.tm_loans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  asset text, borrower text, office text, date_out date, date_due date, status text
);

create table if not exists public.tm_support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  solicitante text not null,
  email text not null,
  whatsapp text,
  service_name text,
  equipment_count int default 1,
  tipo_equipo text,
  marca text,
  modelo text,
  accesorios text,
  falla text,
  foto_url text,
  bienes_json jsonb default '{}'::jsonb,
  responsable text,
  colaborador text,
  status text default 'Nuevo'
);

create table if not exists public.tm_notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  message text not null,
  module text,
  user_email text
);

alter table public.tm_users enable row level security;
alter table public.tm_roles enable row level security;
alter table public.tm_service_orders enable row level security;
alter table public.tm_inventory enable row level security;
alter table public.tm_loans enable row level security;
alter table public.tm_support_tickets enable row level security;
alter table public.tm_notifications enable row level security;

-- Recomendación: ajustar estas policies antes de producción.
create policy "tm_authenticated_select" on public.tm_users for select to authenticated using (true);
create policy "tm_authenticated_all" on public.tm_users for all to authenticated using (true) with check (true);
create policy "tm_roles_all" on public.tm_roles for all to authenticated using (true) with check (true);
create policy "tm_orders_all" on public.tm_service_orders for all to authenticated using (true) with check (true);
create policy "tm_inventory_all" on public.tm_inventory for all to authenticated using (true) with check (true);
create policy "tm_loans_all" on public.tm_loans for all to authenticated using (true) with check (true);
create policy "tm_tickets_all" on public.tm_support_tickets for all to authenticated using (true) with check (true);
create policy "tm_notifications_all" on public.tm_notifications for all to authenticated using (true) with check (true);

insert into public.tm_users(full_name,email,role,office,phone,status) values
('Ing. Fernando Gambino','fernando.m.gambino@gmail.com','SuperAdmin','Dirección de Informática','-','Activo')
on conflict (email) do nothing;
