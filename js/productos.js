// js/productos.js

// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const categoria = urlParams.get('categoria') || 'frutas';
const subcategoria = urlParams.get('subcategoria') || 'General';

// Mapeo de categorías
const categoriasInfo = {
  frutas: { titulo: 'Frutas y Verduras', icono: '🥬' },
  carnes: { titulo: 'Carnes y Pescados', icono: '🥩' },
  lacteos: { titulo: 'Lácteos y Huevos', icono: '🥛' },
  panaderia: { titulo: 'Panadería', icono: '🥖' },
  dulces: { titulo: 'Dulces', icono: '🍬' },
  limpieza: { titulo: 'Limpieza y hogar', icono: '🧹' },
  mascotas: { titulo: 'Mascotas', icono: '🐕' },
  bebidas: { titulo: 'Bebidas', icono: '🥤' },
  aseo: { titulo: 'Aseo personal', icono: '🧴' }
};

// Actualizar UI según categoría
function actualizarUI() {
  const info = categoriasInfo[categoria] || categoriasInfo.frutas;
  
  document.getElementById('sectionIcon').textContent = info.icono;
  document.getElementById('sectionTitle').textContent = info.titulo;
  document.getElementById('breadcrumbCategory').textContent = info.titulo;
  document.getElementById('breadcrumbSubcategory').textContent = subcategoria;
  
  // Actualizar descripción según subcategoría
  const descripcion = `¡Bienvenido a la sección de <strong>${subcategoria}</strong>!<br>
    Descubre lo mejor de la naturaleza en cada bocado. Aquí encontrarás productos seleccionados, llenos de sabor, color y frescura para alegrar tus días y cuidar tu bienestar.`;
  document.getElementById('sectionDescription').innerHTML = descripcion;
}

// Cargar productos desde el backend
async function cargarProductos() {
  try {
    const response = await fetch('http://localhost:3001/productos');
    
    if (!response.ok) {
      throw new Error('Error al cargar productos');
    }
    
    const productos = await response.json();
    
    // Filtrar productos por categoría (puedes agregar más lógica de filtrado)
    const productosFiltrados = filtrarProductos(productos);
    
    mostrarProductos(productosFiltrados);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('productsGrid').innerHTML = `
      <div class="no-products">
        ⚠️ Error al cargar los productos.<br>
        <small>Verifica que el servidor esté corriendo en http://localhost:3001</small>
      </div>
    `;
  }
}

// Filtrar productos por categoría y subcategoría
function filtrarProductos(productos) {
  // Si la subcategoría es "General", mostrar todos los de la categoría
  if (subcategoria === 'General') {
    return productos.filter(p => 
      p.categoria && p.categoria.toLowerCase().includes(categoria)
    );
  }
  
  // Filtrar por subcategoría específica
  return productos.filter(p => {
    const categoriaMatch = p.categoria && p.categoria.toLowerCase().includes(categoria);
    const subcategoriaMatch = p.descripcion && p.descripcion.toLowerCase().includes(subcategoria.toLowerCase());
    return categoriaMatch || subcategoriaMatch;
  });
}

// Mostrar productos en el grid
function mostrarProductos(productos) {
  const grid = document.getElementById('productsGrid');
  
  if (productos.length === 0) {
    grid.innerHTML = `
      <div class="no-products">
        No hay productos disponibles en esta categoría.
      </div>
    `;
    return;
  }
  
  grid.innerHTML = productos.map(producto => `
    <div class="product-card">
      <img 
        src="${producto.imagen || 'img/producto-default.png'}" 
        alt="${producto.nombre}"
        class="product-image"
        onerror="this.src='img/producto-default.png'"
      >
      <div class="product-name">${producto.nombre}</div>
      <div class="product-price">$${formatearPrecio(producto.precio)}</div>
      <button class="btn-add" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}')">
        Agregar
      </button>
    </div>
  `).join('');
}

// Formatear precio
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
}

// Agregar producto al carrito
function agregarAlCarrito(productoId, productoNombre) {
  // Obtener carrito actual del localStorage
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Buscar si el producto ya está en el carrito
  const index = carrito.findIndex(item => item.id === productoId);
  
  if (index !== -1) {
    // Si ya existe, incrementar cantidad
    carrito[index].cantidad++;
  } else {
    // Si no existe, agregarlo
    carrito.push({ id: productoId, nombre: productoNombre, cantidad: 1 });
  }
  
  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Actualizar contador
  actualizarContadorCarrito();
  
  // Mostrar notificación
  mostrarToast(`✓ ${productoNombre} agregado al carrito`);
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById('cartCount').textContent = total;
}

// Mostrar notificación toast
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = mensaje;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Buscar productos
function buscarProductos() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  if (!searchTerm.trim()) {
    cargarProductos();
    return;
  }
  
  // Implementar búsqueda (puedes mejorar esto)
  console.log('Buscando:', searchTerm);
  // Aquí puedes hacer una petición al backend con el término de búsqueda
}

// Ver carrito
function verCarrito() {
  // Redirigir a página de carrito (crear después)
  alert('Funcionalidad de carrito en desarrollo');
  // window.location.href = 'carrito.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  actualizarUI();
  cargarProductos();
  actualizarContadorCarrito();
});