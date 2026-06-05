FIX v8.20 - Auth, perfiles y cambio de contraseña

Problema detectado:
- El error 400 en admin-create-user aparece cuando la Edge Function no tiene SUPABASE_SERVICE_ROLE_KEY configurada, no está desplegada correctamente, o no recibe sesión JWT del SuperAdmin.
- Los perfiles de public.profiles NO alcanzan para iniciar sesión: cada Técnico/Admin/Usuario debe existir también en Authentication -> Users.

Pasos:
1) En Supabase SQL Editor ejecutar:
   supabase/FIX_AUTH_PERFILES_V8_20_EJECUTAR.sql

2) En Supabase -> Edge Functions -> Secrets crear/verificar:
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY  (Settings -> API -> service_role key)

3) Deploy de la función:
   supabase functions deploy admin-create-user --no-verify-jwt

4) Entrar con el SuperAdmin y editar cada perfil técnico/admin/usuario colocando una contraseña nueva.
   Eso crea/repara el usuario en Authentication y sincroniza public.profiles.

5) Probar login:
   - Cerrar sesión del SuperAdmin.
   - Ingresar con email del técnico/admin/usuario y la contraseña asignada.
