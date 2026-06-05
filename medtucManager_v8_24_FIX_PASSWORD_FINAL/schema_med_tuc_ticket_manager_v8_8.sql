-- =========================================================
-- Ticket Manager MEDTUC v8.8 - Sync técnicos/oficinas SATMANAGER
-- Ejecutar después de v8.7 en Supabase SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists must_change_password boolean not null default false,
  add column if not exists source text not null default 'PWA';

alter table public.service_orders
  add column if not exists technician_name text,
  add column if not exists professional_technician text,
  add column if not exists technician_user_id uuid references auth.users(id),
  add column if not exists office_id uuid references public.offices(id),
  add column if not exists original_received_at timestamptz,
  add column if not exists original_finished_at timestamptz,
  add column if not exists original_delivered_at timestamptz,
  add column if not exists satmanager_tecnico_codigo text,
  add column if not exists satmanager_cliente_codigo text,
  add column if not exists satmanager_equipo_codigo text;

create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  address text,
  phone text,
  email text,
  source text not null default 'PWA',
  is_active boolean not null default true,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.satmanager_tecnicos (
  id uuid primary key default gen_random_uuid(),
  codigo text,
  nombre text not null unique,
  email text,
  phone text,
  source text not null default 'SATMANAGER',
  is_active boolean not null default true,
  raw jsonb,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Normaliza un nombre para generar correo institucional provisional.
create or replace function public.tm_slug_name(p_name text)
returns text
language sql
immutable
as $$
  select trim(both '.' from regexp_replace(lower(translate(coalesce(p_name,''),'áàäâéèëêíìïîóòöôúùüûñÁÀÄÂÉÈËÊÍÌÏÎÓÒÖÔÚÙÜÛÑ','aaaaeeeeiiiioooouuuunAAAAEEEEIIIIOOOOUUUUN')), '[^a-z0-9]+', '.', 'g'));
$$;

-- Sincroniza técnicos detectados en SATMANAGER y órdenes hacia auth.users + profiles.
create or replace function public.sync_satmanager_tecnicos_to_profiles()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  r record;
  v_email text;
  v_uid uuid;
  v_count int := 0;
  v_offices int := 0;
begin
  -- Alimentar satmanager_tecnicos desde órdenes si todavía no fueron importados desde MDB/CSV.
  insert into public.satmanager_tecnicos(nombre, source)
  select distinct trim(x.tech), 'SERVICE_ORDERS'
  from (
    select coalesce(nullif(technician_name,''), nullif(professional_technician,''), nullif((regexp_match(coalesce(observations,''),'Técnico SATMANAGER:\s*([^|]+)'))[1],'')) tech
    from public.service_orders
  ) x
  where x.tech is not null and trim(x.tech) <> ''
  on conflict (nombre) do nothing;

  -- Alimentar oficinas/reparticiones desde órdenes.
  insert into public.offices(name, address, phone, source)
  select distinct trim(office), max(address), max(requester_phone), 'SERVICE_ORDERS'
  from public.service_orders
  where office is not null and trim(office) <> ''
  group by trim(office)
  on conflict (name) do update set
    address = coalesce(excluded.address, public.offices.address),
    phone = coalesce(excluded.phone, public.offices.phone),
    updated_at = now();
  get diagnostics v_offices = row_count;

  for r in
    select nombre, email, phone
    from public.satmanager_tecnicos
    where is_active = true
      and nombre is not null
      and btrim(nombre) <> ''
      and lower(nombre) not in ('ing. fernando gambino','fernando gambino','electrónica gambino','electronica gambino')
    order by nombre
  loop
    v_email := coalesce(nullif(r.email,''), public.tm_slug_name(r.nombre) || '@educaciontuc.gov.ar');

    select id into v_uid from auth.users where email = v_email limit 1;

    if v_uid is null then
      v_uid := gen_random_uuid();
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
        v_email,
        crypt('tecnico123456', gen_salt('bf')),
        now(),
        now(),
        jsonb_build_object('provider','email','providers',array['email']),
        jsonb_build_object('full_name',r.nombre,'role_name','Técnicos'),
        now(),
        now()
      );
    end if;

    insert into public.profiles (
      id, email, full_name, role_name, office, phone, is_active, must_change_password, source, created_at, updated_at
    ) values (
      v_uid, v_email, r.nombre, 'Técnicos', 'Dirección de Informática - Área Soporte Técnico', r.phone, true, true, 'SATMANAGER', now(), now()
    )
    on conflict (id) do update set
      email = excluded.email,
      full_name = excluded.full_name,
      role_name = 'Técnicos',
      phone = coalesce(excluded.phone, public.profiles.phone),
      is_active = true,
      source = 'SATMANAGER',
      updated_at = now();

    v_count := v_count + 1;
  end loop;

  update public.service_orders so
  set professional_technician = coalesce(nullif(so.professional_technician,''), nullif(so.technician_name,'')),
      office_id = o.id,
      updated_at = now()
  from public.offices o
  where o.name = so.office
    and so.office is not null;

  update public.service_orders so
  set technician_user_id = p.id,
      updated_at = now()
  from public.profiles p
  where p.role_name = 'Técnicos'
    and lower(trim(p.full_name)) = lower(trim(coalesce(so.technician_name, so.professional_technician,'')));

  return jsonb_build_object('technicians', v_count, 'offices', v_offices);
end;
$$;

grant execute on function public.sync_satmanager_tecnicos_to_profiles() to authenticated;

-- Ejecutar una primera sincronización al aplicar el SQL.
select public.sync_satmanager_tecnicos_to_profiles();

-- Realtime recomendado. Evita error si la tabla ya estaba en la publicación.
do $$
begin
  begin alter publication supabase_realtime add table public.profiles; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.satmanager_tecnicos; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.offices; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.service_orders; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.notifications; exception when duplicate_object then null; end;
end $$;
