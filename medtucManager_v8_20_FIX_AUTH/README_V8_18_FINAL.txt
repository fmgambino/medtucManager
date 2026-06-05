MEDTUC Ticket Manager v8.18 FINAL

1) Ejecutar en Supabase SQL Editor:
   supabase/schema_med_tuc_ticket_manager_v8_18_FINAL.sql

2) Para que el módulo Usuarios cree/edite usuarios en Supabase Auth desde la PWA:
   - Desplegar la Edge Function incluida:
     supabase/functions/admin-create-user/index.ts
   - Variables necesarias en Supabase Functions:
     SUPABASE_URL
     SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY

3) Si no se despliega la Edge Function, el usuario debe existir primero en Authentication > Users.
   Luego la PWA podrá sincronizar/editar el perfil.

4) Correcciones incluidas:
   - Confirmación de emails Auth existentes.
   - Reparación de auth.identities para provider email.
   - Eliminación de triggers públicos sobre auth.users que rompen login.
   - Corrección de Invalid Date en Usuarios.
   - Dashboard con cards y listados.
   - Inventario PRO con imagen, barcode, condición con color, locación y zona.
