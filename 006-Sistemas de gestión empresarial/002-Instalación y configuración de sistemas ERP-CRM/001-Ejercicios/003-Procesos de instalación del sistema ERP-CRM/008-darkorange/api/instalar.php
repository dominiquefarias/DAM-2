<?php
    // Instalador: recibe el modelo de datos en texto y crea las tablas en SQLite
    // Formato del modelo:
    //   nombre_de_tabla
    //   -columna
    //   -columna
    echo "Hola que tal soy tu instalador";
    echo "<br>";

    $db = new SQLite3('../data/darkorange.db');

    $lineas = explode("\n", $_POST['modelo']);

    $tabla = "";
    $columnas = [];

    // Crea la tabla que tengo acumulada (si hay alguna)
    function crearTabla($db, $tabla, $columnas) {
        if ($tabla == "") {
            return;
        }
        $sql = "CREATE TABLE IF NOT EXISTS " . $tabla . " (";
        $sql .= "id INTEGER PRIMARY KEY AUTOINCREMENT";
        if (count($columnas) > 0) {
            $sql .= ", " . implode(" TEXT, ", $columnas) . " TEXT";
        }
        $sql .= ");";
        echo "<pre>" . $sql . "</pre>";
        $db->exec($sql);
    }

    foreach ($lineas as $linea) {
        $linea = trim($linea);
        if ($linea == "") {
            continue;
        }
        if ($linea[0] == "-") {
            // Es una columna de la tabla actual
            $columnas[] = trim(substr($linea, 1));
        } else {
            // Empieza una tabla nueva: antes creo la anterior
            crearTabla($db, $tabla, $columnas);
            $tabla = $linea;
            $columnas = [];
        }
    }
    // La última tabla no tiene otra detrás que la cree
    crearTabla($db, $tabla, $columnas);

    $db->close();

    echo "Base de datos creada correctamente en data/darkorange.db";
?>
