// Exportar a JSON (añadido por mí; en clase solo se exportaba a CSV)
class DarkorangeJSON {
  static descargar(nombre, registros) {
    const texto = JSON.stringify(registros, null, 2);
    const blob = new Blob([texto], {type: 'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = String(nombre).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json';
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
