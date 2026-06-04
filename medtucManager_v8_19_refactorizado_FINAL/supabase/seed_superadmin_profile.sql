-- =========================================================
-- Ticket Manager - Seed / reparación de perfil SuperAdmin
-- Ejecutar DESPUÉS de crear el usuario desde Authentication > Users.
-- Recomendado: Add user > Auto Confirm User > Password: Jamboree0342$$
-- =========================================================

insert into public.profiles (
  id,
  email,
  full_name,
  role_name,
  office,
  is_active
)
select
  u.id,
  u.email,
  case
    when u.email = 'fernando.m.gambino@gmail.com' then 'Ing. Fernando Gambino'
    when u.email = 'electronicagambino@gmail.com' then 'Electrónica Gambino'
    else split_part(u.email,'@',1)
  end,
  'SuperAdmin',
  'Dirección de Informática',
  true
from auth.users u
where u.email in (
  'fernando.m.gambino@gmail.com',
  'electronicagambino@gmail.com'
)
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role_name = 'SuperAdmin',
  office = 'Dirección de Informática',
  is_active = true,
  updated_at = now();

select
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role_name,
  p.is_active
from auth.users u
left join public.profiles p on p.id = u.id
where u.email in (
  'fernando.m.gambino@gmail.com',
  'electronicagambino@gmail.com'
);
