# MEDTUC Ticket Manager v8.30

## Cambios principales

- Módulo **Roles y Permisos** refactorizado con matriz por perfil, módulo y acción: ver, crear, editar, eliminar, importar y exportar.
- Control de menú y acciones por permisos del perfil autenticado.
- Nuevo módulo **Dtos/Oficinas/Reparticiones**.
- Tabla `public.offices` ampliada con: Departamento, Repartición, Oficina, Dependencia y Habitación.
- Sincronización de oficinas/reparticiones desde `service_orders` para evitar duplicados.
- Trigger automático: cuando se carga un ticket, crea una Orden de Servicio y la asigna aleatoriamente a un perfil técnico activo.
- Normalización de rol `Tecnicos` a `Técnicos`.

## Aplicación

1. Subir/reemplazar todo el proyecto.
2. Ejecutar en Supabase SQL Editor:

```txt
supabase/MEDTUC_V8_30_RBAC_OFFICES_ASSIGNMENT.sql
```

3. Verificar Edge Function `admin-create-user` desplegada.
4. Limpiar caché o abrir en incógnito.
5. Ingresar como SuperAdmin y configurar permisos desde **Roles y Permisos**.

