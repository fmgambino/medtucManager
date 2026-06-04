
-- =========================================================
-- Ticket Manager v8.12 - Fix Auth/Profile Técnico + Password SuperAdmin
-- Ejecutar completo en Supabase SQL Editor con usuario dueño del proyecto.
-- =========================================================

create extension if not exists pgcrypto;

-- 1) Limpieza de triggers Auth defectuosos que suelen provocar:
--    "Database error querying schema" durante signInWithPassword.
do $$
declare r record;
begin
  for r in
    select tgname from pg_trigger t
    join pg_class c on c.oid=t.tgrelid
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='auth' and c.relname='users' and not t.tgisinternal
  loop
    execute format('drop trigger if exists %I on auth.users', r.tgname);
  end loop;
end $$;

-- 2) Función segura para crear perfil cuando Auth crea usuario.
create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles(id,email,full_name,role_name,is_active,source)
  values (
    new.id,
    lower(coalesce(new.email,'')),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,''),'@',1), 'Usuario'),
    coalesce(nullif(new.raw_user_meta_data->>'role_name',''),'Usuarios'),
    true,
    'AUTH'
  )
  on conflict (id) do update set
    email=excluded.email,
    updated_at=now();
  return new;
end $$;

drop trigger if exists on_auth_user_created_ticket_manager on auth.users;
create trigger on_auth_user_created_ticket_manager
after insert on auth.users
for each row execute function public.handle_new_auth_user_profile();

-- 3) RPC para asegurar perfil del usuario autenticado.
create or replace function public.ensure_current_user_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public, auth
as $$
declare u auth.users%rowtype; p public.profiles%rowtype;
begin
  select * into u from auth.users where id = auth.uid();
  if u.id is null then raise exception 'No hay usuario autenticado'; end if;
  insert into public.profiles(id,email,full_name,role_name,is_active,source)
  values (u.id, lower(u.email), coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1)), 'Usuarios', true, 'AUTH')
  on conflict (id) do nothing;
  select * into p from public.profiles where id=u.id;
  return p;
end $$;

-- 4) RPC SuperAdmin: crear/actualizar perfil y contraseña.
--    Permite que el SuperAdmin cargue técnicos con contraseña común tecnico123456.
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
begin
  select role_name into caller_role from public.profiles where id = auth.uid();
  if caller_role is distinct from 'SuperAdmin' then
    raise exception 'Acceso denegado: sólo SuperAdmin puede administrar usuarios y contraseñas';
  end if;

  p_email := lower(trim(p_email));
  if p_email is null or p_email = '' then raise exception 'Email obligatorio'; end if;
  if p_full_name is null or trim(p_full_name) = '' then raise exception 'Nombre completo obligatorio'; end if;
  if coalesce(p_role_name,'') not in ('SuperAdmin','Admin','Técnicos','Usuarios') then raise exception 'Perfil inválido'; end if;

  select id into target_id from auth.users where lower(email)=p_email limit 1;

  if target_id is null then
    target_id := gen_random_uuid();
    insert into auth.users(
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, confirmation_sent_at, confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      target_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', p_email,
      case when coalesce(p_password,'')<>'' then crypt(p_password, gen_salt('bf')) else crypt('tecnico123456', gen_salt('bf')) end,
      now(), now(), now(),
      jsonb_build_object('provider','email','providers',array['email']),
      jsonb_build_object('full_name',p_full_name,'role_name',p_role_name),
      now(), now()
    );
    insert into auth.identities(id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), target_id, jsonb_build_object('sub',target_id::text,'email',p_email), 'email', p_email, now(), now(), now())
    on conflict do nothing;
  elsif coalesce(p_password,'')<>'' then
    update auth.users set encrypted_password=crypt(p_password, gen_salt('bf')), updated_at=now(), email_confirmed_at=coalesce(email_confirmed_at,now()), confirmed_at=coalesce(confirmed_at,now()) where id=target_id;
  end if;

  insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source,updated_at)
  values(target_id,p_email,p_full_name,p_role_name,p_office,p_phone,p_is_active,'PWA',now())
  on conflict (id) do update set
    email=excluded.email, full_name=excluded.full_name, role_name=excluded.role_name,
    office=excluded.office, phone=excluded.phone, is_active=excluded.is_active,
    updated_at=now();

  select * into result from public.profiles where id=target_id;
  return result;
end $$;

grant execute on function public.ensure_current_user_profile() to authenticated;
grant execute on function public.superadmin_upsert_user_profile(text,text,text,text,text,boolean,text) to authenticated;

-- 5) RLS mínima compatible.
alter table public.profiles enable row level security;
do $$ begin
  create policy profiles_select_auth on public.profiles for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy profiles_update_self_or_superadmin on public.profiles for update to authenticated using (id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin')) with check (id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy profiles_insert_superadmin on public.profiles for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='SuperAdmin'));
exception when duplicate_object then null; end $$;

-- 6) Garantizar SuperAdmin actual del Ing. Fernando.
do $$
declare uid uuid;
begin
  select id into uid from auth.users where lower(email)='fernando.m.gambino@gmail.com' limit 1;
  if uid is not null then
    insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source)
    values(uid,'fernando.m.gambino@gmail.com','Ing. Fernando Gambino','SuperAdmin','Dirección de Informática',null,true,'SEED')
    on conflict(id) do update set role_name='SuperAdmin', is_active=true, full_name=excluded.full_name, updated_at=now();
  end if;
end $$;
