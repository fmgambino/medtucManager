-- =========================================================
-- Ticket Manager MEDTUC v8.11 - Hotfix Auth técnicos + UI
-- Ejecutar DESPUÉS de v8.10 en Supabase SQL Editor.
-- Objetivo: reparar usuarios técnicos creados desde SATMANAGER para
-- que puedan iniciar sesión con contraseña tecnico123456.
-- =========================================================

create extension if not exists pgcrypto;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- 1) Asegura que cada perfil técnico tenga un usuario Auth válido.
do $$
declare
  r record;
  v_uid uuid;
begin
  for r in
    select p.*
    from public.profiles p
    where lower(coalesce(p.role_name,'')) in ('técnicos','tecnicos')
      and p.email is not null
      and btrim(p.email) <> ''
  loop
    select id into v_uid from auth.users where lower(email)=lower(r.email) limit 1;

    if v_uid is null then
      v_uid := r.id;
      insert into auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, confirmation_sent_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at
      ) values (
        v_uid,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        lower(r.email),
        crypt('tecnico123456', gen_salt('bf')),
        now(), now(),
        jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
        jsonb_build_object('full_name',r.full_name,'role_name','Técnicos'),
        now(), now()
      );
    else
      update auth.users
      set email = lower(r.email),
          aud = 'authenticated',
          role = 'authenticated',
          encrypted_password = crypt('tecnico123456', gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
          raw_user_meta_data = coalesce(raw_user_meta_data,'{}'::jsonb) || jsonb_build_object('full_name',r.full_name,'role_name','Técnicos'),
          updated_at = now()
      where id = v_uid;

      if r.id <> v_uid then
        update public.profiles set id = v_uid, updated_at = now() where id = r.id;
        update public.service_orders set technician_user_id = v_uid where technician_user_id = r.id;
        update public.notifications set target_user = v_uid where target_user = r.id;
      end if;
    end if;

    -- Auth necesita identidad de proveedor email. Sin esto el login puede devolver 500.
    if not exists (select 1 from auth.identities i where i.user_id = v_uid and i.provider = 'email') then
      insert into auth.identities (
        id, user_id, provider_id, provider, identity_data,
        last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(),
        v_uid,
        v_uid::text,
        'email',
        jsonb_build_object('sub',v_uid::text,'email',lower(r.email),'email_verified',true,'phone_verified',false),
        now(), now(), now()
      );
    end if;
  end loop;
end $$;

-- 2) Función segura para crear/actualizar técnicos desde la PWA sin romper Auth.
create or replace function public.tm_repair_technician_login(p_email text, p_full_name text default null)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text := lower(btrim(p_email));
  v_uid uuid;
begin
  if v_email is null or v_email = '' then
    raise exception 'Email requerido';
  end if;

  select id into v_uid from auth.users where lower(email)=v_email limit 1;
  if v_uid is null then
    v_uid := gen_random_uuid();
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, confirmation_sent_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      v_uid, '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', v_email,
      crypt('tecnico123456', gen_salt('bf')),
      now(), now(),
      jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
      jsonb_build_object('full_name',coalesce(nullif(p_full_name,''),split_part(v_email,'@',1)),'role_name','Técnicos'),
      now(), now()
    );
  else
    update auth.users
    set encrypted_password = crypt('tecnico123456', gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        aud='authenticated', role='authenticated', updated_at=now(),
        raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
        raw_user_meta_data = coalesce(raw_user_meta_data,'{}'::jsonb) || jsonb_build_object('full_name',coalesce(nullif(p_full_name,''),split_part(v_email,'@',1)),'role_name','Técnicos')
    where id=v_uid;
  end if;

  insert into public.profiles(id,email,full_name,role_name,is_active,must_change_password,source)
  values(v_uid,v_email,coalesce(nullif(p_full_name,''),split_part(v_email,'@',1)),'Técnicos',true,true,'PWA')
  on conflict(id) do update set
    email=excluded.email,
    full_name=coalesce(nullif(excluded.full_name,''),public.profiles.full_name),
    role_name='Técnicos',
    is_active=true,
    must_change_password=true,
    updated_at=now();

  insert into auth.identities(id,user_id,provider_id,provider,identity_data,last_sign_in_at,created_at,updated_at)
  select gen_random_uuid(), v_uid, v_uid::text, 'email',
         jsonb_build_object('sub',v_uid::text,'email',v_email,'email_verified',true,'phone_verified',false),
         now(), now(), now()
  where not exists (select 1 from auth.identities where user_id=v_uid and provider='email');

  return v_uid;
end;
$$;

grant execute on function public.tm_repair_technician_login(text,text) to authenticated;

-- 3) Asegura SuperAdmin activo y sin tocar su contraseña.
insert into public.profiles(id,email,full_name,role_name,office,is_active,source)
select u.id, lower(u.email), 'Ing. Fernando Gambino', 'SuperAdmin', 'Dirección de Informática - Área Soporte Técnico', true, 'PWA'
from auth.users u
where lower(u.email)=lower('fernando.m.gambino@gmail.com')
on conflict(id) do update set role_name='SuperAdmin', is_active=true, updated_at=now();
