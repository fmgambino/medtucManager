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

## Corrección v7.1 - Autenticación Supabase

Esta versión corrige el flujo de autenticación:

- `index.html`: login con email/contraseña, Google OAuth y creación de usuario institucional.
- `recuperar.html`: recuperación de contraseña sin error `loginForm is not defined`.
- `reset-password.html`: pantalla nueva para definir contraseña luego del enlace enviado por Supabase.
- `js/auth.js`: refactorizado para no ejecutar código de login en páginas donde el formulario no existe.
- Se eliminó dependencia de usuario local/demo para el acceso principal.

### Configurar URLs en Supabase

En Supabase ir a **Authentication > URL Configuration**.

**Site URL para pruebas locales:**

```txt
http://127.0.0.1:5500
```

**Redirect URLs** agregar una por una:

```txt
http://127.0.0.1:5500
http://127.0.0.1:5500/
http://127.0.0.1:5500/index.html
http://127.0.0.1:5500/app.html
http://127.0.0.1:5500/recuperar.html
http://127.0.0.1:5500/reset-password.html
```

Para GitHub Pages agregar también:

```txt
https://fmgambino.github.io/*
```

### Crear usuario SuperAdmin recomendado

1. Supabase > Authentication > Users > Add user.
2. Email: `fernando.m.gambino@gmail.com`.
3. Password: la contraseña definida por el administrador.
4. Activar **Auto Confirm User**.
5. Ejecutar `supabase/seed_superadmin_profile.sql`.

El perfil debe quedar como:

```txt
role_name = SuperAdmin
is_active = true
```

### Google OAuth

En Supabase > Authentication > Sign In / Providers > Google:

1. Activar Google.
2. Cargar Client ID y Client Secret de Google Cloud Console.
3. En Google Cloud Console, agregar como Authorized redirect URI la URL que informa Supabase en el proveedor Google.
4. En Supabase URL Configuration, mantener las Redirect URLs anteriores.

### Nota sobre contraseñas

No se recomienda insertar usuarios manualmente en `auth.users`. Para evitar errores de hash o credenciales inválidas, crear o resetear la contraseña desde Authentication > Users.

## Corrección v8.1 - Login y panel

Se corrigió el error del panel administrativo:

```txt
supa.rpc(...).catch is not a function
```

Causa: `supabase-js` devuelve un `PostgrestBuilder` thenable; no debe encadenarse `.catch()` directamente sobre `supa.rpc(...)`. Ahora el inicio del panel usa `try/catch` y `await` correctamente.

### Prueba local recomendada

1. Abrir el proyecto con Live Server.
2. Usar siempre la URL del puerto activo, por ejemplo:

```txt
http://127.0.0.1:5501/
```

3. En Supabase > Authentication > URL Configuration agregar como Redirect URLs, una por una:

```txt
http://127.0.0.1:5500/*
http://127.0.0.1:5501/*
http://localhost:5500/*
http://localhost:5501/*
```

4. Crear el usuario desde Authentication > Users:

```txt
Email: fernando.m.gambino@gmail.com
Password: Jamboree0342$$
Auto Confirm User: ACTIVADO
```

5. Ejecutar:

```txt
supabase/seed_superadmin_profile.sql
```

### Flujo validado

- `index.html`: login, Google, creación de usuario y recuperación.
- `recuperar.html`: envía enlace de recuperación.
- `reset-password.html`: actualiza contraseña.
- `app.html`: panel administrativo protegido.
- `/soporteticket/`: formulario público sin login.

## Cambios v8.2 UX/UI

- Popups institucionales refinados para Detalle, Alta y Edición.
- Card de usuario con avatar centrado, rol, datos de contacto y estado.
- Formulario de órdenes de servicio rediseñado y compatible con campos SATMANAGER.
- Paginación del módulo Órdenes de Servicio: 5/10/25/50/100/500, arriba y abajo de la tabla.
- Importación CSV SATMANAGER preservando la fecha de ingreso importada cuando viene en el campo `Fecha`.
- Vista previa de notificaciones al pasar el cursor por la campana y botón Historial.
- Exportación PDF con rótulo institucional, línea de membrete, fecha/hora, usuario y pie.

> Nota sobre el logo en PDF: jsPDF puede bloquear imágenes remotas por CORS en algunos navegadores. Para máxima compatibilidad, usar logo en base64/local o servir el proyecto desde el mismo dominio.

## v8.3 Mobile First
- Header móvil simplificado: foto de perfil, notificaciones y cerrar sesión.
- Menú footer flotante para móvil con accesos directos: Dashboard, Inventario, Órdenes de Servicio, Tickets y menú hamburguesa para el resto de los módulos.
- Menú hamburguesa móvil con Roles y Permisos, Usuarios, Préstamos, Notificaciones, Mi Perfil, Configuraciones y Cerrar Sesión.
- Ajustes responsive en cards, tablas, popups SweetAlert2 y botones para navegación táctil.

## v8.4 - Notas de actualización

- Se agregaron checkbox por fila y selección masiva en tablas.
- El header móvil queda institucional: logo a la izquierda + campana + perfil + salir.
- El menú inferior móvil contiene Dashboard, Inventario, Órdenes, Tickets y Más.
- El módulo Notificaciones permite alternar Leída/Sin leer con un clic, selección masiva y redirección al módulo vinculado.
- El documento de ingreso/egreso imprime dos copias: una para la Oficina/Repartición y otra para Dirección de Informática - Área Soporte Técnico.
- SQL de actualización: `supabase/schema_med_tuc_ticket_manager_v8_4.sql`.
- Para SATMANAGER Access: por seguridad del navegador, GitHub Pages no puede leer `.MDB` directamente sin backend. Exportar desde Access la tabla de reparaciones a CSV o cargar en `satmanager_reparaciones`; luego usar `select public.import_satmanager_reparaciones();`. El schema v8.4 incluye tablas staging con nombres compatibles.

## v8.5 - Actualizaciones solicitadas

- Header mobile institucional: logo a la izquierda + campana + foto de perfil + salir.
- Dock footer flotante mobile: Dashboard, Inventario, Órdenes, Tickets y Menú.
- Contador real de notificaciones sin leer en el header.
- Botón **Limpiar contador** en Notificaciones: marca todas como leídas y deja el contador en cero.
- Clic en una notificación: marca como leída y redirige al módulo correspondiente.
- Cambio de foto desde el header y desde **Mi Perfil**.
- Perfil rediseñado con foto central, rol, datos y accesos rápidos.
- Constancias de ingreso/egreso con rótulo y logo visible en ambas copias.
- Exportación PDF con membrete institucional.
- Importador SATMANAGER mejorado para CSV/JSON con mapeo de columnas y fechas originales.
- Importación MDB asistida mediante `tools/mdb_to_csv.py`.
- SQL actualizado para Supabase Realtime: `supabase/schema_med_tuc_ticket_manager_v8_5.sql`.

### Importar Access MDB de SATMANAGER

Por limitación de seguridad del navegador, una PWA estática en GitHub Pages no puede leer directamente `.MDB` sin un conversor local/servidor. Se incluye herramienta:

```bash
python3 tools/mdb_to_csv.py GX_DATA.MDB export_satmanager
```

Luego importar el CSV/JSON generado desde el módulo **Órdenes de Servicio**.

## v8.6 - Correcciones aplicadas

- Seleccionar todo corregido para Notificaciones y tablas de todos los módulos.
- Importador SATMANAGER enriquecido: conserva técnico, códigos de cliente/equipo/técnico, oficina/repartición desde Cliente, Nº de orden, fechas originales e `imported_at` separado.
- Se agregan columnas Supabase en `supabase/schema_med_tuc_ticket_manager_v8_6.sql`.
- Menú lateral colapsable al hacer clic en el logo institucional.
- Detalle y edición de Órdenes de Servicio ahora muestran técnico, oficina/repartición y datos SATMANAGER completos, sin importes.
- Tema mobile/header ajustado y soporte RealTime documentado en SQL.

## Actualización v8.8

1. Ejecutar en Supabase SQL Editor:

```sql
supabase/schema_med_tuc_ticket_manager_v8_8.sql
```

2. Refrescar la PWA con Ctrl + F5.

3. Ir a **Usuarios** y presionar **Actualizar técnicos**. Esto sincroniza automáticamente:

- `satmanager_tecnicos` → `auth.users`
- `satmanager_tecnicos` → `profiles` con rol `Técnicos`
- `service_orders.office` → `offices`

Los técnicos creados quedan con contraseña inicial:

```txt
tecnico123456
```

Los SuperAdmin `fernando.m.gambino@gmail.com` y `electronicagambino@gmail.com` no se mezclan con el rol Técnicos.

También se corrigió el favicon oficial y el header mobile usa el ícono compacto del Gobierno de Tucumán.
