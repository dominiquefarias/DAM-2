import json

NOMBRE_FICHERO = "biblioteca.dat"


def leer_fichero():
    fichero = open(NOMBRE_FICHERO, "r")
    lineas = fichero.readlines()
    linea = lineas[0]
    fichero.close()
    return linea


def deserializar_libros(linea):
    libros = json.loads(linea)
    return libros


def main():
    texto = leer_fichero()
    print("Texto leído del fichero:")
    print(texto)
    print(type(texto))

    libros = deserializar_libros(texto)
    print("\nLista reconstruida:")
    print(libros)
    print(type(libros))


if __name__ == "__main__":
    main()