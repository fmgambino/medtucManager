-- =========================================================
-- MEDTUC Ticket Manager v8.18 FINAL
-- Auth estable + perfiles + inventario PRO
-- Ejecutar COMPLETO en Supabase SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

-- 1) No tocar manualmente auth.users para crear usuarios nuevos.
--    Se eliminan triggers públicos sobre auth.users que suelen romper /auth/v1/token.
do $$
declare r record;
begin
  for r in
    select t.tgname
    from pg_trigger t
    join pg_class c on c.oid=t.tgrelid
    join pg_namespace n on n.oid=c.relnamespace
    join pg_proc p on p.oid=t.tgfoid
    join pg_namespace pn on pn.oid=p.pronamespace
    where n.nspname='auth'
      and c.relname='users'
      and not t.tgisinternal
      and pn.nspname='public'
  loop
    execute format('drop trigger if exists %I on auth.users', r.tgname);
  end loop;
end $$;

drop function if exists public.handle_new_auth_user_profile() cascade;

-- 2) Columnas requeridas
alter table public.profiles add column if not exists must_change_password boolean not null default false;
alter table public.profiles add column if not exists source text not null default 'PWA';
alter table public.inventory_items add column if not exists image_url text;
alter table public.inventory_items add column if not exists barcode text;
alter table public.inventory_items add column if not exists item_type text;
alter table public.inventory_items add column if not exists company text;
alter table public.inventory_items add column if not exists physical_location text;
alter table public.inventory_items add column if not exists zone text;

create table if not exists public.inventory_conditions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#64748b',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.inventory_conditions(name,color) values
('COMPLETO','#22c55e'),
('Nuevo','#3b82f6'),
('Usado','#f59e0b'),
('C/CARGADOR','#64748b'),
('S/CARGADOR','#2563eb'),
('Reparado','#14b8a6'),
('A revisar','#ef4444')
on conflict(name) do nothing;

-- 3) Confirmar emails existentes en Auth para evitar "Email not confirmed"
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now()),
    confirmation_sent_at = coalesce(confirmation_sent_at, now()),
    aud = coalesce(nullif(aud,''),'authenticated'),
    role = coalesce(nullif(role,''),'authenticated'),
    updated_at = now()
where email is not null;

-- 4) Reparar identities EMAIL de usuarios Auth existentes sin insertar usuarios nuevos.
--    En este proyecto auth.identities.id es uuid.
do $$
declare u record;
begin
  for u in select id,email,raw_user_meta_data from auth.users where email is not null loop
    delete from auth.identities
    where provider='email'
      and (user_id=u.id or lower(provider_id)=lower(u.email) or lower(identity_data->>'email')=lower(u.email));

    insert into auth.identities(
      id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at
    ) values (
      u.id,
      u.id,
      jsonb_build_object('sub',u.id::text,'email',lower(u.email),'email_verified',true,'phone_verified',false),
      'email',
      lower(u.email),
      now(),now(),now()
    ) on conflict(id) do update set
      user_id=excluded.user_id,
      identity_data=excluded.identity_data,
      provider=excluded.provider,
      provider_id=excluded.provider_id,
      updated_at=now();
  end loop;
end $$;

-- 5) Sincronizar perfiles desde Auth y corregir Invalid Date
insert into public.profiles(id,email,full_name,role_name,is_active,source,created_at,updated_at)
select
  u.id,
  lower(u.email),
  coalesce(nullif(u.raw_user_meta_data->>'full_name',''), initcap(replace(split_part(lower(u.email),'@',1),'.',' '))),
  case when coalesce(u.raw_user_meta_data->>'role_name','') in ('SuperAdmin','Admin','Técnicos','Usuarios') then u.raw_user_meta_data->>'role_name' else 'Usuarios' end,
  true,
  'AUTH_SYNC',
  now(),
  now()
from auth.users u
where u.email is not null
on conflict(id) do update set
  email=excluded.email,
  full_name=case
    when public.profiles.full_name is null or public.profiles.full_name='' or public.profiles.full_name='Invalid Date' or public.profiles.full_name ~ '^\\d{4}-\\d{2}-\\d{2}' then excluded.full_name
    else public.profiles.full_name
  end,
  is_active=coalesce(public.profiles.is_active,true),
  updated_at=now();

update public.profiles
set full_name=initcap(replace(split_part(lower(email),'@',1),'.',' ')), updated_at=now()
where full_name is null or full_name='' or full_name='Invalid Date' or full_name ~ '^\\d{4}-\\d{2}-\\d{2}';

-- 6) Gerardo Toro como SuperAdmin si existe en Auth
update public.profiles p
set full_name='Ing. Gerardo Toro',
    role_name='SuperAdmin',
    office='Dirección de Informática',
    is_active=true,
    updated_at=now()
where lower(email)='dir.gerardo.toro@educaciontuc.gov.ar';

-- 7) Fernando SuperAdmin si existe en Auth
update public.profiles p
set full_name='Ing. Fernando Gambino',
    role_name='SuperAdmin',
    office=coalesce(office,'Dirección de Informática'),
    is_active=true,
    updated_at=now()
where lower(email)='fernando.m.gambino@gmail.com';

-- 8) Asegurar técnicos activos si ya existen como perfiles y en Auth.
update public.profiles
set role_name='Técnicos',
    office=coalesce(office,'Dirección de Informática - Área Soporte Técnico'),
    is_active=true,
    updated_at=now()
where lower(email) in (
  select lower(email) from auth.users where email is not null
)
and role_name='Técnicos';

-- 9) Función liviana de perfil actual. No crea Auth, sólo sincroniza perfil del usuario autenticado.
drop function if exists public.ensure_current_user_profile() cascade;
create or replace function public.ensure_current_user_profile()
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  u auth.users%rowtype;
  p public.profiles%rowtype;
begin
  select * into u from auth.users where id = auth.uid();
  if u.id is null then
    return jsonb_build_object('success',false,'message','Usuario no autenticado');
  end if;

  update auth.users
  set email_confirmed_at=coalesce(email_confirmed_at,now()),
      confirmation_sent_at=coalesce(confirmation_sent_at,now()),
      updated_at=now()
  where id=u.id;

  insert into public.profiles(id,email,full_name,role_name,is_active,source,created_at,updated_at)
  values(
    u.id,
    lower(u.email),
    coalesce(nullif(u.raw_user_meta_data->>'full_name',''), initcap(replace(split_part(lower(u.email),'@',1),'.',' '))),
    case when coalesce(u.raw_user_meta_data->>'role_name','') in ('SuperAdmin','Admin','Técnicos','Usuarios') then u.raw_user_meta_data->>'role_name' else 'Usuarios' end,
    true,
    'AUTH',
    now(),now()
  )
  on conflict(id) do update set
    email=excluded.email,
    full_name=case when public.profiles.full_name is null or public.profiles.full_name='' or public.profiles.full_name='Invalid Date' then excluded.full_name else public.profiles.full_name end,
    updated_at=now();

  select * into p from public.profiles where id=u.id;
  return jsonb_build_object('success',true,'profile',row_to_json(p));
end;
$$;

grant execute on function public.ensure_current_user_profile() to authenticated;

-- 10) RPC fallback: sólo profiles. Para crear Auth usar Edge Function admin-create-user.
drop function if exists public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) cascade;
create or replace function public.superadmin_upsert_user_profile(
  p_email text,
  p_full_name text,
  p_role_name text default 'Usuarios',
  p_office text default null,
  p_phone text default null,
  p_is_active boolean default true,
  p_password text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  caller_role text;
  target_id uuid;
  clean_email text := lower(trim(coalesce(p_email,'')));
  result_profile public.profiles%rowtype;
begin
  select role_name into caller_role from public.profiles where id=auth.uid();
  if caller_role is distinct from 'SuperAdmin' then
    raise exception 'Acceso denegado: sólo SuperAdmin puede administrar usuarios';
  end if;
  if clean_email='' then raise exception 'Email obligatorio'; end if;
  if trim(coalesce(p_full_name,''))='' then raise exception 'Nombre completo obligatorio'; end if;
  if coalesce(p_role_name,'') not in ('SuperAdmin','Admin','Técnicos','Usuarios') then raise exception 'Perfil inválido'; end if;

  select id into target_id from auth.users where lower(email)=clean_email limit 1;
  if target_id is null then
    raise exception 'El usuario no existe en Supabase Auth. Cree el usuario desde Authentication o despliegue la Edge Function admin-create-user.';
  end if;

  insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source,created_at,updated_at)
  values(target_id,clean_email,p_full_name,p_role_name,p_office,p_phone,p_is_active,'PWA_PROFILE',now(),now())
  on conflict(id) do update set
    email=excluded.email,
    full_name=excluded.full_name,
    role_name=excluded.role_name,
    office=excluded.office,
    phone=excluded.phone,
    is_active=excluded.is_active,
    updated_at=now();

  select * into result_profile from public.profiles where id=target_id;
  return jsonb_build_object('success',true,'id',target_id,'profile',row_to_json(result_profile));
end;
$$;

grant execute on function public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) to authenticated;

-- 11) RLS y permisos
alter table public.profiles enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_conditions enable row level security;

drop policy if exists profiles_select_all on public.profiles;
drop policy if exists profiles_insert_superadmin on public.profiles;
drop policy if exists profiles_update_superadmin on public.profiles;
drop policy if exists profiles_delete_superadmin on public.profiles;

create policy profiles_select_all on public.profiles for select to authenticated using (true);
create policy profiles_insert_superadmin on public.profiles for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));
create policy profiles_update_superadmin on public.profiles for update to authenticated using (id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin')) with check (id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));
create policy profiles_delete_superadmin on public.profiles for delete to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));

drop policy if exists inventory_conditions_select on public.inventory_conditions;
drop policy if exists inventory_conditions_all_superadmin on public.inventory_conditions;
create policy inventory_conditions_select on public.inventory_conditions for select to authenticated using (true);
create policy inventory_conditions_all_superadmin on public.inventory_conditions for all to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name in ('SuperAdmin','Admin'))) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name in ('SuperAdmin','Admin')));

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.inventory_items to authenticated;
grant select, insert, update, delete on public.inventory_conditions to authenticated;
grant select, insert, update, delete on public.service_orders to authenticated;
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.service_order_history to authenticated;
grant select, insert, update, delete on public.service_order_notes to authenticated;
grant select, insert, update, delete on public.loans to authenticated;
grant select on public.service_order_statuses to authenticated;

notify pgrst, 'reload schema';
