# Memoria · UD2 Generación de interfaces naturales de usuario

Desarrollo de interfaces · 2º DAM · Dominique Farías

## Estructura de la entrega

```
003-Proyecto/
├── index.html                  ← interfaz integrada (UD1) + voz y dictado
├── js/
│   ├── componentes.js          ← aplicación de la UD1 (añadida la vista «Dictado»)
│   └── voz.js                  ← NUEVO: VozIU, DictadoIU y TemaIU
├── css/estilo.css              ← estados del micrófono, dictado y tema oscuro
├── data/entidades.json         ← nueva entrada «Dictado»
├── MEMORIA-UD2.md              ← este documento
└── ejercicios_interfaces_naturales/
    ├── index.html              ← portada de los ejercicios
    ├── css/ejercicios.css
    ├── js/comun.js             ← cámara e indicador de estado compartidos
    ├── 01-gestos/              ← Pointer Events + MediaPipe Gesture Recognizer
    ├── 02-detector-facial/     ← MediaPipe Face Landmarker
    └── 03-realidad-aumentada/  ← A-Frame + WebXR
```

## Cómo probarlo

1. En la carpeta `003-Proyecto`: `python3 -m http.server 8000`
2. Abrir `http://localhost:8000/` en **Chrome o Edge** (Firefox no tiene reconocimiento de voz).
3. Dar permiso de micrófono y de cámara cuando el navegador lo pida.

Hace falta internet: el reconocimiento de voz de Chrome se hace en los servidores de Google, y las librerías y los modelos se descargan de CDN. La cámara y el micrófono solo funcionan en `localhost` o HTTPS.

## Proyecto principal: voz y dictado

- **Botón de micrófono** en la cabecera. Su estado se ve por color y por texto: *Voz inactiva* (gris), *Escuchando…* (rosa, con punto rojo que late), *Procesando…* (lavanda, con indicador que gira), *Dictando…* y *Voz no disponible* si el navegador no tiene la API.
- **Comandos** (`VozIU`): `webkitSpeechRecognition` en modo continuo y en español (`es-ES`). Cada frase final se normaliza (minúsculas, sin tildes) y se compara con una lista de expresiones regulares. Abajo a la izquierda se muestra lo que se ha entendido y qué se ha hecho.

  | Di… | Acción |
  |---|---|
  | «clientes», «ir a toasts», «abrir formulario» | pulsa esa opción de los menús |
  | «buscar Laura» / «limpiar búsqueda» | escribe en el buscador y filtra la tabla |
  | «nuevo cliente» / «cerrar» | abre o cierra el panel lateral y la modal |
  | «modo oscuro» / «modo claro» / «cambiar tema» | cambia el tema (se recuerda) |
  | «contraer menú» / «expandir menú» | minimiza la columna de navegación |
  | «empezar dictado» | abre la vista de dictado y empieza a escuchar |
  | «ayuda» | ventana modal con todos los comandos |
  | «dejar de escuchar» / «cerrar sesión» | apaga la voz / vuelve al login |

- **Capas flotantes**: el panel lateral y la modal quedaban tapados por el escenario (`z-index:1000`), así que se han subido por encima para que «nuevo cliente» y «ayuda» se vean.
- **Dictado** (`DictadoIU`): vista nueva en la columna central. El texto provisional se ve en gris mientras se habla y el definitivo se añade al área de texto. Las palabras «punto», «coma», «dos puntos», «nueva línea» y «punto y aparte» se convierten en signos, y la frase empieza con mayúscula. «Terminar dictado» lo para. Además puede **leer el texto en voz alta** (`speechSynthesis`) y copiarlo.

## Ejercicios independientes

- **01 · Gestos**. Un carrusel que responde a dos tipos de gestos:
  - *Táctiles o de ratón* con Pointer Events: deslizar (cambiar), doble toque (me gusta), pulsación larga (detalle) y pinza con dos dedos (zoom). También responde a las teclas ← → y Enter.
  - *De la mano ante la cámara* con el modelo Gesture Recognizer: 👍 me gusta, 👎 quitarlo, ✌️ siguiente, ☝️ anterior, ✊ acercar y ✋ restablecer. El gesto debe mantenerse 500 ms y hay 1,2 s de espera entre acciones para evitar disparos falsos. Se dibuja el esqueleto de la mano.
- **02 · Detector facial**. Face Landmarker dibuja la malla del rostro (478 puntos) y devuelve 52 *blendshapes*. Con ellos se calculan la sonrisa, la boca abierta, las cejas, los ojos cerrados y el guiño, que se muestran en barras. La expresión se nombra con umbrales (😄, 😮, 😉…). Acción: **si mantienes la sonrisa 1 s, se hace una foto**.
- **03 · Realidad aumentada / virtual**. Escena A-Frame con mi monograma y dos objetos animados. El componente propio `interactivo` resalta el objeto al apuntarlo y le cambia el color al tocarlo, con ratón, mando VR o toque en AR. El botón de la escena entra en VR, o en AR WebXR en un móvil compatible (en AR se ocultan el cielo y el suelo). «Ver sobre la cámara» pone la webcam detrás del lienzo transparente para probar la AR en el portátil.

## Resultado de aprendizaje y criterios

**2. Genera interfaces naturales de usuario utilizando herramientas visuales.**

**a) Se han identificado las herramientas disponibles para el aprendizaje automático relacionadas con las interfaces de usuario.**
He usado MediaPipe Tasks Vision, de Google: modelos ya entrenados de manos, gestos, rostro y pose que se ejecutan en el navegador con WebAssembly y GPU. También he usado el reconocimiento de voz de la Web Speech API, que funciona con un modelo en la nube. He revisado otras opciones: TensorFlow.js, face-api.js (rostro), Teachable Machine (entrenar un modelo propio sin código) y ml5.js. Elegí MediaPipe porque una sola librería cubre manos y rostro, y no hace falta entrenar nada.

**b) Se ha creado una interfaz natural de usuario utilizando las herramientas disponibles.**
La interfaz de la UD1 se puede usar entera con la voz: navegar, buscar, crear, cerrar, cambiar el tema y dictar. Los ejercicios se controlan con gestos, con la cara y apuntando en 3D, y en todos el usuario sabe en cada momento qué está pasando gracias a los indicadores de estado.

**c) Se ha utilizado el reconocimiento de voz para implementar acciones en las interfaces naturales de usuario.**
`js/voz.js`: `VozIU` convierte frases en acciones (tabla de comandos de arriba) y `DictadoIU` transcribe en tiempo real con puntuación por voz. Se gestionan los eventos `start`, `result` (provisional y final), `error` y `end`, con reinicio automático tras un silencio. Los errores (permiso denegado, sin micrófono, sin red) se avisan con un toast.

**d) Se ha incorporado la detección del movimiento del cuerpo para implementar acciones en las interfaces naturales de usuario.**
En `01-gestos` el movimiento de los dedos y de la mano produce acciones. Sobre la pantalla se mide la distancia, la dirección y el tiempo del recorrido (deslizar, pinza, pulsación larga). Delante de la cámara, el modelo sigue los 21 puntos de la mano en cada fotograma y clasifica el gesto, que solo se ejecuta si se mantiene estable.

**e) Se han integrado elementos de detección de partes del cuerpo para implementar acciones en las interfaces naturales de usuario.**
En `02-detector-facial` se detectan el rostro y sus partes (ojos, labios, cejas, contorno) y se dibujan sobre el vídeo. Los coeficientes de cada parte se convierten en expresiones. La sonrisa mantenida dispara una acción: hacer una foto. En `01-gestos` también se detecta otra parte del cuerpo, la mano y sus dedos.

**f) Se ha integrado la realidad aumentada en los interfaces de usuario.**
En `03-realidad-aumentada`, con A-Frame y WebXR, la misma escena funciona en tres modos: en el navegador, en VR y en AR inmersiva en un móvil compatible. También hay un modo de AR sobre la webcam. Los objetos virtuales son interactivos gracias al componente propio `interactivo`.

## Pruebas realizadas

- Comandos de voz probados ejecutando `procesarFrase()` con frases de ejemplo. Todos hacen su acción, y una frase desconocida muestra el aviso.
- Puntuación del dictado: «hola me llamo Dominique coma estudio DAM punto» → «Hola me llamo Dominique, estudio DAM.».
- Gestos de puntero (deslizar, doble toque, pinza, pulsación larga y teclado) con eventos simulados.
- Modelos de MediaPipe: los dos se descargan y se inicializan sin errores.
- Escena A-Frame: se ve, los objetos responden al clic y el lienzo es transparente en modo cámara.
- **Pendiente de probar con micrófono y cámara reales.** El navegador de pruebas no tenía ninguno de los dos.

## Limitaciones

- El reconocimiento de voz depende del navegador (Chrome o Edge) y de la conexión. En Firefox el botón aparece como «Voz no disponible».
- La AR inmersiva WebXR solo funciona en móviles Android con ARCore y por HTTPS. En el portátil se usa el modo cámara.
- Los umbrales de las expresiones (0,55 para la sonrisa, etc.) son aproximados y pueden variar con la luz o la persona.

## Uso de IA

La base es mi interfaz de la UD1. Con ayuda de IA (Claude) se han generado `js/voz.js`, los estilos de la UD2 y los tres ejercicios, siguiendo mi manual de marca. Después los he revisado y probado.
