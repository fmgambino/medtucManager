-- ISM Robosoft v12 - FIX prestamos, notificaciones y RPC inventario
-- Ejecutar completo en Supabase SQL Editor.

begin;

-- Limpieza de funciones conflictivas. PostgreSQL no permite cambiar defaults/tipos con CREATE OR REPLACE.
drop function if exists public.admin_update_inventory_asset(uuid,text,uuid,uuid,text,uuid,text,text,text,uuid,uuid,text);
drop function if exists public.admin_update_inventory_asset(uuid,text,text,text,text,text,text,text,text,text,text,text);
drop function if exists public.create_loan_request(text,date,time,time,text[],text);
drop function if exists public.admin_update_loan_status(uuid,text);
drop function if exists public.mark_notification_read(uuid);

-- RPC única para actualizar inventario. Deja una sola firma, sin ambigüedad.
create or replace function public.admin_update_inventory_asset(
  p_asset_id uuid,
  p_barcode text,
  p_brand uuid,
  p_category uuid,
  p_condition_note text,
  p_location_code uuid,
  p_location_detail text,
  p_name text,
  p_serial_number text,
  p_status uuid,
  p_supplier uuid,
  p_zone text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.inventory_assets
  set
    barcode = coalesce(nullif(p_barcode,''), barcode),
    serial_number = coalesce(nullif(p_serial_number,''), serial_number),
    condition_note = coalesce(nullif(p_condition_note,''), condition_note),
    current_location_id = coalesce(p_location_code, current_location_id),
    location_detail = coalesce(nullif(p_location_detail,''), location_detail),
    zone = coalesce(nullif(p_zone,''), zone),
    status_id = coalesce(p_status, status_id),
    updated_at = now()
  where id = p_asset_id;

  if p_name is not null or p_category is not null or p_brand is not null or p_supplier is not null then
    update public.inventory_catalog_items ci
    set
      name = coalesce(nullif(p_name,''), ci.name),
      category_id = coalesce(p_category, ci.category_id),
      brand_id = coalesce(p_brand, ci.brand_id),
      supplier_id = coalesce(p_supplier, ci.supplier_id),
      updated_at = now()
    from public.inventory_assets ia
    where ia.catalog_item_id = ci.id and ia.id = p_asset_id;
  end if;
end;
$$;

grant execute on function public.admin_update_inventory_asset(uuid,text,uuid,uuid,text,uuid,text,text,text,uuid,uuid,text) to authenticated;

-- Tablas/campos requeridos por prestamos.
alter table public.inventory_loans add column if not exists use_date date;
alter table public.inventory_loans add column if not exists from_time time;
alter table public.inventory_loans add column if not exists to_time time;

-- Notificaciones reales.
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
select n.id, n.recipient_profile_id, n.title, n.message, coalesce(n.section,'notifications') as section, n.read_at, n.created_at
from public.notifications n
where n.recipient_profile_id = auth.uid()
   or exists (
     select 1 from public.profiles p join public.roles r on r.id = p.role_id
     where p.id = auth.uid() and r.code = 'administrator'
   );

grant select, insert, update on public.notifications to authenticated;
grant select on public.notifications_frontend_view to authenticated;

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
    and (recipient_profile_id = auth.uid()
      or exists (select 1 from public.profiles p join public.roles r on r.id = p.role_id where p.id = auth.uid() and r.code = 'administrator'));
end;
$$;
grant execute on function public.mark_notification_read(uuid) to authenticated;

-- Vista de prestamos. Se elimina primero para evitar errores de columnas renombradas.
drop view if exists public.loans_frontend_view cascade;
create view public.loans_frontend_view as
select
  l.id,
  l.requester_profile_id as requester_id,
  coalesce(p.full_name, 'Sin solicitante') as requester,
  coalesce(t.name, l.notes, 'Sin equipo') as team,
  coalesce(l.use_date::text, l.requested_at::date::text) as requested_at,
  coalesce(to_char(l.from_time,'HH24:MI'), '') as from_time,
  coalesce(to_char(l.to_time,'HH24:MI'), '') as to_time,
  coalesce(array_agg(coalesce(a.asset_code, a.barcode, ci.name) order by coalesce(a.asset_code, a.barcode, ci.name)) filter (where li.id is not null), array[]::text[]) as items,
  coalesce(l.notes, '-') as notes,
  l.status,
  case l.status
    when 'abierto' then 'Pendiente'
    when 'aprobado' then 'Aprobado'
    when 'rechazado' then 'Rechazado'
    when 'cerrado' then 'Devuelto'
    when 'cancelado' then 'Rechazado'
    else initcap(l.status)
  end as status_label,
  l.created_at
from public.inventory_loans l
left join public.profiles p on p.id = l.requester_profile_id
left join public.teams t on t.id = l.team_id
left join public.inventory_loan_items li on li.loan_id = l.id
left join public.inventory_assets a on a.id = li.asset_id
left join public.inventory_catalog_items ci on ci.id = a.catalog_item_id
group by l.id, p.full_name, t.name;

grant select on public.loans_frontend_view to authenticated;

-- Crear solicitud desde perfiles alumno/docente/admin.
create or replace function public.create_loan_request(
  p_team text,
  p_use_date date,
  p_from_time time,
  p_to_time time,
  p_items text[],
  p_notes text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_loan_id uuid;
  v_team_id uuid;
  v_code text;
  v_item text;
  v_asset_id uuid;
  v_requester_name text;
begin
  if auth.uid() is null then
    raise exception 'No autorizado';
  end if;

  select id into v_team_id from public.teams where name = p_team limit 1;
  select coalesce(full_name,'Un usuario') into v_requester_name from public.profiles where id = auth.uid();
  v_code := 'PRE-' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS') || '-' || substr(auth.uid()::text, 1, 4);

  insert into public.inventory_loans(
    loan_code, requester_profile_id, team_id, requested_at, use_date, from_time, to_time, notes, status, created_by
  ) values (
    v_code, auth.uid(), v_team_id, now(), p_use_date, p_from_time, p_to_time, nullif(p_notes,''), 'abierto', auth.uid()
  ) returning id into v_loan_id;

  foreach v_item in array coalesce(p_items, array[]::text[]) loop
    select ia.id into v_asset_id
    from public.inventory_assets ia
    left join public.inventory_catalog_items ci on ci.id = ia.catalog_item_id
    where ia.asset_code = v_item or ia.barcode = v_item or ci.name = v_item
    limit 1;

    if v_asset_id is not null then
      insert into public.inventory_loan_items(loan_id, asset_id, quantity, notes)
      values (v_loan_id, v_asset_id, 1, p_notes);
    end if;
  end loop;

  -- Notifica a todos los administradores activos.
  insert into public.notifications(recipient_profile_id, title, message, section, created_by)
  select p.id,
         'Nueva solicitud de préstamo',
         v_requester_name || ' registró una solicitud de préstamo.',
         'loanManagement',
         auth.uid()
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where r.code = 'administrator' and p.is_active is true;

  return v_loan_id;
end;
$$;

grant execute on function public.create_loan_request(text,date,time,time,text[],text) to authenticated;

-- Cambiar estado desde administrador y notificar al solicitante.
create or replace function public.admin_update_loan_status(p_loan_id uuid, p_status_label text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_requester uuid;
begin
  v_status := case p_status_label
    when 'Aprobado' then 'aprobado'
    when 'Rechazado' then 'rechazado'
    when 'Devuelto' then 'cerrado'
    else 'abierto'
  end;

  update public.inventory_loans
  set status = v_status,
      approved_at = case when v_status = 'aprobado' then coalesce(approved_at, now()) else approved_at end,
      returned_at = case when v_status = 'cerrado' then coalesce(returned_at, now()) else returned_at end,
      approved_by = case when v_status = 'aprobado' then auth.uid() else approved_by end,
      updated_at = now()
  where id = p_loan_id
  returning requester_profile_id into v_requester;

  if not found then
    raise exception 'Solicitud de préstamo no encontrada';
  end if;

  if v_requester is not null then
    insert into public.notifications(recipient_profile_id, title, message, section, created_by)
    values (v_requester, 'Solicitud de préstamo actualizada', 'Tu solicitud fue marcada como ' || p_status_label || '.', 'loanManagement', auth.uid());
  end if;
end;
$$;

grant execute on function public.admin_update_loan_status(uuid,text) to authenticated;

commit;

notify pgrst, 'reload schema';
