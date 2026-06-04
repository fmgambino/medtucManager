-- =========================================================
-- MEDTUC Ticket Manager v8.15 FINAL
-- Hotfix Auth SuperAdmin/Técnicos + Dashboard + Mobile Header
-- Ejecutar COMPLETO en Supabase SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1) Columnas requeridas por frontend v8.15
-- ---------------------------------------------------------
alter table public.profiles add column if not exists must_change_password boolean not null default false;
alter table public.profiles add column if not exists source text not null default 'PWA';
alter table public.inventory_items add column if not exists image_url text;
alter table public.inventory_items add column if not exists barcode text;

-- ---------------------------------------------------------
-- 2) Limpieza de triggers Auth públicos viejos que provocan
--    "Database error querying schema" en /auth/v1/token
-- ---------------------------------------------------------
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
drop function if exists public.superadmin_upsert_user_profile(text,text,text,text,text,text,boolean) cascade;
drop function if exists public.superadmin_upsert_user_profile(text,text,text,text,text,text,text) cascade;

-- ---------------------------------------------------------
-- 3) Trigger seguro para perfiles creados desde Auth
-- ---------------------------------------------------------
create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  insert into public.profiles(id,email,full_name,role_name,is_active,source,created_at,updated_at)
  values(
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(nullif(new.raw_user_meta_data->>'role_name',''),'Usuarios'),
    true,
    'AUTH',
    now(),
    now()
  )
  on conflict(id) do update set
    email=excluded.email,
    updated_at=now();
  return new;
end;
$$;

create trigger on_auth_user_created_ticket_manager
  after insert on auth.users
  for each row execute function public.handle_new_auth_user_profile();

-- ---------------------------------------------------------
-- 4) Perfil actual usado por app.html
-- ---------------------------------------------------------
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
  on conflict(id) do update set
    email=excluded.email,
    updated_at=now();

  select * into p from public.profiles where id=u.id;
  return jsonb_build_object('success',true,'profile',row_to_json(p));
end;
$$;

-- ---------------------------------------------------------
-- 5) Crear/editar usuario + contraseña desde módulo Usuarios
--    Sólo SuperAdmin puede ejecutar esta operación.
-- ---------------------------------------------------------
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
  clean_email text;
  result_profile public.profiles%rowtype;
begin
  select role_name into caller_role from public.profiles where id = auth.uid();

  if caller_role is distinct from 'SuperAdmin' then
    raise exception 'Acceso denegado: sólo SuperAdmin puede administrar usuarios y contraseñas';
  end if;

  clean_email := lower(trim(coalesce(p_email,'')));

  if clean_email = '' then raise exception 'Email obligatorio'; end if;
  if trim(coalesce(p_full_name,'')) = '' then raise exception 'Nombre completo obligatorio'; end if;
  if coalesce(p_role_name,'') not in ('SuperAdmin','Admin','Técnicos','Usuarios') then raise exception 'Perfil inválido'; end if;

  select id into target_id from auth.users where lower(email)=clean_email limit 1;

  if target_id is null then
    target_id := gen_random_uuid();

    insert into auth.users(
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) values (
      target_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      clean_email,
      crypt(coalesce(nullif(p_password,''),'tecnico123456'), gen_salt('bf')),
      now(),
      now(),
      jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
      jsonb_build_object('full_name',p_full_name,'role_name',p_role_name),
      false,
      now(),
      now()
    );

    insert into auth.identities(
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      target_id,
      jsonb_build_object('sub',target_id::text,'email',clean_email,'email_verified',true,'phone_verified',false),
      'email',
      clean_email,
      now(),
      now(),
      now()
    ) on conflict do nothing;

  elsif coalesce(p_password,'') <> '' then
    update auth.users
    set encrypted_password = crypt(p_password, gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        raw_user_meta_data = coalesce(raw_user_meta_data,'{}'::jsonb) || jsonb_build_object('full_name',p_full_name,'role_name',p_role_name),
        raw_app_meta_data = jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
        aud='authenticated',
        role='authenticated',
        updated_at = now()
    where id = target_id;

    insert into auth.identities(
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      target_id,
      jsonb_build_object('sub',target_id::text,'email',clean_email,'email_verified',true,'phone_verified',false),
      'email',
      clean_email,
      now(),
      now(),
      now()
    ) on conflict do nothing;
  end if;

  insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source,created_at,updated_at)
  values(target_id,clean_email,p_full_name,p_role_name,p_office,p_phone,p_is_active,'PWA',now(),now())
  on conflict(id) do update set
    email=excluded.email,
    full_name=excluded.full_name,
    role_name=excluded.role_name,
    office=excluded.office,
    phone=excluded.phone,
    is_active=excluded.is_active,
    source=coalesce(public.profiles.source,'PWA'),
    updated_at=now();

  select * into result_profile from public.profiles where id=target_id;
  return jsonb_build_object('success',true,'id',target_id,'profile',row_to_json(result_profile));
end;
$$;

grant execute on function public.ensure_current_user_profile() to authenticated;
grant execute on function public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) to authenticated;

-- ---------------------------------------------------------
-- 6) RLS y permisos de lectura/escritura institucional
-- ---------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists profiles_select_all on public.profiles;
drop policy if exists profiles_insert_superadmin on public.profiles;
drop policy if exists profiles_update_superadmin on public.profiles;
drop policy if exists profiles_delete_superadmin on public.profiles;

create policy profiles_select_all
on public.profiles for select to authenticated using (true);

create policy profiles_insert_superadmin
on public.profiles for insert to authenticated
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));

create policy profiles_update_superadmin
on public.profiles for update to authenticated
using (id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'))
with check (id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));

create policy profiles_delete_superadmin
on public.profiles for delete to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.inventory_items to authenticated;
grant select, insert, update, delete on public.service_orders to authenticated;
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.service_order_history to authenticated;
grant select, insert, update, delete on public.service_order_notes to authenticated;
grant select, insert, update, delete on public.loans to authenticated;
grant select on public.service_order_statuses to authenticated;

-- ---------------------------------------------------------
-- 7) Reparación de usuarios ya creados desde versiones previas
--    - Gerardo Toro: SuperAdmin demo123
--    - Técnicos: mantiene email confirmado y password técnico por defecto si hace falta
-- ---------------------------------------------------------
do $$
declare
  uid uuid;
  rec record;
begin
  -- Fernando SuperAdmin si existe en Auth
  select id into uid from auth.users where lower(email)='fernando.m.gambino@gmail.com' limit 1;
  if uid is not null then
    insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source,created_at,updated_at)
    values(uid,'fernando.m.gambino@gmail.com','Ing. Fernando Gambino','SuperAdmin','Dirección de Informática','3816150488',true,'SEED',now(),now())
    on conflict(id) do update set role_name='SuperAdmin', is_active=true, full_name=excluded.full_name, updated_at=now();
  end if;

  -- Gerardo Toro solicitado por el usuario
  select id into uid from auth.users where lower(email)='dir.gerardo.toro@educaciontuc.gov.ar' limit 1;
  if uid is null then
    uid := gen_random_uuid();
    insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,confirmation_sent_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,created_at,updated_at)
    values(uid,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','dir.gerardo.toro@educaciontuc.gov.ar',crypt('demo123',gen_salt('bf')),now(),now(),jsonb_build_object('provider','email','providers',jsonb_build_array('email')),jsonb_build_object('full_name','Ing. Gerardo Toro','role_name','SuperAdmin'),false,now(),now());
  else
    update auth.users set encrypted_password=crypt('demo123',gen_salt('bf')), email_confirmed_at=coalesce(email_confirmed_at,now()), aud='authenticated', role='authenticated', raw_app_meta_data=jsonb_build_object('provider','email','providers',jsonb_build_array('email')), raw_user_meta_data=coalesce(raw_user_meta_data,'{}'::jsonb)||jsonb_build_object('full_name','Ing. Gerardo Toro','role_name','SuperAdmin'), updated_at=now() where id=uid;
  end if;
  insert into auth.identities(id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,jsonb_build_object('sub',uid::text,'email','dir.gerardo.toro@educaciontuc.gov.ar','email_verified',true,'phone_verified',false),'email','dir.gerardo.toro@educaciontuc.gov.ar',now(),now(),now()) on conflict do nothing;
  insert into public.profiles(id,email,full_name,role_name,office,is_active,source,created_at,updated_at)
  values(uid,'dir.gerardo.toro@educaciontuc.gov.ar','Ing. Gerardo Toro','SuperAdmin','Dirección de Informática',true,'SEED',now(),now())
  on conflict(id) do update set role_name='SuperAdmin', full_name=excluded.full_name, office=excluded.office, is_active=true, updated_at=now();

  -- Normalización general de usuarios de profiles que existen en auth.users
  for rec in select p.* from public.profiles p join auth.users u on lower(u.email)=lower(p.email) loop
    update auth.users
    set email_confirmed_at=coalesce(email_confirmed_at,now()),
        aud='authenticated',
        role='authenticated',
        raw_app_meta_data=jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
        raw_user_meta_data=coalesce(raw_user_meta_data,'{}'::jsonb)||jsonb_build_object('full_name',rec.full_name,'role_name',rec.role_name),
        updated_at=now()
    where lower(email)=lower(rec.email);
  end loop;
end $$;

update public.profiles set created_at=now() where created_at is null;
update public.profiles set updated_at=now() where updated_at is null;

notify pgrst, 'reload schema';
