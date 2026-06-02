-- ============================================================
-- ISM ROBOSOFT V40 HOTFIX
-- Notificaciones sin duplicados, RPC faltantes, préstamos 409,
-- visibilidad privada de tickets y limpieza de caché PostgREST.
-- ============================================================

begin;

-- Evitar que una notificación duplicada rompa acciones del sistema.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'uq_notifications_exact_dedupe'
      and conrelid = 'public.notifications'::regclass
  ) then
    alter table public.notifications drop constraint uq_notifications_exact_dedupe;
  end if;
end $$;

-- Limpiar duplicados exactos existentes conservando el más reciente.
with ranked as (
  select id,
         row_number() over (
           partition by recipient_profile_id, title, message, section, date_trunc('minute', created_at)
           order by created_at desc, id desc
         ) rn
  from public.notifications
)
delete from public.notifications n
using ranked r
where n.id = r.id and r.rn > 1;

create index if not exists idx_notifications_recipient_read_created
on public.notifications(recipient_profile_id, read_at, created_at desc);

create index if not exists idx_notifications_exact_lookup
on public.notifications(recipient_profile_id, title, section, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists notifications_select_own_v40 on public.notifications;
drop policy if exists notifications_update_own_v40 on public.notifications;
drop policy if exists notifications_insert_authenticated_v40 on public.notifications;

create policy notifications_select_own_v40
on public.notifications
for select
to authenticated
using (recipient_profile_id = auth.uid());

create policy notifications_update_own_v40
on public.notifications
for update
to authenticated
using (recipient_profile_id = auth.uid())
with check (recipient_profile_id = auth.uid());

create policy notifications_insert_authenticated_v40
on public.notifications
for insert
to authenticated
with check (true);

grant select, insert, update on public.notifications to authenticated;

drop function if exists public.safe_insert_notification_v40(uuid, text, text, text, uuid);
create or replace function public.safe_insert_notification_v40(
  p_recipient uuid,
  p_title text,
  p_message text,
  p_section text default 'notifications',
  p_created_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing uuid;
  v_id uuid;
begin
  if p_recipient is null then
    return null;
  end if;

  select id into v_existing
  from public.notifications
  where recipient_profile_id = p_recipient
    and title = coalesce(p_title,'')
    and message = coalesce(p_message,'')
    and section = coalesce(p_section,'notifications')
    and created_at >= now() - interval '2 minutes'
  order by created_at desc
  limit 1;

  if v_existing is not null then
    return v_existing;
  end if;

  insert into public.notifications(recipient_profile_id,title,message,section,created_by,created_at)
  values(p_recipient, coalesce(p_title,''), coalesce(p_message,''), coalesce(p_section,'notifications'), p_created_by, now())
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.safe_insert_notification_v40(uuid,text,text,text,uuid) to authenticated;

-- RPC que usa la app si existe; filtra solo las del usuario actual.
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
  select distinct on (n.recipient_profile_id, n.title, n.message, n.section, date_trunc('minute', n.created_at))
    n.id,
    n.title,
    n.message,
    coalesce(n.section,'notifications') as section,
    n.created_by,
    n.created_at,
    n.read_at,
    n.recipient_profile_id,
    coalesce(sender.full_name,'Sistema') as sender_name,
    coalesce(rec.full_name,'') as recipient_name,
    coalesce(rr.name, rr.code, '') as recipient_role
  from public.notifications n
  left join public.profiles sender on sender.id = n.created_by
  left join public.profiles rec on rec.id = n.recipient_profile_id
  left join public.roles rr on rr.id = rec.role_id
  where n.recipient_profile_id = auth.uid()
  order by n.recipient_profile_id, n.title, n.message, n.section, date_trunc('minute', n.created_at), n.created_at desc;
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

-- Notificar inicios solo a otros administradores; nunca al usuario que inicia sesión.
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
begin
  if v_user is null then return; end if;

  select p.full_name, coalesce(r.name,r.code,'Usuario')
    into v_name, v_role
  from public.profiles p
  left join public.roles r on r.id = p.role_id
  where p.id = v_user;

  insert into public.user_sessions(profile_id, login_at, last_seen_at, user_agent)
  values(v_user, now(), now(), null);

  for v_admin in
    select p.id
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.id <> v_user
      and lower(coalesce(r.code,r.name,'')) in ('admin','administrador','administrator')
  loop
    perform public.safe_insert_notification_v40(
      v_admin.id,
      'Inicio de sesión',
      'Usuario: '||coalesce(v_name,'Usuario')||' · Rol: '||coalesce(v_role,'-')||' · Fecha: '||to_char(timezone('America/Argentina/Buenos_Aires', now()), 'DD/MM/YYYY HH24:MI'),
      'access',
      v_user
    );
  end loop;
end;
$$;

grant execute on function public.notify_user_login_v39() to authenticated;

drop function if exists public.notify_user_logout_v39();
create or replace function public.notify_user_logout_v39()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then return; end if;
  update public.user_sessions
     set logout_at = now(), last_seen_at = now()
   where id = (
     select id from public.user_sessions
     where profile_id = v_user and logout_at is null
     order by login_at desc
     limit 1
   );
end;
$$;

grant execute on function public.notify_user_logout_v39() to authenticated;

-- Préstamos: función robusta que no falla por notificaciones repetidas.
drop function if exists public.admin_update_loan_status(uuid, text);
create or replace function public.admin_update_loan_status(p_loan_id uuid, p_status_label text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_actor uuid := auth.uid();
  v_requester uuid;
  v_actor_name text;
begin
  v_status := lower(coalesce(p_status_label,'abierto'));
  v_status := case v_status
    when 'pendiente' then 'abierto'
    when 'aprobado' then 'aprobado'
    when 'rechazado' then 'rechazado'
    when 'devuelto' then 'cerrado'
    when 'cerrado' then 'cerrado'
    when 'retirado' then 'retirado'
    when 'vencido' then 'vencido'
    when 'cancelado' then 'cancelado'
    else 'abierto'
  end;

  update public.inventory_loans
     set status = v_status,
         updated_at = now(),
         approved_at = case when v_status in ('aprobado','retirado') then coalesce(approved_at, now()) else approved_at end,
         approved_by = case when v_status in ('aprobado','rechazado','retirado') then v_actor else approved_by end,
         returned_at = case when v_status = 'cerrado' then coalesce(returned_at, now()) else returned_at end
   where id = p_loan_id
   returning requester_profile_id into v_requester;

  select full_name into v_actor_name from public.profiles where id = v_actor;

  if v_requester is not null and v_requester <> v_actor then
    perform public.safe_insert_notification_v40(
      v_requester,
      'Préstamo actualizado',
      'Estado: '||initcap(v_status)||' · Actualizó: '||coalesce(v_actor_name,'Administrador')||' · Fecha: '||to_char(timezone('America/Argentina/Buenos_Aires', now()), 'DD/MM/YYYY HH24:MI'),
      'loans',
      v_actor
    );
  end if;
end;
$$;

grant execute on function public.admin_update_loan_status(uuid,text) to authenticated;

-- Tickets: admins ven todo; docentes/alumnos solo propios.
alter table public.support_tickets enable row level security;
drop policy if exists support_tickets_select_private_v40 on public.support_tickets;
drop policy if exists support_tickets_update_private_v40 on public.support_tickets;
drop policy if exists support_tickets_delete_private_v40 on public.support_tickets;

create policy support_tickets_select_private_v40
on public.support_tickets
for select
to authenticated
using (
  created_by = auth.uid()
  or requester_id = auth.uid()
  or exists (
    select 1 from public.profiles p join public.roles r on r.id = p.role_id
    where p.id = auth.uid() and lower(coalesce(r.code,r.name,'')) in ('admin','administrador','administrator')
  )
);

create policy support_tickets_update_private_v40
on public.support_tickets
for update
to authenticated
using (
  created_by = auth.uid()
  or requester_id = auth.uid()
  or exists (
    select 1 from public.profiles p join public.roles r on r.id = p.role_id
    where p.id = auth.uid() and lower(coalesce(r.code,r.name,'')) in ('admin','administrador','administrator')
  )
)
with check (
  created_by = auth.uid()
  or requester_id = auth.uid()
  or exists (
    select 1 from public.profiles p join public.roles r on r.id = p.role_id
    where p.id = auth.uid() and lower(coalesce(r.code,r.name,'')) in ('admin','administrador','administrator')
  )
);

create policy support_tickets_delete_private_v40
on public.support_tickets
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p join public.roles r on r.id = p.role_id
    where p.id = auth.uid() and lower(coalesce(r.code,r.name,'')) in ('admin','administrador','administrator')
  )
  or created_by = auth.uid()
);

grant select, insert, update, delete on public.support_tickets to authenticated;

notify pgrst, 'reload schema';
commit;
