import sys
import os
import re
import pyodbc
import pandas as pd


def safe_name(name):
    name = re.sub(r'[\\/*?:\[\]]', '_', name)
    return name[:31]


def main():
    if len(sys.argv) < 3:
        print("Uso:")
        print(r'py tools\mdb_to_csv.py "C:\SatManager\db\GX_DATA.MDB" export_satmanager')
        sys.exit(1)

    mdb_path = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.exists(mdb_path):
        print(f"No existe el archivo MDB: {mdb_path}")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    conn_str = (
        r"DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};"
        rf"DBQ={mdb_path};"
    )

    try:
        conn = pyodbc.connect(conn_str)
    except Exception as e:
        print("No se pudo conectar al MDB.")
        print("Verifique tener instalado Microsoft Access Database Engine.")
        print(e)
        sys.exit(1)

    cursor = conn.cursor()

    tables = []
    for row in cursor.tables(tableType="TABLE"):
        table_name = row.table_name
        if not table_name.startswith("MSys"):
            tables.append(table_name)

    print(f"Tablas encontradas: {len(tables)}")

    excel_path = os.path.join(output_dir, "SATMANAGER_EXPORT.xlsx")

    with pd.ExcelWriter(excel_path, engine="openpyxl") as writer:
        for table in tables:
            print(f"Exportando: {table}")

            query = f"SELECT * FROM [{table}]"
            df = pd.read_sql(query, conn)

            csv_path = os.path.join(output_dir, f"{table}.csv")
            df.to_csv(csv_path, index=False, encoding="utf-8-sig", sep=";")

            sheet_name = safe_name(table)
            df.to_excel(writer, sheet_name=sheet_name, index=False)

    conn.close()

    print("")
    print("Exportación finalizada correctamente.")
    print(f"Carpeta generada: {output_dir}")
    print(f"Excel generado: {excel_path}")


if __name__ == "__main__":
    main()