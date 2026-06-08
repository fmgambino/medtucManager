MEDTUC Ticket Manager v8.33 FINAL

Aplicación:
1) Subir/reemplazar todos los archivos del proyecto.
2) Ejecutar en Supabase SQL Editor:
   supabase/MEDTUC_V8_33_FINAL_HOTFIX.sql

Correcciones incluidas:
- Roles y Permisos: tabla role_module_permissions, Nuevo perfil y guardado sin error de RLS/schema cache.
- Menú lateral: activo sincronizado correctamente y “Dtos/Oficinas” acotado.
- Soporte Ticket: selector de oficinas desde public.offices.
- Gestión de Préstamos: selector de insumos/equipos desde inventory_items.
- Inventario/notificaciones: grants y RLS estabilizados.
- Header: icono sol/luna SVG minimalista.
- Login: inputs corregidos para evitar bloqueo visual/pointer.
- PDF ingreso/egreso: copias compactas, línea punteada centrada y Falla separada de Informe/Solución.
