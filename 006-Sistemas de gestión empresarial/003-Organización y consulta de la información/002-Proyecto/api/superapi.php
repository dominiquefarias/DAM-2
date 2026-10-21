<?php
    // API del ERP: todas las respuestas son JSON
    header('Content-Type: application/json; charset=utf-8');
    $db = new SQLite3('../data/darkorange.db');
    $db->enableExceptions(true);   // los errores de SQLite pasan a ser excepciones

    // Lista de tablas reales de la base de datos
    function tablasPermitidas($db) {
        $resultado = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        $tablas = [];
        while ($fila = $resultado->fetchArray(SQLITE3_ASSOC)) {
            $tablas[] = $fila['name'];
        }
        return $tablas;
    }

    // Pongo comillas dobles a un nombre de tabla o columna para usarlo en SQL
    function comillas($nombre) {
        return '"' . str_replace('"', '""', $nombre) . '"';
    }

    // Solo dejo trabajar con tablas que existen (evita inyección SQL en el nombre)
    function validarTabla($db, $tabla) {
        if (!in_array($tabla, tablasPermitidas($db), true)) {
            throw new Exception('Tabla no válida');
        }
        return comillas($tabla);
    }

    // Columnas de la tabla y cuál es la clave primaria (en mis tablas, "identificador")
    function estructura($db, $tabla) {
        $segura = validarTabla($db, $tabla);
        $resultado = $db->query("PRAGMA table_info($segura)");
        $columnas = [];
        $clave = null;
        while ($fila = $resultado->fetchArray(SQLITE3_ASSOC)) {
            $columnas[] = $fila;
            if ($fila['pk']) {
                $clave = $fila['name'];
            }
        }
        if (!$clave) {
            throw new Exception('La tabla no tiene clave primaria');
        }
        return [$columnas, $clave];
    }

    // Me quedo solo con los campos que existen y no son la clave primaria
    function filtrarDatos($columnas, $datos) {
        $permitidas = [];
        foreach ($columnas as $columna) {
            if (!$columna['pk']) {
                $permitidas[] = $columna['name'];
            }
        }
        return array_intersect_key($datos, array_flip($permitidas));
    }

    // Los datos de crear/actualizar/eliminar llegan en el cuerpo de la petición como JSON
    function entrada() {
        return json_decode(file_get_contents('php://input'), true) ?: [];
    }

    try {
        $ruta = $_GET['ruta'] ?? '';
        switch ($ruta) {
            case 'modulos':
                echo json_encode(['ventas', 'rrhh', 'facturacion', 'compras']);
                break;

            case 'entidades':
                echo json_encode(tablasPermitidas($db), JSON_UNESCAPED_UNICODE);
                break;

            case 'estructura':
                [$columnas, $clave] = estructura($db, $_GET['tabla'] ?? '');
                echo json_encode(['columnas' => $columnas, 'clavePrimaria' => $clave], JSON_UNESCAPED_UNICODE);
                break;

            case 'tabla':
                $tabla = $_GET['tabla'] ?? '';
                $segura = validarTabla($db, $tabla);
                [$columnas, $clave] = estructura($db, $tabla);
                $resultado = $db->query("SELECT * FROM $segura ORDER BY " . comillas($clave) . " DESC");
                $registros = [];
                while ($fila = $resultado->fetchArray(SQLITE3_ASSOC)) {
                    $registros[] = $fila;
                }
                echo json_encode(['tabla' => $tabla, 'columnas' => $columnas, 'clavePrimaria' => $clave, 'registros' => $registros], JSON_UNESCAPED_UNICODE);
                break;

            case 'crear':
                $e = entrada();
                $tabla = $e['tabla'] ?? '';
                $segura = validarTabla($db, $tabla);
                [$columnas, $clave] = estructura($db, $tabla);
                $datos = filtrarDatos($columnas, $e['datos'] ?? []);
                if (!$datos) {
                    throw new Exception('No hay datos para insertar');
                }
                $campos = implode(', ', array_map('comillas', array_keys($datos)));
                $huecos = implode(', ', array_fill(0, count($datos), '?'));
                // Consulta preparada: los valores nunca se pegan dentro del SQL
                $consulta = $db->prepare("INSERT INTO $segura ($campos) VALUES ($huecos)");
                $i = 1;
                foreach ($datos as $valor) {
                    $consulta->bindValue($i++, $valor, SQLITE3_TEXT);
                }
                $consulta->execute();
                echo json_encode(['ok' => true, 'id' => $db->lastInsertRowID()]);
                break;

            case 'actualizar':
                $e = entrada();
                $tabla = $e['tabla'] ?? '';
                $segura = validarTabla($db, $tabla);
                [$columnas, $clave] = estructura($db, $tabla);
                $datos = filtrarDatos($columnas, $e['datos'] ?? []);
                if (!$datos) {
                    throw new Exception('No hay datos para actualizar');
                }
                $asignaciones = implode(', ', array_map(function ($campo) { return comillas($campo) . ' = ?'; }, array_keys($datos)));
                $consulta = $db->prepare("UPDATE $segura SET $asignaciones WHERE " . comillas($clave) . " = ?");
                $i = 1;
                foreach ($datos as $valor) {
                    $consulta->bindValue($i++, $valor, SQLITE3_TEXT);
                }
                $consulta->bindValue($i, $e['id'] ?? null);
                $consulta->execute();
                echo json_encode(['ok' => true]);
                break;

            case 'eliminar':
                $e = entrada();
                $tabla = $e['tabla'] ?? '';
                $segura = validarTabla($db, $tabla);
                [, $clave] = estructura($db, $tabla);
                $consulta = $db->prepare("DELETE FROM $segura WHERE " . comillas($clave) . " = ?");
                $consulta->bindValue(1, $e['id'] ?? null);
                $consulta->execute();
                echo json_encode(['ok' => true]);
                break;

            default:
                throw new Exception('Ruta no válida');
        }
    } catch (Throwable $error) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => $error->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    $db->close();
?>
