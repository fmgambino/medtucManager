-- =====================================================
-- MEDTUC Ticket Manager v8.32 FINAL HOTFIX
-- Ejecutar completo en Supabase SQL Editor.
-- Corrige: role_module_permissions, RLS roles/permisos, oficinas, ON CONFLICT,
-- permisos para guardar perfiles/roles, selects de oficinas y recarga schema cache.
-- =====================================================

create extension if not exists pgcrypto;

-- 1) Roles dinámicos: quitar checks rígidos si existen.
do $$
declare c record;
begin
  for c in
    select conname, conrelid::regclass as tbl
    from pg_constraint
    where contype='c'
      and conrelid in ('public.roles'::regclass,'public.profiles'::regclass)
      and pg_get_constraintdef(oid) ilike '%SuperAdmin%'
  loop
    execute format('alter table %s drop constraint if exists %I', c.tbl, c.conname);
  end loop;
end $$;

-- 2) Tabla RBAC usada por la PWA.
create table if not exists public.role_module_permissions (
  id uuid primary key default gen_random_uuid(),
  role_name text not null,
  module_key text not null,
  can_view boolean not null default false,
  can_create boolean not null default false,
  can_edit boolean not null default false,
  can_delete boolean not null default false,
  can_import boolean not null default false,
  can_export boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(role_name, module_key)
);

-- 3) Permisos/roles base.
insert into public.roles(name,description,is_system)
values
('SuperAdmin','Acceso total',true),
('Admin','Administración general',true),
('Técnicos','Perfil técnico',true),
('Usuarios','Usuario general',true)
on conflict (name) do update set description=excluded.description, is_system=excluded.is_system, updated_at=now();

-- 4) Oficinas: columnas nuevas seguras.
alter table public.offices add column if not exists department text;
alter table public.offices add column if not exists repartition text;
alter table public.offices add column if not exists office_name text;
alter table public.offices add column if not exists dependency text;
alter table public.offices add column if not exists room text;
alter table public.offices add column if not exists normalized_name text;

update public.offices
set normalized_name = lower(trim(coalesce(normalized_name, name, office_name, ''))),
    office_name = coalesce(office_name, name)
where normalized_name is null or office_name is null;

create unique index if not exists offices_normalized_name_uidx
on public.offices(normalized_name)
where normalized_name is not null and normalized_name <> '';

-- 5) Función sync sin ON CONFLICT problemático.
create or replace function public.sync_offices_from_service_orders()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.offices(name, office_name, address, source, is_active, normalized_name, created_at, updated_at)
  select distinct
    trim(so.office) as name,
    trim(so.office) as office_name,
    max(nullif(trim(coalesce(so.address,'')),'')) as address,
    'SYNC_SERVICE_ORDERS' as source,
    true,
    lower(trim(so.office)) as normalized_name,
    now(), now()
  from public.service_orders so
  where nullif(trim(coalesce(so.office,'')),'') is not null
    and not exists (
      select 1 from public.offices o
      where o.normalized_name = lower(trim(so.office))
    )
  group by lower(trim(so.office)), trim(so.office);

  update public.offices o
  set address = coalesce(o.address, s.address),
      office_name = coalesce(o.office_name, s.office_name),
      name = coalesce(o.name, s.office_name),
      updated_at = now()
  from (
    select lower(trim(office)) normalized_name,
           trim(office) office_name,
           max(nullif(trim(coalesce(address,'')),'')) address
    from public.service_orders
    where nullif(trim(coalesce(office,'')),'') is not null
    group by lower(trim(office)), trim(office)
  ) s
  where o.normalized_name = s.normalized_name;
end;
$$;

select public.sync_offices_from_service_orders();

-- 6) Función superadmin sin recursión.
create or replace function public.tm_is_superadmin_v832()
returns boolean
language sql
security definer
set search_path=public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role_name = 'SuperAdmin'
      and p.is_active = true
  );
$$;

grant execute on function public.tm_is_superadmin_v832() to authenticated;
grant execute on function public.sync_offices_from_service_orders() to authenticated;

-- 7) RLS y grants.
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Profiles sin recursión.
alter table public.profiles enable row level security;
do $$ declare pol record; begin
  for pol in select policyname from pg_policies where schemaname='public' and tablename='profiles' loop
    execute format('drop policy if exists %I on public.profiles', pol.policyname);
  end loop;
end $$;
create policy profiles_read_v832 on public.profiles for select to authenticated using (true);
create policy profiles_insert_superadmin_v832 on public.profiles for insert to authenticated with check (public.tm_is_superadmin_v832());
create policy profiles_update_own_or_superadmin_v832 on public.profiles for update to authenticated using (auth.uid()=id or public.tm_is_superadmin_v832()) with check (auth.uid()=id or public.tm_is_superadmin_v832());
create policy profiles_delete_superadmin_v832 on public.profiles for delete to authenticated using (public.tm_is_superadmin_v832());

-- Roles.
alter table public.roles enable row level security;
do $$ declare pol record; begin
  for pol in select policyname from pg_policies where schemaname='public' and tablename='roles' loop
    execute format('drop policy if exists %I on public.roles', pol.policyname);
  end loop;
end $$;
create policy roles_read_v832 on public.roles for select to authenticated using (true);
create policy roles_write_superadmin_v832 on public.roles for all to authenticated using (public.tm_is_superadmin_v832()) with check (public.tm_is_superadmin_v832());

-- role_module_permissions.
alter table public.role_module_permissions enable row level security;
do $$ declare pol record; begin
  for pol in select policyname from pg_policies where schemaname='public' and tablename='role_module_permissions' loop
    execute format('drop policy if exists %I on public.role_module_permissions', pol.policyname);
  end loop;
end $$;
create policy rmp_read_v832 on public.role_module_permissions for select to authenticated using (true);
create policy rmp_write_superadmin_v832 on public.role_module_permissions for all to authenticated using (public.tm_is_superadmin_v832()) with check (public.tm_is_superadmin_v832());

-- Offices.
alter table public.offices enable row level security;
do $$ declare pol record; begin
  for pol in select policyname from pg_policies where schemaname='public' and tablename='offices' loop
    execute format('drop policy if exists %I on public.offices', pol.policyname);
  end loop;
end $$;
create policy offices_read_v832 on public.offices for select to authenticated using (true);
create policy offices_write_superadmin_admin_v832 on public.offices for all to authenticated using (public.tm_is_superadmin_v832() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='Admin' and p.is_active=true)) with check (public.tm_is_superadmin_v832() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name='Admin' and p.is_active=true));

-- Notifications: permitir contador/lectura según destino y escritura autenticada.
alter table public.notifications enable row level security;
do $$ declare pol record; begin
  for pol in select policyname from pg_policies where schemaname='public' and tablename='notifications' loop
    execute format('drop policy if exists %I on public.notifications', pol.policyname);
  end loop;
end $$;
create policy notifications_read_v832 on public.notifications for select to authenticated using (target_user is null or target_user=auth.uid() or target_role is null or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role_name=target_role));
create policy notifications_write_v832 on public.notifications for insert to authenticated with check (true);
create policy notifications_update_v832 on public.notifications for update to authenticated using (true) with check (true);
create policy notifications_delete_superadmin_v832 on public.notifications for delete to authenticated using (public.tm_is_superadmin_v832());

-- 8) Poblar role_module_permissions por defecto si faltan.
with modules(module_key) as (
  values ('dashboard'),('users'),('roles'),('orders'),('inventory'),('loans'),('tickets'),('notifications'),('offices'),('settings'),('profile')
)
insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
select 'SuperAdmin', module_key, true,true,true,true,true,true from modules
on conflict (role_name,module_key) do update set can_view=true,can_create=true,can_edit=true,can_delete=true,can_import=true,can_export=true,updated_at=now();

insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export) values
('Admin','dashboard',true,false,false,false,false,false),
('Admin','users',true,true,true,false,false,true),
('Admin','roles',true,false,false,false,false,false),
('Admin','orders',true,true,true,false,true,true),
('Admin','inventory',true,true,true,false,true,true),
('Admin','loans',true,true,true,false,true,true),
('Admin','tickets',true,true,true,false,true,true),
('Admin','notifications',true,true,true,false,false,false),
('Admin','offices',true,true,true,false,true,true),
('Admin','profile',true,false,true,false,false,false),
('Técnicos','dashboard',true,false,false,false,false,false),
('Técnicos','orders',true,false,true,false,false,true),
('Técnicos','inventory',true,false,false,false,false,false),
('Técnicos','tickets',true,false,true,false,false,false),
('Técnicos','notifications',true,false,true,false,false,false),
('Técnicos','profile',true,false,true,false,false,false),
('Usuarios','dashboard',true,false,false,false,false,false),
('Usuarios','tickets',true,true,false,false,false,false),
('Usuarios','loans',true,true,false,false,false,false),
('Usuarios','notifications',true,false,true,false,false,false),
('Usuarios','profile',true,false,true,false,false,false)
on conflict (role_name,module_key) do nothing;

-- 9) Refrescar schema cache PostgREST.
notify pgrst, 'reload schema';

-- Diagnóstico final.
select 'role_module_permissions' as tabla, count(*) as registros from public.role_module_permissions
union all
select 'offices', count(*) from public.offices
union all
select 'roles', count(*) from public.roles;
