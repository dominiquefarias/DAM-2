# Resultado de aprendizaje 2

2. Implanta sistemas ERP-CRM interpretando la documentación técnica e identificando las diferentes opciones y módulos.

## Criterios de evaluación:

### a) Se han identificado los módulos que componen el ERP-CRM.

En clase vimos que un ERP se divide en módulos, y en mi aplicación los separé de las tablas: por un lado están los módulos de ventas, recursos humanos, facturación y compras, y por otro las entidades, como clientes, productos o empleados.

Los módulos salen en un menú y las tablas en otro, y los dos se cargan pidiéndoselos al servidor. Esto me ayudó a entender que un módulo agrupa una parte de la empresa y que no es lo mismo que una tabla de la base de datos.

### b) Se han realizado diferentes tipos de instalaciones.

La aplicación la fui montando de varias formas. Primero era solo una página con HTML y CSS, después el navegador pedía los datos a un servidor en PHP, y al final los datos salían de una base de datos SQLite creada con un esquema y unos datos de ejemplo.

También hice un instalador al que le escribes el modelo de datos, es decir, el nombre de cada tabla y sus columnas, y él se encarga de crear las tablas solo.

### c) Se han configurado los módulos instalados.

Configuré la aplicación para que el nombre de la empresa y el color corporativo estén guardados aparte y no metidos dentro del código. Al abrir la página se leen esos datos y se aplican.

Con las variables de CSS basta con cambiar el color en un solo sitio para que cambie en toda la aplicación. En mi proyecto la dejé configurada como Domasa, con mi color morado.

### d) Se han realizado instalaciones adaptadas a las necesidades planteadas en diferentes supuestos.

El instalador sirve para adaptar la aplicación a cada empresa, porque cada una puede escribir su propio modelo de datos. Yo lo probé con el mío, con clientes, productos y empleados.

Para la empresa de ejemplo, que es un fabricante de aviones, preparé un script que crea la base de datos con sus datos, porque en mi ordenador no tenía instalado el programa de SQLite que usaba el profesor.

### e) Se ha verificado el funcionamiento del ERP-CRM.

Cada versión la probé arrancando el servidor de PHP y abriéndola en el navegador. Así vi que en una de mis versiones el menú de tablas daba error, porque usaba una consulta de MySQL que en SQLite no existe, y lo arreglé en la versión siguiente.

En el proyecto comprobé que se ven todas las tablas, que se pueden crear, editar y borrar registros y que los colores se aplican bien.

### f) Se han documentado las operaciones realizadas y las incidencias.

Fui apuntando cómo ver los errores de PHP, dónde están los registros de Apache y cómo generar y comprobar el informe de entrega.

Las incidencias que me encontré las dejé explicadas en el proyecto: la consulta de MySQL que fallaba en SQLite, que SQLite crea un archivo vacío cuando no encuentra la base de datos, que no tenía instalado el programa de SQLite y que con el modo oscuro la tabla no se leía.
