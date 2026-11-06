/**
 * Utilidades compartidas por los ejercicios de cámara (gestos y rostro).
 * Se cargan como módulo ES: import { ... } from "../js/comun.js";
 */

// MediaPipe Tasks Vision: modelos de aprendizaje automático ya entrenados que se ejecutan en el navegador
export const VISION = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
export const WASM = `${VISION}/wasm`;

// Pide la webcam y la conecta al <video>. Devuelve el MediaStream para poder pararlo.
export async function iniciarCamara(video) {
  const flujo = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480, facingMode: "user" },
    audio: false
  });

  video.srcObject = flujo;
  await video.play();
  return flujo;
}

export function pararCamara(flujo, video) {
  flujo?.getTracks().forEach((pista) => pista.stop());
  video.srcObject = null;
}

// Indicador de estado (apagado / cargando / detectando / error) con texto y color
export class Estado {
  constructor(elemento) {
    this.elemento = elemento;
  }

  cambiar(estado, texto) {
    this.elemento.dataset.estado = estado;
    this.elemento.textContent = texto;
  }
}

// Mensaje de error legible para los fallos típicos de getUserMedia
export function mensajeCamara(error) {
  if (error.name === "NotAllowedError") return "Permiso de cámara denegado";
  if (error.name === "NotFoundError") return "No se ha encontrado ninguna cámara";
  return `Error: ${error.message}`;
}
