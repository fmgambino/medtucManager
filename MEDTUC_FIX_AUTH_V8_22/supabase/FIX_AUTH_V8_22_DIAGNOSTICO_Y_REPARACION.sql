-- =========================================================
-- MEDTUC Ticket Manager - FIX AUTH V8.22
-- Ejecutar en Supabase > SQL Editor.
-- Objetivo: reparar login de Admin/Técnicos/Usuarios y evitar
-- "AuthApiError: Database error checking email" en Edge Function.
-- =========================================================

-- 1) Ver triggers NO internos sobre auth.users. Debe devolver 0 filas luego del bloque siguiente.
select n.nspname as schema, c.relname as table, t.tgname as trigger_name, p.proname as function_name
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
join pg_proc p on p.oid = t.tgfoid
where n.nspname = 'auth' and c.relname = 'users' and not t.tgisinternal;

-- 2) Eliminar triggers custom sobre auth.users. Supabase Auth no debe depender
-- de triggers públicos para crear perfiles; la Edge Function hace el upsert.
do $$
declare r record;
begin
  for r in
    select t.tgname
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname='auth' and c.relname='users' and not t.tgisinternal
  loop
    execute format('drop trigger if exists %I on auth.users', r.tgname);
  end loop;
end $$;

drop function if exists public.handle_new_auth_user_profile() cascade;
drop function if exists public.create_profile_for_new_user() cascade;

-- 3) Normalizar roles y perfiles.
insert into public.roles(name, description, is_system)
values
('SuperAdmin','Acceso total',true),
('Admin','Administración general',true),
('Técnicos','Perfil técnico',true),
('Usuarios','Usuario general',true)
on conflict (name) do update set description=excluded.description, is_system=true, updated_at=now();

update public.profiles set role_name='Técnicos' where role_name='Tecnicos';
update public.profiles set is_active=true where email is not null and is_active is null;

-- 4) Confirmar emails y desbloquear usuarios Auth existentes.
-- IMPORTANTE: NO actualizar auth.users.confirmed_at porque en Supabase actual es GENERATED.
-- Sólo se actualizan columnas permitidas.
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now()),
    banned_until = null,
    updated_at = now()
where email is not null;

-- 5) Crear/reparar perfiles faltantes desde auth.users.
insert into public.profiles(id,email,full_name,role_name,office,phone,is_active,source,created_at,updated_at)
select
  u.id,
  lower(u.email),
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1), 'Usuario'),
  case
    when coalesce(u.raw_user_meta_data->>'role_name','Usuarios')='Tecnicos' then 'Técnicos'
    when coalesce(u.raw_user_meta_data->>'role_name','Usuarios') in ('SuperAdmin','Admin','Técnicos','Usuarios') then coalesce(u.raw_user_meta_data->>'role_name','Usuarios')
    else 'Usuarios'
  end,
  u.raw_user_meta_data->>'office',
  null,
  true,
  'AUTH_REPAIR_V8_22',
  now(),
  now()
from auth.users u
where u.email is not null
on conflict (id) do update set
  email=excluded.email,
  full_name=coalesce(public.profiles.full_name, excluded.full_name),
  role_name=case when public.profiles.role_name='Tecnicos' then 'Técnicos' else public.profiles.role_name end,
  is_active=true,
  updated_at=now();

-- 6) Asegurar SuperAdmin principal.
update public.profiles
set role_name='SuperAdmin', is_active=true, updated_at=now()
where lower(email)='fernando.m.gambino@gmail.com';

-- 7) Diagnóstico final.
select 'AUTH_USERS' as tipo, count(*) as cantidad from auth.users
union all
select 'PROFILES', count(*) from public.profiles
union all
select 'PROFILES_SIN_AUTH', count(*) from public.profiles p left join auth.users u on u.id=p.id where u.id is null;

select p.email, p.full_name, p.role_name, p.is_active,
       case when u.id is null then 'NO_EXISTE_EN_AUTH' else 'OK_AUTH' end as estado_auth,
       u.email_confirmed_at is not null as email_confirmed
from public.profiles p
left join auth.users u on u.id=p.id
order by p.role_name, p.email;
