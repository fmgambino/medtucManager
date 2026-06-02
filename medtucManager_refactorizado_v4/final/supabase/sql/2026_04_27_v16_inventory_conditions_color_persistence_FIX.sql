-- ISM Robosoft v16 - FIX DEFINITIVO: persistencia de condiciones y colores.
-- Ejecutar completo en Supabase SQL Editor.

begin;

create table if not exists public.inventory_conditions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#64748b',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.inventory_conditions add column if not exists color text not null default '#64748b';
alter table public.inventory_conditions add column if not exists sort_order integer not null default 100;
alter table public.inventory_conditions add column if not exists is_active boolean not null default true;
alter table public.inventory_conditions add column if not exists updated_at timestamptz default now();

-- Normaliza registros duplicados por espacios/capitalización, conservando el más reciente.
with ranked as (
  select id,
         row_number() over (partition by lower(trim(regexp_replace(name, '\s+', ' ', 'g'))) order by updated_at desc nulls last, created_at desc nulls last, id desc) rn
  from public.inventory_conditions
)
update public.inventory_conditions c
set is_active = false, updated_at = now()
from ranked r
where c.id = r.id and r.rn > 1;

-- Permisos/RLS permisivos para usuarios autenticados. La app igual controla roles en frontend.
alter table public.inventory_conditions enable row level security;

do $$ begin
  create policy inventory_conditions_select_auth_v16
  on public.inventory_conditions for select to authenticated using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy inventory_conditions_insert_auth_v16
  on public.inventory_conditions for insert to authenticated with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy inventory_conditions_update_auth_v16
  on public.inventory_conditions for update to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;

grant select, insert, update on public.inventory_conditions to authenticated;

-- Nueva RPC sin defaults para evitar conflictos con versiones anteriores cacheadas.
drop function if exists public.save_inventory_condition_v16(text, text);

create function public.save_inventory_condition_v16(
  p_name text,
  p_color text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text := nullif(trim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g')), '');
  v_color text := case when coalesce(p_color,'') ~* '^#[0-9a-f]{6}$' then lower(p_color) else '#64748b' end;
  v_row public.inventory_conditions%rowtype;
begin
  if v_name is null then
    raise exception 'Ingresá el nombre de la condición';
  end if;

  select id into v_id
  from public.inventory_conditions
  where lower(trim(regexp_replace(name, '\s+', ' ', 'g'))) = lower(v_name)
  order by is_active desc, updated_at desc nulls last, created_at desc nulls last
  limit 1;

  if v_id is null then
    insert into public.inventory_conditions(name, color, sort_order, is_active, updated_at)
    values (v_name, v_color, 100, true, now())
    returning * into v_row;
  else
    update public.inventory_conditions
    set name = v_name,
        color = v_color,
        is_active = true,
        updated_at = now()
    where id = v_id
    returning * into v_row;
  end if;

  return jsonb_build_object(
    'id', v_row.id,
    'name', v_row.name,
    'color', v_row.color,
    'sort_order', v_row.sort_order,
    'is_active', v_row.is_active
  );
end;
$$;

grant execute on function public.save_inventory_condition_v16(text, text) to authenticated;

-- Mantiene compatibilidad con código viejo, pero sin defaults problemáticos.
drop function if exists public.upsert_inventory_condition(text, text);

create function public.upsert_inventory_condition(
  p_name text,
  p_color text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payload jsonb;
begin
  v_payload := public.save_inventory_condition_v16(p_name, p_color);
  return (v_payload->>'id')::uuid;
end;
$$;

grant execute on function public.upsert_inventory_condition(text, text) to authenticated;

notify pgrst, 'reload schema';

commit;
