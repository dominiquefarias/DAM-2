<?php
 switch($_GET['ruta']){
 		case "modulos":
    	echo '
      	["ventas","rrhh","facturacion","compras"]
      ';
      break;
 		case "entidades":
    	$db = new SQLite3('../data/darkorange.db');
			// SHOW TABLES es de MySQL: en SQLite las tablas se listan desde sqlite_master
			$result = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      $entidades = [];
      while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
      	$entidades[] = $fila['name'];
      }
      // codigo.js espera JSON, no HTML
      echo json_encode($entidades);
      $db->close();
      break;
    case "tabla":
    	// Ya no son datos escritos a mano: los leo de SQLite
    	$db = new SQLite3('../data/darkorange.db');
      $result = $db->query("SELECT * FROM clientes;");
      $registros = [];
      while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
      	$registros[] = $fila;
      }
      echo json_encode($registros);
      $db->close();
      break;
 }
?>