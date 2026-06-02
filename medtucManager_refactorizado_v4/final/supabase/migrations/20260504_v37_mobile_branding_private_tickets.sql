-- ============================================================
-- ISM ROBOSOFT V37
-- Branding en tiempo real, polling configurable, sesiones, zona horaria Argentina,
-- notificaciones de login/logout y visibilidad privada de tickets.
-- ============================================================

begin;

set timezone = 'America/Argentina/Buenos_Aires';

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  updated_by uuid references public.profiles(id)
);

insert into public.app_settings(key, value)
values ('general_config', jsonb_build_object(
  'institutionName','Instituto San Miguel',
  'institutionSubtitle','Laboratorio de Robótica',
  'institutionEmail','robotica@ism.edu.ar',
  'logoDataUrl','',
  'pollingSeconds',25
))
on conflict (key) do update set value = public.app_settings.value || excluded.value;

create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  login_at timestamptz not null default now(),
  logout_at timestamptz,
  last_seen_at timestamptz not null default now(),
  user_agent text,
  duration_seconds integer generated always as (
    case when logout_at is null then null else greatest(0, extract(epoch from (logout_at - login_at))::integer) end
  ) stored
);

alter table public.app_settings enable row level security;
alter table public.user_sessions enable row level security;

-- Limpieza segura de policies
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname, tablename FROM pg_policies WHERE schemaname='public' AND tablename IN ('app_settings','user_sessions','support_tickets','support_ticket_incidents') LOOP
    EXECUTE format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

create policy app_settings_select on public.app_settings for select to authenticated, anon using (true);
create policy app_settings_admin_write on public.app_settings for all to authenticated
using (exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador')))
with check (exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador')));

create policy user_sessions_own_or_admin_select on public.user_sessions for select to authenticated
using (profile_id = auth.uid() or exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador')));
create policy user_sessions_insert_own on public.user_sessions for insert to authenticated with check (profile_id = auth.uid());
create policy user_sessions_update_own on public.user_sessions for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());

alter table public.support_tickets enable row level security;
alter table public.support_ticket_incidents enable row level security;

-- Tickets: admins ven todo. Docentes/alumnos solo propios. Crear ticket propio.
create policy support_tickets_private_select on public.support_tickets for select to authenticated
using (
  exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador'))
  or requester_id = auth.uid()
  or created_by = auth.uid()
);

create policy support_tickets_private_insert on public.support_tickets for insert to authenticated
with check (
  requester_id = auth.uid()
  or created_by = auth.uid()
  or exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador'))
);

create policy support_tickets_private_update on public.support_tickets for update to authenticated
using (
  exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador'))
  or requester_id = auth.uid()
  or created_by = auth.uid()
)
with check (
  exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador'))
  or requester_id = auth.uid()
  or created_by = auth.uid()
);

create policy support_tickets_private_delete on public.support_tickets for delete to authenticated
using (
  exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador'))
  or requester_id = auth.uid()
  or created_by = auth.uid()
);

-- Incidencias: todos leen; solo admin crea/edita/elimina.
create policy support_ticket_incidents_select on public.support_ticket_incidents for select to authenticated using (true);
create policy support_ticket_incidents_admin_insert on public.support_ticket_incidents for insert to authenticated
with check (exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador')));
create policy support_ticket_incidents_admin_update on public.support_ticket_incidents for update to authenticated
using (exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador')))
with check (exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador')));
create policy support_ticket_incidents_admin_delete on public.support_ticket_incidents for delete to authenticated
using (exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=auth.uid() and lower(r.code) in ('admin','administrator','administrador')));

-- Rehacer view con security_invoker para respetar RLS.
drop view if exists public.support_tickets_frontend_view cascade;
create view public.support_tickets_frontend_view
with (security_invoker = true)
as
select
  st.id, st.ticket_number, st.title, st.description, st.room, st.asset_id, st.asset_label,
  st.incident_type, st.status, st.priority, st.history, st.requester_id, st.requester_name,
  st.assigned_to, st.created_by, st.created_at, st.updated_at,
  sti.color as incident_color, sts.name as status_name, sts.color as status_color
from public.support_tickets st
left join public.support_ticket_statuses sts on sts.code = st.status
left join public.support_ticket_incidents sti on sti.name = st.incident_type;

grant select on public.support_tickets_frontend_view to authenticated;
grant all on public.support_tickets to authenticated;
grant all on public.support_ticket_incidents to authenticated;
grant select on public.app_settings to anon;
grant select, insert, update on public.app_settings to authenticated;
grant select, insert, update on public.user_sessions to authenticated;

-- secuencia auxiliar solo si no existe
create sequence if not exists public.support_ticket_seq;

-- Funciones RPC con SECURITY DEFINER para evitar falsos 403 y aplicar reglas.
drop function if exists public.support_ticket_save_v37(jsonb);
create function public.support_ticket_save_v37(p_ticket jsonb)
returns public.support_tickets
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_is_admin boolean;
  v_id uuid;
  v_row public.support_tickets;
begin
  if v_uid is null then raise exception 'No autenticado'; end if;
  select exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=v_uid and lower(r.code) in ('admin','administrator','administrador')) into v_is_admin;
  v_id := nullif(p_ticket->>'id','')::uuid;

  if v_id is not null and exists(select 1 from public.support_tickets where id=v_id) then
    if not v_is_admin and not exists(select 1 from public.support_tickets where id=v_id and (requester_id=v_uid or created_by=v_uid)) then
      raise exception 'No podés modificar tickets de otro usuario';
    end if;
    update public.support_tickets set
      ticket_number = coalesce(nullif(p_ticket->>'ticket_number',''), ticket_number),
      title = coalesce(nullif(p_ticket->>'title',''), title),
      description = p_ticket->>'description',
      room = coalesce(nullif(p_ticket->>'room',''), room),
      asset_id = nullif(p_ticket->>'asset_id','')::uuid,
      asset_label = p_ticket->>'asset_label',
      incident_type = p_ticket->>'incident_type',
      status = case when v_is_admin then coalesce(nullif(p_ticket->>'status',''), status) else status end,
      priority = coalesce(nullif(p_ticket->>'priority',''), priority),
      history = p_ticket->>'history',
      updated_at = now()
    where id=v_id
    returning * into v_row;
  else
    insert into public.support_tickets(
      id, ticket_number, title, description, room, asset_id, asset_label, incident_type, status, priority, history,
      requester_id, requester_name, assigned_to, created_by, created_at, updated_at
    ) values (
      coalesce(v_id, gen_random_uuid()),
      coalesce(nullif(p_ticket->>'ticket_number',''), 'TK-' || to_char(now(),'YYYY') || '-' || lpad(nextval('support_ticket_seq')::text,5,'0')),
      coalesce(nullif(p_ticket->>'title',''), 'Ticket de soporte'),
      p_ticket->>'description',
      coalesce(nullif(p_ticket->>'room',''), 'Laboratorio de Robótica'),
      nullif(p_ticket->>'asset_id','')::uuid,
      p_ticket->>'asset_label',
      p_ticket->>'incident_type',
      coalesce(nullif(p_ticket->>'status',''), 'pendiente'),
      coalesce(nullif(p_ticket->>'priority',''), 'Normal'),
      p_ticket->>'history',
      coalesce(nullif(p_ticket->>'requester_id','')::uuid, v_uid),
      coalesce(nullif(p_ticket->>'requester_name',''), (select full_name from public.profiles where id=v_uid), 'Usuario'),
      nullif(p_ticket->>'assigned_to','')::uuid,
      coalesce(nullif(p_ticket->>'created_by','')::uuid, v_uid),
      coalesce(nullif(p_ticket->>'created_at','')::timestamptz, now()),
      now()
    ) returning * into v_row;
  end if;
  return v_row;
end;
$$;

drop function if exists public.support_ticket_bulk_update_v37(uuid[], jsonb);
create function public.support_ticket_bulk_update_v37(p_ids uuid[], p_changes jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_uid uuid := auth.uid(); v_is_admin boolean;
begin
  select exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=v_uid and lower(r.code) in ('admin','administrator','administrador')) into v_is_admin;
  if not v_is_admin then raise exception 'Solo administradores pueden actualizar estados masivamente'; end if;
  update public.support_tickets set status = coalesce(nullif(p_changes->>'status',''), status), updated_at = now() where id = any(p_ids);
end;
$$;

drop function if exists public.support_ticket_delete_v37(uuid[]);
create function public.support_ticket_delete_v37(p_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_uid uuid := auth.uid(); v_is_admin boolean;
begin
  select exists(select 1 from public.profiles p join public.roles r on r.id=p.role_id where p.id=v_uid and lower(r.code) in ('admin','administrator','administrador')) into v_is_admin;
  delete from public.support_tickets where id = any(p_ids) and (v_is_admin or requester_id=v_uid or created_by=v_uid);
end;
$$;

-- Notificaciones de login/logout a admins.
drop function if exists public.notify_user_login_v37();
create function public.notify_user_login_v37()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_name text;
  v_role text;
  v_session uuid;
  a record;
begin
  if v_uid is null then return null; end if;
  select coalesce(p.full_name,'Usuario'), coalesce(r.name,r.code,'') into v_name, v_role from public.profiles p left join public.roles r on r.id=p.role_id where p.id=v_uid;
  insert into public.user_sessions(profile_id, user_agent) values (v_uid, current_setting('request.headers', true)) returning id into v_session;
  for a in select p.id from public.profiles p join public.roles r on r.id=p.role_id where lower(r.code) in ('admin','administrator','administrador') loop
    insert into public.notifications(recipient_profile_id, title, message, section, created_by, created_at)
    values (a.id, 'Inicio de sesión', 'Usuario: '||coalesce(v_name,'Usuario')||' · Rol: '||coalesce(v_role,'-')||' · Fecha: '||to_char(now() at time zone 'America/Argentina/Buenos_Aires','DD/MM/YYYY HH24:MI'), 'notifications', v_uid, now());
  end loop;
  return v_session;
end;
$$;

drop function if exists public.notify_user_logout_v37();
create function public.notify_user_logout_v37()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_name text;
  v_session public.user_sessions;
  a record;
begin
  if v_uid is null then return; end if;
  select coalesce(full_name,'Usuario') into v_name from public.profiles where id=v_uid;
  select * into v_session from public.user_sessions where profile_id=v_uid and logout_at is null order by login_at desc limit 1;
  if v_session.id is not null then
    update public.user_sessions set logout_at=now(), last_seen_at=now() where id=v_session.id;
    for a in select p.id from public.profiles p join public.roles r on r.id=p.role_id where lower(r.code) in ('admin','administrator','administrador') loop
      insert into public.notifications(recipient_profile_id, title, message, section, created_by, created_at)
      values (a.id, 'Cierre de sesión', 'Usuario: '||coalesce(v_name,'Usuario')||' · Permanencia: '||greatest(0, extract(epoch from (now()-v_session.login_at))::int)||' segundos · Fecha: '||to_char(now() at time zone 'America/Argentina/Buenos_Aires','DD/MM/YYYY HH24:MI'), 'notifications', v_uid, now());
    end loop;
  end if;
end;
$$;

grant execute on function public.support_ticket_save_v37(jsonb) to authenticated;
grant execute on function public.support_ticket_bulk_update_v37(uuid[], jsonb) to authenticated;
grant execute on function public.support_ticket_delete_v37(uuid[]) to authenticated;
grant execute on function public.notify_user_login_v37() to authenticated;
grant execute on function public.notify_user_logout_v37() to authenticated;

notify pgrst, 'reload schema';
commit;
