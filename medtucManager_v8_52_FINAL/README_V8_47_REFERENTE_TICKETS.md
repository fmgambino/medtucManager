# Ticket Manager v8.47 - Hotfix Referente / Tickets / Roles

1. Ejecutar en Supabase SQL Editor:
   `supabase_hotfix_v8_47_referente_ticket_rbac.sql`

2. Publicar nuevamente todos los archivos del proyecto.

Correcciones incluidas:
- Referente puede ver y crear Soporte Ticket.
- Creación de ticket no envía `technician_user_id` a `support_tickets`, porque esa columna no existe en el schema actual.
- Al crear ticket se genera una Orden de Servicio vinculada, con asignación automática de técnico según horario laboral y excepciones activas.
- Dashboard del Referente muestra tarjetas orientadas a sus tickets/órdenes vinculadas.
- Roles y Permisos con selección por checkbox, seleccionar todos, paginación 5/10/25/50/100/500/1000, arrows anterior/siguiente y eliminación de selección.
- Vista previa de notificaciones móvil: ancho adaptado, scroll, botón X y cierre al salir el cursor.
