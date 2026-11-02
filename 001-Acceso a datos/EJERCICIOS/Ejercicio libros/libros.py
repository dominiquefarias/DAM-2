import mysql.connector

libros = [
    {"titulo": "Don Quijote", "paginas": 863,
     "generos": ["novela", "aventuras", "humor"]},
    {"titulo": "Platero y yo", "paginas": 144,
     "generos": ["poesía", "infantil"]},
    {"titulo": "Marianela", "paginas": 256,
     "generos": ["novela"]}
]

print("--- Tipos de datos ---")
muestra = libros[0]
for clave in muestra.keys():
    print(clave, type(muestra[clave]))
conn = mysql.connector.connect(
    host="localhost",
    user="desfase",
    password="desfase",
    database="desfase"
)
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS libros_generos")
cursor.execute("DROP TABLE IF EXISTS libros")

cursor.execute("""
    CREATE TABLE libros (
        Identificador INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255),
        paginas INT
    )
""")

cursor.execute("""
    CREATE TABLE libros_generos (
        Identificador INT AUTO_INCREMENT PRIMARY KEY,
        libros_id INT,
        valor VARCHAR(255),
        FOREIGN KEY (libros_id) REFERENCES libros(Identificador)
    )
""")

for libro in libros:
    cursor.execute(
        "INSERT INTO libros (titulo, paginas) VALUES (%s, %s)",
        (libro["titulo"], libro["paginas"])
    )
    id_libro = cursor.lastrowid

    for genero in libro["generos"]:
        cursor.execute(
            "INSERT INTO libros_generos (libros_id, valor) VALUES (%s, %s)",
            (id_libro, genero)
        )

conn.commit()
print("\nDatos guardados en MySQL.")


recuperados = []

cursor.execute("SELECT Identificador, titulo, paginas FROM libros ORDER BY Identificador")
filas_libros = cursor.fetchall()

for fila in filas_libros:
    id_libro = fila[0]
    titulo = fila[1]
    paginas = fila[2]

    cursor.execute(
        "SELECT valor FROM libros_generos WHERE libros_id = %s ORDER BY Identificador",
        (id_libro,)
    )
    filas_generos = cursor.fetchall()

    generos = []
    for g in filas_generos:
        generos.append(g[0])

    ficha = {"titulo": titulo, "paginas": paginas, "generos": generos}
    recuperados.append(ficha)

print("\n--- Libros recuperados ---")
print(recuperados)
print("¿Es igual que la lista original?", recuperados == libros)

cursor.execute("""
    SELECT libros.titulo
    FROM libros
    JOIN libros_generos ON libros.Identificador = libros_generos.libros_id
    WHERE libros_generos.valor = %s
""", ("novela",))

print("\n--- Libros del género novela ---")
for fila in cursor.fetchall():
    print("-", fila[0])

cursor.close()
conn.close()