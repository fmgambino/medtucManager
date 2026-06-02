-- ISM Robosoft v29 - Notificaciones con fecha/hora, auditoría de usuarios y fix edición masiva de imagen

drop view if exists public.notifications_frontend_view cascade;

create view public.notifications_frontend_view as
select
  n.id,
  n.recipient_profile_id,
  n.title,
  n.message,
  n.section,
  n.read_at,
  n.created_by,
  n.created_at,
  coalesce(nullif(sender.full_name,''), 'Sistema') as sender,
  coalesce(nullif(sender.full_name,''), 'Sistema') as sender_name,
  coalesce(nullif(sender.full_name,''), 'Sistema') as created_by_name,
  coalesce(nullif(recipient.full_name,''), 'Todos / global') as recipient_name,
  coalesce(rr.name, '') as recipient_role,
  to_char(n.created_at at time zone 'America/Argentina/Tucuman', 'DD/MM/YYYY HH24:MI') as created_at_label,
  case when n.read_at is null then null else to_char(n.read_at at time zone 'America/Argentina/Tucuman', 'DD/MM/YYYY HH24:MI') end as read_at_label
from public.notifications n
left join public.profiles sender on sender.id = n.created_by
left join public.profiles recipient on recipient.id = n.recipient_profile_id
left join public.roles rr on rr.id = recipient.role_id
where
  n.recipient_profile_id = auth.uid()
  or n.recipient_profile_id is null
  or exists (
    select 1
    from public.profiles me
    join public.roles r on r.id = me.role_id
    where me.id = auth.uid() and r.code = 'administrator'
  );

grant select on public.notifications_frontend_view to authenticated;
grant update(read_at) on public.notifications to authenticated;

create or replace function public.set_notifications_read_state_v29(
  p_notification_ids uuid[],
  p_read boolean default true
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_is_admin boolean := false;
begin
  select exists (
    select 1 from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.id = auth.uid() and r.code = 'administrator'
  ) into v_is_admin;

  update public.notifications n
     set read_at = case when coalesce(p_read,true) then now() else null end
   where n.id = any(p_notification_ids)
     and (v_is_admin or n.recipient_profile_id = auth.uid() or n.recipient_profile_id is null);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.set_notifications_read_state_v29(uuid[], boolean) to authenticated, anon;

create or replace function public.set_notifications_read_state_v28(
  p_notification_ids uuid[],
  p_read boolean default true
)
returns integer
language sql
security definer
set search_path = public
as $$
  select public.set_notifications_read_state_v29(p_notification_ids, p_read);
$$;

grant execute on function public.set_notifications_read_state_v28(uuid[], boolean) to authenticated, anon;

create or replace function public.notify_admins_user_created_v29()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  a record;
  v_role text := '';
  v_message text;
begin
  select coalesce(r.name, r.code, '') into v_role
  from public.roles r
  where r.id = new.role_id;

  v_message := 'Usuario: ' || coalesce(new.full_name, 'Sin nombre') ||
               case when v_role <> '' then ' · Rol: ' || v_role else '' end ||
               ' · Fecha/hora: ' || to_char(coalesce(new.created_at, now()) at time zone 'America/Argentina/Tucuman', 'DD/MM/YYYY HH24:MI');

  for a in
    select p.id
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where r.code = 'administrator'
      and p.id <> new.id
  loop
    insert into public.notifications(recipient_profile_id, title, message, section, created_by, created_at)
    values (a.id, 'Nuevo usuario registrado', v_message, 'users', new.id, now());
  end loop;

  return new;
end;
$$;

drop trigger if exists trg_notify_admins_user_created_v29 on public.profiles;
create trigger trg_notify_admins_user_created_v29
after insert on public.profiles
for each row
execute function public.notify_admins_user_created_v29();

create or replace function public.bulk_update_inventory_asset_images_v29(
  p_asset_ids uuid[],
  p_image_url text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
begin
  if p_image_url is null or btrim(p_image_url) = '' then
    return 0;
  end if;

  update public.inventory_assets
     set image_url = btrim(p_image_url),
         updated_at = now()
   where id = any(p_asset_ids)
     and coalesce(is_active, true) = true;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.bulk_update_inventory_asset_images_v29(uuid[], text) to authenticated, anon;

notify pgrst, 'reload schema';
