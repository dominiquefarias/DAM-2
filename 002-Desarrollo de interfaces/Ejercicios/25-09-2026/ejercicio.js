
const nombre = "Carlos";
const edad = 17;
const tieneMatricula = false;
const bloqueado = false;
const precioCurso = 1200;
const descuento = 0.1;
const nota = 8.5;

function calcularPrecioFinal(precioCurso, descuento) {

    const precioFinal = precioCurso - (precioCurso * descuento);

    console.log(precioFinal);

}

function puedeAcceder(edad, tieneMatricula, bloqueado) {

    if (edad >= 18 && tieneMatricula && !bloqueado) {

        console.log("Puede acceder");

    } else {

        console.log("No puede acceder");

    }

}


function obtenerCalificacion(nota) {

    if (nota < 0 || nota > 10) {

        console.log("Nota no válida");

    } else if (nota >= 9) {

        console.log("Sobresaliente");

    } else if (nota >= 7) {

        console.log("Notable");

    } else if (nota >= 5) {

        console.log("Aprobado");

    } else {

        console.log("Suspenso");

    }
}



