-- =========================================================
-- MEDTUC Ticket Manager v8.19 FINAL
-- Reparación Supabase Auth + Profiles + Inventario
-- Ejecutar COMPLETO en Supabase SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

-- 1) Quitar triggers públicos/externos sobre auth.users que provocan:
-- /auth/v1/token 500 Database error querying schema
do $$
declare r record;
begin
  for r in
    select t.tgname
    from pg_trigger t
    join pg_class c on c.oid=t.tgrelid
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='auth'
      and c.relname='users'
      and not t.tgisinternal
  loop
    execute format('drop trigger if exists %I on auth.users', r.tgname);
  end loop;
end $$;

drop function if exists public.handle_new_auth_user_profile() cascade;
drop function if exists public.create_profile_for_new_user() cascade;

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
('Nuevo','#2563eb'),
('Usado','#ca8a04'),
('COMPLETO','#16a34a'),
('C/CARGADOR','#64748b'),
('S/CARGADOR','#1d4ed8'),
('Reparado','#22c55e'),
('Dañado','#ef4444')
on conflict(name) do nothing;

-- 3) Función segura para completar perfil actual después del login
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

  insert into public.profiles(id,email,full_name,role_name,is_active,source,created_at,updated_at)
  values(
    u.id,
    lower(u.email),
    coalesce(nullif(u.raw_user_meta_data->>'full_name',''), split_part(u.email,'@',1)),
    coalesce(nullif(u.raw_user_meta_data->>'role_name',''),'Usuarios'),
    true,
    'AUTH',
    now(),
    now()
  )
  on conflict(id) do update set
    email=excluded.email,
    full_name=case when public.profiles.full_name is null or public.profiles.full_name in ('Invalid Date','','null','undefined') then excluded.full_name else public.profiles.full_name end,
    role_name=case when public.profiles.role_name is null or public.profiles.role_name in ('Invalid Date','','null','undefined') then excluded.role_name else public.profiles.role_name end,
    updated_at=now();

  select * into p from public.profiles where id=u.id;
  return jsonb_build_object('success',true,'profile',row_to_json(p));
end;
$$;
grant execute on function public.ensure_current_user_profile() to authenticated;

-- 4) Reparar perfiles con "Invalid Date"
update public.profiles
set full_name = initcap(replace(replace(split_part(email,'@',1),'.',' '),'-',' '))
where full_name is null or full_name in ('Invalid Date','','null','undefined');

update public.profiles
set role_name = 'Usuarios'
where role_name is null or role_name not in ('SuperAdmin','Admin','Técnicos','Usuarios') or role_name in ('Invalid Date','','null','undefined');

update public.profiles
set office = null
where office in ('Invalid Date','null','undefined');

update public.profiles set created_at=now() where created_at is null;
update public.profiles set updated_at=now() where updated_at is null;

-- 5) Sincronizar perfiles faltantes desde usuarios reales de Auth
insert into public.profiles(id,email,full_name,role_name,is_active,source,created_at,updated_at)
select
  au.id,
  lower(au.email),
  coalesce(nullif(au.raw_user_meta_data->>'full_name',''), initcap(replace(split_part(au.email,'@',1),'.',' '))),
  coalesce(nullif(au.raw_user_meta_data->>'role_name',''),'Usuarios'),
  true,
  'AUTH_SYNC',
  now(),
  now()
from auth.users au
where au.email is not null
on conflict(id) do update set
  email=excluded.email,
  full_name=case when public.profiles.full_name is null or public.profiles.full_name in ('Invalid Date','','null','undefined') then excluded.full_name else public.profiles.full_name end,
  role_name=case when public.profiles.role_name is null or public.profiles.role_name in ('Invalid Date','','null','undefined') then excluded.role_name else public.profiles.role_name end,
  updated_at=now();

-- 6) Confirmar emails existentes. No tocar confirmed_at porque puede ser columna generada.
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now()),
    confirmation_sent_at = coalesce(confirmation_sent_at, now()),
    aud = 'authenticated',
    role = 'authenticated',
    updated_at = now()
where email is not null;

-- 7) Reset de contraseñas solicitadas por el proyecto.
-- Técnicos: tecnico123456. Gerardo: demo123.
update auth.users au
set encrypted_password = crypt('tecnico123456', gen_salt('bf')),
    updated_at = now()
from public.profiles p
where au.id = p.id
  and p.role_name = 'Técnicos'
  and au.email is not null;

update auth.users
set encrypted_password = crypt('demo123', gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    updated_at = now()
where lower(email)='dir.gerardo.toro@educaciontuc.gov.ar';

-- 8) Reparar auth.identities respetando si id es uuid o text
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
      and (
        user_id = r.id
        or lower(provider_id) = lower(r.email)
        or lower(identity_data->>'email') = lower(r.email)
      );

    if id_udt = 'uuid' then
      execute $sql$
        insert into auth.identities(
          id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at
        ) values (
          $1,$1,
          jsonb_build_object('sub',$1::text,'email',lower($2),'email_verified',true,'phone_verified',false),
          'email',lower($2),now(),now(),now()
        )
      $sql$ using r.id, r.email;
    else
      execute $sql$
        insert into auth.identities(
          id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at
        ) values (
          $1::text,$1,
          jsonb_build_object('sub',$1::text,'email',lower($2),'email_verified',true,'phone_verified',false),
          'email',lower($2),now(),now(),now()
        )
      $sql$ using r.id, r.email;
    end if;
  end loop;
end $$;

-- 9) Perfil especial Gerardo
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

-- 10) RLS y permisos
alter table public.profiles enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_conditions enable row level security;

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

drop policy if exists inventory_items_all_auth on public.inventory_items;
create policy inventory_items_all_auth on public.inventory_items for all to authenticated using (true) with check (true);

drop policy if exists inventory_conditions_all_auth on public.inventory_conditions;
create policy inventory_conditions_all_auth on public.inventory_conditions for all to authenticated using (true) with check (true);

grant select,insert,update,delete on public.profiles to authenticated;
grant select,insert,update,delete on public.inventory_items to authenticated;
grant select,insert,update,delete on public.inventory_conditions to authenticated;
grant select,insert,update,delete on public.service_orders to authenticated;
grant select,insert,update,delete on public.support_tickets to authenticated;
grant select,insert,update,delete on public.notifications to authenticated;
grant select,insert,update,delete on public.service_order_history to authenticated;
grant select,insert,update,delete on public.service_order_notes to authenticated;
grant select,insert,update,delete on public.loans to authenticated;
grant select on public.service_order_statuses to authenticated;

notify pgrst, 'reload schema';
