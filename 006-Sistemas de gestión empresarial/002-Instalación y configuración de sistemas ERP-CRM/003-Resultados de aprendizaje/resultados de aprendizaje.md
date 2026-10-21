# Resultado de aprendizaje 2

2. Implanta sistemas ERP-CRM interpretando la documentación técnica e identificando las diferentes opciones y módulos.

## Criterios de evaluación:

### a) Se han identificado los módulos que componen el ERP-CRM.

En clase hicimos la aplicación con dos menús: uno con los módulos del ERP, que eran ventas, recursos humanos, facturación y compras, y otro con las entidades, que son las tablas como clientes, productos o empleados. Los dos menús se cargan pidiéndoselos al servidor.

Yo lo hice igual, pero le puse el nombre de mi empresa, Domasa, y cambié el estilo de los menús: los botones blancos con las esquinas redondeadas y un pequeño efecto al pasar el ratón por encima.

### b) Se han realizado diferentes tipos de instalaciones.

En clase fuimos montando la aplicación de varias formas: primero solo con HTML y CSS, luego el navegador pedía los datos a un servidor en PHP y al final los datos salían de una base de datos SQLite. También hicimos un instalador al que le escribes el modelo de datos y crea las tablas.

Yo fui haciendo cada paso con mi versión, y en el modelo del instalador puse mis propias tablas: clientes, productos y empleados, cada una con sus columnas, como el país, el teléfono o el salario.

### c) Se han configurado los módulos instalados.

En clase guardamos el nombre y el color de la empresa en un archivo de configuración, para no tenerlos metidos en el código, y después pasamos los colores a variables de CSS para cambiarlos desde un solo sitio.

Yo cambié el nombre por Domasa y, en el proyecto, el naranja de clase por mi color morado. También añadí un lila más suave que se ve en la fila de la tabla cuando pasas el ratón.

### d) Se han realizado instalaciones adaptadas a las necesidades planteadas en diferentes supuestos.

En clase el instalador creaba las tablas según el modelo que le escribes, así cada empresa puede tener las suyas. Yo lo probé con mi modelo de clientes, productos y empleados.

Para la empresa de ejemplo, que es un fabricante de aviones, el profesor tenía la base de datos ya creada en su ordenador. Yo no tenía instalado el programa de SQLite que usaba él, así que cambié la forma de crearla y lo hice con un pequeño script en PHP.

### e) Se ha verificado el funcionamiento del ERP-CRM.

En clase probábamos cada versión abriéndola en el navegador con el servidor de PHP. Al probar la mía vi que el menú de tablas daba error porque usaba una consulta de MySQL que en SQLite no existe, y la cambié por la consulta correcta para SQLite.

En el proyecto comprobé que se ven todas las tablas y que se pueden crear, editar y borrar registros. También vi que con el ordenador en modo oscuro la tabla no se leía, y lo arreglé poniéndole a la página un fondo blanco.

### f) Se han documentado las operaciones realizadas y las incidencias.

En clase apuntamos cómo ver los errores de PHP, dónde están los registros de Apache y cómo generar el informe con el programa del profesor. Yo lo adapté a mi ordenador, por ejemplo compilando ese programa en vez de descargarlo.

Las incidencias que me encontré las dejé explicadas en el proyecto: la consulta de MySQL que fallaba en SQLite, que SQLite crea un archivo vacío cuando no encuentra la base de datos, que no tenía el programa de SQLite y que con el modo oscuro la tabla no se leía.
