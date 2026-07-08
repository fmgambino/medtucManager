-- MEDTUC Ticket Manager v8.51 FINAL
create extension if not exists unaccent;
-- Ejecutar en Supabase SQL Editor antes de subir los archivos.
-- Objetivo: reparar usuarios Auth huérfanos, limitar scope por cuenta y asignar técnicos por tarea/horario/excepción.

begin;

-- 1) Índices/constraints operativos seguros.
create unique index if not exists uq_technician_task_types_pair
on public.technician_task_types(technician_id, task_type_id);

create index if not exists idx_support_tickets_created_by on public.support_tickets(created_by);
create index if not exists idx_support_tickets_requester_email on public.support_tickets(lower(requester_email));
create index if not exists idx_support_tickets_task_type on public.support_tickets(task_type_id);
create index if not exists idx_service_orders_created_by on public.service_orders(created_by);
create index if not exists idx_service_orders_requester_email on public.service_orders(lower(requester_email));
create index if not exists idx_service_orders_task_type on public.service_orders(task_type_id);
create index if not exists idx_notifications_target_user on public.notifications(target_user);
create index if not exists idx_notifications_entity on public.notifications(entity_id);

-- 2) RPC para reparar perfiles borrados cuando el usuario todavía existe en Supabase Auth.
create or replace function public.medtuc_repair_orphan_profile(
  p_email text,
  p_full_name text default null,
  p_role_name text default 'Usuarios',
  p_office text default null,
  p_phone text default null,
  p_is_active boolean default true,
  p_work_days text[] default array['1','2','3','4','5'],
  p_work_start time default '08:00',
  p_work_end time default '14:00'
)
returns public.profiles
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_auth_id uuid;
  v_caller_role text;
  v_profile public.profiles;
begin
  select role_name into v_caller_role from public.profiles where id = auth.uid();
  if coalesce(v_caller_role,'') not in ('SuperAdmin','Admin') then
    raise exception 'Solo SuperAdmin/Admin puede reparar o crear perfiles.';
  end if;

  select id into v_auth_id from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  if v_auth_id is null then
    raise exception 'AUTH_USER_NOT_FOUND: el email no existe en Supabase Authentication. Cree el usuario en Auth o use la Edge Function admin-create-user.';
  end if;

  insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,work_days,work_start,work_end,source,updated_at)
  values (
    v_auth_id,
    lower(trim(p_email)),
    coalesce(nullif(trim(p_full_name),''), lower(trim(p_email))),
    coalesce(nullif(trim(p_role_name),''),'Usuarios'),
    nullif(trim(p_office),''),
    nullif(trim(p_phone),''),
    coalesce(p_is_active,true),
    coalesce(p_work_days,array['1','2','3','4','5']),
    coalesce(p_work_start,'08:00'::time),
    coalesce(p_work_end,'14:00'::time),
    'AUTH_REPAIR',
    now()
  )
  on conflict (id) do update set
    email=excluded.email,
    full_name=excluded.full_name,
    role_name=excluded.role_name,
    office=excluded.office,
    phone=excluded.phone,
    is_active=excluded.is_active,
    work_days=excluded.work_days,
    work_start=excluded.work_start,
    work_end=excluded.work_end,
    updated_at=now()
  returning * into v_profile;

  return v_profile;
end;
$$;

grant execute on function public.medtuc_repair_orphan_profile(text,text,text,text,text,boolean,text[],time,time) to authenticated;

-- 3) RPC para elegir un técnico disponible según tarea, horario laboral y excepciones activas.
create or replace function public.medtuc_pick_technician_for_task(p_task_type_id uuid)
returns table(technician_id uuid, full_name text, email text)
language sql
security definer
set search_path = public, auth
as $$
  with now_ctx as (
    select
      now() as ts,
      extract(dow from now())::int as dow,
      now()::time as tm
  ), candidates as (
    select p.id, p.full_name, p.email
    from public.profiles p
    join public.technician_task_types ttt
      on ttt.technician_id = p.id
     and ttt.task_type_id = p_task_type_id
     and ttt.is_active = true
    left join public.technician_work_schedules tws
      on tws.technician_id = p.id
     and tws.is_active = true
     and tws.weekday = (select dow from now_ctx)
     and (select tm from now_ctx) between tws.start_time and tws.end_time
    where p.is_active = true
      and lower(unaccent(coalesce(p.role_name,''))) in ('tecnicos','tecnico','técnicos','técnico')
      and (
        tws.id is not null
        or (
          coalesce(p.work_days,array['1','2','3','4','5']::text[]) @> array[(select dow from now_ctx)::text]
          and (select tm from now_ctx) between coalesce(p.work_start,'08:00'::time) and coalesce(p.work_end,'14:00'::time)
        )
      )
      and not exists (
        select 1 from public.technician_exceptions ex
        where ex.technician_id = p.id
          and ex.is_active = true
          and (select ts from now_ctx) >= ex.start_at
          and (ex.end_at is null or (select ts from now_ctx) <= ex.end_at)
      )
  )
  select id, full_name, email
  from candidates
  order by random()
  limit 1;
$$;

grant execute on function public.medtuc_pick_technician_for_task(uuid) to authenticated;

-- Fallback si unaccent no estuviera disponible: reemplaza la función anterior sin unaccent.
do $$
begin
  perform 1 from pg_extension where extname='unaccent';
exception when undefined_function then
  create or replace function public.medtuc_pick_technician_for_task(p_task_type_id uuid)
  returns table(technician_id uuid, full_name text, email text)
  language sql
  security definer
  set search_path = public, auth
  as $f$
    with now_ctx as (select now() as ts, extract(dow from now())::int as dow, now()::time as tm), candidates as (
      select p.id, p.full_name, p.email
      from public.profiles p
      join public.technician_task_types ttt on ttt.technician_id=p.id and ttt.task_type_id=p_task_type_id and ttt.is_active=true
      left join public.technician_work_schedules tws on tws.technician_id=p.id and tws.is_active=true and tws.weekday=(select dow from now_ctx) and (select tm from now_ctx) between tws.start_time and tws.end_time
      where p.is_active=true
        and lower(coalesce(p.role_name,'')) in ('tecnicos','tecnico','técnicos','técnico')
        and (tws.id is not null or (coalesce(p.work_days,array['1','2','3','4','5']::text[]) @> array[(select dow from now_ctx)::text] and (select tm from now_ctx) between coalesce(p.work_start,'08:00'::time) and coalesce(p.work_end,'14:00'::time)))
        and not exists (select 1 from public.technician_exceptions ex where ex.technician_id=p.id and ex.is_active=true and (select ts from now_ctx)>=ex.start_at and (ex.end_at is null or (select ts from now_ctx)<=ex.end_at))
    ) select id, full_name, email from candidates order by random() limit 1;
  $f$;
end $$;

-- 4) Semilla de permisos mínima: Referentes no crean OS, solo Tickets/Notificaciones/Dashboard.
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
values
('Referente','dashboard',true,false,false,false,false,false),
('Referente','tickets',true,true,false,false,false,true),
('Referente','orders',true,false,false,false,false,true),
('Referente','notifications',true,false,false,false,false,true),
('Usuarios','dashboard',true,false,false,false,false,false),
('Usuarios','tickets',true,true,false,false,false,true),
('Usuarios','orders',true,false,false,false,false,true),
('Usuarios','notifications',true,false,false,false,false,true)
on conflict do nothing;

commit;
