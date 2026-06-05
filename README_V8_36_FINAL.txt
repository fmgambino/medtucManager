MEDTUC Ticket Manager v8.36 FINAL

Aplicar primero:
  supabase/MEDTUC_V8_36_FINAL.sql

Correcciones incluidas:
- Roles y Permisos estable, con Nuevo perfil y guardado de matriz RBAC.
- Módulo Excepciones visible solo para SuperAdmin, con responsive corregido.
- Horarios laborales en Usuarios.
- Select de Oficinas en Usuarios, Soporte Ticket y Préstamos.
- Soporte Ticket autocompleta usuario logueado y limita creación de nuevos servicios por rol.
- Asignación aleatoria excluyendo técnicos fuera de horario o con excepción activa; agrega colaborador si cantidad > 7.
- Dashboard filtrado por técnico logueado cuando corresponde.
- Préstamos autocompletan solicitante, usan inventario y estados Pendiente/Aprobado/Rechazado/Entregado/Devuelto.
- Contador de notificaciones sin duplicación visual.
