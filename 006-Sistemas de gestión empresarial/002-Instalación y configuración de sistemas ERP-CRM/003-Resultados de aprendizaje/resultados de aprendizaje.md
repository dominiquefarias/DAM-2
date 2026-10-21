# Resultado de aprendizaje 2

2. Implanta sistemas ERP-CRM interpretando la documentación técnica e identificando las diferentes opciones y módulos.

## Criterios de evaluación:

### a) Se han identificado los módulos que componen el ERP-CRM.

En `001-Ejercicios/002-Módulos de un sistema ERP-CRM/005-darkorange` separo los módulos del ERP (ventas, rrhh, facturación y compras), que devuelve `api/superapi.php?ruta=modulos` y se pintan en el menú `#modulos`, de las entidades o tablas, que van en el menú `#entidades`.

### b) Se han realizado diferentes tipos de instalaciones.

En `001-Ejercicios/001-Tipos de instalación/` la aplicación pasa de solo HTML y CSS (`001-darkorange`) a un cliente que pide los datos a una API PHP con `fetch` (`002` y `003-darkorange`). Después pasa a usar una base de datos SQLite con `data/schema.sql` y `data/demo.sql` (`002-Módulos/006-darkorange`).

En `003-Procesos de instalación/008-darkorange/api/instalar.php` el instalador crea las tablas a partir de un modelo de texto (`data/modelodedatos.txt`).

### c) Se han configurado los módulos instalados.

En `001-Ejercicios/004-Parámetros de configuración del sistema ERP-CRM/` el nombre y el color de la empresa se guardan en `data/config.php` (`009-darkorange`) y `codigo.js` los aplica al cargar. En `012-darkorange` el color pasa a ser una variable CSS que se cambia con `setProperty`.

En el proyecto (`002-Proyecto/data/config.php`) he configurado Domasa con mi color `#9D50FF`.

### d) Se han realizado instalaciones adaptadas a las necesidades planteadas en diferentes supuestos.

El instalador de `003-Procesos de instalación/008-darkorange` crea la base de datos según el modelo de cada empresa. Lo probé con mi modelo (`data/modelodedatos.txt`: clientes, productos y empleados).

Para la empresa de ejemplo, un fabricante de aviones, `data/cargar_demo.php` (desde el `013-darkorange`) crea la base de datos con `schema.sql` y `demo.sql`. Lo hice así porque en mi PC no está el programa `sqlite3`.

### e) Se ha verificado el funcionamiento del ERP-CRM.

He probado cada versión con `php -S localhost:8000` y en el navegador. Así encontré que en mi `007-darkorange` la ruta `entidades` daba error 500 (`SHOW TABLES` no existe en SQLite) y lo corregí en el `008-darkorange`.

En el proyecto he comprobado que se ven las tablas, que el CRUD del `017` funciona y que los colores se aplican.

### f) Se han documentado las operaciones realizadas y las incidencias.

Las operaciones están en `001-Ejercicios/002-Módulos de un sistema ERP-CRM/007-debug.md` (ver los errores de PHP y los logs de Apache) y en `008-jocarsa-documentacion.md` (generar y verificar el informe).

Las incidencias están en `002-Proyecto/README.md`, apartado "Incidencias": `SHOW TABLES` en SQLite, el archivo `.db` vacío que crea `new SQLite3()`, la falta del programa `sqlite3` y el texto que no se leía en modo oscuro.
