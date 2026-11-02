import csv
import json

# Paso 1 y 2: leer el CSV y convertir cada fila en diccionario
contactos = []
archivo_csv = open("datos.csv", "r", encoding="utf-8")
lector = csv.reader(archivo_csv)
siguiente = False
for fila in lector:
    if not siguiente:          # saltamos la cabecera
        siguiente = True
        continue
    contacto = {
        "nombre": fila[0],
        "apellidos": fila[1],
        "telefono": fila[2]
    }
    contactos.append(contacto)  # Paso 3: guardar en la lista
archivo_csv.close()

# Paso 4: guardar la lista en JSON
archivo_json = open("contactos.json", "w", encoding="utf-8")
json.dump(contactos, archivo_json, indent=4)
archivo_json.close()

# Paso 5: escribir el log (¡con \n al final de cada línea!)
archivo_log = open("log.txt", "w", encoding="utf-8")
for c in contactos:
    archivo_log.write("Contacto añadido: " + c["nombre"] + " " + c["apellidos"] + "\n")
archivo_log.close()
