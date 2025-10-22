// js/app.js

const API_URL = "http://localhost:3001/productos"; // tu backend

async function cargarProductos() {
  try {
    const response = await fetch(API_URL);
    const productos = await response.json();

    const tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";

    productos.forEach(p => {
      const fila = `
        <tr>
          <td>${p.id}</td>
          <td>${p.nombre}</td>
          <td>${p.descripcion || '-'}</td>
          <td>$${p.precio.toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>${p.categoria || '-'}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editarProducto(${p.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})">Eliminar</button>
          </td>
        </tr>
      `;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// Llamar la función cuando cargue la página
cargarProductos();
