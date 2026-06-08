-- =========================================================
-- MEDTUC Ticket Manager v8.14 FINAL
-- Hotfix Auth usuarios + confirmación email + RLS + schema reload
-- Ejecutar completo en Supabase SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

alter table public.profiles add column if not exists must_change_password boolean not null default false;
alter table public.profiles add column if not exists source text not null default 'PWA';
alter table public.inventory_items add column if not exists image_url text;
alter table public.inventory_items add column if not exists barcode text;

-- Evita conflictos por cambio de firma/retorno
DROP FUNCTION IF EXISTS public.ensure_current_user_profile() CASCADE;
DROP FUNCTION IF EXISTS public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) CASCADE;
DROP FUNCTION IF EXISTS public.superadmin_upsert_user_profile(text,text,text,text,text,text,boolean) CASCADE;
DROP FUNCTION IF EXISTS public.superadmin_upsert_user_profile(text,text,text,text,text,text,text) CASCADE;

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
  values(u.id, lower(u.email), coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1)), 'Usuarios', true, 'AUTH', now(), now())
  on conflict(id) do update set email=excluded.email, updated_at=now();

  select * into p from public.profiles where id=u.id;
  return jsonb_build_object('success',true,'profile',row_to_json(p));
end;
$$;

create or replace function public.superadmin_upsert_user_profile(
  p_email text,
  p_full_name text,
  p_role_name text default 'Usuarios',
  p_office text default null,
  p_phone text default null,
  p_is_active boolean default true,
  p_password text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  caller_role text;
  target_id uuid;
  result public.profiles%rowtype;
  clean_email text;
begin
  select role_name into caller_role from public.profiles where id = auth.uid();
  if caller_role is distinct from 'SuperAdmin' then
    raise exception 'Acceso denegado: sólo SuperAdmin puede administrar usuarios y contraseñas';
  end if;

  clean_email := lower(trim(p_email));
  if clean_email is null or clean_email = '' then raise exception 'Email obligatorio'; end if;
  if p_full_name is null or trim(p_full_name) = '' then raise exception 'Nombre completo obligatorio'; end if;
  if coalesce(p_role_name,'') not in ('SuperAdmin','Admin','Técnicos','Usuarios') then raise exception 'Perfil inválido'; end if;

  select id into target_id from auth.users where lower(email)=clean_email limit 1;

  if target_id is null then
    target_id := gen_random_uuid();

    -- IMPORTANTE: NO insertar confirmed_at porque en Supabase es columna generada.
    insert into auth.users(
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, confirmation_sent_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      target_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      clean_email,
      crypt(coalesce(nullif(p_password,''),'tecnico123456'), gen_salt('bf')),
      now(),
      now(),
      jsonb_build_object('provider','email','providers',array['email']),
      jsonb_build_object('full_name',p_full_name,'role_name',p_role_name),
      now(),
      now()
    );

    insert into auth.identities(id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), target_id, jsonb_build_object('sub',target_id::text,'email',clean_email), 'email', clean_email, now(), now(), now())
    on conflict do nothing;

  elsif coalesce(p_password,'') <> '' then
    update auth.users
    set encrypted_password = crypt(p_password, gen_salt('bf')),
        updated_at = now(),
        email_confirmed_at = coalesce(email_confirmed_at, now())
    where id = target_id;
  end if;

  insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source,created_at,updated_at)
  values(target_id,clean_email,p_full_name,p_role_name,p_office,p_phone,p_is_active,'PWA',now(),now())
  on conflict (id) do update set
    email=excluded.email,
    full_name=excluded.full_name,
    role_name=excluded.role_name,
    office=excluded.office,
    phone=excluded.phone,
    is_active=excluded.is_active,
    updated_at=now();

  select * into result from public.profiles where id=target_id;
  return result;
end;
$$;

grant execute on function public.ensure_current_user_profile() to authenticated;
grant execute on function public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) to authenticated;

alter table public.profiles enable row level security;

drop policy if exists profiles_select_all on public.profiles;
drop policy if exists profiles_insert_superadmin on public.profiles;
drop policy if exists profiles_update_superadmin on public.profiles;
drop policy if exists profiles_delete_superadmin on public.profiles;

create policy profiles_select_all on public.profiles for select to authenticated using (true);
create policy profiles_insert_superadmin on public.profiles for insert to authenticated with check (
  exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin')
);
create policy profiles_update_superadmin on public.profiles for update to authenticated using (
  id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin')
) with check (
  id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin')
);
create policy profiles_delete_superadmin on public.profiles for delete to authenticated using (
  exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin')
);

-- Grants para Dashboard y módulos
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_order_history TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_order_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loans TO authenticated;

-- Reasegurar SuperAdmin Fernando si ya existe en Auth
DO $$
DECLARE uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE lower(email)='fernando.m.gambino@gmail.com' LIMIT 1;
  IF uid IS NOT NULL THEN
    INSERT INTO public.profiles(id,email,full_name,role_name,office,phone,is_active,source,created_at,updated_at)
    VALUES(uid,'fernando.m.gambino@gmail.com','Ing. Fernando Gambino','SuperAdmin','Dirección de Informática','3816150488',true,'SEED',now(),now())
    ON CONFLICT(id) DO UPDATE SET role_name='SuperAdmin', is_active=true, full_name=excluded.full_name, updated_at=now();
  END IF;
END $$;

UPDATE public.profiles SET created_at=now() WHERE created_at IS NULL;
UPDATE public.profiles SET updated_at=now() WHERE updated_at IS NULL;

NOTIFY pgrst, 'reload schema';
