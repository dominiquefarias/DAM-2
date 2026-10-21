<?php
    // Servicio de salida: otros programas pueden preguntar qué tablas tiene el ERP
    $db = new SQLite3('../data/darkorange.db');
    $result = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    $entidades = [];
    while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
        $entidades[] = $fila['name'];
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($entidades);
    $db->close();
?>
