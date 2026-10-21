<?php
    // Adaptación para mi PC: el profesor tenía darkorange.db ya generado en su equipo.
    // Este script lo vuelve a crear desde schema.sql y demo.sql, sin necesitar el
    // programa sqlite3. Se ejecuta desde la terminal:
    //     php data/cargar_demo.php
    if (php_sapi_name() != "cli") {
        exit("Este script solo se ejecuta desde la terminal\n");
    }
    $carpeta = __DIR__;
    $ruta = $carpeta . "/darkorange.db";
    if (file_exists($ruta)) {
        unlink($ruta);   // empiezo de cero para no mezclar con tablas del instalador
    }
    $db = new SQLite3($ruta);
    $db->enableExceptions(true);
    $db->exec(file_get_contents($carpeta . "/schema.sql"));
    $db->exec(file_get_contents($carpeta . "/demo.sql"));
    $tablas = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    while ($fila = $tablas->fetchArray(SQLITE3_ASSOC)) {
        echo $fila['name'] . ": " . $db->querySingle("SELECT COUNT(*) FROM " . $fila['name']) . " registros\n";
    }
    $db->close();
?>
