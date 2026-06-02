-- ISM Robosoft v13 - FIX destinatarios reales en módulo Notificaciones
-- Ejecutar completo en Supabase SQL Editor después de subir el proyecto.

begin;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  section text default 'notifications',
  read_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

alter table public.notifications add column if not exists recipient_profile_id uuid references public.profiles(id) on delete cascade;
alter table public.notifications add column if not exists section text default 'notifications';
alter table public.notifications add column if not exists read_at timestamptz;
alter table public.notifications add column if not exists created_by uuid references public.profiles(id);
alter table public.notifications add column if not exists created_at timestamptz default now();

create index if not exists notifications_recipient_created_idx on public.notifications(recipient_profile_id, created_at desc);

drop view if exists public.notifications_frontend_view cascade;
create view public.notifications_frontend_view as
select
  n.id,
  n.recipient_profile_id,
  n.title,
  n.message,
  coalesce(n.section,'notifications') as section,
  n.read_at,
  n.created_by,
  n.created_at
from public.notifications n
where n.recipient_profile_id = auth.uid()
   or exists (
     select 1
     from public.profiles p
     join public.roles r on r.id = p.role_id
     where p.id = auth.uid() and r.code = 'administrator'
   );

grant select on public.notifications_frontend_view to authenticated;
grant select, insert, update on public.notifications to authenticated;

drop function if exists public.send_notification(text,text,text,text[],text);
create or replace function public.send_notification(
  p_title text,
  p_message text,
  p_target text,
  p_recipient_ids text[] default array[]::text[],
  p_section text default 'notifications'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sender uuid := auth.uid();
  v_count integer := 0;
begin
  if v_sender is null then
    raise exception 'No autorizado';
  end if;

  if nullif(trim(p_title),'') is null or nullif(trim(p_message),'') is null then
    raise exception 'Título y mensaje son obligatorios';
  end if;

  if p_target = 'all' then
    insert into public.notifications(recipient_profile_id, title, message, section, created_by)
    select p.id, p_title, p_message, coalesce(p_section,'notifications'), v_sender
    from public.profiles p
    where coalesce(p.is_active,true) is true;

  elsif p_target = 'teachers' then
    insert into public.notifications(recipient_profile_id, title, message, section, created_by)
    select p.id, p_title, p_message, coalesce(p_section,'notifications'), v_sender
    from public.profiles p join public.roles r on r.id = p.role_id
    where r.code = 'teacher' and coalesce(p.is_active,true) is true;

  elsif p_target = 'students' then
    insert into public.notifications(recipient_profile_id, title, message, section, created_by)
    select p.id, p_title, p_message, coalesce(p_section,'notifications'), v_sender
    from public.profiles p join public.roles r on r.id = p.role_id
    where r.code = 'student' and coalesce(p.is_active,true) is true;

  elsif p_target in ('individual','multi') then
    insert into public.notifications(recipient_profile_id, title, message, section, created_by)
    select distinct p.id, p_title, p_message, coalesce(p_section,'notifications'), v_sender
    from public.profiles p
    where p.id::text = any(coalesce(p_recipient_ids, array[]::text[]))
      and coalesce(p.is_active,true) is true;

  elsif p_target = 'team' then
    insert into public.notifications(recipient_profile_id, title, message, section, created_by)
    select distinct tm.profile_id, p_title, p_message, coalesce(p_section,'notifications'), v_sender
    from public.team_members tm
    join public.profiles p on p.id = tm.profile_id
    where tm.team_id::text = any(coalesce(p_recipient_ids, array[]::text[]))
      and coalesce(p.is_active,true) is true;
  else
    raise exception 'Destino no válido: %', p_target;
  end if;

  get diagnostics v_count = row_count;
  if v_count = 0 then
    raise exception 'No se encontraron destinatarios para el destino seleccionado';
  end if;
  return v_count;
end;
$$;

grant execute on function public.send_notification(text,text,text,text[],text) to authenticated;

drop function if exists public.mark_notification_read(uuid);
create or replace function public.mark_notification_read(p_notification_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notifications
  set read_at = coalesce(read_at, now())
  where id = p_notification_id
    and (
      recipient_profile_id = auth.uid()
      or exists (
        select 1 from public.profiles p join public.roles r on r.id = p.role_id
        where p.id = auth.uid() and r.code = 'administrator'
      )
    );
end;
$$;

grant execute on function public.mark_notification_read(uuid) to authenticated;

commit;
notify pgrst, 'reload schema';
