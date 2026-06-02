# Ticket Manager PWA v5

PWA HTML5 + CSS3 + JavaScript + SweetAlert2 + Supabase, lista para GitHub Pages.

## Módulos incluidos

- Dashboard
- Usuarios
- Roles y Permisos
- Órdenes de Servicio
- Inventario
- Gestión de Préstamos
- Soporte Ticket
- Notificaciones
- Mi Perfil
- Configuraciones
- Cerrar Sesión

## Perfiles definidos

- SuperAdmin: acceso completo.
- Administrador: administración operativa.
- Técnicos: gestión técnica, órdenes, inventario, préstamos, tickets y notificaciones.
- Usuarios: portal de consulta y carga de tickets/préstamos.

Usuario demo SuperAdmin:

```txt
Email: fernando.m.gambino@gmail.com
Pass:  Jamboree0342$$
```

## Formulario público de Soporte Ticket

El formulario público queda disponible sin login en:

```txt
/soporteticket/
```

En GitHub Pages usar:

```txt
https://TU_USUARIO.github.io/TU_REPOSITORIO/soporteticket/
```

## Configuración Supabase

1. Crear un proyecto en Supabase.
2. Copiar `js/config.example.js` como `js/config.js`.
3. Completar:

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://xxxx.supabase.co',
  SUPABASE_ANON_KEY: 'tu_anon_key'
};
```

4. Ejecutar los SQL incluidos en `/supabase/sql/` y `public_support_ticket_policy.sql`.
5. Crear el usuario SuperAdmin en Supabase Auth con el email `fernando.m.gambino@gmail.com`.

## Configurar Login con Google en Supabase

1. Ir a **Supabase Dashboard > Authentication > Providers**.
2. Activar **Google**.
3. Crear credenciales OAuth en Google Cloud Console.
4. En Google Cloud Console agregar como Authorized redirect URI:

```txt
https://TU_PROJECT_REF.supabase.co/auth/v1/callback
```

5. Copiar **Client ID** y **Client Secret** en Supabase > Authentication > Providers > Google.
6. En Supabase > Authentication > URL Configuration configurar:

```txt
Site URL: https://TU_USUARIO.github.io/TU_REPOSITORIO/
Redirect URLs:
https://TU_USUARIO.github.io/TU_REPOSITORIO/app.html
http://127.0.0.1:5500/app.html
http://localhost:5500/app.html
```

## Publicación en GitHub Pages

1. Subir todos los archivos del proyecto al repositorio.
2. Ir a **Settings > Pages**.
3. Seleccionar branch `main` y carpeta `/root`.
4. Abrir la URL publicada.

## Importación desde SATMANAGER / Access

El módulo **Órdenes de Servicio** está preparado para cargar órdenes técnicas inspiradas en SATMANAGER.

Flujo recomendado:

1. Exportar desde Access/SATMANAGER a CSV.
2. Normalizar columnas: `orden, fecha, cliente, direccion, telefono, tecnico, serie, tipo_equipo, marca, modelo, accesorios, falla, informe, mano_obra, repuestos, entrega, saldo, estado`.
3. Importar desde el módulo Órdenes de Servicio.
4. Exportar CSV/PDF A4 desde la PWA.

## Footer

Incluye:

`TICKET MANAGER © 2026 Tucumán - Argentina by Ing. Fernando Gambino · Todos los Derechos Registrados.`

También se incorporó botón Cafecito.
