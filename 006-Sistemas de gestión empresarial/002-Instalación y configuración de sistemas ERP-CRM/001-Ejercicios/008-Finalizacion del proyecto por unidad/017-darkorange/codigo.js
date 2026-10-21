let tablaActual = ""
let clavePrimaria = ""

// Cargo la configuración (nombre y color de la empresa)
fetch("data/config.php")
    .then(function (respuesta) { return respuesta.json() })
    .then(function (datos) {
        document.querySelector("h1").textContent = datos.nombre
        document.title = datos.nombre
        document.documentElement.style.setProperty("--color_corporativo", datos.color)
    })

fetch("api/superapi.php?ruta=modulos")
    .then(function (respuesta) { return respuesta.json() })
    .then(function (datos) {
        let menu = document.querySelector("#modulos")
        datos.forEach(function (dato) {
            menu.innerHTML += '<a href="#">' + escapar(dato) + '</a>'
        })
    })

// Cada entidad del menú carga su tabla al pulsarla
fetch("api/superapi.php?ruta=entidades")
    .then(function (respuesta) { return respuesta.json() })
    .then(function (datos) {
        let menu = document.querySelector("#entidades")
        datos.forEach(function (dato) {
            let enlace = document.createElement("a")
            enlace.href = "#"
            enlace.textContent = dato
            enlace.onclick = function (evento) {
                evento.preventDefault()
                document.querySelectorAll("#entidades a").forEach(function (a) { a.classList.remove("activo") })
                enlace.classList.add("activo")
                cargarTabla(dato)
            }
            menu.appendChild(enlace)
        })
    })

function cargarTabla(tabla) {
    tablaActual = tabla
    fetch("api/superapi.php?ruta=tabla&tabla=" + encodeURIComponent(tabla))
        .then(function (respuesta) { return respuesta.json() })
        .then(function (datos) {
            clavePrimaria = datos.clavePrimaria
            pintarTabla(datos)
        })
}

function pintarTabla(datos) {
    let seccion = document.querySelector("section")
    let html = '<div class="barra"><div><small>ENTIDAD</small><h2>' + escapar(tablaActual) + '</h2></div>'
    html += '<button onclick="nuevoRegistro()">+ Nuevo registro</button></div>'

    html += '<div class="tabla-contenedor"><table><thead><tr>'
    // Cabeceras de columna
    datos.columnas.forEach(function (columna) {
        html += '<th>' + escapar(columna.name) + '</th>'
    })
    html += '<th class="acciones">Acciones</th></tr></thead><tbody>'
    // Cuerpo de la tabla
    datos.registros.forEach(function (registro, posicion) {
        html += '<tr>'
        datos.columnas.forEach(function (columna) {
            html += '<td>' + escapar(registro[columna.name] ?? '') + '</td>'
        })
        html += '<td class="acciones">'
        html += '<button class="editar" onclick="editarRegistro(' + posicion + ')">Editar</button> '
        html += '<button class="eliminar" onclick="eliminarRegistro(' + posicion + ')">Eliminar</button>'
        html += '</td></tr>'
    })
    html += '</tbody></table></div>'
    if (datos.registros.length == 0) {
        html += '<p class="vacio">Todavía no hay registros.</p>'
    }
    seccion.innerHTML = html
    // Guardo los registros para que los botones los encuentren por su posición
    registrosActuales = datos.registros
}

let registrosActuales = []

function nuevoRegistro() { cargarFormulario(null) }
function editarRegistro(posicion) { cargarFormulario(registrosActuales[posicion]) }

// El formulario se construye con las columnas reales de la tabla
function cargarFormulario(registro) {
    fetch("api/superapi.php?ruta=estructura&tabla=" + encodeURIComponent(tablaActual))
        .then(function (respuesta) { return respuesta.json() })
        .then(function (datos) {
            let editando = registro !== null
            let html = '<div class="barra"><div><small>' + (editando ? 'EDITAR' : 'CREAR') + '</small><h2>' + escapar(tablaActual) + '</h2></div>'
            html += '<button class="secundario" onclick="cargarTabla(tablaActual)">← Volver</button></div>'
            html += '<form id="formulario">'
            datos.columnas.forEach(function (columna) {
                if (columna.pk) { return }   // la clave primaria la pone SQLite
                let valor = editando ? (registro[columna.name] ?? '') : ''
                html += '<label>' + escapar(columna.name)
                html += '<input name="' + escapar(columna.name) + '" value="' + escapar(valor) + '"></label>'
            })
            html += '<button type="submit">' + (editando ? 'Guardar cambios' : 'Crear registro') + '</button></form>'
            document.querySelector("section").innerHTML = html
            document.querySelector("#formulario").onsubmit = function (evento) {
                evento.preventDefault()
                guardarRegistro(new FormData(this), editando ? registro[datos.clavePrimaria] : null)
            }
        })
}

function guardarRegistro(formulario, id) {
    let datos = Object.fromEntries(formulario.entries())
    fetch("api/superapi.php?ruta=" + (id === null ? "crear" : "actualizar"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabla: tablaActual, id: id, datos: datos })
    })
        .then(function (respuesta) { return respuesta.json() })
        .then(function (respuesta) {
            if (!respuesta.ok) { return alert(respuesta.error || "Error") }
            cargarTabla(tablaActual)
        })
}

function eliminarRegistro(posicion) {
    let id = registrosActuales[posicion][clavePrimaria]
    if (!confirm("¿Eliminar este registro?")) { return }
    fetch("api/superapi.php?ruta=eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabla: tablaActual, id: id })
    })
        .then(function (respuesta) { return respuesta.json() })
        .then(function (respuesta) {
            if (!respuesta.ok) { return alert(respuesta.error || "Error") }
            cargarTabla(tablaActual)
        })
}

// Convierte < > & " en texto seguro para meterlo en el HTML
function escapar(valor) {
    let caja = document.createElement("div")
    caja.textContent = String(valor)
    return caja.innerHTML.replaceAll('"', "&quot;")
}
