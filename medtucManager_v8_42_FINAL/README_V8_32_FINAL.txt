MEDTUC Ticket Manager v8.32 FINAL

Aplicación:
1) Ejecutar en Supabase SQL Editor:
   supabase/MEDTUC_V8_32_FINAL_HOTFIX.sql

2) Reemplazar el proyecto completo en hosting/local.

Correcciones incluidas:
- Login: inputs editables sin email precargado.
- Sidebar: Dtos/Oficinas.
- Header: iconos SVG profesionales sol/luna.
- Sidebar colapsable al hacer clic en el logo.
- Roles y Permisos: tabla role_module_permissions, botón Nuevo perfil, RLS corregido.
- Soporte Ticket y formularios: selects de oficinas desde tabla offices.
- PDF ingreso/egreso: corte centrado, menos espacio en blanco, Falla separada de Informe técnico y Solución/Observaciones.
- Notificaciones: contador operativo.
- SQL: corrige ON CONFLICT de oficinas y recarga schema cache.
