/**
 * jocarsa | iu · interfaces naturales (UD2)
 * Comandos por voz y dictado con la Web Speech API.
 *
 * - VozIU: escucha frases cortas y las convierte en acciones de la interfaz.
 * - DictadoIU: transcribe en tiempo real dentro de un área de texto.
 * - TemaIU: cambia entre tema claro y oscuro (uno de los comandos).
 *
 * El reconocimiento funciona en Chrome y Edge (webkitSpeechRecognition),
 * necesita HTTPS o localhost y conexión a internet.
 */
window.jocarsa = window.jocarsa || {};
window.jocarsa.iu = window.jocarsa.iu || {};

(() => {
  "use strict";

  const { DOM } = window.jocarsa.iu;
  const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;

  class Texto {
    // Minúsculas, sin tildes ni signos: así "Ir a Configuración." coincide con "ir a configuracion"
    static normalizar(texto) {
      return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[.,;:¡!¿?/]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // La frase reconocida se pinta con innerHTML en los toasts: se escapa antes
    static escapar(texto) {
      return String(texto).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }
  }

  class TemaIU {
    static clave = "df-tema";

    static cargar() {
      let tema = "light";
      try {
        tema = localStorage.getItem(TemaIU.clave) || "light";
      } catch (error) {
        // Sin almacenamiento (modo privado): se queda en claro
      }
      TemaIU.aplicar(tema);
    }

    static aplicar(tema) {
      document.documentElement.dataset.theme = tema;
      try {
        localStorage.setItem(TemaIU.clave, tema);
      } catch (error) {
        // La preferencia no se recuerda, pero el cambio se aplica igual
      }
    }

    static alternar() {
      TemaIU.aplicar(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    }
  }

  class VozIU {
    constructor(aplicacion) {
      this.aplicacion = aplicacion;
      this.boton = DOM.uno("#microfono");
      this.textoBoton = DOM.uno(".ju-mic-texto", this.boton);
      this.transcripcion = DOM.uno("#transcripcion");
      this.activo = false;   // true mientras la usuaria quiere seguir dando comandos
      this.dictado = null;   // DictadoIU de la vista abierta
      this.comandos = this.definirComandos();

      if (!Reconocimiento) {
        this.cambiarEstado("no-disponible", "Voz no disponible");
        this.boton.disabled = true;
        this.boton.title = "Tu navegador no tiene Web Speech API. Usa Chrome o Edge.";
        return;
      }

      this.reconocedor = this.crearReconocedor();
      this.boton.addEventListener("click", () => (this.activo ? this.parar() : this.escuchar()));
    }

    crearReconocedor() {
      const reconocedor = new Reconocimiento();
      reconocedor.lang = "es-ES";
      reconocedor.continuous = true;      // no se apaga tras la primera frase
      reconocedor.interimResults = true;  // resultados provisionales mientras se habla

      reconocedor.addEventListener("start", () => this.cambiarEstado("escuchando", "Escuchando…"));
      reconocedor.addEventListener("result", (evento) => this.alRecibirResultado(evento));
      reconocedor.addEventListener("error", (evento) => this.alFallar(evento));
      reconocedor.addEventListener("end", () => {
        // Chrome corta la sesión tras un silencio largo: si seguimos activos, se reinicia
        if (this.activo) {
          this.arrancar();
        } else if (!this.dictado?.dictando) {
          this.cambiarEstado("inactivo", "Voz inactiva");
        }
      });

      return reconocedor;
    }

    escuchar() {
      this.dictado?.parar();
      this.activo = true;
      this.arrancar();
    }

    arrancar() {
      try {
        this.reconocedor.start();
      } catch (error) {
        // start() lanza InvalidStateError si ya estaba arrancado: se ignora
      }
    }

    parar() {
      this.activo = false;
      this.reconocedor?.stop();
      this.cambiarEstado("inactivo", "Voz inactiva");
    }

    cambiarEstado(estado, texto) {
      this.boton.dataset.estado = estado;
      this.textoBoton.textContent = texto;
    }

    alRecibirResultado(evento) {
      let provisional = "";

      for (let i = evento.resultIndex; i < evento.results.length; i++) {
        const resultado = evento.results[i];

        if (resultado.isFinal) {
          this.procesarFrase(resultado[0].transcript);
        } else {
          provisional += resultado[0].transcript;
        }
      }

      if (provisional) {
        this.mostrarTranscripcion(`«${provisional.trim()}»`);
      }
    }

    alFallar(evento) {
      if (evento.error === "no-speech" || evento.error === "aborted") {
        return; // silencio o parada manual: "end" ya se encarga
      }

      const mensajes = {
        "not-allowed": "Permite el uso del micrófono en el navegador para usar la voz.",
        "audio-capture": "No se ha encontrado ningún micrófono.",
        network: "El reconocimiento de voz necesita conexión a internet."
      };

      this.activo = false;
      this.cambiarEstado("inactivo", "Voz inactiva");
      this.aplicacion.toast.mostrar("danger", "Micrófono", mensajes[evento.error] || `Error de reconocimiento: ${evento.error}`);
    }

    // Busca el primer comando cuyo patrón encaja con la frase y lo ejecuta
    procesarFrase(frase) {
      const normal = Texto.normalizar(frase);
      let respuesta = null;

      this.cambiarEstado("procesando", "Procesando…");

      for (const comando of this.comandos) {
        const coincidencia = normal.match(comando.patron);

        if (coincidencia) {
          respuesta = comando.accion(coincidencia);
          if (respuesta) break;
        }
      }

      if (respuesta) {
        this.mostrarTranscripcion(`«${frase.trim()}» → ${respuesta}`);
      } else {
        this.mostrarTranscripcion(`«${frase.trim()}» → no reconocido`);
        this.aplicacion.toast.mostrar("warning", "Comando no reconocido", `«${Texto.escapar(frase.trim())}». Di «ayuda» para ver los comandos.`);
      }

      // Se deja ver el estado "procesando" un instante antes de volver a escuchar
      setTimeout(() => {
        if (this.activo) {
          this.cambiarEstado("escuchando", "Escuchando…");
        } else if (!this.dictado?.dictando) {
          this.cambiarEstado("inactivo", "Voz inactiva");
        }
      }, 700);
    }

    mostrarTranscripcion(texto) {
      this.transcripcion.textContent = texto;
      this.transcripcion.classList.add("visible");
      clearTimeout(this.temporizador);
      this.temporizador = setTimeout(() => this.transcripcion.classList.remove("visible"), 4000);
    }

    // Cada comando devuelve el texto de respuesta, o null si no ha podido hacer nada
    definirComandos() {
      const app = this.aplicacion;

      return [
        { ejemplo: "ayuda", patron: /^(ayuda|comandos|que puedo decir)$/, accion: () => this.mostrarAyuda() },
        { ejemplo: "buscar Laura", patron: /^buscar (.+)$/, accion: (m) => this.buscar(m[1]) },
        { ejemplo: "limpiar búsqueda", patron: /^(limpiar|borrar) (la )?busqueda$/, accion: () => this.buscar("") },
        { ejemplo: "nuevo cliente", patron: /^(nuevo|crear)( cliente)?$/, accion: () => (app.drawer.abrirCrear(), "panel de creación") },
        { ejemplo: "cerrar sesión", patron: /^cerrar sesion$/, accion: () => ((location.href = "login.html"), "cerrando sesión") },
        { ejemplo: "cerrar", patron: /^(cerrar|cancelar)( panel| ventana)?$/, accion: () => (app.drawer.cerrar(), app.modal.cerrar(), "cerrado") },
        { ejemplo: "modo oscuro", patron: /^(modo|tema) oscuro$/, accion: () => (TemaIU.aplicar("dark"), "tema oscuro") },
        { ejemplo: "modo claro", patron: /^(modo|tema) claro$/, accion: () => (TemaIU.aplicar("light"), "tema claro") },
        { ejemplo: "cambiar tema", patron: /^cambiar (de )?tema$/, accion: () => (TemaIU.alternar(), "tema cambiado") },
        { ejemplo: "contraer menú", patron: /^(contraer|minimizar|ocultar) (el )?menu$/, accion: () => this.alternarMenu(true) },
        { ejemplo: "expandir menú", patron: /^(expandir|mostrar|abrir) (el )?menu$/, accion: () => this.alternarMenu(false) },
        { ejemplo: "empezar dictado", patron: /^((empezar|iniciar|abrir) (el )?)?dictado$/, accion: () => this.irADictado() },
        { ejemplo: "dejar de escuchar", patron: /^(dejar de escuchar|desactivar voz|parar voz)$/, accion: () => (this.parar(), "voz desactivada") },
        // El último es el más general: "ir a toasts", "abrir formulario", "clientes"…
        { ejemplo: "ir a Toasts", patron: /^(ir a |abrir |ver |mostrar )?(.+)$/, accion: (m) => this.navegar(m[2]) }
      ];
    }

    buscar(texto) {
      const buscador = DOM.uno("#buscador");
      buscador.value = texto;
      buscador.dispatchEvent(new Event("input")); // reutiliza el escuchador de la UD1
      return texto ? `buscando «${texto}»` : "búsqueda limpia";
    }

    alternarMenu(contraer) {
      const menu = DOM.uno("#navegacion");

      if (menu.classList.contains("compacto") !== contraer) {
        DOM.uno(".minimizar", menu).click();
      }

      return contraer ? "menú contraído" : "menú expandido";
    }

    // Pulsa el elemento del menú o de la columna central cuyo texto coincide
    navegar(destino) {
      const elementos = [...DOM.todos("#navegacion a"), ...DOM.todos("#entidades article")];
      const elemento = elementos.find((nodo) => {
        const etiqueta = Texto.normalizar(DOM.uno(".etiqueta", nodo).textContent);
        return etiqueta === destino || etiqueta.startsWith(`${destino} `);
      });

      if (!elemento) return null;

      elemento.click();
      return `abriendo ${DOM.uno(".etiqueta", elemento).textContent}`;
    }

    irADictado() {
      this.navegar("dictado");
      this.parar(); // solo puede haber un reconocimiento activo a la vez
      this.dictado?.empezar();
      return "dictado";
    }

    mostrarAyuda() {
      const lista = this.comandos.map((comando) => `<li>«${comando.ejemplo}»</li>`).join("");
      this.aplicacion.modal.abrir("Comandos por voz", `<p>Pulsa el botón del micrófono y di, por ejemplo:</p><ul class="ju-voz-ayuda">${lista}</ul><p>En «ir a…» vale cualquier opción de los menús.</p>`);
      return "ayuda";
    }

    mostrarDictado() {
      this.dictado?.parar();
      this.dictado = new DictadoIU(this.aplicacion, this);
    }
  }

  class DictadoIU {
    constructor(aplicacion, voz) {
      this.aplicacion = aplicacion;
      this.voz = voz;
      this.dictando = false;
      this.pintar();

      if (!Reconocimiento) {
        this.botonEmpezar.disabled = true;
        this.provisional.textContent = "Este navegador no permite el dictado. Prueba con Chrome o Edge.";
        return;
      }

      this.reconocedor = new Reconocimiento();
      this.reconocedor.lang = "es-ES";
      this.reconocedor.continuous = true;
      this.reconocedor.interimResults = true;
      this.reconocedor.addEventListener("result", (evento) => this.alRecibirResultado(evento));
      this.reconocedor.addEventListener("error", (evento) => {
        if (evento.error === "no-speech" || evento.error === "aborted") return;
        this.parar();
        this.aplicacion.toast.mostrar("danger", "Dictado", evento.error === "not-allowed"
          ? "Permite el uso del micrófono en el navegador para dictar."
          : `Error de reconocimiento: ${evento.error}`);
      });
      this.reconocedor.addEventListener("end", () => {
        if (!this.dictando) return;
        try {
          this.reconocedor.start(); // sigue dictando tras un silencio
        } catch (error) {
          // ya estaba arrancado
        }
      });
    }

    pintar() {
      const escenario = DOM.uno("#escenario");

      escenario.innerHTML = `
        <article class="ju-card ju-dictado">
          <h2>Dictado por voz</h2>
          <p>Pulsa «Empezar dictado» y habla. Di «punto», «coma», «dos puntos» o «nueva línea» para puntuar y «terminar dictado» para parar.</p>
          <div class="ju-form-grid">
            <label class="ju-form-full">
              <span>Texto dictado</span>
              <textarea id="textoDictado" rows="8" placeholder="Aquí aparecerá lo que digas…"></textarea>
            </label>
          </div>
          <p class="ju-dictado-provisional" id="dictadoProvisional" aria-live="polite"></p>
          <div class="ju-button-row">
            <button class="ju-btn" id="dictadoEmpezar" type="button">Empezar dictado</button>
            <button class="ju-btn secondary" id="dictadoLeer" type="button">Leer en voz alta</button>
            <button class="ju-btn secondary" id="dictadoCopiar" type="button">Copiar</button>
            <button class="ju-btn secondary" id="dictadoBorrar" type="button">Borrar</button>
          </div>
        </article>
      `;

      this.area = DOM.uno("#textoDictado");
      this.provisional = DOM.uno("#dictadoProvisional");
      this.botonEmpezar = DOM.uno("#dictadoEmpezar");

      this.botonEmpezar.addEventListener("click", () => (this.dictando ? this.parar() : this.empezar()));
      DOM.uno("#dictadoLeer").addEventListener("click", () => this.leer());
      DOM.uno("#dictadoCopiar").addEventListener("click", () => this.copiar());
      DOM.uno("#dictadoBorrar").addEventListener("click", () => {
        this.area.value = "";
        this.area.focus();
      });
    }

    empezar() {
      if (!this.reconocedor || this.dictando) return;

      this.voz.parar();
      this.dictando = true;
      this.reconocedor.start();
      this.botonEmpezar.textContent = "Parar dictado";
      this.voz.cambiarEstado("escuchando", "Dictando…");
    }

    parar() {
      if (!this.dictando) return;

      this.dictando = false;
      this.reconocedor.stop();
      this.botonEmpezar.textContent = "Empezar dictado";
      this.provisional.textContent = "";
      this.voz.cambiarEstado("inactivo", "Voz inactiva");
    }

    alRecibirResultado(evento) {
      // Si se ha cambiado de vista, el área ya no existe: se deja de dictar
      if (!document.contains(this.area)) {
        this.parar();
        return;
      }

      let provisional = "";

      for (let i = evento.resultIndex; i < evento.results.length; i++) {
        const texto = evento.results[i][0].transcript;

        if (!evento.results[i].isFinal) {
          provisional += texto;
        } else if (/^(terminar|parar) (el )?dictado$/.test(Texto.normalizar(texto))) {
          this.parar();
          return;
        } else {
          this.voz.cambiarEstado("procesando", "Procesando…");
          this.anadir(texto);
          setTimeout(() => this.dictando && this.voz.cambiarEstado("escuchando", "Dictando…"), 400);
        }
      }

      // Lo provisional se ve en gris debajo y se sustituye al llegar el resultado final
      this.provisional.textContent = provisional;
    }

    // Convierte las palabras de puntuación en signos y añade el texto al final
    anadir(texto) {
      let fragmento = texto
        .replace(/\s*\bpunto y aparte\b\s*/gi, ".\n")
        .replace(/\s*\bnueva l[ií]nea\b\s*/gi, "\n")
        .replace(/\s*\bdos puntos\b/gi, ":")
        .replace(/\s*\bpunto\b/gi, ".")
        .replace(/\s*\bcoma\b/gi, ",")
        .trim();

      const actual = this.area.value;
      const inicioDeFrase = actual.trim() === "" || /[.!?:\n]\s*$/.test(actual);

      if (inicioDeFrase) {
        fragmento = fragmento.charAt(0).toUpperCase() + fragmento.slice(1);
      }

      const separador = actual === "" || /\s$/.test(actual) || /^[.,:\n]/.test(fragmento) ? "" : " ";
      this.area.value = actual + separador + fragmento;
      this.area.scrollTop = this.area.scrollHeight;
    }

    // Síntesis de voz: la interfaz "habla" leyendo el texto dictado
    leer() {
      if (!("speechSynthesis" in window) || !this.area.value.trim()) return;

      speechSynthesis.cancel();
      const locucion = new SpeechSynthesisUtterance(this.area.value);
      locucion.lang = "es-ES";
      speechSynthesis.speak(locucion);
    }

    async copiar() {
      try {
        await navigator.clipboard.writeText(this.area.value);
        this.aplicacion.toast.mostrar("success", "Texto copiado", "El dictado está en el portapapeles.");
      } catch (error) {
        this.aplicacion.toast.mostrar("warning", "No se ha podido copiar", "Selecciona el texto y cópialo a mano.");
      }
    }
  }

  window.jocarsa.iu.Texto = Texto;
  window.jocarsa.iu.TemaIU = TemaIU;
  window.jocarsa.iu.VozIU = VozIU;
  window.jocarsa.iu.DictadoIU = DictadoIU;

  TemaIU.cargar();

  // componentes.js crea la aplicación en su propio DOMContentLoaded, que se registra antes
  document.addEventListener("DOMContentLoaded", () => {
    const aplicacion = window.jocarsa.iu.aplicacion;
    aplicacion.voz = new VozIU(aplicacion);
  });
})();
