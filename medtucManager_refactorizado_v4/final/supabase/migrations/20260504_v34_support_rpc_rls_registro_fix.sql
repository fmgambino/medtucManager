-- ============================================================
-- ISM ROBOSOFT V34
-- FIX DEFINITIVO: Soporte Ticket por RPC SECURITY DEFINER + RLS + /registro
-- Ejecutar completo en Supabase SQL Editor.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1) Tablas base por si alguna migración anterior quedó parcial
-- ------------------------------------------------------------
create table if not exists public.support_ticket_incidents (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#64748b',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.support_ticket_statuses (
  code text primary key,
  name text not null,
  color text not null default '#64748b',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  title text not null,
  description text,
  room text not null check (room = any (array['Laboratorio de Robótica','Sala N°1 - Planta Baja (PB)','Sala N°2 - Primer Piso'])),
  asset_id uuid references public.inventory_assets(id),
  asset_label text,
  incident_type text,
  status text not null default 'pendiente' references public.support_ticket_statuses(code),
  priority text default 'Normal',
  history text,
  requester_id uuid references public.profiles(id),
  requester_name text,
  assigned_to uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into public.support_ticket_statuses(code,name,color,sort_order,is_active) values
('pendiente','Pendiente','#f59e0b',10,true),
('aprobado','Aprobado','#22c55e',20,true),
('rechazado','Rechazado','#ef4444',30,true),
('en_proceso','En proceso','#3b82f6',40,true),
('resolviendo','Resolviendo','#8b5cf6',50,true),
('resuelto','Resuelto','#14b8a6',60,true)
on conflict (code) do update set name=excluded.name, color=excluded.color, sort_order=excluded.sort_order, is_active=true, updated_at=now();

insert into public.support_ticket_incidents(name,color,sort_order,is_active) values
('Falla técnica','#ef4444',10,true),
('Falta de insumo','#f59e0b',20,true),
('Mantenimiento preventivo','#3b82f6',30,true),
('Software / configuración','#8b5cf6',40,true)
on conflict (name) do update set color=excluded.color, sort_order=excluded.sort_order, is_active=true, updated_at=now();

-- ------------------------------------------------------------
-- 2) Helpers de rol robustos: admin/administrator/administrador y docente/teacher
-- ------------------------------------------------------------
create or replace function public.support_is_admin_v34(p_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists(
    select 1
    from public.profiles p
    left join public.roles r on r.id = p.role_id
    where p.id = p_uid
      and (
        lower(coalesce(r.code,'')) in ('admin','administrator','administrador')
        or lower(coalesce(r.name,'')) in ('admin','administrator','administrador')
      )
  );
$$;

create or replace function public.support_can_use_v34(p_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists(
    select 1
    from public.profiles p
    left join public.roles r on r.id = p.role_id
    where p.id = p_uid
      and (
        lower(coalesce(r.code,'')) in ('admin','administrator','administrador','teacher','docente')
        or lower(coalesce(r.name,'')) in ('admin','administrator','administrador','teacher','docente')
      )
  );
$$;

-- ------------------------------------------------------------
-- 3) RLS permisivo para lectura y controlado por helpers para escritura
--    El RPC SECURITY DEFINER de abajo evita los falsos 403 del cliente REST.
-- ------------------------------------------------------------
alter table public.support_tickets enable row level security;
alter table public.support_ticket_incidents enable row level security;
alter table public.support_ticket_statuses enable row level security;

drop policy if exists support_tickets_select on public.support_tickets;
drop policy if exists support_tickets_insert on public.support_tickets;
drop policy if exists support_tickets_update on public.support_tickets;
drop policy if exists support_tickets_delete on public.support_tickets;
drop policy if exists support_ticket_incidents_select on public.support_ticket_incidents;
drop policy if exists support_ticket_incidents_insert on public.support_ticket_incidents;
drop policy if exists support_ticket_incidents_update on public.support_ticket_incidents;
drop policy if exists support_ticket_incidents_delete on public.support_ticket_incidents;
drop policy if exists support_ticket_statuses_select on public.support_ticket_statuses;

create policy support_tickets_select on public.support_tickets for select to authenticated using (true);
create policy support_tickets_insert on public.support_tickets for insert to authenticated with check (public.support_can_use_v34(auth.uid()));
create policy support_tickets_update on public.support_tickets for update to authenticated using (public.support_is_admin_v34(auth.uid()) or requester_id = auth.uid() or created_by = auth.uid()) with check (public.support_is_admin_v34(auth.uid()) or requester_id = auth.uid() or created_by = auth.uid());
create policy support_tickets_delete on public.support_tickets for delete to authenticated using (public.support_is_admin_v34(auth.uid()));

create policy support_ticket_incidents_select on public.support_ticket_incidents for select to authenticated using (true);
create policy support_ticket_incidents_insert on public.support_ticket_incidents for insert to authenticated with check (public.support_is_admin_v34(auth.uid()));
create policy support_ticket_incidents_update on public.support_ticket_incidents for update to authenticated using (public.support_is_admin_v34(auth.uid())) with check (public.support_is_admin_v34(auth.uid()));
create policy support_ticket_incidents_delete on public.support_ticket_incidents for delete to authenticated using (public.support_is_admin_v34(auth.uid()));
create policy support_ticket_statuses_select on public.support_ticket_statuses for select to authenticated using (true);

-- ------------------------------------------------------------
-- 4) Vista frontend: drop completo para evitar ERROR 42P16
-- ------------------------------------------------------------
drop view if exists public.support_tickets_frontend_view cascade;

create view public.support_tickets_frontend_view as
select
  st.id,
  st.ticket_number,
  st.title,
  st.description,
  st.room,
  st.asset_id,
  st.asset_label,
  st.incident_type,
  st.priority,
  st.history,
  st.status,
  st.requester_id,
  st.requester_name,
  st.assigned_to,
  st.created_by,
  st.created_at,
  st.updated_at,
  sti.color as incident_color,
  sts.name as status_name,
  sts.color as status_color
from public.support_tickets st
left join public.support_ticket_statuses sts on sts.code = st.status
left join public.support_ticket_incidents sti on sti.name = st.incident_type;

-- ------------------------------------------------------------
-- 5) RPC de soporte: evita 403 por RLS en insert/update desde la app
-- ------------------------------------------------------------
drop function if exists public.support_ticket_save_v34(jsonb);
create function public.support_ticket_save_v34(p_ticket jsonb)
returns public.support_tickets
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_existing public.support_tickets%rowtype;
  v_row public.support_tickets%rowtype;
  v_ticket_number text;
  v_requester_name text;
begin
  if v_uid is null then
    raise exception 'Usuario no autenticado';
  end if;

  if not public.support_can_use_v34(v_uid) then
    raise exception 'No tenés permisos para usar Soporte Ticket';
  end if;

  v_id := nullif(p_ticket->>'id','')::uuid;
  if v_id is not null then
    select * into v_existing from public.support_tickets where id = v_id;
  end if;

  if v_existing.id is not null and not (public.support_is_admin_v34(v_uid) or v_existing.requester_id = v_uid or v_existing.created_by = v_uid) then
    raise exception 'No tenés permisos para modificar este ticket';
  end if;

  v_ticket_number := nullif(p_ticket->>'ticket_number','');
  if v_ticket_number is null then
    v_ticket_number := 'TK-' || to_char(now(),'YYYY') || '-' || lpad(((select count(*) + 1 from public.support_tickets))::text, 5, '0');
  end if;

  select coalesce(full_name, p_ticket->>'requester_name', 'Usuario') into v_requester_name
  from public.profiles where id = v_uid;

  if v_existing.id is null then
    insert into public.support_tickets(
      id, ticket_number, title, description, room, asset_id, asset_label, incident_type,
      status, priority, history, requester_id, requester_name, assigned_to, created_by, created_at, updated_at
    ) values (
      coalesce(v_id, gen_random_uuid()),
      v_ticket_number,
      coalesce(nullif(p_ticket->>'title',''), 'Ticket sin título'),
      nullif(p_ticket->>'description',''),
      coalesce(nullif(p_ticket->>'room',''), 'Laboratorio de Robótica'),
      nullif(p_ticket->>'asset_id','')::uuid,
      nullif(p_ticket->>'asset_label',''),
      nullif(p_ticket->>'incident_type',''),
      coalesce(nullif(p_ticket->>'status',''), 'pendiente'),
      coalesce(nullif(p_ticket->>'priority',''), 'Normal'),
      nullif(p_ticket->>'history',''),
      v_uid,
      v_requester_name,
      nullif(p_ticket->>'assigned_to','')::uuid,
      v_uid,
      coalesce(nullif(p_ticket->>'created_at','')::timestamptz, now()),
      now()
    ) returning * into v_row;
  else
    update public.support_tickets set
      title = coalesce(nullif(p_ticket->>'title',''), title),
      description = nullif(p_ticket->>'description',''),
      room = coalesce(nullif(p_ticket->>'room',''), room),
      asset_id = nullif(p_ticket->>'asset_id','')::uuid,
      asset_label = nullif(p_ticket->>'asset_label',''),
      incident_type = nullif(p_ticket->>'incident_type',''),
      status = case when public.support_is_admin_v34(v_uid) then coalesce(nullif(p_ticket->>'status',''), status) else status end,
      priority = coalesce(nullif(p_ticket->>'priority',''), priority),
      history = nullif(p_ticket->>'history',''),
      assigned_to = nullif(p_ticket->>'assigned_to','')::uuid,
      updated_at = now()
    where id = v_existing.id
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

drop function if exists public.support_ticket_bulk_update_v34(uuid[], jsonb);
create function public.support_ticket_bulk_update_v34(p_ids uuid[], p_changes jsonb)
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_count integer := 0;
begin
  if v_uid is null then raise exception 'Usuario no autenticado'; end if;
  if not public.support_is_admin_v34(v_uid) then raise exception 'Solo administradores pueden hacer edición masiva'; end if;

  update public.support_tickets set
    status = coalesce(nullif(p_changes->>'status',''), status),
    priority = coalesce(nullif(p_changes->>'priority',''), priority),
    history = coalesce(nullif(p_changes->>'history',''), history),
    updated_at = now()
  where id = any(p_ids);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

drop function if exists public.support_ticket_delete_v34(uuid[]);
create function public.support_ticket_delete_v34(p_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_count integer := 0;
begin
  if v_uid is null then raise exception 'Usuario no autenticado'; end if;
  if not public.support_is_admin_v34(v_uid) then raise exception 'Solo administradores pueden eliminar tickets'; end if;

  delete from public.support_tickets where id = any(p_ids);
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

drop function if exists public.admin_upsert_support_ticket_incident(text,text,integer);
create function public.admin_upsert_support_ticket_incident(p_name text, p_color text default '#64748b', p_sort_order integer default 100)
returns public.support_ticket_incidents
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.support_ticket_incidents%rowtype;
begin
  if v_uid is null then raise exception 'Usuario no autenticado'; end if;
  if not public.support_is_admin_v34(v_uid) then raise exception 'Solo administradores pueden administrar incidencias'; end if;

  insert into public.support_ticket_incidents(name,color,sort_order,is_active,updated_at)
  values (trim(p_name), coalesce(p_color,'#64748b'), coalesce(p_sort_order,100), true, now())
  on conflict (name) do update set color=excluded.color, sort_order=excluded.sort_order, is_active=true, updated_at=now()
  returning * into v_row;
  return v_row;
end;
$$;

-- ------------------------------------------------------------
-- 6) Notificaciones automáticas al crear/modificar tickets
-- ------------------------------------------------------------
drop function if exists public.notify_support_ticket_event(uuid,text);
create function public.notify_support_ticket_event(p_ticket_id uuid, p_action text default 'actualizado')
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  t public.support_tickets%rowtype;
  v_sender uuid := auth.uid();
  v_count integer := 0;
  v_msg text;
begin
  select * into t from public.support_tickets where id = p_ticket_id;
  if t.id is null then return 0; end if;

  v_msg := 'Ticket ' || t.ticket_number || ' · ' || t.title ||
           ' · Incidencia: ' || coalesce(t.incident_type,'-') ||
           ' · Urgencia: ' || coalesce(t.priority,'Normal') ||
           ' · Cargó: ' || coalesce(t.requester_name,'Usuario') ||
           ' · Fecha: ' || to_char(coalesce(t.created_at, now()), 'DD/MM/YYYY HH24:MI') ||
           ' · Estado: ' || coalesce(t.status,'pendiente');

  insert into public.notifications(recipient_profile_id,title,message,section,created_by,created_at)
  select p.id,
         case when p_action = 'creado' then 'Nuevo ticket de soporte' else 'Ticket de soporte actualizado' end,
         v_msg,
         'supportTickets',
         coalesce(v_sender, t.created_by),
         now()
  from public.profiles p
  left join public.roles r on r.id = p.role_id
  where p.id = t.requester_id
     or lower(coalesce(r.code,'')) in ('admin','administrator','administrador')
     or lower(coalesce(r.name,'')) in ('admin','administrator','administrador');

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

drop function if exists public.support_ticket_notify_trigger_v34();
create function public.support_ticket_notify_trigger_v34()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  perform public.notify_support_ticket_event(new.id, case when tg_op = 'INSERT' then 'creado' else 'actualizado' end);
  return new;
end;
$$;

drop trigger if exists trg_support_ticket_notify_v34 on public.support_tickets;
create trigger trg_support_ticket_notify_v34
after insert or update of status, priority, history, title, incident_type
on public.support_tickets
for each row
execute function public.support_ticket_notify_trigger_v34();

-- ------------------------------------------------------------
-- 7) Grants y PostgREST reload
-- ------------------------------------------------------------
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.support_ticket_incidents to authenticated;
grant select on public.support_ticket_statuses to authenticated;
grant select on public.support_tickets_frontend_view to authenticated;

grant execute on function public.support_is_admin_v34(uuid) to authenticated;
grant execute on function public.support_can_use_v34(uuid) to authenticated;
grant execute on function public.support_ticket_save_v34(jsonb) to authenticated;
grant execute on function public.support_ticket_bulk_update_v34(uuid[], jsonb) to authenticated;
grant execute on function public.support_ticket_delete_v34(uuid[]) to authenticated;
grant execute on function public.admin_upsert_support_ticket_incident(text,text,integer) to authenticated;
grant execute on function public.notify_support_ticket_event(uuid,text) to authenticated;

notify pgrst, 'reload schema';

commit;
