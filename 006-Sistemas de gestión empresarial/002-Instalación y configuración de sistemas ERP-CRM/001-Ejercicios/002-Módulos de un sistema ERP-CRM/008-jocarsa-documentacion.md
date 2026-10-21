# jocarsa-documentacion

Programa del profesor que genera un informe en Markdown de una carpeta (árbol, código y contenido de las bases de datos) con un sello HMAC-SHA-256 para comprobar que no se ha modificado.

Código: https://github.com/jocarsa/generador

En mi PC lo compilo desde el código fuente en C (necesita la librería de SQLite para desarrollo):

    sudo apt install libsqlite3-dev
    gcc -O2 -o jocarsa-documentacion-local jocarsa-documentacion.c -lsqlite3

Generar el informe de una unidad (siempre la carpeta de la unidad entera, y el destino fuera de ella):

    ./jocarsa-documentacion-local "<carpeta de la unidad>" "<carpeta destino>"

Comprobar que el informe está íntegro:

    ./jocarsa-documentacion-local --verify "<informe>.md"

El informe no se edita después de generarlo: si cambia algo, se vuelve a generar.
