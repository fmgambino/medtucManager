MEDTUC Ticket Manager v8.51 FINAL

1) Ejecutar primero en Supabase SQL Editor:
   supabase/MEDTUC_V8_51_FINAL.sql

2) Subir los archivos actualizados del proyecto.

Correcciones incluidas:
- Alta de usuarios borrados previamente: si el email sigue existiendo en Supabase Authentication, se repara/recrea el perfil público sin duplicar Auth.
- Dashboard para perfil Usuario/Referente/Técnico con scope por cuenta: tickets, órdenes, calendario y alertas operativas solo de su cuenta o asignación.
- Se quitó la card Usuarios para perfiles no administradores.
- Notificaciones filtradas por target_user, target_role y entidades asociadas a tickets/órdenes del usuario.
- Referente no puede crear órdenes manuales; crea Ticket y el sistema genera Orden de Servicio vinculada.
- Soporte Ticket crea Orden de Servicio y asigna técnico aleatorio por tarea, horario laboral y excepciones activas.
- Tema claro: correcciones de contraste en modales, inputs, popover de notificaciones y bordes de alertas operativas.

Nota técnica:
Para que la asignación por tarea funcione, cargar previamente las tareas en task_types y asociarlas a cada técnico en technician_task_types desde el módulo correspondiente/Supabase.
