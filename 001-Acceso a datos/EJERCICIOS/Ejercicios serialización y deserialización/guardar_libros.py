import json

NOMBRE_FICHERO = "biblioteca.dat"


def crear_lista_libros():
    libros = [
        {"titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "anio": 1967, "paginas": 471},
        {"titulo": "1984", "autor": "George Orwell", "anio": 1949, "paginas": 328},
        {"titulo": "El Principito", "autor": "Antoine de Saint-Exupéry", "anio": 1943, "paginas": 96}
    ]
    return libros


def serializar_libros(libros):
    cadena = json.dumps(libros)
    print("\nTexto JSON:")
    print(cadena)
    print(type(cadena))
    return cadena


def guardar_en_fichero(cadena):
    fichero = open(NOMBRE_FICHERO, "w")
    fichero.write(cadena)
    fichero.close()
    print("\nGuardado en", NOMBRE_FICHERO)


def main():
    libros = crear_lista_libros()
    print("Lista de libros:")
    print(libros)
    print(type(libros))

    cadena = serializar_libros(libros)
    guardar_en_fichero(cadena)


if __name__ == "__main__":
    main()