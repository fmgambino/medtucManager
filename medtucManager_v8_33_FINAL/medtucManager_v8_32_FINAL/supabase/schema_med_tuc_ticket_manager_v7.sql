-- TICKET MANAGER v7 - Supabase SQL completo
-- Ejecutar en Supabase SQL Editor. Compatible con perfiles: SuperAdmin, Admin, Técnicos, Usuarios.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name in ('SuperAdmin','Admin','Técnicos','Usuarios')),
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(role_id, permission_id)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role_name text not null default 'Usuarios' check (role_name in ('SuperAdmin','Admin','Técnicos','Usuarios')),
  office text,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id int primary key default 1 check (id = 1),
  institution_name text not null default 'Ministerio de Educación Tucumán',
  institution_area text not null default 'Dirección de Informática - Área Soporte Técnico',
  logo_dark_url text not null default 'https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/MINISTERIO-DE-EDUCACION-blanco.png',
  logo_light_url text not null default 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4m5sI9rXqK72J4Ix5rqSA4U4AH3eDjmuJWQ&s',
  primary_color text not null default '#7c5cff',
  secondary_color text not null default '#19d3da',
  accent_color text not null default '#22c55e',
  background_color text not null default '#08111f',
  card_color text not null default '#101b31',
  telegram_enabled boolean not null default false,
  telegram_bot_token text,
  telegram_chat_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  category text default 'Insumo',
  brand text,
  model text,
  serial_number text,
  barcode text,
  stock integer not null default 0 check (stock >= 0),
  min_stock integer not null default 0,
  location text,
  status text not null default 'Disponible',
  condition text default 'Nuevo',
  notes text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_order_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#64748b',
  sort_order integer not null default 0,
  is_final boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  satmanager_order text,
  origin_ticket_id uuid,
  status_id uuid references public.service_order_statuses(id),
  assigned_to uuid references auth.users(id),
  attended_by uuid references auth.users(id),
  attended_at timestamptz,
  received_at timestamptz not null default now(),
  finished_at timestamptz,
  delivered_at timestamptz,
  requester_name text,
  requester_email text,
  requester_phone text,
  office text,
  address text,
  equipment_type text,
  brand text,
  model text,
  serial_number text,
  accessories text,
  fault_description text not null,
  technical_report text,
  diagnosis text,
  solution text,
  observations text,
  priority text not null default 'Media' check (priority in ('Baja','Media','Alta','Urgente')),
  source text not null default 'PWA',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references public.inventory_items(id) on delete set null,
  service_order_id uuid references public.service_orders(id) on delete set null,
  movement_type text not null check (movement_type in ('entrada','salida','ajuste','uso_orden','devolucion')),
  quantity integer not null check (quantity > 0),
  previous_stock integer,
  new_stock integer,
  reason text,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.service_order_items (
  id uuid primary key default gen_random_uuid(),
  service_order_id uuid not null references public.service_orders(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id),
  quantity integer not null default 1 check (quantity > 0),
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.service_order_notes (
  id uuid primary key default gen_random_uuid(),
  service_order_id uuid not null references public.service_orders(id) on delete cascade,
  note_type text not null default 'interna' check (note_type in ('interna','compra','informe','ia')),
  title text not null,
  body text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.service_order_history (
  id uuid primary key default gen_random_uuid(),
  service_order_id uuid not null references public.service_orders(id) on delete cascade,
  action text not null,
  previous_value text,
  new_value text,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null default ('TK-' || to_char(now(),'YYYY') || '-' || upper(substr(gen_random_uuid()::text,1,8))) unique,
  requester_name text not null,
  requester_email text,
  requester_phone text,
  office text,
  area text,
  subject text not null,
  incidence_type text not null,
  description text not null,
  priority text not null default 'Media',
  status text not null default 'Pendiente',
  assigned_to uuid references auth.users(id),
  attended_by uuid references auth.users(id),
  attended_at timestamptz,
  service_order_id uuid references public.service_orders(id),
  public_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  requester_email text,
  office text,
  item_id uuid references public.inventory_items(id),
  item_description text,
  quantity integer not null default 1,
  requested_at timestamptz not null default now(),
  start_at timestamptz,
  due_at timestamptz,
  returned_at timestamptz,
  status text not null default 'Pendiente',
  observations text,
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  module text,
  entity_id uuid,
  target_role text check (target_role is null or target_role in ('SuperAdmin','Admin','Técnicos','Usuarios')),
  target_user uuid references auth.users(id),
  is_read boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Funciones de seguridad
create or replace function public.current_role_name()
returns text language sql security definer set search_path=public as $$
  select role_name from public.profiles where id = auth.uid() and is_active = true limit 1;
$$;

create or replace function public.is_superadmin()
returns boolean language sql security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role_name = 'SuperAdmin' and is_active = true);
$$;

create or replace function public.is_admin_or_superadmin()
returns boolean language sql security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role_name in ('SuperAdmin','Admin') and is_active = true);
$$;

create or replace function public.ensure_current_user_profile()
returns void language plpgsql security definer set search_path=public as $$
declare u auth.users%rowtype;
begin
  select * into u from auth.users where id = auth.uid();
  if u.id is null then return; end if;
  insert into public.profiles(id,email,full_name,role_name,is_active)
  values(u.id, coalesce(u.email,''), coalesce(u.raw_user_meta_data->>'full_name', split_part(coalesce(u.email,''),'@',1)), coalesce(u.raw_user_meta_data->>'role_name','Usuarios'), true)
  on conflict(id) do nothing;
end; $$;

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,email,full_name,role_name,is_active)
  values(new.id, coalesce(new.email,''), coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,''),'@',1)), coalesce(new.raw_user_meta_data->>'role_name','Usuarios'), true)
  on conflict(id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created_ticket_manager on auth.users;
create trigger on_auth_user_created_ticket_manager after insert on auth.users for each row execute function public.create_profile_for_new_user();

-- Descontar stock al asociar insumos a una orden
create or replace function public.consume_inventory_for_order()
returns trigger language plpgsql security definer set search_path=public as $$
declare current_stock int;
begin
  select stock into current_stock from public.inventory_items where id = new.inventory_item_id for update;
  if current_stock is null then raise exception 'Insumo no encontrado'; end if;
  if current_stock < new.quantity then raise exception 'Stock insuficiente'; end if;
  update public.inventory_items set stock = stock - new.quantity, updated_at = now() where id = new.inventory_item_id;
  insert into public.inventory_movements(item_id, service_order_id, movement_type, quantity, previous_stock, new_stock, reason, user_id)
  values(new.inventory_item_id, new.service_order_id, 'uso_orden', new.quantity, current_stock, current_stock - new.quantity, 'Uso en orden de servicio', new.created_by);
  insert into public.notifications(title, body, module, entity_id, target_role, created_by)
  values('Insumo consumido en orden', 'Se descontó stock por uso en una orden de servicio.', 'inventory', new.inventory_item_id, 'SuperAdmin', new.created_by);
  return new;
end; $$;

drop trigger if exists trg_consume_inventory_for_order on public.service_order_items;
create trigger trg_consume_inventory_for_order after insert on public.service_order_items for each row execute function public.consume_inventory_for_order();

-- Notificar cambios de estado de orden
create or replace function public.notify_service_order_status_change()
returns trigger language plpgsql security definer set search_path=public as $$
declare old_status text; new_status text;
begin
  if tg_op = 'UPDATE' and old.status_id is distinct from new.status_id then
    select name into old_status from public.service_order_statuses where id = old.status_id;
    select name into new_status from public.service_order_statuses where id = new.status_id;
    insert into public.service_order_history(service_order_id, action, previous_value, new_value, user_id)
    values(new.id, 'Cambio de estado', old_status, new_status, new.updated_by);
    insert into public.notifications(title, body, module, entity_id, target_role, created_by)
    values('Cambio de estado de orden', 'Orden #' || new.order_number || ': ' || coalesce(old_status,'Sin estado') || ' → ' || coalesce(new_status,'Sin estado'), 'orders', new.id, 'SuperAdmin', new.updated_by);
  end if;
  return new;
end; $$;

drop trigger if exists trg_notify_service_order_status_change on public.service_orders;
create trigger trg_notify_service_order_status_change after update on public.service_orders for each row execute function public.notify_service_order_status_change();

-- RLS
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.service_order_statuses enable row level security;
alter table public.service_orders enable row level security;
alter table public.service_order_items enable row level security;
alter table public.service_order_notes enable row level security;
alter table public.service_order_history enable row level security;
alter table public.support_tickets enable row level security;
alter table public.loans enable row level security;
alter table public.notifications enable row level security;

-- Borrar políticas anteriores del proyecto para evitar conflictos
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname='public' AND tablename IN ('roles','permissions','role_permissions','profiles','app_settings','inventory_items','inventory_movements','service_order_statuses','service_orders','service_order_items','service_order_notes','service_order_history','support_tickets','loans','notifications') LOOP
    EXECUTE format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

create policy roles_read on public.roles for select to authenticated using (true);
create policy roles_manage on public.roles for all to authenticated using (public.is_superadmin()) with check (public.is_superadmin());
create policy permissions_read on public.permissions for select to authenticated using (true);
create policy permissions_manage on public.permissions for all to authenticated using (public.is_superadmin()) with check (public.is_superadmin());
create policy role_permissions_read on public.role_permissions for select to authenticated using (true);
create policy role_permissions_manage on public.role_permissions for all to authenticated using (public.is_superadmin()) with check (public.is_superadmin());

create policy profiles_read on public.profiles for select to authenticated using (public.is_admin_or_superadmin() or id = auth.uid());
create policy profiles_insert on public.profiles for insert to authenticated with check (public.is_admin_or_superadmin() or id = auth.uid());
create policy profiles_update on public.profiles for update to authenticated using (public.is_admin_or_superadmin() or id = auth.uid()) with check (public.is_admin_or_superadmin() or id = auth.uid());
create policy profiles_delete on public.profiles for delete to authenticated using (public.is_superadmin());

create policy settings_read on public.app_settings for select to authenticated using (true);
create policy settings_manage on public.app_settings for all to authenticated using (public.is_superadmin() or public.current_role_name()='Admin') with check (public.is_superadmin() or public.current_role_name()='Admin');

create policy inv_read on public.inventory_items for select to authenticated using (true);
create policy inv_manage on public.inventory_items for all to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos')) with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));
create policy invmov_read on public.inventory_movements for select to authenticated using (true);
create policy invmov_manage on public.inventory_movements for all to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos')) with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));

create policy statuses_read on public.service_order_statuses for select to authenticated using (true);
create policy statuses_manage on public.service_order_statuses for all to authenticated using (public.current_role_name() in ('SuperAdmin','Admin')) with check (public.current_role_name() in ('SuperAdmin','Admin'));
create policy orders_read on public.service_orders for select to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos') or created_by = auth.uid() or assigned_to = auth.uid());
create policy orders_manage on public.service_orders for all to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos')) with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));
create policy order_items_manage on public.service_order_items for all to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos')) with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));
create policy order_notes_manage on public.service_order_notes for all to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos')) with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));
create policy order_history_read on public.service_order_history for select to authenticated using (true);
create policy order_history_insert on public.service_order_history for insert to authenticated with check (true);

create policy tickets_public_insert on public.support_tickets for insert to anon, authenticated with check (true);
create policy tickets_read on public.support_tickets for select to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos') or requester_email = auth.email());
create policy tickets_manage on public.support_tickets for update to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos')) with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));
create policy tickets_delete on public.support_tickets for delete to authenticated using (public.current_role_name() in ('SuperAdmin','Admin'));

create policy loans_read on public.loans for select to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos') or requester_email = auth.email());
create policy loans_manage on public.loans for all to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos')) with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));

create policy notifications_public_insert on public.notifications for insert to anon, authenticated with check (true);
create policy notifications_read on public.notifications for select to authenticated using (target_user is null or target_user = auth.uid() or target_role is null or target_role = public.current_role_name() or public.is_superadmin());
create policy notifications_manage on public.notifications for all to authenticated using (public.current_role_name() in ('SuperAdmin','Admin','Técnicos')) with check (public.current_role_name() in ('SuperAdmin','Admin','Técnicos'));

-- Seeds institucionales
insert into public.roles(name,description,is_system) values
('SuperAdmin','Acceso institucional completo, configuración, permisos, auditoría e integración Supabase.',true),
('Admin','Administración operativa de módulos institucionales.',true),
('Técnicos','Atención técnica, cambios de estado, informes, uso de insumos y seguimiento.',true),
('Usuarios','Oficinas y reparticiones: carga y consulta de tickets propios.',true)
on conflict(name) do update set description=excluded.description,is_system=excluded.is_system,updated_at=now();

insert into public.permissions(code,module,action,description) values
('dashboard.read','dashboard','read','Ver dashboard'),
('users.manage','users','manage','Gestionar usuarios'),
('roles.manage','roles','manage','Gestionar roles y permisos'),
('orders.read','orders','read','Ver órdenes'),
('orders.manage','orders','manage','Gestionar órdenes'),
('orders.manage_assigned','orders','manage_assigned','Gestionar órdenes asignadas'),
('inventory.read','inventory','read','Ver inventario'),
('inventory.manage','inventory','manage','Gestionar inventario'),
('inventory.consume','inventory','consume','Consumir insumos en órdenes'),
('loans.manage','loans','manage','Gestionar préstamos'),
('tickets.create','tickets','create','Crear tickets'),
('tickets.read','tickets','read','Ver tickets'),
('tickets.read_own','tickets','read_own','Ver tickets propios'),
('tickets.manage_assigned','tickets','manage_assigned','Gestionar tickets asignados'),
('notifications.read','notifications','read','Ver notificaciones'),
('notifications.manage','notifications','manage','Gestionar notificaciones'),
('profile.manage','profile','manage','Editar perfil'),
('settings.manage','settings','manage','Gestionar configuración')
on conflict(code) do update set module=excluded.module, action=excluded.action, description=excluded.description;

insert into public.role_permissions(role_id, permission_id)
select r.id,p.id from public.roles r cross join public.permissions p where r.name='SuperAdmin'
on conflict do nothing;
insert into public.role_permissions(role_id, permission_id)
select r.id,p.id from public.roles r join public.permissions p on p.code in ('dashboard.read','users.manage','orders.read','orders.manage','inventory.read','inventory.manage','loans.manage','tickets.read','notifications.read','notifications.manage','profile.manage','settings.manage') where r.name='Admin'
on conflict do nothing;
insert into public.role_permissions(role_id, permission_id)
select r.id,p.id from public.roles r join public.permissions p on p.code in ('dashboard.read','orders.read','orders.manage_assigned','inventory.read','inventory.consume','tickets.read','tickets.manage_assigned','notifications.read','profile.manage') where r.name='Técnicos'
on conflict do nothing;
insert into public.role_permissions(role_id, permission_id)
select r.id,p.id from public.roles r join public.permissions p on p.code in ('dashboard.read','tickets.create','tickets.read_own','notifications.read','profile.manage') where r.name='Usuarios'
on conflict do nothing;

insert into public.service_order_statuses(name,color,sort_order,is_final) values
('Pendiente','#f59e0b',1,false),('Asignada','#38bdf8',2,false),('En proceso','#7c5cff',3,false),('Esperando Repuesto','#fb7185',4,false),('Esperando Compra','#f97316',5,false),('Terminada','#22c55e',6,false),('Lista p/Retirar','#14b8a6',7,false),('Entregada','#64748b',8,true),('Cancelada','#ef4444',9,true)
on conflict(name) do update set color=excluded.color,sort_order=excluded.sort_order,is_final=excluded.is_final,updated_at=now();

insert into public.app_settings(id) values(1) on conflict(id) do nothing;

-- Si el usuario auth ya existe, lo deja como SuperAdmin activo.
do $$
declare uid uuid;
begin
  select id into uid from auth.users where email = 'fernando.m.gambino@gmail.com' limit 1;
  if uid is not null then
    insert into public.profiles(id,email,full_name,role_name,office,is_active)
    values(uid,'fernando.m.gambino@gmail.com','Ing. Fernando Gambino','SuperAdmin','Dirección de Informática',true)
    on conflict(id) do update set role_name='SuperAdmin', full_name='Ing. Fernando Gambino', is_active=true, updated_at=now();
  end if;
end $$;

-- Triggers updated_at
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['roles','profiles','inventory_items','service_order_statuses','service_orders','support_tickets','loans'] LOOP
    EXECUTE format('drop trigger if exists trg_%s_updated_at on public.%I', t, t);
    EXECUTE format('create trigger trg_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  END LOOP;
END $$;
