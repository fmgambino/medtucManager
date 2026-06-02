-- ============================================================
-- ISM ROBOSOFT V36
-- VISIBILIDAD PRIVADA DE SOPORTE TICKET
-- Regla:
--   - Administradores: pueden ver, editar y eliminar todos los tickets.
--   - Docentes/Alumnos: solo pueden ver, editar y eliminar tickets propios.
--   - Tickets creados por administradores: solo visibles para administradores.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1) Helpers robustos de rol
-- ------------------------------------------------------------
create or replace function public.support_is_admin_v36(p_uid uuid default auth.uid())
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

create or replace function public.support_can_use_v36(p_uid uuid default auth.uid())
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
        lower(coalesce(r.code,'')) in ('admin','administrator','administrador','teacher','docente','student','alumno')
        or lower(coalesce(r.name,'')) in ('admin','administrator','administrador','teacher','docente','student','alumno')
      )
  );
$$;

-- ------------------------------------------------------------
-- 2) RLS privado para tickets
-- ------------------------------------------------------------
alter table public.support_tickets enable row level security;
alter table public.support_ticket_incidents enable row level security;
alter table public.support_ticket_statuses enable row level security;

drop policy if exists support_tickets_select on public.support_tickets;
drop policy if exists support_tickets_insert on public.support_tickets;
drop policy if exists support_tickets_update on public.support_tickets;
drop policy if exists support_tickets_delete on public.support_tickets;

create policy support_tickets_select
on public.support_tickets
for select
to authenticated
using (
  public.support_is_admin_v36(auth.uid())
  or requester_id = auth.uid()
  or created_by = auth.uid()
);

create policy support_tickets_insert
on public.support_tickets
for insert
to authenticated
with check (
  public.support_can_use_v36(auth.uid())
  and coalesce(requester_id, auth.uid()) = auth.uid()
  and coalesce(created_by, auth.uid()) = auth.uid()
);

create policy support_tickets_update
on public.support_tickets
for update
to authenticated
using (
  public.support_is_admin_v36(auth.uid())
  or requester_id = auth.uid()
  or created_by = auth.uid()
)
with check (
  public.support_is_admin_v36(auth.uid())
  or requester_id = auth.uid()
  or created_by = auth.uid()
);

create policy support_tickets_delete
on public.support_tickets
for delete
to authenticated
using (
  public.support_is_admin_v36(auth.uid())
  or requester_id = auth.uid()
  or created_by = auth.uid()
);

-- ------------------------------------------------------------
-- 3) Incidencias y estados
-- ------------------------------------------------------------
drop policy if exists support_ticket_incidents_select on public.support_ticket_incidents;
drop policy if exists support_ticket_incidents_insert on public.support_ticket_incidents;
drop policy if exists support_ticket_incidents_update on public.support_ticket_incidents;
drop policy if exists support_ticket_incidents_delete on public.support_ticket_incidents;
drop policy if exists support_ticket_statuses_select on public.support_ticket_statuses;

create policy support_ticket_incidents_select on public.support_ticket_incidents for select to authenticated using (true);
create policy support_ticket_incidents_insert on public.support_ticket_incidents for insert to authenticated with check (public.support_is_admin_v36(auth.uid()));
create policy support_ticket_incidents_update on public.support_ticket_incidents for update to authenticated using (public.support_is_admin_v36(auth.uid())) with check (public.support_is_admin_v36(auth.uid()));
create policy support_ticket_incidents_delete on public.support_ticket_incidents for delete to authenticated using (public.support_is_admin_v36(auth.uid()));
create policy support_ticket_statuses_select on public.support_ticket_statuses for select to authenticated using (true);

-- ------------------------------------------------------------
-- 4) Vista frontend con security_invoker para respetar RLS
-- ------------------------------------------------------------
drop view if exists public.support_tickets_frontend_view cascade;

create view public.support_tickets_frontend_view
with (security_invoker = true)
as
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
-- 5) RPC actualizados con la misma regla de privacidad
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
  if v_uid is null then raise exception 'Usuario no autenticado'; end if;
  if not public.support_can_use_v36(v_uid) then raise exception 'No tenés permisos para usar Soporte Ticket'; end if;

  v_id := nullif(p_ticket->>'id','')::uuid;
  if v_id is not null then
    select * into v_existing from public.support_tickets where id = v_id;
  end if;

  if v_existing.id is not null and not (public.support_is_admin_v36(v_uid) or v_existing.requester_id = v_uid or v_existing.created_by = v_uid) then
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
      case when public.support_is_admin_v36(v_uid) then coalesce(nullif(p_ticket->>'status',''), 'pendiente') else 'pendiente' end,
      coalesce(nullif(p_ticket->>'priority',''), 'Normal'),
      nullif(p_ticket->>'history',''),
      v_uid,
      coalesce(v_requester_name, p_ticket->>'requester_name', 'Usuario'),
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
      status = case when public.support_is_admin_v36(v_uid) then coalesce(nullif(p_ticket->>'status',''), status) else status end,
      priority = coalesce(nullif(p_ticket->>'priority',''), priority),
      history = nullif(p_ticket->>'history',''),
      assigned_to = case when public.support_is_admin_v36(v_uid) then nullif(p_ticket->>'assigned_to','')::uuid else assigned_to end,
      updated_at = now()
    where id = v_existing.id
      and (public.support_is_admin_v36(v_uid) or requester_id = v_uid or created_by = v_uid)
    returning * into v_row;
  end if;

  return v_row;
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

  delete from public.support_tickets
  where id = any(p_ids)
    and (public.support_is_admin_v36(v_uid) or requester_id = v_uid or created_by = v_uid);

  get diagnostics v_count = row_count;
  return v_count;
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
  if not public.support_is_admin_v36(v_uid) then raise exception 'Solo administradores pueden hacer edición masiva de estado'; end if;

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

-- ------------------------------------------------------------
-- 6) Grants y reload
-- ------------------------------------------------------------
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.support_ticket_incidents to authenticated;
grant select on public.support_ticket_statuses to authenticated;
grant select on public.support_tickets_frontend_view to authenticated;

grant execute on function public.support_is_admin_v36(uuid) to authenticated;
grant execute on function public.support_can_use_v36(uuid) to authenticated;
grant execute on function public.support_ticket_save_v34(jsonb) to authenticated;
grant execute on function public.support_ticket_delete_v34(uuid[]) to authenticated;
grant execute on function public.support_ticket_bulk_update_v34(uuid[], jsonb) to authenticated;

notify pgrst, 'reload schema';

commit;
