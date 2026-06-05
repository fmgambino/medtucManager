-- =========================================================
-- MEDTUC Ticket Manager v8.16 FINAL URGENTE
-- Reparación Auth Login + RPC Usuarios + Dashboard permisos
-- Ejecutar COMPLETO en Supabase SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

-- Columnas requeridas
alter table public.profiles add column if not exists must_change_password boolean not null default false;
alter table public.profiles add column if not exists source text not null default 'PWA';
alter table public.inventory_items add column if not exists image_url text;
alter table public.inventory_items add column if not exists barcode text;

-- Eliminar triggers públicos sobre auth.users que rompen /auth/v1/token
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT t.tgname
    FROM pg_trigger t
    JOIN pg_class c ON c.oid=t.tgrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    JOIN pg_proc p ON p.oid=t.tgfoid
    JOIN pg_namespace pn ON pn.oid=p.pronamespace
    WHERE n.nspname='auth' AND c.relname='users' AND NOT t.tgisinternal AND pn.nspname='public'
  LOOP
    EXECUTE format('drop trigger if exists %I on auth.users', r.tgname);
  END LOOP;
END $$;

drop function if exists public.handle_new_auth_user_profile() cascade;
drop function if exists public.ensure_current_user_profile() cascade;
drop function if exists public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) cascade;
drop function if exists public.superadmin_upsert_user_profile(text,text,text,text,text,text,boolean) cascade;
drop function if exists public.set_user_profile(text,text,text,text,text,boolean,text) cascade;
drop function if exists public.set_user_profile(text,text,text,text,text,text,boolean) cascade;
drop function if exists public.repair_auth_user_login(text,text,text,text) cascade;

-- Perfil actual, sin trigger Auth para no romper login
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
  on conflict(id) do update set email=excluded.email, updated_at=now();

  select * into p from public.profiles where id=u.id;
  return jsonb_build_object('success',true,'profile',row_to_json(p));
end;
$$;

-- Reparación/creación segura de usuario Auth por SQL.
-- IMPORTANTE: NO insertar ni actualizar confirmed_at porque en Supabase es generado.
create or replace function public.repair_auth_user_login(
  p_email text,
  p_password text,
  p_full_name text default null,
  p_role_name text default 'Usuarios'
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  uid uuid;
  clean_email text := lower(trim(coalesce(p_email,'')));
  clean_name text := coalesce(nullif(trim(coalesce(p_full_name,'')),''), split_part(lower(trim(coalesce(p_email,''))),'@',1));
  clean_role text := coalesce(nullif(trim(coalesce(p_role_name,'')),''),'Usuarios');
begin
  if clean_email='' then raise exception 'Email obligatorio'; end if;
  if coalesce(p_password,'')='' then raise exception 'Contraseña obligatoria'; end if;
  if clean_role not in ('SuperAdmin','Admin','Técnicos','Usuarios') then clean_role := 'Usuarios'; end if;

  select id into uid from auth.users where lower(email)=clean_email limit 1;

  if uid is null then
    uid := gen_random_uuid();
    insert into auth.users(
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, confirmation_sent_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, created_at, updated_at
    ) values (
      uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', clean_email,
      crypt(p_password, gen_salt('bf')), now(), now(),
      jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
      jsonb_build_object('full_name',clean_name,'role_name',clean_role),
      false, now(), now()
    );
  else
    update auth.users
    set encrypted_password=crypt(p_password, gen_salt('bf')),
        email_confirmed_at=coalesce(email_confirmed_at,now()),
        confirmation_sent_at=coalesce(confirmation_sent_at,now()),
        aud='authenticated',
        role='authenticated',
        raw_app_meta_data=jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
        raw_user_meta_data=coalesce(raw_user_meta_data,'{}'::jsonb) || jsonb_build_object('full_name',clean_name,'role_name',clean_role),
        updated_at=now()
    where id=uid;
  end if;

  -- Limpiar identidades duplicadas del mismo email y recrear identidad email válida
  delete from auth.identities where provider='email' and (user_id=uid or lower(provider_id)=clean_email or lower(identity_data->>'email')=clean_email);
  insert into auth.identities(
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) values (
    uid::text, uid,
    jsonb_build_object('sub',uid::text,'email',clean_email,'email_verified',true,'phone_verified',false),
    'email', clean_email, now(), now(), now()
  );

  insert into public.profiles(id,email,full_name,role_name,is_active,source,created_at,updated_at)
  values(uid,clean_email,clean_name,clean_role,true,'AUTH_REPAIR',now(),now())
  on conflict(id) do update set
    email=excluded.email,
    full_name=excluded.full_name,
    role_name=excluded.role_name,
    is_active=true,
    updated_at=now();

  return uid;
end;
$$;

-- RPC para módulo Usuarios
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
    raise exception 'Acceso denegado: sólo SuperAdmin puede administrar usuarios y contraseñas';
  end if;
  if clean_email='' then raise exception 'Email obligatorio'; end if;
  if trim(coalesce(p_full_name,''))='' then raise exception 'Nombre completo obligatorio'; end if;
  if coalesce(p_role_name,'') not in ('SuperAdmin','Admin','Técnicos','Usuarios') then raise exception 'Perfil inválido'; end if;

  if coalesce(p_password,'')<>'' then
    target_id := public.repair_auth_user_login(clean_email,p_password,p_full_name,p_role_name);
  else
    select id into target_id from auth.users where lower(email)=clean_email limit 1;
    if target_id is null then target_id := gen_random_uuid(); end if;
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
    updated_at=now();

  select * into result_profile from public.profiles where id=target_id;
  return jsonb_build_object('success',true,'id',target_id,'profile',row_to_json(result_profile));
end;
$$;

-- Wrapper por compatibilidad con versiones anteriores del frontend/cache
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
set search_path = public, auth, extensions
as $$
begin
  return public.superadmin_upsert_user_profile(p_email,p_full_name,p_role_name,p_office,p_phone,p_is_active,p_password);
end;
$$;

grant execute on function public.ensure_current_user_profile() to authenticated;
grant execute on function public.repair_auth_user_login(text,text,text,text) to authenticated;
grant execute on function public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) to authenticated;
grant execute on function public.set_user_profile(text,text,text,text,text,boolean,text) to authenticated;

-- RLS y permisos mínimos para dashboard/cards
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

-- Reparar usuarios clave y técnicos existentes
DO $$
DECLARE rec record; uid uuid;
BEGIN
  -- Fernando no fuerza contraseña; sólo asegura perfil si existe Auth
  select id into uid from auth.users where lower(email)='fernando.m.gambino@gmail.com' limit 1;
  if uid is not null then
    insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source,created_at,updated_at)
    values(uid,'fernando.m.gambino@gmail.com','Ing. Fernando Gambino','SuperAdmin','Dirección de Informática','3816150488',true,'SEED',now(),now())
    on conflict(id) do update set role_name='SuperAdmin', is_active=true, full_name=excluded.full_name, updated_at=now();
  end if;

  -- Gerardo Toro solicitado: SuperAdmin / demo123
  perform public.repair_auth_user_login('dir.gerardo.toro@educaciontuc.gov.ar','demo123','Ing. Gerardo Toro','SuperAdmin');
  update public.profiles set office='Dirección de Informática', role_name='SuperAdmin', is_active=true where lower(email)='dir.gerardo.toro@educaciontuc.gov.ar';

  -- Técnicos existentes con contraseña por defecto si no se reconfiguró desde la app
  for rec in select * from public.profiles where role_name='Técnicos' and email is not null loop
    perform public.repair_auth_user_login(rec.email,'tecnico123456',rec.full_name,'Técnicos');
    update public.profiles set office=coalesce(public.profiles.office,'Dirección de Informática - Área Soporte Técnico'), is_active=true where lower(email)=lower(rec.email);
  end loop;
END $$;

update public.profiles set created_at=now() where created_at is null;
update public.profiles set updated_at=now() where updated_at is null;
notify pgrst, 'reload schema';
