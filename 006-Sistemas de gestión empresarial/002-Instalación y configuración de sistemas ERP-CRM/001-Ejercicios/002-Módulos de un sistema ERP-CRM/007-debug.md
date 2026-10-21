# Depuración de PHP

Por defecto PHP no enseña los errores (`display_errors = Off`), y si algo falla solo se ve la página en blanco.

En mi PC (Ubuntu, PHP 8.3) hay dos `php.ini`:

- `/etc/php/8.3/apache2/php.ini` → el que usa Apache (`http://localhost/...`)
- `/etc/php/8.3/cli/php.ini` → el que usa la terminal y `php -S`

Para ver los errores en Apache:

    sudo nano /etc/php/8.3/apache2/php.ini
    display_errors = On
    sudo service apache2 restart

Logs de Apache:

- `/var/log/apache2/access.log` → qué peticiones llegan y con qué código (200, 404, 500…)
- `/var/log/apache2/error.log` → los errores de PHP

Con el servidor de pruebas (`php -S localhost:8000`) los errores salen directamente en la terminal donde lo arranco, sin tocar el `php.ini`.

PHP en Ubuntu no lleva SQLite incorporado:

    sudo apt install php-sqlite3

## Error real que encontré así

En `007-darkorange`, la ruta `entidades` daba error 500. En la terminal de `php -S` salía:

    PHP Warning:  SQLite3::query(): Unable to prepare statement: near "SHOW": syntax error
    PHP Fatal error:  Uncaught Error: Call to a member function fetchArray() on false

`SHOW TABLES` es de MySQL; en SQLite se usa `SELECT name FROM sqlite_master WHERE type='table'`. Corregido en `008-darkorange`.
