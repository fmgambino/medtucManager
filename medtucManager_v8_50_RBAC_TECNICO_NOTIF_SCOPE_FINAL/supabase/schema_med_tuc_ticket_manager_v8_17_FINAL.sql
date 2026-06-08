-- =========================================================
-- MEDTUC Ticket Manager v8.17 FINAL
-- Auth seguro + Confirmación usuarios + Dashboard permisos
-- Ejecutar COMPLETO en Supabase SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

-- Columnas requeridas
alter table public.profiles add column if not exists must_change_password boolean not null default false;
alter table public.profiles add column if not exists source text not null default 'PWA';
alter table public.inventory_items add column if not exists image_url text;
alter table public.inventory_items add column if not exists barcode text;

-- Eliminar triggers públicos sobre auth.users que pueden romper Auth.
-- La creación de usuarios debe realizarse por Supabase Auth o Edge Function admin-create-user.
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
drop function if exists public.ensure_current_user_profile() cascade;
drop function if exists public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) cascade;
drop function if exists public.set_user_profile(text,text,text,text,text,boolean,text) cascade;

-- Perfil del usuario autenticado. No toca auth.users.
create or replace function public.ensure_current_user_profile()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  u auth.users%rowtype;
  p public.profiles%rowtype;
begin
  select * into u from auth.users where id = auth.uid();
  if u.id is null then
    return jsonb_build_object('success',false,'message','Usuario no autenticado');
  end if;

  insert into public.profiles(id,email,full_name,role_name,is_active,source,created_at,updated_at)
  values(
    u.id,
    lower(u.email),
    coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1)),
    coalesce(nullif(u.raw_user_meta_data->>'role_name',''),'Usuarios'),
    true,
    'AUTH',
    now(),
    now()
  )
  on conflict(id) do update set email=excluded.email, updated_at=now();

  select * into p from public.profiles where id=u.id;
  return jsonb_build_object('success',true,'profile',row_to_json(p));
end;
$$;

grant execute on function public.ensure_current_user_profile() to authenticated;

-- RPC fallback: SOLO sincroniza profiles. La creación real en Auth se realiza con Edge Function admin-create-user.
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
set search_path = public, auth
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
    raise exception 'El usuario no existe en Supabase Auth. Créelo desde Authentication > Users o despliegue la Edge Function admin-create-user.';
  end if;

  insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source,created_at,updated_at)
  values(target_id,clean_email,p_full_name,p_role_name,p_office,p_phone,p_is_active,'AUTH',now(),now())
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

create or replace function public.set_user_profile(
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
set search_path = public, auth
as $$
begin
  return public.superadmin_upsert_user_profile(p_email,p_full_name,p_role_name,p_office,p_phone,p_is_active,p_password);
end;
$$;

grant execute on function public.set_user_profile(text,text,text,text,text,boolean,text) to authenticated;

-- Confirmar usuarios existentes creados desde Supabase Auth que quedaron sin email_confirmed_at.
-- Esto corrige el error "Email not confirmed".
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now()),
    confirmation_sent_at = coalesce(confirmation_sent_at, now()),
    updated_at = now()
where email_confirmed_at is null
  and lower(email) in (
    select lower(email) from public.profiles where is_active=true
  );

-- Sincronizar todos los Auth Users existentes hacia profiles si faltan
insert into public.profiles(id,email,full_name,role_name,is_active,source,created_at,updated_at)
select
  au.id,
  lower(au.email),
  coalesce(au.raw_user_meta_data->>'full_name', split_part(au.email,'@',1)),
  coalesce(nullif(au.raw_user_meta_data->>'role_name',''),'Usuarios'),
  true,
  'AUTH_SYNC',
  now(),
  now()
from auth.users au
where au.email is not null
on conflict(id) do update set
  email=excluded.email,
  updated_at=now();

-- Asegurar SuperAdmin principal
update public.profiles
set role_name='SuperAdmin', is_active=true, office=coalesce(office,'Dirección de Informática'), updated_at=now()
where lower(email)='fernando.m.gambino@gmail.com';

-- Asegurar Gerardo si ya existe en Auth/profiles
update auth.users
set email_confirmed_at=coalesce(email_confirmed_at,now()),
    confirmation_sent_at=coalesce(confirmation_sent_at,now()),
    updated_at=now()
where lower(email)='dir.gerardo.toro@educaciontuc.gov.ar';

insert into public.profiles(id,email,full_name,role_name,office,is_active,source,created_at,updated_at)
select id, lower(email), 'Ing. Gerardo Toro', 'SuperAdmin', 'Dirección de Informática', true, 'AUTH', now(), now()
from auth.users
where lower(email)='dir.gerardo.toro@educaciontuc.gov.ar'
on conflict(id) do update set
  full_name='Ing. Gerardo Toro',
  role_name='SuperAdmin',
  office='Dirección de Informática',
  is_active=true,
  updated_at=now();

-- RLS y permisos para dashboard/cards
alter table public.profiles enable row level security;
drop policy if exists profiles_select_all on public.profiles;
drop policy if exists profiles_insert_superadmin on public.profiles;
drop policy if exists profiles_update_superadmin on public.profiles;
drop policy if exists profiles_delete_superadmin on public.profiles;
create policy profiles_select_all on public.profiles for select to authenticated using (true);
create policy profiles_insert_superadmin on public.profiles for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));
create policy profiles_update_superadmin on public.profiles for update to authenticated using (id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin')) with check (id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));
create policy profiles_delete_superadmin on public.profiles for delete to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.inventory_items to authenticated;
grant select, insert, update, delete on public.service_orders to authenticated;
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.service_order_history to authenticated;
grant select, insert, update, delete on public.service_order_notes to authenticated;
grant select, insert, update, delete on public.loans to authenticated;
grant select on public.service_order_statuses to authenticated;

update public.profiles set created_at=now() where created_at is null;
update public.profiles set updated_at=now() where updated_at is null;
notify pgrst, 'reload schema';
