<?php
    // Servicio de salida: devuelve TODA la base de datos en JSON
    // { "tabla": [ {registro}, {registro} ], ... }
    $db = new SQLite3('../data/darkorange.db');

    $tablas = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");

    $basededatos = [];
    while ($fila = $tablas->fetchArray(SQLITE3_ASSOC)) {
        $tabla = $fila['name'];
        // Entrecomillo el nombre por si tiene caracteres raros
        $resultado = $db->query('SELECT * FROM "' . str_replace('"', '""', $tabla) . '"');
        $registros = [];
        while ($registro = $resultado->fetchArray(SQLITE3_ASSOC)) {
            $registros[] = $registro;
        }
        $basededatos[$tabla] = $registros;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($basededatos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $db->close();
?>
