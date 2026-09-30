const productos = [
    {
        nombre: "Teclado mecánico",
        precio: 79.99,
        stock: 5,
        disponible: true
    },
    {
        nombre: "Ratón inalámbrico",
        precio: 39.99,
        stock: 0,
        disponible: false
    },
    {
        nombre: "Monitor 24 pulgadas",
        precio: 159.99,
        stock: 8,
        disponible: true
    }
];

function mostrarProductos() {
    productos.forEach(producto => {
        console.log(`Nombre: ${producto.nombre}`);
        console.log(`Precio: ${producto.precio}`);
        console.log(`Stock: ${producto.stock}`);
        console.log(`Disponible: ${producto.disponible}`);
    });
}

function agregarProducto(producto) {
    productos.push(producto);
}

function contarProductosDisponibles() {
    let contador = 0;
    productos.forEach(producto => {
        if (producto.disponible) {
            contador++;
        }
    });
    return contador;
}

function calcularValorStock() {
    let valorTotal = 0;
    productos.forEach(producto => {
        valorTotal += producto.precio * producto.stock;
    });
    return valorTotal;
}