/**
 * 01 · Gestos y comandos por gestos
 *
 * A) GestosPuntero: reconoce deslizar, doble toque, pulsación larga y pinza
 *    con Pointer Events (sirven igual para dedo, ratón o lápiz).
 * B) GestosMano: reconoce gestos de la mano con la webcam usando el modelo
 *    preentrenado Gesture Recognizer de MediaPipe.
 * Los dos controlan el mismo Carrusel.
 */
import { FilesetResolver, GestureRecognizer, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";
import { WASM, iniciarCamara, pararCamara, Estado, mensajeCamara } from "../js/comun.js";

const $ = (selector) => document.querySelector(selector);

class Carrusel {
  constructor() {
    this.pista = $("#pista");
    this.diapositivas = [...this.pista.children];
    this.puntos = $("#puntos");
    this.registro = $("#registro");
    this.indice = 0;
    this.zoom = 1;

    this.puntos.innerHTML = this.diapositivas.map(() => "<span></span>").join("");
    this.actualizar();
  }

  get actual() {
    return this.diapositivas[this.indice];
  }

  ir(indice) {
    // La diapositiva que se deja vuelve a su estado normal
    this.actual.classList.remove("con-detalle");
    this.ampliar(1);
    this.indice = (indice + this.diapositivas.length) % this.diapositivas.length;
    this.actualizar();
  }

  siguiente() { this.ir(this.indice + 1); }
  anterior() { this.ir(this.indice - 1); }

  meGusta(valor = !this.actual.classList.contains("me-gusta")) {
    this.actual.classList.toggle("me-gusta", valor);
  }

  detalle() {
    this.actual.classList.toggle("con-detalle");
  }

  ampliar(factor) {
    this.zoom = Math.min(3, Math.max(1, factor));
    this.actual.querySelector(".ej-contenido").style.transform = `scale(${this.zoom})`;
  }

  actualizar() {
    this.pista.style.transform = `translateX(${-this.indice * 100}%)`;
    [...this.puntos.children].forEach((punto, i) => punto.classList.toggle("activo", i === this.indice));
  }

  // Deja constancia de cada gesto y de su origen (puntero, teclado o mano)
  anotar(texto) {
    const elemento = document.createElement("li");
    elemento.textContent = `${new Date().toLocaleTimeString()} · ${texto}`;
    this.registro.prepend(elemento);
    [...this.registro.children].slice(6).forEach((sobrante) => sobrante.remove());
  }
}

class GestosPuntero {
  constructor(superficie, carrusel) {
    this.superficie = superficie;
    this.carrusel = carrusel;
    this.punteros = new Map(); // pointerId → {x, y, x0, y0, t0}
    this.ultimoToque = 0;
    this.temporizadorLargo = null;
    this.pinza = null;         // {distancia, zoom} al empezar a pellizcar
    this.huboGesto = false;    // evita que una pinza o pulsación larga cuente también como toque

    superficie.addEventListener("pointerdown", (e) => this.alPulsar(e));
    superficie.addEventListener("pointermove", (e) => this.alMover(e));
    superficie.addEventListener("pointerup", (e) => this.alSoltar(e));
    superficie.addEventListener("pointercancel", (e) => this.punteros.delete(e.pointerId));
    superficie.addEventListener("keydown", (e) => this.alTeclear(e));
  }

  alPulsar(e) {
    try {
      this.superficie.setPointerCapture(e.pointerId); // seguir recibiendo el movimiento aunque salga de la superficie
    } catch (error) {
      // Algunos punteros (p. ej. sintéticos) no se pueden capturar; el gesto funciona igual
    }
    this.punteros.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t0: performance.now() });

    if (this.punteros.size === 1) {
      this.huboGesto = false;
      // Pulsación larga: 600 ms sin moverse
      this.temporizadorLargo = setTimeout(() => {
        this.huboGesto = true;
        this.carrusel.detalle();
        this.carrusel.anotar("pulsación larga → detalle");
      }, 600);
    } else if (this.punteros.size === 2) {
      clearTimeout(this.temporizadorLargo);
      this.pinza = { distancia: this.distancia(), zoom: this.carrusel.zoom };
    }
  }

  alMover(e) {
    const puntero = this.punteros.get(e.pointerId);
    if (!puntero) return;

    puntero.x = e.clientX;
    puntero.y = e.clientY;

    if (Math.hypot(puntero.x - puntero.x0, puntero.y - puntero.y0) > 10) {
      clearTimeout(this.temporizadorLargo);
    }

    // Pinza: la escala sigue la proporción entre la distancia actual y la inicial
    if (this.punteros.size === 2 && this.pinza) {
      this.huboGesto = true;
      this.carrusel.ampliar(this.pinza.zoom * (this.distancia() / this.pinza.distancia));
    }
  }

  alSoltar(e) {
    const puntero = this.punteros.get(e.pointerId);
    clearTimeout(this.temporizadorLargo);
    this.punteros.delete(e.pointerId);
    if (!puntero) return;

    if (this.pinza) {
      if (this.punteros.size === 0) {
        this.carrusel.anotar(`pinza → zoom ×${this.carrusel.zoom.toFixed(1)}`);
        this.pinza = null;
      }
      return;
    }

    if (this.huboGesto) return;

    const dx = puntero.x - puntero.x0;
    const dy = puntero.y - puntero.y0;
    const duracion = performance.now() - puntero.t0;

    // Deslizar: movimiento horizontal de más de 60 px en menos de 700 ms
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) && duracion < 700) {
      if (dx < 0) {
        this.carrusel.siguiente();
        this.carrusel.anotar("deslizar ← → siguiente");
      } else {
        this.carrusel.anterior();
        this.carrusel.anotar("deslizar → → anterior");
      }
      return;
    }

    // Doble toque: dos toques en menos de 300 ms
    if (Math.hypot(dx, dy) < 10) {
      const ahora = performance.now();
      if (ahora - this.ultimoToque < 300) {
        this.carrusel.meGusta();
        this.carrusel.anotar("doble toque → me gusta");
        this.ultimoToque = 0;
      } else {
        this.ultimoToque = ahora;
      }
    }
  }

  // Alternativa accesible con teclado
  alTeclear(e) {
    const acciones = {
      ArrowRight: () => this.carrusel.siguiente(),
      ArrowLeft: () => this.carrusel.anterior(),
      Enter: () => this.carrusel.meGusta()
    };

    if (acciones[e.key]) {
      e.preventDefault();
      acciones[e.key]();
      this.carrusel.anotar(`tecla ${e.key}`);
    }
  }

  distancia() {
    const [a, b] = [...this.punteros.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
  }
}

class GestosMano {
  // Nombres de categoría que devuelve el modelo → acción sobre el carrusel
  static acciones = {
    Thumb_Up: { icono: "👍", texto: "Me gusta", hacer: (c) => c.meGusta(true) },
    Thumb_Down: { icono: "👎", texto: "Quitar me gusta", hacer: (c) => c.meGusta(false) },
    Victory: { icono: "✌️", texto: "Siguiente", hacer: (c) => c.siguiente() },
    Pointing_Up: { icono: "☝️", texto: "Anterior", hacer: (c) => c.anterior() },
    Closed_Fist: { icono: "✊", texto: "Acercar", hacer: (c) => c.ampliar(1.8) },
    Open_Palm: { icono: "✋", texto: "Restablecer zoom", hacer: (c) => c.ampliar(1) }
  };

  constructor(carrusel) {
    this.carrusel = carrusel;
    this.video = $("#video");
    this.lienzo = $("#lienzo");
    this.contexto = this.lienzo.getContext("2d");
    this.dibujo = new DrawingUtils(this.contexto);
    this.estado = new Estado($("#estado"));
    this.boton = $("#botonCamara");
    this.reconocedor = null;
    this.flujo = null;
    this.ultimoTiempo = -1;
    this.candidato = { nombre: "None", desde: 0 };
    this.ultimaAccion = 0;

    this.pintarMapa();
    this.boton.addEventListener("click", () => (this.flujo ? this.parar() : this.iniciar()));
  }

  pintarMapa() {
    $("#mapa").innerHTML = Object.entries(GestosMano.acciones)
      .map(([nombre, a]) => `<tr data-gesto="${nombre}"><td>${a.icono}</td><td>${a.texto}</td></tr>`)
      .join("");
  }

  async iniciar() {
    try {
      this.boton.disabled = true;

      if (!this.reconocedor) {
        this.estado.cambiar("cargando", "Cargando modelo…");
        const vision = await FilesetResolver.forVisionTasks(WASM);
        this.reconocedor = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
      }

      this.estado.cambiar("cargando", "Abriendo cámara…");
      this.flujo = await iniciarCamara(this.video);
      this.lienzo.width = this.video.videoWidth;
      this.lienzo.height = this.video.videoHeight;
      $("#vacia").hidden = true;
      this.estado.cambiar("detectando", "Detectando manos");
      this.boton.textContent = "Apagar cámara";
      this.bucle();
    } catch (error) {
      this.estado.cambiar("error", mensajeCamara(error));
    } finally {
      this.boton.disabled = false;
    }
  }

  parar() {
    pararCamara(this.flujo, this.video);
    this.flujo = null;
    this.contexto.clearRect(0, 0, this.lienzo.width, this.lienzo.height);
    $("#vacia").hidden = false;
    this.estado.cambiar("apagado", "Cámara apagada");
    this.boton.textContent = "Activar cámara";
  }

  // Se analiza cada fotograma nuevo del vídeo
  bucle() {
    if (!this.flujo) return;

    if (this.video.currentTime !== this.ultimoTiempo) {
      this.ultimoTiempo = this.video.currentTime;
      const resultado = this.reconocedor.recognizeForVideo(this.video, performance.now());
      this.dibujar(resultado);
      this.interpretar(resultado);
    }

    requestAnimationFrame(() => this.bucle());
  }

  dibujar(resultado) {
    this.contexto.clearRect(0, 0, this.lienzo.width, this.lienzo.height);

    for (const puntos of resultado.landmarks) {
      this.dibujo.drawConnectors(puntos, GestureRecognizer.HAND_CONNECTIONS, { color: "#E9DDF1", lineWidth: 4 });
      this.dibujo.drawLandmarks(puntos, { color: "#D9A1B8", lineWidth: 1, radius: 4 });
    }
  }

  // Un gesto solo se ejecuta si se mantiene 500 ms y ha pasado 1,2 s desde la última acción
  interpretar(resultado) {
    const mejor = resultado.gestures[0]?.[0];
    const nombre = mejor && mejor.score > 0.6 ? mejor.categoryName : "None";
    const accion = GestosMano.acciones[nombre];
    const ahora = performance.now();

    $("#gesto").textContent = accion ? `${accion.icono} ${accion.texto}` : "Sin gesto";
    $("#confianza").textContent = mejor ? `Confianza: ${(mejor.score * 100).toFixed(0)} % (${mejor.categoryName})` : "Confianza: —";
    document.querySelectorAll("#mapa tr").forEach((fila) => fila.classList.toggle("activo", fila.dataset.gesto === nombre));

    if (nombre !== this.candidato.nombre) {
      this.candidato = { nombre, desde: ahora };
      return;
    }

    if (accion && ahora - this.candidato.desde > 500 && ahora - this.ultimaAccion > 1200) {
      accion.hacer(this.carrusel);
      this.carrusel.anotar(`mano ${accion.icono} → ${accion.texto.toLowerCase()}`);
      this.ultimaAccion = ahora;
    }
  }
}

const carrusel = new Carrusel();
new GestosPuntero($("#superficie"), carrusel);
new GestosMano(carrusel);
