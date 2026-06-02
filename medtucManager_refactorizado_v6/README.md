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

## Cambios v6 solicitados

- Perfiles oficiales: **SuperAdmin**, **Admin**, **Técnicos** y **Usuarios**. Los permisos se administran desde **Roles y Permisos**.
- Módulo **Órdenes de Servicio** institucional, inspirado en SATMANAGER, sin campos comerciales: no hay mano de obra, repuestos, saldo ni entrega monetaria.
- Estados configurables por nombre y color: Pendiente, En proceso, Terminada, Lista p/Retirar, Entregada, Cancelada y nuevos estados personalizados.
- Notificaciones automáticas al crear, atender, cambiar estado, importar, consumir insumos o generar notas.
- Si una orden usa un insumo del inventario, se descuenta del stock local.
- Dos impresiones institucionales: **Constancia de Ingreso de Equipo** y **Constancia de Entrega de Equipo**, con rótulo, logo, fecha y hora.
- Exportación PDF A4 agregada a los módulos con exportación CSV.
- Configuración de paleta visual de la PWA desde el módulo Configuraciones.
- Importador SATMANAGER flexible para CSV/JSON. Para respaldos Access `.MDB/.ACCDB`, usar el conversor incluido.

### Importar respaldo Access de SATMANAGER

GitHub Pages es estático y el navegador no puede leer directamente bases Microsoft Access por seguridad. Por eso el proyecto incluye:

```bash
python tools/access_to_csv.py GX_DATA.MDB salida_csv
```

Requiere `mdbtools`:

```bash
sudo apt install mdbtools
```

Luego importar el CSV generado desde **Órdenes de Servicio → Importar SATMANAGER**. El importador reconoce columnas similares a: Orden, Fecha, Cliente, Dirección, Teléfono, Técnico, Número de Serie, Tipo de Equipo, Marca, Modelo, Accesorios, Falla, Informe, Estado y Ticket.

### Supabase Auth con Google

1. En Supabase, ir a **Authentication → Providers → Google**.
2. Activar Google Provider.
3. Crear credenciales OAuth en Google Cloud Console.
4. Agregar como Redirect URL:
   - `https://TU_USUARIO.github.io/TU_REPO/app.html`
   - Para pruebas locales: `http://127.0.0.1:5500/app.html` o el puerto usado por Live Server.
5. Copiar Client ID y Client Secret en Supabase.
6. En `js/config.js`, completar `SUPABASE_URL` y `SUPABASE_ANON_KEY`.

Usuario local de prueba SuperAdmin:

- Email: `fernando.m.gambino@gmail.com`
- Contraseña: `Jamboree0342$$`
