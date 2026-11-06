/**
 * 03 · Realidad aumentada y virtual
 *
 * - Componente A-Frame "interactivo": resalta el objeto al apuntarlo y cambia
 *   su color al tocarlo (ratón, mando VR o toque en AR).
 * - Modo cámara: pone la webcam detrás del lienzo 3D transparente.
 */
// Tonos medios y oscuros de la marca: el texto blanco del monograma se sigue leyendo
const PALETA = ["#342D3C", "#A991C9", "#D9A1B8", "#756D7B"];
let toques = 0;

AFRAME.registerComponent("interactivo", {
  schema: {
    nombre: { type: "string", default: "Objeto" }
  },

  init() {
    this.indice = PALETA.indexOf(this.el.getAttribute("color"));

    // Al apuntar, el objeto crece un poco; al dejar de apuntar vuelve a su tamaño
    this.el.addEventListener("mouseenter", () => this.el.setAttribute("scale", "1.15 1.15 1.15"));
    this.el.addEventListener("mouseleave", () => this.el.setAttribute("scale", "1 1 1"));

    this.el.addEventListener("click", () => {
      this.indice = (this.indice + 1) % PALETA.length;
      this.el.setAttribute("material", "color", PALETA[this.indice]);
      toques++;
      document.querySelector("#rotulo").setAttribute("value", `${this.data.nombre}: color ${this.indice + 1}  (${toques} toques)`);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector("#contenedor");
  const video = document.querySelector("#video");
  const boton = document.querySelector("#botonCamara");
  const estado = document.querySelector("#estado");
  let flujo = null;

  const cambiarEstado = (clave, texto) => {
    estado.dataset.estado = clave;
    estado.textContent = texto;
  };

  // Muestra u oculta el cielo y el suelo virtuales
  const mostrarFondo = (visible) => {
    document.querySelectorAll(".fondo").forEach((entidad) => entidad.setAttribute("visible", visible));
    // Sobre la imagen de la cámara el rótulo oscuro no se leería
    document.querySelector("#rotulo").setAttribute("color", visible ? "#342D3C" : "#FFFFFF");
  };

  boton.addEventListener("click", async () => {
    if (flujo) {
      flujo.getTracks().forEach((pista) => pista.stop());
      flujo = null;
      video.srcObject = null;
      contenedor.classList.remove("modo-camara");
      mostrarFondo(true);
      boton.textContent = "Ver sobre la cámara (AR)";
      cambiarEstado("apagado", "Fondo virtual");
      return;
    }

    try {
      cambiarEstado("cargando", "Abriendo cámara…");
      // En el móvil se prefiere la cámara trasera, que es la que mira al mundo
      flujo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      video.srcObject = flujo;
      await video.play();
      contenedor.classList.add("modo-camara");
      mostrarFondo(false);
      boton.textContent = "Volver al fondo virtual";
      cambiarEstado("detectando", "AR sobre la cámara");
    } catch (error) {
      cambiarEstado("error", error.name === "NotAllowedError" ? "Permiso de cámara denegado" : `Error: ${error.message}`);
    }
  });
});
