# Ticket Manager v7 - Ministerio de Educación Tucumán

PWA institucional con HTML5, CSS3, JavaScript, SweetAlert2, Supabase Auth/Database, CSV/PDF A4, módulo público `/soporteticket` y panel administrativo.

## Perfiles válidos

- SuperAdmin
- Admin
- Técnicos
- Usuarios

Se eliminaron referencias a Docente, Mentor, Alumno, Campus, Biblioteca y módulos del proyecto educativo original.

## Instalación rápida

1. Crear un proyecto en Supabase.
2. Ir a **SQL Editor** y ejecutar:

```sql
supabase/schema_med_tuc_ticket_manager_v7.sql
```

3. Crear el usuario en Supabase Auth:

```text
Email: fernando.m.gambino@gmail.com
Password: Jamboree0342$$
```

4. Ejecutar nuevamente el bloque final del SQL o todo el SQL completo para que el usuario quede como `SuperAdmin` activo.
5. Editar `js/config.js` y colocar URL + ANON KEY del proyecto Supabase.
6. Servir localmente:

```bash
npx serve .
```

7. Abrir:

```text
http://localhost:3000/index.html
```

## Google Auth

En Supabase:

1. Ir a **Authentication > Providers > Google**.
2. Activar Google.
3. Cargar Client ID y Client Secret desde Google Cloud Console.
4. En Google Cloud Console agregar como Authorized redirect URI:

```text
https://TU-PROYECTO.supabase.co/auth/v1/callback
```

5. En Supabase **Authentication > URL Configuration** agregar:

```text
http://localhost:3000/app.html
https://USUARIO.github.io/REPOSITORIO/app.html
```

## Formulario público

El formulario público está en:

```text
/soporteticket/
```

Permite insertar tickets sin login mediante política RLS pública controlada.

## Órdenes de Servicio

Incluye:

- Estados configurables con color.
- Alta, edición, eliminación y búsqueda.
- Impresión de ingreso de equipo.
- Impresión de entrega.
- Historial de cambios de estado.
- Notificaciones automáticas.
- Notas para compras/manuales y borrador tipo IA basado en la orden.
- Importador SATMANAGER vía CSV inteligente.

> Nota: el navegador no puede leer directamente archivos `.MDB` de Access sin backend/driver ODBC. Para GitHub Pages se incluye importación CSV inteligente. Exportar desde SATMANAGER/Access a CSV y subirlo desde el módulo Órdenes.

## Reportes

Todos los módulos principales tienen:

- Exportar CSV.
- Exportar PDF A4 con rótulo, fecha, hora y usuario.

## PWA

Incluye `manifest.webmanifest` y `sw.js` para instalación en escritorio/móvil.
