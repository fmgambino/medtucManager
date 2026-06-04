# Importación SATMANAGER Access MDB

Una PWA estática en GitHub Pages no puede leer internamente archivos Microsoft Access `.MDB` desde el navegador. Por eso el proyecto incluye importación asistida profesional:

1. Copiar `GX_DATA.MDB` en la carpeta del proyecto.
2. Instalar mdbtools:
   - Linux/WSL: `sudo apt install mdbtools`
3. Ejecutar:
   ```bash
   python3 tools/mdb_to_csv.py GX_DATA.MDB export_satmanager
   ```
4. Importar en **Órdenes de Servicio** el CSV/JSON de Reparaciones generado.

El importador mantiene nombres de tablas y columnas originales en `satmanager_raw`, `satmanager_table` e `imported_at`, y respeta la fecha/hora original si viene en la tabla Access exportada.
