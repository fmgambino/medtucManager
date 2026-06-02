# Ticket Manager PWA – Ministerio de Educación Tucumán

PWA estática para GitHub Pages + Supabase, basada en los módulos funcionales del proyecto `botSoft_v52_notificaciones_routing_fix`:

- Dashboard
- Usuarios
- Roles y permisos
- Equipos
- Inventario
- Gestión de préstamos
- Soporte Ticket
- Control de acceso
- Campus docente
- Biblioteca digital
- Notificaciones
- Mi perfil
- Configuraciones
- Cerrar sesión

También incluye formulario público en:

```txt
/soporteticket/
```

Ese formulario permite que oficinas/reparticiones generen tickets sin iniciar sesión. Los registros se insertan en la tabla `support_tickets` de Supabase. Si Supabase no está configurado, se guardan temporalmente en `localStorage` para pruebas locales.

## Usuario local de prueba

```txt
Email: fernando.m.gambino@gmail.com
Contraseña: Jamboree0342$$
```

## Configurar Supabase

1. Crear proyecto en Supabase.
2. Ejecutar las migraciones incluidas en `/supabase/sql/` y `/supabase/migrations/`.
3. Ejecutar también el bloque `public_support_ticket_policy.sql` incluido en este paquete.
4. Copiar `js/config.example.js` como `js/config.js`.
5. Completar:

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU_ANON_KEY',
  SITE_URL: 'https://fmgambino.github.io/TU-REPO'
};
```

## Configurar inicio de sesión con Google

En Supabase:

1. Ir a **Authentication → Providers → Google**.
2. Activar Google Provider.
3. Crear credenciales OAuth en Google Cloud Console.
4. En Google Cloud Console agregar el redirect URI que muestra Supabase, normalmente:

```txt
https://TU-PROYECTO.supabase.co/auth/v1/callback
```

5. Copiar **Client ID** y **Client Secret** en Supabase.
6. En **Authentication → URL Configuration** configurar:

```txt
Site URL: https://fmgambino.github.io/TU-REPO
Redirect URLs:
https://fmgambino.github.io/TU-REPO/app.html
http://127.0.0.1:5500/app.html
http://localhost:5500/app.html
```

Para producción en GitHub Pages, actualizar `SITE_URL` en `js/config.js` con la URL real del repositorio.

## GitHub Pages

Subir todos los archivos a un repositorio público o privado con Pages habilitado.

Recomendado:

```txt
Branch: main
Folder: /root
```

## Importante

- `index.html` contiene solo la pantalla de login.
- `app.html` contiene solo el panel administrativo.
- El error visual donde login y dashboard aparecían juntos queda corregido separando pantallas y agregando guardia de sesión.
- `/soporteticket/` queda público para generar tickets sin login.

## Footer

TICKET MANAGER © 2026 Tucumán - Argentina  
by Ing. Fernando Gambino · Todos los Derechos Registrados.
