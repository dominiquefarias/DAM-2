NOMBRE_FICHERO_TEMPERATURAS = "temperaturas.txt"
NOMBRE_FICHERO_CONTADOR = "contador.bin"


def escribir_temperaturas():
    fichero = open(NOMBRE_FICHERO_TEMPERATURAS, "w")
    fichero.write("18.5\n")
    fichero.write("21.0\n")
    fichero.write("19.2\n")
    fichero.close()
    print("Temperaturas guardadas en", NOMBRE_FICHERO_TEMPERATURAS)


def leer_temperaturas():
    fichero = open(NOMBRE_FICHERO_TEMPERATURAS, "r")
    contenido = fichero.read()
    fichero.close()
    print("\n--- Contenido completo ---")
    print(contenido)


def saltar_primera_temperatura():
    fichero = open(NOMBRE_FICHERO_TEMPERATURAS, "r")

    primera = fichero.readline()          
    print("--- Saltar la primera temperatura ---")
    print("Primera temperatura (saltada):", primera.strip())

    posicion = fichero.tell()          
    print("Posición del puntero:", posicion)

    fichero.seek(0)                       
    print("Puntero vuelto al principio:", fichero.tell())

    fichero.seek(posicion)               
    print("Puntero de nuevo en:", fichero.tell())

    resto = fichero.read()               
    fichero.close()
    print("Resto del fichero:")
    print(resto)


def comprobar_fichero_configuracion():
    print("--- Comprobar configuración ---")
    try:
        fichero = open("configuracion.txt", "r")
        print(fichero.read())
        fichero.close()
    except FileNotFoundError:
        print("Aviso: el fichero configuracion.txt no existe.")


def guardar_numero_registros():
    print("\n--- Fichero binario ---")
    datos = bytes([3])                    

    fichero = open(NOMBRE_FICHERO_CONTADOR, "wb")
    fichero.write(datos)
    fichero.close()

    fichero = open(NOMBRE_FICHERO_CONTADOR, "rb")
    leido = fichero.read()
    fichero.close()

    print("Bytes leídos:", leido)
    print("Número de registros:", leido[0])


def main():
    escribir_temperaturas()
    leer_temperaturas()
    saltar_primera_temperatura()
    comprobar_fichero_configuracion()
    guardar_numero_registros()


if __name__ == "__main__":
    main()