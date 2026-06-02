# Importación desde SATMANAGER / Access

Como GitHub Pages es estático, no ejecuta drivers ODBC ni puede parsear `.MDB` de forma segura en navegador. Para importar desde SATMANAGER:

1. Abrir `GX_DATA.MDB` con Microsoft Access.
2. Exportar la tabla de órdenes/servicios como CSV con separador `;`.
3. Renombrar/ordenar columnas según este encabezado:

```csv
nro_orden;sat_id;fecha_ingreso;dependencia;solicitante;bien_tipo;bien_marca;bien_modelo;serie;problema;diagnostico;solucion;tecnico;prioridad;estado
```

4. Importar el CSV desde el módulo **Órdenes de Servicio**.

Campos SATMANAGER habituales sugeridos:
- Nº/Código de orden → `nro_orden`
- ID interno Access → `sat_id`
- Fecha de alta → `fecha_ingreso`
- Oficina/sector → `dependencia`
- Usuario/solicitante → `solicitante`
- Equipo/bien/patrimonio → `bien_tipo`, `bien_marca`, `bien_modelo`, `serie`
- Falla/problema → `problema`
- Informe técnico → `diagnostico`
- Trabajo realizado → `solucion`
- Responsable → `tecnico`
- Estado → `estado`
