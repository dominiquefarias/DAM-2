# Domasa (unidad 3)

ERP de una empresa ficticia que fabrica aviones. Es mi proyecto de la unidad 2 con lo que hicimos en clase en esta unidad y mis colores morados.

## Cómo se arranca

```bash
php -S localhost:8000
```

Y abrir `http://localhost:8000`. La base de datos de ejemplo ya está en `data/darkorange.db`. Para volver a crearla:

```bash
php data/cargar_demo.php
```

## Lo que hicimos en clase y está en el proyecto

- Formulario para crear registros y tabla para leerlos, como componentes separados (`nucleo/formulario.js` y `nucleo/tabla.js`).
- Reporting: un informe de todas las tablas en formato A4 que se puede imprimir, con filtros, orden por columna, suma y promedio.
- Gráficas en SVG (barras, anillo y tarta) y un dashboard.
- Exportar a CSV desde las tablas y desde el reporting.

## Lo que he añadido yo

- **Colores:** las gráficas y el aviso del dashboard en mi paleta morada (`#9D50FF`, `#E6E0F8`, `#2D2345`).
- **Una gráfica más:** líneas, usada en la evolución comercial del dashboard.
- **Un formato más para exportar:** JSON, con un botón al lado del de CSV. En el reporting solo exporta las filas que se ven con los filtros.

## Incidencias

- Si pulsabas una tabla justo al abrir la página, cuando terminaba de cargar el dashboard se pintaba encima y la tabla desaparecía. Ahora el dashboard solo se pinta si todavía se está mostrando "Cargando dashboard…".
- El reporting sumaba también la columna `identificador`, que es la clave y no tiene sentido sumarla. Ahora se salta.
- Las de la unidad 2 siguen resueltas: la consulta de MySQL en SQLite, el archivo `.db` vacío que crea `new SQLite3()`, la falta del programa `sqlite3` y la tabla ilegible en modo oscuro.

## Uso de IA

Me perdí las clases de esta unidad. Los ejercicios del `018` al `022` se hicieron con IA (Claude): a mi código de la unidad 2 se le añadieron los componentes que hizo el profesor en clase. Los cambios del proyecto (colores, la gráfica de líneas, la exportación a JSON y las dos correcciones) también se hicieron con IA. Cada paso está en un commit separado.
