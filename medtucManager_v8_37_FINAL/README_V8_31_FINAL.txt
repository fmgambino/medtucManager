MEDTUC Ticket Manager v8.31

1) Ejecutar en Supabase SQL Editor:
   supabase/MEDTUC_V8_31_RBAC_OFFICES_FINAL.sql

2) Reemplazar archivos del proyecto y abrir app.html/index.html.

Cambios:
- Corrige error ON CONFLICT(normalized_name) creando índice unique parcial.
- Reconstruye RBAC para módulos y acciones.
- Agrega Dtos/Oficinas/Reparticiones con Departamento, Repartición, Oficina, Dependencia y Habitación.
- Sincroniza oficinas existentes desde service_orders.
- Agrega paginación 5/10/25/50/100/500/1000 arriba y abajo.
- Colapso de menú lateral desde el logo.
- Ícono SVG profesional para cambio claro/oscuro.
- Permisos por perfil aplicados en frontend y RLS base.
