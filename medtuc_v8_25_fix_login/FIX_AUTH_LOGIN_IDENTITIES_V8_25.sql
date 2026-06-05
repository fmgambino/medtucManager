-- =========================================================
-- MEDTUC Ticket Manager v8.25
-- FIX LOGIN SUPABASE AUTH: email identities + datos mínimos Auth
-- Ejecutar en Supabase SQL Editor como postgres.
-- NO modifica public.profiles salvo lectura.
-- =========================================================

create extension if not exists pgcrypto;

-- 1) Normaliza usuarios Auth existentes.
-- IMPORTANTE: no tocar confirmed_at porque es columna generada.
update auth.users u
set
  aud = coalesce(nullif(u.aud, ''), 'authenticated'),
  role = coalesce(nullif(u.role, ''), 'authenticated'),
  email_confirmed_at = coalesce(u.email_confirmed_at, now()),
  raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('provider','email','providers',array['email']),
  raw_user_meta_data = coalesce(u.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'full_name', coalesce(p.full_name, split_part(u.email,'@',1)),
    'role_name', coalesce(p.role_name, 'Usuarios'),
    'office', p.office
  ),
  updated_at = now()
from public.profiles p
where p.id = u.id
  and u.email is not null;

-- 2) Crea auth.identities faltantes para login email/password.
-- Esto corrige usuarios que existen en auth.users pero no tienen identidad provider='email'.
do $$
declare
  r record;
  has_provider_id boolean;
  id_required boolean;
  id_data_type text;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema='auth' and table_name='identities' and column_name='provider_id'
  ) into has_provider_id;

  select
    coalesce(column_default is null and is_nullable='NO', false),
    data_type
  into id_required, id_data_type
  from information_schema.columns
  where table_schema='auth' and table_name='identities' and column_name='id'
  limit 1;

  for r in
    select u.id, lower(u.email) as email, p.full_name, p.role_name
    from auth.users u
    join public.profiles p on p.id = u.id
    left join auth.identities i
      on i.user_id = u.id
     and i.provider = 'email'
    where u.email is not null
      and i.user_id is null
  loop
    if has_provider_id then
      if id_required then
        if id_data_type = 'uuid' then
          insert into auth.identities (
            id, provider_id, user_id, identity_data, provider,
            last_sign_in_at, created_at, updated_at
          )
          values (
            gen_random_uuid(),
            r.id::text,
            r.id,
            jsonb_build_object(
              'sub', r.id::text,
              'email', r.email,
              'email_verified', true,
              'phone_verified', false
            ),
            'email',
            now(), now(), now()
          );
        else
          insert into auth.identities (
            id, provider_id, user_id, identity_data, provider,
            last_sign_in_at, created_at, updated_at
          )
          values (
            r.id::text,
            r.id::text,
            r.id,
            jsonb_build_object(
              'sub', r.id::text,
              'email', r.email,
              'email_verified', true,
              'phone_verified', false
            ),
            'email',
            now(), now(), now()
          );
        end if;
      else
        insert into auth.identities (
          provider_id, user_id, identity_data, provider,
          last_sign_in_at, created_at, updated_at
        )
        values (
          r.id::text,
          r.id,
          jsonb_build_object(
            'sub', r.id::text,
            'email', r.email,
            'email_verified', true,
            'phone_verified', false
          ),
          'email',
          now(), now(), now()
        );
      end if;
    else
      if id_data_type = 'uuid' then
        insert into auth.identities (
          id, user_id, identity_data, provider,
          last_sign_in_at, created_at, updated_at
        )
        values (
          gen_random_uuid(),
          r.id,
          jsonb_build_object(
            'sub', r.id::text,
            'email', r.email,
            'email_verified', true,
            'phone_verified', false
          ),
          'email',
          now(), now(), now()
        );
      else
        insert into auth.identities (
          id, user_id, identity_data, provider,
          last_sign_in_at, created_at, updated_at
        )
        values (
          r.id::text,
          r.id,
          jsonb_build_object(
            'sub', r.id::text,
            'email', r.email,
            'email_verified', true,
            'phone_verified', false
          ),
          'email',
          now(), now(), now()
        );
      end if;
    end if;
  end loop;
end $$;

-- 3) Grants de funciones públicas usadas por la PWA luego del login.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;

-- 4) Diagnóstico final.
select
  lower(u.email) as email,
  p.full_name,
  p.role_name,
  p.is_active,
  u.email_confirmed_at is not null as email_confirmed,
  exists (
    select 1 from auth.identities i
    where i.user_id = u.id and i.provider = 'email'
  ) as has_email_identity
from auth.users u
left join public.profiles p on p.id = u.id
where lower(u.email) in (
  select lower(email) from public.profiles
)
order by p.role_name, p.full_name;
