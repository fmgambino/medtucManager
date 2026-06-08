-- =========================================================
-- MEDTUC Ticket Manager v8.24
-- FIX DEFINITIVO: cambio de contraseña sin usar updateUserById()
-- Motivo: el proyecto devuelve "Database error loading user" desde Supabase Auth.
-- Ejecutar en Supabase SQL Editor como postgres.
-- =========================================================

create extension if not exists pgcrypto;

create or replace function public.superadmin_set_user_password(
  p_user_id uuid,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_exists boolean;
begin
  if p_user_id is null then
    raise exception 'p_user_id es obligatorio';
  end if;

  if p_password is null or length(trim(p_password)) < 6 then
    raise exception 'La contraseña debe tener al menos 6 caracteres';
  end if;

  select exists(select 1 from auth.users u where u.id = p_user_id)
    into v_exists;

  if not v_exists then
    raise exception 'No existe usuario en auth.users con id %', p_user_id;
  end if;

  update auth.users
  set
    encrypted_password = crypt(p_password, gen_salt('bf')),
    updated_at = now(),
    recovery_token = null,
    recovery_sent_at = null,
    confirmation_token = null,
    email_change_token_new = null,
    email_change_token_current = null,
    reauthentication_token = null
  where id = p_user_id;

  update public.profiles
  set
    must_change_password = false,
    updated_at = now()
  where id = p_user_id;

  return jsonb_build_object(
    'success', true,
    'user_id', p_user_id,
    'updated_at', now()
  );
end;
$$;

revoke all on function public.superadmin_set_user_password(uuid, text) from public;
grant execute on function public.superadmin_set_user_password(uuid, text) to service_role;

-- Test manual opcional:
-- select public.superadmin_set_user_password('UUID_DEL_USUARIO'::uuid, 'NuevaClave123');
