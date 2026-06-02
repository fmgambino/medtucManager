-- ISM Robosoft v41 - hotfix mobile/notificaciones/préstamos/tickets
begin;

-- Inserción segura de notificaciones: nunca rompe la operación principal por duplicado.
drop function if exists public.safe_insert_notification_v41(uuid,text,text,text,uuid);
create or replace function public.safe_insert_notification_v41(
  p_recipient uuid,
  p_title text,
  p_message text,
  p_section text default 'notifications',
  p_created_by uuid default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if p_recipient is null then return null; end if;
  select id into v_id
  from public.notifications
  where recipient_profile_id = p_recipient
    and title = coalesce(p_title,'')
    and message = coalesce(p_message,'')
    and coalesce(section,'notifications') = coalesce(p_section,'notifications')
    and created_at >= now() - interval '2 minutes'
  order by created_at desc
  limit 1;
  if v_id is not null then return v_id; end if;
  begin
    insert into public.notifications(recipient_profile_id,title,message,section,created_by,created_at)
    values(p_recipient, coalesce(p_title,''), coalesce(p_message,''), coalesce(p_section,'notifications'), p_created_by, now())
    returning id into v_id;
  exception when unique_violation then
    select id into v_id
    from public.notifications
    where recipient_profile_id = p_recipient
      and title = coalesce(p_title,'')
      and message = coalesce(p_message,'')
      and coalesce(section,'notifications') = coalesce(p_section,'notifications')
    order by created_at desc
    limit 1;
  end;
  return v_id;
end;
$$;
grant execute on function public.safe_insert_notification_v41(uuid,text,text,text,uuid) to authenticated;

-- RPC de listado para evitar 404 si la app o cache lo llama.
drop function if exists public.list_my_notifications_v39();
create or replace function public.list_my_notifications_v39()
returns table(
  id uuid,
  title text,
  message text,
  section text,
  created_by uuid,
  created_at timestamptz,
  read_at timestamptz,
  recipient_profile_id uuid,
  sender_name text,
  recipient_name text,
  recipient_role text
)
language sql
security definer
set search_path = public
as $$
  select distinct on (n.recipient_profile_id, n.title, n.message, coalesce(n.section,'notifications'), date_trunc('minute', n.created_at))
    n.id, n.title, n.message, coalesce(n.section,'notifications'), n.created_by, n.created_at, n.read_at, n.recipient_profile_id,
    coalesce(sender.full_name,'Sistema') as sender_name,
    coalesce(rec.full_name,'') as recipient_name,
    coalesce(rr.name, rr.code, '') as recipient_role
  from public.notifications n
  left join public.profiles sender on sender.id = n.created_by
  left join public.profiles rec on rec.id = n.recipient_profile_id
  left join public.roles rr on rr.id = rec.role_id
  where n.recipient_profile_id = auth.uid()
  order by n.recipient_profile_id, n.title, n.message, coalesce(n.section,'notifications'), date_trunc('minute', n.created_at), n.created_at desc;
$$;
grant execute on function public.list_my_notifications_v39() to authenticated;

drop function if exists public.set_notifications_read_state_v39(uuid[], boolean);
create or replace function public.set_notifications_read_state_v39(p_notification_ids uuid[], p_read boolean default true)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notifications
     set read_at = case when p_read then now() else null end
   where id = any(p_notification_ids)
     and recipient_profile_id = auth.uid();
end;
$$;
grant execute on function public.set_notifications_read_state_v39(uuid[], boolean) to authenticated;

-- Login: notifica solo a OTROS administradores, jamás al usuario logueado.
drop function if exists public.notify_user_login_v39();
create or replace function public.notify_user_login_v39()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_name text;
  v_role text;
  v_admin record;
  v_msg text;
begin
  if v_user is null then return; end if;
  select p.full_name, coalesce(r.name,r.code,'Usuario') into v_name, v_role
  from public.profiles p left join public.roles r on r.id = p.role_id
  where p.id = v_user;

  insert into public.user_sessions(profile_id, login_at, last_seen_at, user_agent)
  values(v_user, now(), now(), null)
  on conflict do nothing;

  v_msg := 'Usuario: '||coalesce(v_name,'Usuario')||' · Rol: '||coalesce(v_role,'-')||' · Fecha: '||to_char(timezone('America/Argentina/Buenos_Aires', now()), 'DD/MM/YYYY HH24:MI');

  for v_admin in
    select p.id from public.profiles p join public.roles r on r.id = p.role_id
    where p.id <> v_user and lower(coalesce(r.code,r.name,'')) in ('admin','administrador','administrator')
  loop
    perform public.safe_insert_notification_v41(v_admin.id, 'Inicio de sesión', v_msg, 'access', v_user);
  end loop;
end;
$$;
grant execute on function public.notify_user_login_v39() to authenticated;

-- Admin update préstamo: no falla si la notificación ya existe.
drop function if exists public.admin_update_loan_status(uuid,text);
create or replace function public.admin_update_loan_status(p_loan_id uuid, p_status_label text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_requester uuid;
  v_actor uuid := auth.uid();
  v_actor_name text;
begin
  v_status := case lower(coalesce(p_status_label,''))
    when 'pendiente' then 'abierto'
    when 'aprobado' then 'aprobado'
    when 'rechazado' then 'rechazado'
    when 'devuelto' then 'cerrado'
    when 'cerrado' then 'cerrado'
    when 'retirado' then 'retirado'
    when 'vencido' then 'vencido'
    when 'cancelado' then 'cancelado'
    else coalesce(nullif(lower(p_status_label),''),'abierto')
  end;

  update public.inventory_loans
     set status = v_status,
         updated_at = now(),
         approved_at = case when v_status in ('aprobado','retirado') then coalesce(approved_at, now()) else approved_at end,
         approved_by = case when v_status in ('aprobado','rechazado','retirado','cerrado') then coalesce(v_actor, approved_by) else approved_by end
   where id = p_loan_id
   returning requester_profile_id into v_requester;

  select full_name into v_actor_name from public.profiles where id = v_actor;

  if v_requester is not null then
    perform public.safe_insert_notification_v41(
      v_requester,
      'Préstamo actualizado',
      'Estado: '||p_status_label||' · Actualizó: '||coalesce(v_actor_name,'Administrador')||' · Fecha: '||to_char(timezone('America/Argentina/Buenos_Aires', now()), 'DD/MM/YYYY HH24:MI'),
      'loans',
      v_actor
    );
  end if;
end;
$$;
grant execute on function public.admin_update_loan_status(uuid,text) to authenticated;

-- Ticket number robusto para evitar 409 por duplicados desde clientes viejos.
create sequence if not exists public.support_ticket_number_seq start 1;

create or replace function public.next_support_ticket_number_v41()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare n bigint; candidate text;
begin
  loop
    n := nextval('public.support_ticket_number_seq');
    candidate := 'TK-' || to_char(timezone('America/Argentina/Buenos_Aires', now()), 'YYYY') || '-' || lpad(n::text, 5, '0');
    exit when not exists(select 1 from public.support_tickets where ticket_number = candidate);
  end loop;
  return candidate;
end;
$$;
grant execute on function public.next_support_ticket_number_v41() to authenticated;

drop function if exists public.support_ticket_save_v39(jsonb);
create or replace function public.support_ticket_save_v39(p_ticket jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid := nullif(p_ticket->>'id','')::uuid;
  v_row public.support_tickets%rowtype;
  v_number text;
begin
  if v_id is null then
    v_number := coalesce(nullif(p_ticket->>'ticket_number',''), public.next_support_ticket_number_v41());
    if exists(select 1 from public.support_tickets where ticket_number = v_number) then
      v_number := public.next_support_ticket_number_v41();
    end if;
    insert into public.support_tickets(ticket_number,title,description,room,asset_id,asset_label,incident_type,status,priority,history,requester_id,requester_name,assigned_to,created_by,created_at,updated_at)
    values(
      v_number,
      coalesce(p_ticket->>'title','Sin título'),
      nullif(p_ticket->>'description',''),
      coalesce(nullif(p_ticket->>'room',''),'Laboratorio de Robótica'),
      nullif(p_ticket->>'asset_id','')::uuid,
      nullif(p_ticket->>'asset_label',''),
      nullif(p_ticket->>'incident_type',''),
      coalesce(nullif(p_ticket->>'status',''),'pendiente'),
      coalesce(nullif(p_ticket->>'priority',''),'Normal'),
      nullif(p_ticket->>'history',''),
      coalesce(nullif(p_ticket->>'requester_id','')::uuid, auth.uid()),
      nullif(p_ticket->>'requester_name',''),
      nullif(p_ticket->>'assigned_to','')::uuid,
      coalesce(nullif(p_ticket->>'created_by','')::uuid, auth.uid()),
      now(), now()
    ) returning * into v_row;
  else
    update public.support_tickets set
      title = coalesce(p_ticket->>'title', title),
      description = nullif(p_ticket->>'description',''),
      room = coalesce(nullif(p_ticket->>'room',''), room),
      asset_id = nullif(p_ticket->>'asset_id','')::uuid,
      asset_label = nullif(p_ticket->>'asset_label',''),
      incident_type = nullif(p_ticket->>'incident_type',''),
      status = coalesce(nullif(p_ticket->>'status',''), status),
      priority = coalesce(nullif(p_ticket->>'priority',''), priority),
      history = nullif(p_ticket->>'history',''),
      updated_at = now()
    where id = v_id
    returning * into v_row;
  end if;
  return to_jsonb(v_row);
end;
$$;
grant execute on function public.support_ticket_save_v39(jsonb) to authenticated;

notify pgrst, 'reload schema';
commit;
