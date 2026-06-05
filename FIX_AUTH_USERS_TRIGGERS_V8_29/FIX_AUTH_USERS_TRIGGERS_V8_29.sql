-- =====================================================
-- MEDTUC Ticket Manager v8.29
-- FIX LOGIN /auth/v1/token 500: Database error querying schema
-- Objetivo: desactivar TODOS los triggers custom sobre auth.users.
-- Ejecutar completo en Supabase SQL Editor como postgres.
-- =====================================================

-- 1) Desactivar triggers de usuario sobre auth.users.
-- Esto NO desactiva triggers internos del sistema PostgreSQL.
alter table auth.users disable trigger user;

-- 2) Mostrar qué triggers quedaron desactivados/activos.
select
  t.tgname as trigger_name,
  ns.nspname as function_schema,
  p.proname as function_name,
  case t.tgenabled
    when 'O' then 'ENABLED'
    when 'D' then 'DISABLED'
    when 'R' then 'REPLICA'
    when 'A' then 'ALWAYS'
    else t.tgenabled::text
  end as trigger_status
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace cn on cn.oid = c.relnamespace
join pg_proc p on p.oid = t.tgfoid
join pg_namespace ns on ns.oid = p.pronamespace
where cn.nspname = 'auth'
  and c.relname = 'users'
  and not t.tgisinternal
order by t.tgname;

-- 3) Confirmar usuarios/perfiles.
select
  lower(u.email) as email,
  p.full_name,
  p.role_name,
  p.is_active,
  u.email_confirmed_at is not null as email_confirmed,
  exists (
    select 1
    from auth.identities i
    where i.user_id = u.id
      and i.provider = 'email'
  ) as has_email_identity,
  'READY_LOGIN_TEST' as estado
from auth.users u
join public.profiles p on p.id = u.id
order by p.role_name, p.full_name;
