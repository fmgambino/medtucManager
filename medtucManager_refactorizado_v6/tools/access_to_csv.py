#!/usr/bin/env python3
"""
Conversor SATMANAGER Access (.MDB/.ACCDB) a CSV para Ticket Manager.
Requiere mdbtools instalado (Linux/macOS):
  sudo apt install mdbtools
Uso:
  python tools/access_to_csv.py GX_DATA.MDB salida_csv
El script exporta todas las tablas detectadas y deja CSV listos para importar en el módulo Órdenes de Servicio.
"""
import csv, subprocess, sys, pathlib, re

def run(cmd):
    return subprocess.check_output(cmd, text=True, errors='replace')

def main():
    if len(sys.argv) < 3:
        print('Uso: python access_to_csv.py GX_DATA.MDB carpeta_salida')
        sys.exit(1)
    mdb = pathlib.Path(sys.argv[1])
    out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
    tables = run(['mdb-tables','-1',str(mdb)]).splitlines()
    print(f'Tablas detectadas: {len(tables)}')
    for table in tables:
        if not table.strip(): continue
        safe = re.sub(r'[^A-Za-z0-9_-]+','_',table).strip('_') or 'tabla'
        data = run(['mdb-export','-D','%Y-%m-%d','-d',';',str(mdb),table])
        (out/f'{safe}.csv').write_text(data, encoding='utf-8')
        print('Exportada:', table, '->', out/f'{safe}.csv')
    print('\nImporte en Ticket Manager el CSV de Reparaciones/Ordenes usando el botón Importar SATMANAGER.')
if __name__ == '__main__': main()
