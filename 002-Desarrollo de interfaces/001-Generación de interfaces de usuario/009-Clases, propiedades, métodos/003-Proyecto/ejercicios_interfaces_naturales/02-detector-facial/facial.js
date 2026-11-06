/**
 * 02 · Detector facial
 *
 * Usa el modelo preentrenado Face Landmarker de MediaPipe en modo VIDEO:
 * - faceLandmarks: puntos 3D del rostro, que se dibujan como malla.
 * - faceBlendshapes: coeficientes de 0 a 1 por gesto (sonrisa, mandíbula, cejas…),
 *   con los que se deduce la expresión y se dispara una acción.
 */
import { FilesetResolver, FaceLandmarker, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";
import { WASM, iniciarCamara, pararCamara, Estado, mensajeCamara } from "../js/comun.js";

const $ = (selector) => document.querySelector(selector);

class DetectorFacial {
  // Expresiones que se muestran: nombre visible → cómo se calcula con los blendshapes
  static medidas = {
    Sonrisa: (b) => (b.mouthSmileLeft + b.mouthSmileRight) / 2,
    "Boca abierta": (b) => b.jawOpen,
    "Cejas arriba": (b) => b.browInnerUp,
    "Ojos cerrados": (b) => (b.eyeBlinkLeft + b.eyeBlinkRight) / 2,
    // Un guiño es un ojo mucho más cerrado que el otro
    "Guiño": (b) => Math.abs(b.eyeBlinkLeft - b.eyeBlinkRight)
  };

  constructor() {
    this.video = $("#video");
    this.lienzo = $("#lienzo");
    this.contexto = this.lienzo.getContext("2d");
    this.dibujo = new DrawingUtils(this.contexto);
    this.estado = new Estado($("#estado"));
    this.boton = $("#botonCamara");
    this.detector = null;
    this.flujo = null;
    this.ultimoTiempo = -1;
    this.sonriendoDesde = 0;
    this.ultimaFoto = 0;

    this.pintarBarras();
    this.boton.addEventListener("click", () => (this.flujo ? this.parar() : this.iniciar()));
  }

  pintarBarras() {
    $("#barras").innerHTML = Object.keys(DetectorFacial.medidas)
      .map((nombre) => `<label><span>${nombre}</span><progress max="1" value="0"></progress><output>0 %</output></label>`)
      .join("");
    this.barras = [...document.querySelectorAll("#barras label")];
  }

  async iniciar() {
    try {
      this.boton.disabled = true;

      if (!this.detector) {
        this.estado.cambiar("cargando", "Cargando modelo…");
        const vision = await FilesetResolver.forVisionTasks(WASM);
        this.detector = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 2,
          outputFaceBlendshapes: true
        });
      }

      this.estado.cambiar("cargando", "Abriendo cámara…");
      this.flujo = await iniciarCamara(this.video);
      this.lienzo.width = this.video.videoWidth;
      this.lienzo.height = this.video.videoHeight;
      $("#vacia").hidden = true;
      this.estado.cambiar("detectando", "Detectando rostro");
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

  bucle() {
    if (!this.flujo) return;

    if (this.video.currentTime !== this.ultimoTiempo) {
      this.ultimoTiempo = this.video.currentTime;
      const resultado = this.detector.detectForVideo(this.video, performance.now());
      this.dibujar(resultado);
      this.interpretar(resultado);
    }

    requestAnimationFrame(() => this.bucle());
  }

  dibujar(resultado) {
    this.contexto.clearRect(0, 0, this.lienzo.width, this.lienzo.height);

    for (const puntos of resultado.faceLandmarks) {
      this.dibujo.drawConnectors(puntos, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "rgba(233,221,241,.35)", lineWidth: 1 });
      this.dibujo.drawConnectors(puntos, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#A991C9", lineWidth: 3 });
      this.dibujo.drawConnectors(puntos, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#D9A1B8", lineWidth: 3 });
      this.dibujo.drawConnectors(puntos, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#E9DDF1", lineWidth: 2 });
      this.dibujo.drawConnectors(puntos, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#E9DDF1", lineWidth: 2 });
    }
  }

  interpretar(resultado) {
    $("#rostros").textContent = `Rostros detectados: ${resultado.faceLandmarks.length}`;

    const categorias = resultado.faceBlendshapes[0]?.categories;
    if (!categorias) {
      $("#expresion").textContent = "😶 Sin rostro";
      this.sonriendoDesde = 0;
      return;
    }

    // Lista de categorías → objeto {mouthSmileLeft: 0.8, jawOpen: 0.1, …}
    const b = Object.fromEntries(categorias.map((c) => [c.categoryName, c.score]));
    const valores = Object.values(DetectorFacial.medidas).map((medir) => medir(b));

    valores.forEach((valor, i) => {
      this.barras[i].querySelector("progress").value = valor;
      this.barras[i].querySelector("output").textContent = `${Math.round(valor * 100)} %`;
    });

    const [sonrisa, boca, cejas, ojos, guino] = valores;
    $("#expresion").textContent = this.nombrarExpresion(sonrisa, boca, cejas, ojos, guino);
    this.comprobarFoto(sonrisa);
  }

  // Reglas sencillas con umbrales sobre los coeficientes
  nombrarExpresion(sonrisa, boca, cejas, ojos, guino) {
    if (guino > 0.4) return "😉 Guiño";
    if (ojos > 0.6) return "😌 Ojos cerrados";
    if (boca > 0.45 && cejas > 0.35) return "😮 Sorpresa";
    if (sonrisa > 0.55) return "😄 Sonriendo";
    if (boca > 0.45) return "😯 Boca abierta";
    return "😐 Neutral";
  }

  // Acción: con la sonrisa mantenida 1 s se captura el fotograma actual
  comprobarFoto(sonrisa) {
    const ahora = performance.now();

    if (sonrisa < 0.55) {
      this.sonriendoDesde = 0;
      return;
    }

    this.sonriendoDesde ||= ahora;

    if (ahora - this.sonriendoDesde > 1000 && ahora - this.ultimaFoto > 3000) {
      this.ultimaFoto = ahora;
      this.hacerFoto();
    }
  }

  hacerFoto() {
    const foto = document.createElement("canvas");
    foto.width = this.video.videoWidth;
    foto.height = this.video.videoHeight;

    const contexto = foto.getContext("2d");
    contexto.translate(foto.width, 0); // en espejo, igual que se ve en pantalla
    contexto.scale(-1, 1);
    contexto.drawImage(this.video, 0, 0);

    const imagen = document.createElement("img");
    imagen.src = foto.toDataURL("image/jpeg", 0.8);
    imagen.alt = `Foto con sonrisa, ${new Date().toLocaleTimeString()}`;
    $("#galeria").prepend(imagen);
  }
}

new DetectorFacial();
