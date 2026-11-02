NOMBRE_FICHERO_SECUENCIAL = "peliculas_secuencial.txt"


def escribir_varias_peliculas():
    peliculas = ["Matrix,148\n", "Titanic,195\n", "Avatar,162\n"]
    fichero = open(NOMBRE_FICHERO_SECUENCIAL, "w")
    fichero.writelines(peliculas)
    fichero.close()
    print("Tres películas guardadas con writelines().")


def anadir_una_pelicula():
    fichero = open(NOMBRE_FICHERO_SECUENCIAL, "a")
    fichero.write("Gladiator,155\n")
    fichero.close()
    print("Película añadida al final con write().")


def leer_todo_de_golpe():
    fichero = open(NOMBRE_FICHERO_SECUENCIAL, "r")
    contenido = fichero.read()
    fichero.close()
    print("\n--- Leer todo de golpe ---")
    print(contenido)


def leer_linea_a_linea():
    fichero = open(NOMBRE_FICHERO_SECUENCIAL, "r")
    print("--- Leer línea a línea ---")
    linea = fichero.readline()
    while linea != "":
        print(linea.strip())
        linea = fichero.readline()
    fichero.close()


def main():
    escribir_varias_peliculas()
    anadir_una_pelicula()
    leer_todo_de_golpe()
    leer_linea_a_linea()


if __name__ == "__main__":
    main()