# Domasa (unidad 2)

ERP de una empresa ficticia que fabrica aviones. Es mi ejercicio `017-darkorange` de clase con los colores de Domasa.

## Cómo se arranca

```bash
php -S localhost:8000
```

Y abrir `http://localhost:8000`. La base de datos de ejemplo ya está en `data/darkorange.db`. Para volver a crearla desde `schema.sql` y `demo.sql`:

```bash
php data/cargar_demo.php
```

## Decisiones (planteamiento 018)

- **Cliente y servidor separados con `fetch`, como en clase:** es la arquitectura que elegí en la unidad 1. El cliente es HTML, CSS y JS en el navegador, y el servidor es PHP.
- **PHP y SQLite, como en clase:** en mis apuntes de la unidad 1, SQLite es para prototipar. Más adelante se podría pasar a MySQL.
- **Nombre y color en `data/config.php`, como en el 009:** cambiar de empresa o de color no obliga a tocar el código.
- **Mis colores:** morado `#9D50FF`, lila `#E6E0F8` y texto `#2D2345`, en variables CSS como en el 012.

## Qué he añadido a la versión de clase

- Colores morados de Domasa.
- La fila de la tabla se pone lila al pasar el ratón.

## Incidencias

- En mi `007-darkorange` la ruta `entidades` daba error 500: `SHOW TABLES` es de MySQL y en SQLite no existe. Se cambió por `SELECT name FROM sqlite_master WHERE type='table'`.
- `new SQLite3()` crea un archivo `.db` vacío si no existe, y el error parece otro.
- No tengo el programa `sqlite3` instalado, así que la base de datos se crea con `data/cargar_demo.php`.
- Con el ordenador en modo oscuro el texto de la tabla no se leía porque la página no tenía fondo. Lo arreglé poniendo el fondo y el color del texto en el CSS.

## Uso de IA

Los ejercicios hasta el `007-darkorange` los hice en clase. Los de las clases que perdí (`008` al `017`) y los cambios de este proyecto se hicieron con IA (Claude), partiendo de mi código y de los ejercicios del profesor. Cada paso está en un commit separado.
