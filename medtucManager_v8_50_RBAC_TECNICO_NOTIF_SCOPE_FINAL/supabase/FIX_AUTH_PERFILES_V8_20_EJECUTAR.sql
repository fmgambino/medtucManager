-- =========================================================
-- FIX AUTH/PERFILES v8.20 - Ticket Manager Ministerio Educación Tucumán
-- Ejecutar completo en Supabase SQL Editor.
-- Luego redeploy de Edge Function admin-create-user y configurar SUPABASE_SERVICE_ROLE_KEY.
-- =========================================================

create extension if not exists pgcrypto;

-- 1) Evitar errores por triggers viejos sobre auth.users.
do $$
declare r record;
begin
  for r in
    select t.tgname
    from pg_trigger t
    join pg_class c on c.oid=t.tgrelid
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='auth' and c.relname='users' and not t.tgisinternal
  loop
    execute format('drop trigger if exists %I on auth.users', r.tgname);
  end loop;
end $$;

drop function if exists public.handle_new_auth_user_profile() cascade;
drop function if exists public.create_profile_for_new_user() cascade;

-- 2) Columnas obligatorias.
alter table public.profiles add column if not exists must_change_password boolean not null default false;
alter table public.profiles add column if not exists source text not null default 'PWA';

-- 3) Normalizar perfiles.
update public.profiles
set email = lower(trim(email)),
    full_name = coalesce(nullif(full_name,''), initcap(replace(split_part(email,'@',1),'.',' '))),
    role_name = case when role_name='Tecnicos' then 'Técnicos'
                     when role_name in ('SuperAdmin','Admin','Técnicos','Usuarios') then role_name
                     else 'Usuarios' end,
    is_active = coalesce(is_active,true),
    updated_at = now()
where email is not null;

-- 4) Función segura para detectar SuperAdmin sin recursión de RLS.
create or replace function public.is_superadmin(uid uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from public.profiles p
    where p.id = uid and p.role_name = 'SuperAdmin' and p.is_active = true
  );
$$;

grant execute on function public.is_superadmin(uuid) to authenticated;

-- 5) Función que crea/repara perfil del usuario autenticado luego del login.
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
    coalesce(nullif(u.raw_user_meta_data->>'full_name',''), initcap(replace(split_part(u.email,'@',1),'.',' '))),
    case when u.raw_user_meta_data->>'role_name' in ('SuperAdmin','Admin','Técnicos','Usuarios') then u.raw_user_meta_data->>'role_name' else 'Usuarios' end,
    true,
    'AUTH_LOGIN',
    now(),
    now()
  )
  on conflict(id) do update set
    email=excluded.email,
    full_name=case when public.profiles.full_name is null or public.profiles.full_name in ('Invalid Date','','null','undefined') then excluded.full_name else public.profiles.full_name end,
    role_name=case when public.profiles.role_name is null or public.profiles.role_name in ('Invalid Date','','null','undefined','Tecnicos') then excluded.role_name else public.profiles.role_name end,
    updated_at=now();

  select * into p from public.profiles where id=u.id;
  return jsonb_build_object('success',true,'profile',row_to_json(p));
end;
$$;

grant execute on function public.ensure_current_user_profile() to authenticated;

-- 6) Confirmar usuarios Auth existentes y asegurar identidad email.
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now()),
    confirmation_sent_at = coalesce(confirmation_sent_at, now()),
    aud = 'authenticated',
    role = 'authenticated',
    updated_at = now()
where email is not null;

do $$
declare
  r record;
  id_udt text;
begin
  select udt_name into id_udt
  from information_schema.columns
  where table_schema='auth' and table_name='identities' and column_name='id'
  limit 1;

  for r in select id,email from auth.users where email is not null loop
    delete from auth.identities
    where provider='email'
      and (user_id = r.id or lower(provider_id)=lower(r.email) or lower(identity_data->>'email')=lower(r.email));

    if id_udt = 'uuid' then
      execute $sql$
        insert into auth.identities(id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at)
        values ($1,$1,jsonb_build_object('sub',$1::text,'email',lower($2),'email_verified',true,'phone_verified',false),'email',lower($2),now(),now(),now())
      $sql$ using r.id, r.email;
    else
      execute $sql$
        insert into auth.identities(id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at)
        values ($1::text,$1,jsonb_build_object('sub',$1::text,'email',lower($2),'email_verified',true,'phone_verified',false),'email',lower($2),now(),now(),now())
      $sql$ using r.id, r.email;
    end if;
  end loop;
end $$;

-- 7) RLS sin recursión.
alter table public.profiles enable row level security;

drop policy if exists profiles_select_all on public.profiles;
drop policy if exists profiles_insert_superadmin on public.profiles;
drop policy if exists profiles_update_superadmin on public.profiles;
drop policy if exists profiles_delete_superadmin on public.profiles;
drop policy if exists profiles_select_authenticated on public.profiles;
drop policy if exists profiles_insert_only_superadmin on public.profiles;
drop policy if exists profiles_update_self_or_superadmin on public.profiles;
drop policy if exists profiles_delete_only_superadmin on public.profiles;

create policy profiles_select_authenticated
on public.profiles for select to authenticated
using (true);

create policy profiles_insert_only_superadmin
on public.profiles for insert to authenticated
with check (public.is_superadmin(auth.uid()));

create policy profiles_update_self_or_superadmin
on public.profiles for update to authenticated
using (id = auth.uid() or public.is_superadmin(auth.uid()))
with check (id = auth.uid() or public.is_superadmin(auth.uid()));

create policy profiles_delete_only_superadmin
on public.profiles for delete to authenticated
using (public.is_superadmin(auth.uid()));

grant select,insert,update,delete on public.profiles to authenticated;
notify pgrst, 'reload schema';

-- IMPORTANTE:
-- Los perfiles que sólo existen en public.profiles pero NO existen en Authentication -> Users NO podrán loguear.
-- Créelos/repárelos desde la PWA con un SuperAdmin, o desde Authentication -> Users.
