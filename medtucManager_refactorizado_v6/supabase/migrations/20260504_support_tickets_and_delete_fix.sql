-- v30 - Soporte Ticket + corrección de eliminación de usuarios
-- Ejecutar en Supabase SQL Editor antes de publicar los archivos del proyecto.

create table if not exists public.support_ticket_statuses (
  code text primary key,
  name text not null,
  color text not null default '#64748b',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into public.support_ticket_statuses(code, name, color, sort_order) values
('pendiente','Pendiente','#f59e0b',10),
('aprobado','Aprobado','#22c55e',20),
('rechazado','Rechazado','#ef4444',30),
('en_proceso','En proceso','#3b82f6',40),
('resolviendo','Resolviendo','#8b5cf6',50),
('resuelto','Resuelto','#14b8a6',60)
on conflict (code) do update set name=excluded.name, color=excluded.color, sort_order=excluded.sort_order, updated_at=now();

create table if not exists public.support_ticket_incidents (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#64748b',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into public.support_ticket_incidents(name, color, sort_order) values
('Falla técnica','#ef4444',10),
('Falta de insumo','#f59e0b',20),
('Mantenimiento preventivo','#3b82f6',30),
('Software / configuración','#8b5cf6',40)
on conflict (name) do update set color=excluded.color, sort_order=excluded.sort_order, updated_at=now();

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  title text not null,
  description text,
  room text not null check (room in ('Laboratorio de Robótica','Sala N°1 - Planta Baja (PB)','Sala N°2 - Primer Piso')),
  asset_id uuid references public.inventory_assets(id) on delete set null,
  asset_label text,
  incident_type text,
  status text not null default 'pendiente' references public.support_ticket_statuses(code),
  priority text default 'Normal',
  history text,
  requester_id uuid references public.profiles(id) on delete set null,
  requester_name text,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_support_tickets_status on public.support_tickets(status);
create index if not exists idx_support_tickets_asset_id on public.support_tickets(asset_id);
create index if not exists idx_support_tickets_created_at on public.support_tickets(created_at desc);

create or replace view public.support_tickets_frontend_view as
select
  t.*,
  coalesce(t.asset_label, a.asset_code || ' · ' || ci.name) as asset_label_view,
  p.full_name as requester_profile_name,
  s.name as status_name,
  s.color as status_color
from public.support_tickets t
left join public.inventory_assets a on a.id = t.asset_id
left join public.inventory_catalog_items ci on ci.id = a.catalog_item_id
left join public.profiles p on p.id = t.requester_id
left join public.support_ticket_statuses s on s.code = t.status;

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

insert into public.permissions(code, name, module) values
('support.read','Ver tickets de soporte','Soporte Ticket'),
('support.create','Crear tickets de soporte','Soporte Ticket'),
('support.manage','Gestionar tickets de soporte','Soporte Ticket'),
('support.status.manage','Gestionar incidencias/estados de soporte','Soporte Ticket'),
('support.delete','Eliminar tickets de soporte','Soporte Ticket')
on conflict (code) do update set name=excluded.name, module=excluded.module;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r cross join public.permissions p
where r.code = 'administrator' and p.code in ('support.read','support.create','support.manage','support.status.manage','support.delete')
on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r cross join public.permissions p
where r.code = 'teacher' and p.code in ('support.read','support.create')
on conflict do nothing;

drop function if exists public.admin_delete_profile(uuid);

create or replace function public.admin_delete_profile(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Evita el error: notifications_created_by_fkey / recipient_profile_id_fkey al eliminar usuarios.
  delete from public.notifications where created_by = p_profile_id or recipient_profile_id = p_profile_id;
  delete from public.user_audit_log where profile_id = p_profile_id or changed_by = p_profile_id;
  delete from public.team_members where profile_id = p_profile_id;

  update public.support_tickets set requester_id = null where requester_id = p_profile_id;
  update public.support_tickets set assigned_to = null where assigned_to = p_profile_id;
  update public.support_tickets set created_by = null where created_by = p_profile_id;
  update public.inventory_asset_status_history set changed_by = null where changed_by = p_profile_id;
  update public.inventory_location_history set changed_by = null where changed_by = p_profile_id;
  update public.inventory_barcode_labels set printed_by = null where printed_by = p_profile_id;
  update public.inventory_transactions set created_by = null where created_by = p_profile_id;
  update public.inventory_transactions set related_profile_id = null where related_profile_id = p_profile_id;
  update public.inventory_loans set requester_profile_id = null where requester_profile_id = p_profile_id;
  update public.inventory_loans set teacher_profile_id = null where teacher_profile_id = p_profile_id;
  update public.inventory_loans set created_by = null where created_by = p_profile_id;
  update public.inventory_loans set approved_by = null where approved_by = p_profile_id;
  update public.inventory_assets set current_holder_profile_id = null where current_holder_profile_id = p_profile_id;
  update public.teams set teacher_id = null where teacher_id = p_profile_id;
  update public.teams set backup_teacher_id = null where backup_teacher_id = p_profile_id;

  delete from public.profiles where id = p_profile_id;
end;
$$;

grant execute on function public.admin_delete_profile(uuid) to authenticated;
grant select on public.support_tickets_frontend_view to authenticated;
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update on public.support_ticket_incidents to authenticated;
grant select, insert, update on public.support_ticket_statuses to authenticated;
grant select, insert, update on public.app_settings to authenticated;
