-- ============================================================
-- ISM ROBOSOFT V38
-- Mobile-first fixes, ticket-number uniqueness, notification dedupe,
-- private ticket visibility, permissions for Campus menu.
-- ============================================================
begin;
set timezone = 'America/Argentina/Buenos_Aires';

create sequence if not exists public.support_ticket_seq;
select setval('public.support_ticket_seq', greatest(
  coalesce((select max((regexp_match(ticket_number, 'TK-[0-9]{4}-([0-9]+)'))[1]::bigint) from public.support_tickets where ticket_number ~ '^TK-[0-9]{4}-[0-9]+$'),0),
  coalesce((select last_value from public.support_ticket_seq),0)
), true);

-- Permisos de vistas / menú lateral. Campus queda controlado por courses.read/courses.manage.
insert into public.permissions(code,name,module) values
('support.read','Ver Soporte Ticket','Soporte Ticket'),
('support.create','Crear tickets de soporte','Soporte Ticket'),
('support.manage','Administrar todos los tickets de soporte','Soporte Ticket'),
('support.delete','Eliminar tickets de soporte','Soporte Ticket'),
('support.status.manage','Cambiar estado de tickets','Soporte Ticket'),
('courses.read','Ver Campus docente/alumno','Campus'),
('courses.manage','Administrar Campus','Campus')
on conflict (code) do update set name=excluded.name, module=excluded.module;

-- Quitar Campus a Docente/Alumno por defecto si se quiere ocultar desde Roles y permisos.
delete from public.role_permissions rp
using public.roles r, public.permissions p
where rp.role_id=r.id and rp.permission_id=p.id
and lower(r.code) in ('teacher','docente','student','alumno')
and p.code in ('courses.read','courses.manage');

-- Asegurar soporte para administradores/docentes/alumnos.
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where lower(r.code) in ('admin','administrator','administrador')
and p.code in ('support.read','support.create','support.manage','support.delete','support.status.manage','courses.read','courses.manage')
and not exists (select 1 from public.role_permissions rp where rp.role_id=r.id and rp.permission_id=p.id);
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where lower(r.code) in ('teacher','docente','student','alumno')
and p.code in ('support.read','support.create')
and not exists (select 1 from public.role_permissions rp where rp.role_id=r.id and rp.permission_id=p.id);

-- RLS tickets: admins todo; el resto solo propios.
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='support_tickets' LOOP
    EXECUTE format('drop policy if exists %I on public.support_tickets', p.policyname);
  END LOOP;
END $$;
alter table public.support_tickets enable row level security;
create policy support_tickets_v38_select on public.support_tickets for select to authenticated
using (
  exists(select 1 from public.profiles pr join public.roles ro on ro.id=pr.role_id where pr.id=auth.uid() and lower(ro.code) in ('admin','administrator','administrador'))
  or requester_id=auth.uid() or created_by=auth.uid()
);
create policy support_tickets_v38_insert on public.support_tickets for insert to authenticated
with check (requester_id=auth.uid() or created_by=auth.uid() or exists(select 1 from public.profiles pr join public.roles ro on ro.id=pr.role_id where pr.id=auth.uid() and lower(ro.code) in ('admin','administrator','administrador')));
create policy support_tickets_v38_update on public.support_tickets for update to authenticated
using (exists(select 1 from public.profiles pr join public.roles ro on ro.id=pr.role_id where pr.id=auth.uid() and lower(ro.code) in ('admin','administrator','administrador')) or requester_id=auth.uid() or created_by=auth.uid())
with check (exists(select 1 from public.profiles pr join public.roles ro on ro.id=pr.role_id where pr.id=auth.uid() and lower(ro.code) in ('admin','administrator','administrador')) or requester_id=auth.uid() or created_by=auth.uid());
create policy support_tickets_v38_delete on public.support_tickets for delete to authenticated
using (exists(select 1 from public.profiles pr join public.roles ro on ro.id=pr.role_id where pr.id=auth.uid() and lower(ro.code) in ('admin','administrator','administrador')) or requester_id=auth.uid() or created_by=auth.uid());

drop view if exists public.support_tickets_frontend_view cascade;
create view public.support_tickets_frontend_view with (security_invoker=true) as
select st.id, st.ticket_number, st.title, st.description, st.room, st.asset_id, st.asset_label,
       st.incident_type, st.status, st.priority, st.history, st.requester_id, st.requester_name,
       st.assigned_to, st.created_by, st.created_at, st.updated_at,
       sti.color as incident_color, sts.name as status_name, sts.color as status_color
from public.support_tickets st
left join public.support_ticket_statuses sts on sts.code=st.status
left join public.support_ticket_incidents sti on sti.name=st.incident_type;

drop function if exists public.support_ticket_save_v38(jsonb);
create function public.support_ticket_save_v38(p_ticket jsonb)
returns public.support_tickets
language plpgsql security definer set search_path=public as $$
declare
  v_uid uuid := auth.uid();
  v_is_admin boolean := false;
  v_id uuid := nullif(p_ticket->>'id','')::uuid;
  v_row public.support_tickets;
  v_ticket_number text;
begin
  if v_uid is null then raise exception 'No autenticado'; end if;
  select exists(select 1 from profiles p join roles r on r.id=p.role_id where p.id=v_uid and lower(r.code) in ('admin','administrator','administrador')) into v_is_admin;
  if v_id is not null and exists(select 1 from support_tickets where id=v_id) then
    if not v_is_admin and not exists(select 1 from support_tickets where id=v_id and (requester_id=v_uid or created_by=v_uid)) then
      raise exception 'No podés modificar tickets de otro usuario';
    end if;
    update support_tickets set
      title=coalesce(nullif(p_ticket->>'title',''),title), description=p_ticket->>'description', room=coalesce(nullif(p_ticket->>'room',''),room),
      asset_id=nullif(p_ticket->>'asset_id','')::uuid, asset_label=p_ticket->>'asset_label', incident_type=p_ticket->>'incident_type',
      status=case when v_is_admin then coalesce(nullif(p_ticket->>'status',''),status) else status end,
      priority=coalesce(nullif(p_ticket->>'priority',''),priority), history=p_ticket->>'history', updated_at=now()
    where id=v_id returning * into v_row;
  else
    loop
      v_ticket_number := 'TK-' || to_char(now() at time zone 'America/Argentina/Buenos_Aires','YYYY') || '-' || lpad(nextval('support_ticket_seq')::text,5,'0');
      begin
        insert into support_tickets(id,ticket_number,title,description,room,asset_id,asset_label,incident_type,status,priority,history,requester_id,requester_name,assigned_to,created_by,created_at,updated_at)
        values (gen_random_uuid(), v_ticket_number, coalesce(nullif(p_ticket->>'title',''),'Ticket de soporte'), p_ticket->>'description', coalesce(nullif(p_ticket->>'room',''),'Laboratorio de Robótica'), nullif(p_ticket->>'asset_id','')::uuid, p_ticket->>'asset_label', p_ticket->>'incident_type', coalesce(nullif(p_ticket->>'status',''),'pendiente'), coalesce(nullif(p_ticket->>'priority',''),'Normal'), p_ticket->>'history', coalesce(nullif(p_ticket->>'requester_id','')::uuid,v_uid), coalesce(nullif(p_ticket->>'requester_name',''),(select full_name from profiles where id=v_uid),'Usuario'), nullif(p_ticket->>'assigned_to','')::uuid, coalesce(nullif(p_ticket->>'created_by','')::uuid,v_uid), now(), now()) returning * into v_row;
        exit;
      exception when unique_violation then
        -- seguir al próximo número
      end;
    end loop;
  end if;
  return v_row;
end; $$;

-- Notificación de soporte sin duplicar ni listar destinatarios en UI.
drop function if exists public.notify_support_ticket_event_v38(uuid,text);
create function public.notify_support_ticket_event_v38(p_ticket_id uuid, p_action text default 'creado')
returns integer
language plpgsql security definer set search_path=public as $$
declare
  t support_tickets;
  a record;
  v_msg text;
  v_count integer := 0;
begin
  select * into t from support_tickets where id=p_ticket_id;
  if t.id is null then return 0; end if;
  v_msg := 'Ticket '||t.ticket_number||' · '||coalesce(t.title,'')||' · Incidencia: '||coalesce(t.incident_type,'-')||' · Urgencia: '||coalesce(t.priority,'Normal')||' · Cargó: '||coalesce(t.requester_name,'Usuario')||' · Fecha: '||to_char(t.created_at at time zone 'America/Argentina/Buenos_Aires','DD/MM/YYYY HH24:MI')||' · Estado: '||coalesce(t.status,'pendiente');
  for a in select p.id from profiles p join roles r on r.id=p.role_id where lower(r.code) in ('admin','administrator','administrador') loop
    if not exists(select 1 from notifications n where n.recipient_profile_id=a.id and n.title='Nuevo ticket de soporte' and n.message=v_msg) then
      insert into notifications(recipient_profile_id,title,message,section,created_by,created_at) values(a.id,'Nuevo ticket de soporte',v_msg,'supportTickets',t.created_by,now());
      v_count := v_count + 1;
    end if;
  end loop;
  return v_count;
end; $$;

grant execute on function public.support_ticket_save_v38(jsonb) to authenticated;
grant execute on function public.notify_support_ticket_event_v38(uuid,text) to authenticated;
grant select on public.support_tickets_frontend_view to authenticated;
grant all on public.support_tickets to authenticated;
grant select on public.permissions to authenticated;
notify pgrst, 'reload schema';
commit;
