NOMBRE_FICHERO_ALEATORIO = "peliculas_aleatorio.txt"
TAMANO_REGISTRO = 15


def escribir_registros_tamano_fijo():
    titulos = ["Matrix", "Titanic", "Avatar", "Gladiator"]
    fichero = open(NOMBRE_FICHERO_ALEATORIO, "w", newline="")
    for titulo in titulos:
        linea = titulo.ljust(TAMANO_REGISTRO - 1) + "\n"
        fichero.write(linea)
    fichero.close()
    print("Registros de tamaño fijo guardados.")


def leer_registro_directo(numero_registro):
    fichero = open(NOMBRE_FICHERO_ALEATORIO, "r", newline="")
    posicion = numero_registro * TAMANO_REGISTRO
    fichero.seek(posicion)
    registro = fichero.readline()
    fichero.close()
    print("Registro", numero_registro, "(byte", str(posicion) + "):", registro.strip())


def modificar_registro_directo(numero_registro, titulo_nuevo):
    fichero = open(NOMBRE_FICHERO_ALEATORIO, "r+", newline="")
    posicion = numero_registro * TAMANO_REGISTRO
    fichero.seek(posicion)
    linea = titulo_nuevo.ljust(TAMANO_REGISTRO - 1) + "\n"
    fichero.write(linea)
    fichero.close()
    print("Registro", numero_registro, "cambiado por", titulo_nuevo)


def main():
    escribir_registros_tamano_fijo()

    print("\n--- Acceso directo al tercer registro ---")
    leer_registro_directo(2)

    print("\n--- Modificar el primer registro ---")
    modificar_registro_directo(0, "Interstellar")

    print("\n--- Comprobar los cuatro registros ---")
    for numero in range(4):
        leer_registro_directo(numero)


if __name__ == "__main__":
    main()