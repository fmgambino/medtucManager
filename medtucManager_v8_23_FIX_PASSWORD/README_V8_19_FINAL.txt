# MEDTUC Ticket Manager v8.19 FINAL

Cambios:
- Reparación de login de usuarios Auth existentes.
- Limpieza de triggers rotos sobre auth.users.
- Confirmación de emails Auth existentes.
- Reparación de auth.identities compatible con id uuid/text.
- Reset de contraseña para Técnicos: tecnico123456.
- Reset de Gerardo Toro: demo123.
- Corrección de Invalid Date en Usuarios.
- Usuarios: creación/edición vía Edge Function admin-create-user.
- Inventario: columnas ampliadas, imágenes, condiciones con color, tabla y detalle mejorados.

Pasos:
1. Ejecutar supabase/schema_med_tuc_ticket_manager_v8_19_FINAL.sql.
2. Desplegar supabase/functions/admin-create-user/index.ts si quiere crear usuarios desde el módulo Usuarios.
3. Configurar en la Edge Function la variable SUPABASE_SERVICE_ROLE_KEY.
4. Ctrl + F5.
