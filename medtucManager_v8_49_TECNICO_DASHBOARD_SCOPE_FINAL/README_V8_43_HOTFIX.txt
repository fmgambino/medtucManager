MEDTUC Ticket Manager v8.43 HOTFIX

Correcciones incluidas:
1) Soporte Ticket: corrige el error "record new has no field technician_user_id".
2) Soporte Ticket: al crear ticket, genera automáticamente una Orden de Servicio y asigna técnico/colaborador según disponibilidad, horario laboral y excepciones activas.
3) Dashboard: corrige alineación responsive de tablas en popups de cards superiores, especialmente columna Acciones.
4) Dashboard: corrige contraste/fondo de iconos de acciones en modo oscuro.

IMPORTANTE:
Ejecutar primero en Supabase SQL Editor el archivo:
  supabase_hotfix_v8_43.sql

Luego subir los archivos del proyecto a GitHub Pages/hosting.
