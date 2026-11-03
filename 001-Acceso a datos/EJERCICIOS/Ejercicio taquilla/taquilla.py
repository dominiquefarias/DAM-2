import mysql.connector

# ===== Paso 2: conexión =====
conexion = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="taquilla"
)
conexion.autocommit = True
cursor = conexion.cursor()


# ===== Paso 3: mostrar los datos =====
def ver_estado():
    cursor.execute("SELECT * FROM clientes")
    print("CLIENTES:", cursor.fetchall())
    cursor.execute("SELECT * FROM entradas")
    print("ENTRADAS:", cursor.fetchall())
    print()

ver_estado()


def comprar(cliente_id, evento, precio):
    try:
        conexion.start_transaction()

        cursor.execute("UPDATE clientes SET saldo = saldo - %s WHERE id = %s",
                       (precio, cliente_id))

        cursor.execute("SELECT saldo FROM clientes WHERE id = %s", (cliente_id,))
        saldo = cursor.fetchone()[0]
        if saldo < 0:
            raise Exception("saldo insuficiente")

        cursor.execute("INSERT INTO entradas (cliente_id, evento) VALUES (%s, %s)",
                       (cliente_id, evento))

        conexion.commit()
        print("Compra realizada")

    except Exception as error:
        conexion.rollback()
        print("Compra cancelada:", error)


comprar(1, "Concierto", 20)
ver_estado()

comprar(2, "Festival", 40)
ver_estado()


cursor.close()
conexion.close()