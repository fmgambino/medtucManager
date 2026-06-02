-- ============================================================
-- ISM ROBOSOFT V39
-- Fix notificaciones duplicadas/no leídas, login sin auto-notificación,
-- secuencia tickets y visibilidad privada.
-- ============================================================
begin;
set timezone = 'America/Argentina/Buenos_Aires';

create sequence if not exists public.support_ticket_seq;
select setval('public.support_ticket_seq', greatest(
  coalesce((select max((regexp_match(ticket_number, 'TK-[0-9]{4}-([0-9]+)'))[1]::bigint) from public.support_tickets where ticket_number ~ '^TK-[0-9]{4}-[0-9]+$'),0),
  coalesce((select last_value from public.support_ticket_seq),0)
), true);

-- eliminar duplicados exactos de notificaciones por destinatario/título/mensaje/sección
with ranked as (
  select id, row_number() over(partition by recipient_profile_id, title, message, coalesce(section,''), created_by order by created_at asc, id asc) rn
  from public.notifications
)
delete from public.notifications n using ranked r where n.id=r.id and r.rn > 1;

create index if not exists idx_notifications_recipient_read_created on public.notifications(recipient_profile_id, read_at, created_at desc);
create unique index if not exists uq_notifications_exact_dedupe
on public.notifications(recipient_profile_id, title, message, coalesce(section,''), coalesce(created_by,'00000000-0000-0000-0000-000000000000'::uuid));

-- RPC para leer SOLO notificaciones propias. Admin ya no ve copias de todos los destinatarios en su bandeja.
drop function if exists public.list_my_notifications_v39();
create function public.list_my_notifications_v39()
returns table(
  id uuid,
  title text,
  message text,
  section text,
  created_by uuid,
  created_at timestamptz,
  read_at timestamptz,
  sender_name text,
  recipient_name text,
  recipient_role text
)
language sql security definer set search_path=public as $$
  select n.id, n.title, n.message, n.section, n.created_by, n.created_at, n.read_at,
         coalesce(cp.full_name,'Sistema') as sender_name,
         coalesce(rp.full_name,'') as recipient_name,
         coalesce(rr.name,'') as recipient_role
  from public.notifications n
  left join public.profiles cp on cp.id=n.created_by
  left join public.profiles rp on rp.id=n.recipient_profile_id
  left join public.roles rr on rr.id=rp.role_id
  where n.recipient_profile_id = auth.uid()
  order by n.created_at desc
  limit 2000;
$$;

drop function if exists public.set_notifications_read_state_v39(uuid[], boolean);
create function public.set_notifications_read_state_v39(p_notification_ids uuid[], p_read boolean default true)
returns integer
language plpgsql security definer set search_path=public as $$
declare v_count integer;
begin
  update public.notifications
  set read_at = case when p_read then now() else null end
  where id = any(p_notification_ids)
    and recipient_profile_id = auth.uid();
  get diagnostics v_count = row_count;
  return v_count;
end; $$;

-- Ticket save robusto: nunca reutiliza ticket_number ni confía en el front para tickets nuevos.
drop function if exists public.support_ticket_save_v39(jsonb);
create function public.support_ticket_save_v39(p_ticket jsonb)
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
      title=coalesce(nullif(p_ticket->>'title',''),title),
      description=p_ticket->>'description',
      room=coalesce(nullif(p_ticket->>'room',''),room),
      asset_id=nullif(p_ticket->>'asset_id','')::uuid,
      asset_label=p_ticket->>'asset_label',
      incident_type=p_ticket->>'incident_type',
      status=case when v_is_admin then coalesce(nullif(p_ticket->>'status',''),status) else status end,
      priority=coalesce(nullif(p_ticket->>'priority',''),priority),
      history=p_ticket->>'history',
      updated_at=now()
    where id=v_id returning * into v_row;
  else
    loop
      v_ticket_number := 'TK-' || to_char(now() at time zone 'America/Argentina/Buenos_Aires','YYYY') || '-' || lpad(nextval('public.support_ticket_seq')::text,5,'0');
      begin
        insert into support_tickets(id,ticket_number,title,description,room,asset_id,asset_label,incident_type,status,priority,history,requester_id,requester_name,assigned_to,created_by,created_at,updated_at)
        values (gen_random_uuid(), v_ticket_number,
          coalesce(nullif(p_ticket->>'title',''),'Ticket de soporte'),
          p_ticket->>'description', coalesce(nullif(p_ticket->>'room',''),'Laboratorio de Robótica'),
          nullif(p_ticket->>'asset_id','')::uuid, p_ticket->>'asset_label', p_ticket->>'incident_type',
          coalesce(nullif(p_ticket->>'status',''),'pendiente'), coalesce(nullif(p_ticket->>'priority',''),'Normal'), p_ticket->>'history',
          coalesce(nullif(p_ticket->>'requester_id','')::uuid,v_uid),
          coalesce(nullif(p_ticket->>'requester_name',''),(select full_name from profiles where id=v_uid),'Usuario'),
          nullif(p_ticket->>'assigned_to','')::uuid, coalesce(nullif(p_ticket->>'created_by','')::uuid,v_uid), now(), now())
        returning * into v_row;
        exit;
      exception when unique_violation then
        -- probar siguiente número
      end;
    end loop;
  end if;
  return v_row;
end; $$;

-- Notificaciones de soporte: solo admins y solicitante, sin duplicar.
drop function if exists public.notify_support_ticket_event_v39(uuid,text);
create function public.notify_support_ticket_event_v39(p_ticket_id uuid, p_action text default 'creado')
returns integer
language plpgsql security definer set search_path=public as $$
declare
  t support_tickets;
  r record;
  v_title text;
  v_msg text;
  v_count integer := 0;
begin
  select * into t from support_tickets where id=p_ticket_id;
  if t.id is null then return 0; end if;
  v_title := case when p_action='actualizado' then 'Ticket de soporte actualizado' else 'Nuevo ticket de soporte' end;
  v_msg := 'Ticket '||t.ticket_number||' · '||coalesce(t.title,'')||' · Incidencia: '||coalesce(t.incident_type,'-')||' · Urgencia: '||coalesce(t.priority,'Normal')||' · Cargó: '||coalesce(t.requester_name,'Usuario')||' · Fecha: '||to_char(t.created_at at time zone 'America/Argentina/Buenos_Aires','DD/MM/YYYY HH24:MI')||' · Estado: '||coalesce(t.status,'pendiente');

  for r in
    select distinct id from (
      select p.id from profiles p join roles ro on ro.id=p.role_id where lower(ro.code) in ('admin','administrator','administrador')
      union
      select t.requester_id where t.requester_id is not null
    ) x where id is not null
  loop
    insert into notifications(recipient_profile_id,title,message,section,created_by,created_at)
    values(r.id, v_title, v_msg, 'supportTickets', t.created_by, now())
    on conflict do nothing;
    v_count := v_count + 1;
  end loop;
  return v_count;
end; $$;

-- Login/logout: avisar solo a otros administradores, no al usuario que inició sesión; dedupe por minuto.
drop function if exists public.notify_user_login_v39();
create function public.notify_user_login_v39()
returns integer
language plpgsql security definer set search_path=public as $$
declare
  u profiles; role_name text; r record; msg text; v_count int:=0;
begin
  select p.* into u from profiles p where p.id=auth.uid();
  if u.id is null then return 0; end if;
  select coalesce(ro.name, ro.code, '') into role_name from roles ro where ro.id=u.role_id;
  msg := 'Usuario: '||coalesce(u.full_name,'Usuario')||' · Rol: '||coalesce(role_name,'')||' · Fecha: '||to_char(now() at time zone 'America/Argentina/Buenos_Aires','DD/MM/YYYY HH24:MI');
  for r in select p.id from profiles p join roles ro on ro.id=p.role_id where lower(ro.code) in ('admin','administrator','administrador') and p.id <> auth.uid() loop
    if not exists(select 1 from notifications n where n.recipient_profile_id=r.id and n.title='Inicio de sesión' and n.created_by=auth.uid() and n.created_at > now() - interval '2 minutes') then
      insert into notifications(recipient_profile_id,title,message,section,created_by,created_at) values(r.id,'Inicio de sesión',msg,'notifications',auth.uid(),now()) on conflict do nothing;
      v_count := v_count + 1;
    end if;
  end loop;
  return v_count;
end; $$;

drop function if exists public.notify_user_logout_v39();
create function public.notify_user_logout_v39()
returns integer
language plpgsql security definer set search_path=public as $$
declare
  u profiles; role_name text; r record; msg text; v_count int:=0;
begin
  select p.* into u from profiles p where p.id=auth.uid();
  if u.id is null then return 0; end if;
  select coalesce(ro.name, ro.code, '') into role_name from roles ro where ro.id=u.role_id;
  msg := 'Usuario: '||coalesce(u.full_name,'Usuario')||' · Permanencia registrada · Fecha: '||to_char(now() at time zone 'America/Argentina/Buenos_Aires','DD/MM/YYYY HH24:MI');
  for r in select p.id from profiles p join roles ro on ro.id=p.role_id where lower(ro.code) in ('admin','administrator','administrador') and p.id <> auth.uid() loop
    if not exists(select 1 from notifications n where n.recipient_profile_id=r.id and n.title='Cierre de sesión' and n.created_by=auth.uid() and n.created_at > now() - interval '2 minutes') then
      insert into notifications(recipient_profile_id,title,message,section,created_by,created_at) values(r.id,'Cierre de sesión',msg,'notifications',auth.uid(),now()) on conflict do nothing;
      v_count := v_count + 1;
    end if;
  end loop;
  return v_count;
end; $$;

grant execute on function public.list_my_notifications_v39() to authenticated;
grant execute on function public.set_notifications_read_state_v39(uuid[], boolean) to authenticated;
grant execute on function public.support_ticket_save_v39(jsonb) to authenticated;
grant execute on function public.notify_support_ticket_event_v39(uuid,text) to authenticated;
grant execute on function public.notify_user_login_v39() to authenticated;
grant execute on function public.notify_user_logout_v39() to authenticated;
notify pgrst, 'reload schema';
commit;
