# Resultado de aprendizaje 3

3. Realiza operaciones de gestión, consulta y análisis de la información siguiendo las especificaciones de diseño y utilizando las herramientas proporcionadas por los sistemas ERP-CRM.

## Criterios de evaluación:

### a) Se han utilizado herramientas y lenguajes de consulta y manipulación de datos proporcionados por los sistemas ERP-CRM.

En clase trabajamos con SQL sobre SQLite desde PHP: creamos tablas, guardamos lo que llega de un formulario con INSERT y sacamos listados con SELECT. También usamos Python para consultar datos del sistema, como el tamaño de las carpetas o el uso de CPU y memoria.

En mi ERP la aplicación lee la estructura de cada tabla de la base de datos y con eso monta sola los formularios y los listados, así que funciona con cualquier tabla. Yo lo tengo con los datos de mi empresa, un fabricante de aviones con clientes, productos, empleados, proveedores y pedidos.

### b) Se han generado formularios.

En clase empezamos con los controles de formulario y las etiquetas, después hicimos plantillas que generan el formulario solas a partir de las columnas de una tabla, y al final lo guardamos en la base de datos con PHP.

En el ERP el formulario es un componente que sirve para cualquier tabla, y pone el tipo de campo adecuado: correo para el email, teléfono para el teléfono y número para los precios. Lo probé dando de alta un proveedor nuevo y vi que aparecía en la lista.

### c) Se han generado informes.

En clase hicimos informes a partir de una tabla: primero el modelo, luego con datos de clientes de prueba, y después le añadimos ordenar por columnas, filtros y una fila con los totales.

En el ERP está el módulo de reporting, que saca todas las tablas en un documento tamaño A4 que se puede imprimir o guardar en PDF, con filtros, orden y la suma y el promedio de las columnas con números. Yo cambié que no sume la columna del identificador, porque es la clave de cada registro y sumarla no tiene sentido.

### d) Se han exportado datos e informes.

En clase vimos varios formatos para sacar los datos y exportamos a CSV, primero escribiendo un archivo a mano y luego sacando los 50 clientes de una base de datos SQLite. En el ERP se añadió un botón para exportar a CSV cada tabla y cada parte del informe.

Yo añadí también la exportación a JSON con un botón al lado del de CSV. En el informe solo se exportan las filas que se ven con los filtros: lo probé filtrando los pedidos entregados y me salieron solo esos dos.

### e) Se han automatizado las extracciones de datos mediante procesos.

En clase preparamos un script en Python que mide el uso de CPU y de memoria y lo va guardando en un archivo, y una línea de cron para que se ejecute solo cada minuto. También hicimos el script que saca los clientes de la base de datos a un CSV.

Yo tuve que cambiar las rutas, porque apuntaban a carpetas del ordenador del profesor y en el mío fallaban; ahora cada script guarda el archivo en su propia carpeta. También añadí al archivo de los 50 clientes la creación de la tabla, porque solo traía los datos y sin la tabla no se podía crear la base de datos.

### f) Se ha verificado el rendimiento del sistema ERP-CRM.

En clase vimos las herramientas del sistema para ver cómo va el ordenador y luego lo hicimos con Python: el árbol de carpetas con lo que ocupa cada una, y el uso de CPU y de memoria guardado con la fecha y la hora.

Lo ejecuté en mi ordenador y se fueron guardando mediciones reales en el archivo de registros. Para dibujarlas hay otro script que hace una gráfica de CPU y otra de memoria, que yo puse en mis colores morados.

### g) Se han documentado las operaciones realizadas y las incidencias observadas.

Las operaciones las fui apuntando en los ejercicios y en el proyecto, donde explico cómo se arranca la aplicación, qué se hizo en clase y qué he añadido yo.

Las incidencias también están explicadas en el proyecto. Por ejemplo, si pulsabas una tabla justo al abrir la página, el dashboard se pintaba encima al terminar de cargar; lo arreglé para que solo se pinte si todavía no has abierto otra cosa. Además, los scripts fallaban por las rutas del ordenador del profesor y me faltaba una librería de Python para hacer las gráficas.

### h) Se ha obtenido información relevante a partir de los datos procesados.

En clase hicimos un dashboard con indicadores y cuatro gráficas. Unas son de ejemplo y otras salen de los datos reales, como los registros que hay en cada tabla o los pedidos según su estado, y además cada tabla tiene su propia gráfica.

Yo añadí un tipo de gráfica más, la de líneas, que la uso para la evolución comercial porque se ve mejor cómo sube o baja. También cambié los colores de todas las gráficas a mi paleta morada.
