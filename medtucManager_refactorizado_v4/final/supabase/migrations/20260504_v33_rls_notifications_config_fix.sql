-- =====================================================
-- V33 - Fix definitivo Soporte Ticket: RLS, incidencias,
-- notificaciones, configuraciones generales y reload schema
-- =====================================================

create extension if not exists pgcrypto;

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  updated_by uuid references public.profiles(id)
);

-- Función robusta de rol/permisos para administradores de soporte
create or replace function public.is_support_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    left join public.roles r on r.id = p.role_id
    where p.id = auth.uid()
      and (
        lower(coalesce(r.code,'')) in ('admin','administrator','administrador')
        or lower(coalesce(r.name,'')) in ('admin','administrator','administrador')
      )
  )
  or exists (
    select 1
    from public.profiles p
    join public.role_permissions rp on rp.role_id = p.role_id
    join public.permissions pe on pe.id = rp.permission_id
    where p.id = auth.uid()
      and pe.code in ('support.manage','support.status.manage','support.delete')
  );
$$;

grant execute on function public.is_support_admin() to authenticated;

-- RLS: limpiar políticas previas
alter table public.support_tickets enable row level security;
alter table public.support_ticket_incidents enable row level security;
alter table public.support_ticket_statuses enable row level security;
alter table public.app_settings enable row level security;

do $$
declare pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('support_tickets','support_ticket_incidents','support_ticket_statuses','app_settings')
  loop
    execute format('drop policy if exists %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;

-- Tickets: docentes y administradores pueden crear; lectura autenticada; gestión admin o propietario
create policy support_tickets_select_v33
on public.support_tickets for select to authenticated
using (true);

create policy support_tickets_insert_v33
on public.support_tickets for insert to authenticated
with check (auth.uid() is not null);

create policy support_tickets_update_v33
on public.support_tickets for update to authenticated
using (public.is_support_admin() or requester_id = auth.uid() or created_by = auth.uid())
with check (public.is_support_admin() or requester_id = auth.uid() or created_by = auth.uid());

create policy support_tickets_delete_v33
on public.support_tickets for delete to authenticated
using (public.is_support_admin());

-- Incidencias: lectura para todos; escritura solo admin robusto
create policy support_ticket_incidents_select_v33
on public.support_ticket_incidents for select to authenticated
using (true);

create policy support_ticket_incidents_insert_v33
on public.support_ticket_incidents for insert to authenticated
with check (public.is_support_admin());

create policy support_ticket_incidents_update_v33
on public.support_ticket_incidents for update to authenticated
using (public.is_support_admin())
with check (public.is_support_admin());

create policy support_ticket_incidents_delete_v33
on public.support_ticket_incidents for delete to authenticated
using (public.is_support_admin());

-- Estados: lectura autenticada; gestión admin
create policy support_ticket_statuses_select_v33
on public.support_ticket_statuses for select to authenticated
using (true);

create policy support_ticket_statuses_write_v33
on public.support_ticket_statuses for all to authenticated
using (public.is_support_admin())
with check (public.is_support_admin());

-- Configuraciones: todos leen; admin escribe
create policy app_settings_select_v33
on public.app_settings for select to authenticated
using (true);

create policy app_settings_write_v33
on public.app_settings for all to authenticated
using (public.is_support_admin())
with check (public.is_support_admin());

grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.support_ticket_incidents to authenticated;
grant select, insert, update, delete on public.support_ticket_statuses to authenticated;
grant select, insert, update, delete on public.app_settings to authenticated;

-- RPC de alta/edición de incidencias con SECURITY DEFINER para evitar bloqueos RLS en PostgREST
create or replace function public.admin_upsert_support_ticket_incident(
  p_name text,
  p_color text default '#64748b',
  p_sort_order integer default 100
)
returns public.support_ticket_incidents
language plpgsql
security definer
set search_path = public
as $$
declare v_row public.support_ticket_incidents;
begin
  if not public.is_support_admin() then
    raise exception 'Solo administradores pueden administrar incidencias de soporte' using errcode = '42501';
  end if;
  insert into public.support_ticket_incidents(name, color, sort_order, is_active, updated_at)
  values (trim(p_name), coalesce(nullif(p_color,''), '#64748b'), coalesce(p_sort_order,100), true, now())
  on conflict (name) do update set
    color = excluded.color,
    sort_order = excluded.sort_order,
    is_active = true,
    updated_at = now()
  returning * into v_row;
  return v_row;
end;
$$;

grant execute on function public.admin_upsert_support_ticket_incident(text,text,integer) to authenticated;

-- Notificación de tickets a administradores
create or replace function public.notify_support_ticket_event(p_ticket_id uuid, p_action text default 'creado')
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.support_tickets%rowtype;
  admin_record record;
  v_title text;
  v_message text;
begin
  select * into t from public.support_tickets where id = p_ticket_id;
  if not found then
    return;
  end if;

  v_title := case when p_action = 'actualizado' then 'Ticket de soporte actualizado' else 'Nuevo ticket de soporte' end;
  v_message := concat(
    'Ticket: ', coalesce(t.ticket_number,'-'),
    ' · Título: ', coalesce(t.title,'-'),
    ' · Incidencia: ', coalesce(t.incident_type,'-'),
    ' · Urgencia: ', coalesce(t.priority,'Normal'),
    ' · Cargó: ', coalesce(t.requester_name,'Usuario'),
    ' · Fecha/Hora: ', to_char(coalesce(t.created_at, now()), 'DD/MM/YYYY HH24:MI'),
    ' · Sala: ', coalesce(t.room,'-')
  );

  for admin_record in
    select p.id
    from public.profiles p
    left join public.roles r on r.id = p.role_id
    where lower(coalesce(r.code,'')) in ('admin','administrator','administrador')
       or lower(coalesce(r.name,'')) in ('admin','administrator','administrador')
  loop
    insert into public.notifications(recipient_profile_id, title, message, section, created_by, created_at)
    values (admin_record.id, v_title, v_message, 'supportTickets', t.created_by, now());
  end loop;
end;
$$;

grant execute on function public.notify_support_ticket_event(uuid,text) to authenticated;

create or replace function public.trg_notify_support_ticket_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_support_ticket_event(new.id, 'creado');
  return new;
end;
$$;

drop trigger if exists support_tickets_notify_insert_v33 on public.support_tickets;
create trigger support_tickets_notify_insert_v33
after insert on public.support_tickets
for each row execute function public.trg_notify_support_ticket_insert();

-- Vista frontend si faltaba o quedó inválida
create or replace view public.support_tickets_frontend_view as
select
  st.*,
  sts.name as status_name,
  sts.color as status_color,
  sti.color as incident_color
from public.support_tickets st
left join public.support_ticket_statuses sts on sts.code = st.status
left join public.support_ticket_incidents sti on sti.name = st.incident_type;

grant select on public.support_tickets_frontend_view to authenticated;

notify pgrst, 'reload schema';
