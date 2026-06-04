MEDTUC Ticket Manager v8.17 FINAL

IMPORTANTE - Usuarios/Auth:
1) Ejecutar supabase/schema_med_tuc_ticket_manager_v8_17_FINAL.sql
2) Para crear usuarios desde el módulo Usuarios con contraseña, desplegar la Edge Function incluida:
   supabase/functions/admin-create-user/index.ts
3) Configurar secret SUPABASE_SERVICE_ROLE_KEY en Supabase Edge Functions.

Comandos sugeridos con Supabase CLI:
   supabase functions deploy admin-create-user
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY

La PWA intenta primero la Edge Function admin-create-user. Si no está desplegada, usa RPC fallback, pero el usuario debe existir antes en Authentication > Users.

Correcciones v8.17:
- Corrige Email not confirmed actualizando email_confirmed_at para usuarios activos.
- Elimina triggers públicos sobre auth.users que rompían Auth.
- Dashboard con cards superiores y modales con registros reales.
- Modales de dashboard no dependen de caché de state.rows.
- Login directo sin popup de acceso validado.
- Header mobile conservado.
