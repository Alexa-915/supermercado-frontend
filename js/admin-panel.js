// js/admin-panel-completo.js
// Panel de Administrador - Supermercado La Fortuna

const API_URL = 'http://localhost:3001';
let adminData = null;
let todosLosProductos = [];
let todosLosPedidos = [];
let todosLosEmpleados = [];

// ========================================
// SUBCATEGORÍAS POR CATEGORÍA
// ========================================
const subcategoriasPorCategoria = {
  'frutas': [
    'General',
    'Frutas frescas',
    'Verduras frescas',
    'Hierbas aromáticas',
    'Ensaladas listas',
    'Frutas secas'
  ],
  'carnes': [
    'General',
    'Carnes de res',
    'Pollo y aves',
    'Cerdo',
    'Pescados',
    'Mariscos',
    'Embutidos'
  ],
  'lacteos': [
    'General',
    'Leche',
    'Yogurt',
    'Quesos',
    'Mantequilla y margarina',
    'Huevos',
    'Crema de leche'
  ],
  'panaderia': [
    'General',
    'Pan fresco',
    'Pan empacado',
    'Pasteles y tortas',
    'Galletas',
    'Productos de repostería'
  ],
  'dulces': [
    'General',
    'Chocolates',
    'Caramelos',
    'Gomitas',
    'Snacks dulces',
    'Postres'
  ],
  'limpieza': [
    'General',
    'Limpieza de pisos',
    'Limpieza de baño',
    'Limpieza de cocina',
    'Detergentes',
    'Desinfectantes',
    'Papel higiénico'
  ],
  'mascotas': [
    'General',
    'Alimento para perros',
    'Alimento para gatos',
    'Snacks y premios',
    'Higiene',
    'Accesorios'
  ],
  'bebidas': [
    'General',
    'Jugos naturales',
    'Gaseosas',
    'Agua',
    'Bebidas energéticas',
    'Té y café',
    'Bebidas alcohólicas'
  ],
  'aseo': [
    'General',
    'Jabones y geles',
    'Shampoo',
    'Cuidado dental',
    'Desodorantes',
    'Cuidado de la piel',
    'Afeitado'
  ]
};

// ========================================
// VERIFICAR AUTENTICACIÓN
// ========================================
window.addEventListener('DOMContentLoaded', async () => {
  await verificarAutenticacion();
  await cargarDashboard();
  setupEventListeners();
});

async function verificarAutenticacion() {
  try {
    const response = await fetch(`${API_URL}/auth/admin/check`, {
      credentials: 'include'
    });

    if (!response.ok) {
      window.location.href = 'admin-login.html';
      return;
    }

    const data = await response.json();
    
    if (!data.authenticated) {
      window.location.href = 'admin-login.html';
      return;
    }

    adminData = data.admin;
    
    document.getElementById('adminName').textContent = adminData.nombre;
    document.getElementById('adminRole').textContent = adminData.rol.charAt(0).toUpperCase() + adminData.rol.slice(1);
    document.getElementById('adminAvatar').textContent = adminData.nombre.charAt(0).toUpperCase();

  } catch (error) {
    console.error('Error verificando autenticación:', error);
    window.location.href = 'admin-login.html';
  }
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
  // Navegación entre secciones
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', cambiarSeccion);
  });

  // Filtros de productos
  document.getElementById('filterCategoria')?.addEventListener('change', actualizarSubcategorias);
  document.getElementById('filterSubcategoria')?.addEventListener('change', filtrarProductos);
  document.getElementById('searchProducto')?.addEventListener('input', filtrarProductos);

  // Filtros de pedidos
  document.getElementById('filterEstadoPedido')?.addEventListener('change', filtrarPedidos);
  document.getElementById('filterFechaPedido')?.addEventListener('change', filtrarPedidos);

  // Filtro de inventario
  document.getElementById('filterInventario')?.addEventListener('change', filtrarInventario);

  // Botones
  document.getElementById('btnLogout')?.addEventListener('click', logout);
  document.getElementById('btnNuevoProducto')?.addEventListener('click', () => abrirModal('modalProducto'));
  document.getElementById('btnNuevoEmpleado')?.addEventListener('click', () => abrirModal('modalEmpleado'));
}

// ========================================
// NAVEGACIÓN
// ========================================
async function cambiarSeccion(e) {
  const item = e.currentTarget;
  const section = item.dataset.section;

  // Actualizar nav items
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  item.classList.add('active');

  // Cambiar sección
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');

  // Actualizar título
  const titles = {
    dashboard: 'Dashboard',
    productos: 'Gestión de Productos',
    pedidos: 'Gestión de Pedidos',
    inventario: 'Control de Inventario',
    empleados: 'Gestión de Empleados',
    clientes: 'Lista de Clientes'
  };
  document.getElementById('pageTitle').textContent = titles[section];

  // Cargar datos según sección
  if (section === 'productos') await cargarProductos();
  if (section === 'pedidos') await cargarPedidos();
  if (section === 'inventario') await cargarInventario();
  if (section === 'empleados') await cargarEmpleados();
  if (section === 'clientes') await cargarClientes();
}

// ========================================
// DASHBOARD
// ========================================
async function cargarDashboard() {
  try {
    const response = await fetch(`${API_URL}/api/admin/dashboard`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Error al cargar dashboard');

    const data = await response.json();
    
    document.getElementById('totalProductos').textContent = data.totalProductos || 0;
    document.getElementById('pedidosPendientes').textContent = data.ventasHoy || 0;
    document.getElementById('stockBajo').textContent = data.productosBajoStock || 0;
    
    // Cargar empleados para el dashboard
    const empResponse = await fetch(`${API_URL}/empleados`, {
      credentials: 'include'
    });
    if (empResponse.ok) {
      const empleados = await empResponse.json();
      document.getElementById('empleadosActivos').textContent = empleados.filter(e => e.activo).length || 0;
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// ========================================
// PRODUCTOS
// ========================================
async function cargarProductos() {
  try {
    const response = await fetch(`${API_URL}/api/admin/productos`, {
      credentials: 'include'
    });

    todosLosProductos = await response.json();
    mostrarProductos(todosLosProductos);

  } catch (error) {
    console.error('Error:', error);
  }
}

function actualizarSubcategorias() {
  const categoriaSelect = document.getElementById('filterCategoria');
  const subcategoriaSelect = document.getElementById('filterSubcategoria');
  const categoria = categoriaSelect.value;

  subcategoriaSelect.innerHTML = '<option value="">Todas las subcategorías</option>';

  if (categoria && subcategoriasPorCategoria[categoria]) {
    subcategoriasPorCategoria[categoria].forEach(sub => {
      const option = document.createElement('option');
      option.value = sub;
      option.textContent = sub;
      subcategoriaSelect.appendChild(option);
    });
  }

  filtrarProductos();
}

function filtrarProductos() {
  const categoria = document.getElementById('filterCategoria').value;
  const subcategoria = document.getElementById('filterSubcategoria').value;
  const busqueda = document.getElementById('searchProducto').value.toLowerCase();

  let productosFiltrados = todosLosProductos;

  // Filtrar por categoría
  if (categoria) {
    const categoriaMap = {
      'frutas': 'Frutas y Verduras',
      'carnes': 'Carnes y Pescados',
      'lacteos': 'Lácteos y Huevos',
      'panaderia': 'Panadería',
      'dulces': 'Dulces',
      'limpieza': 'Limpieza y Hogar',
      'mascotas': 'Mascotas',
      'bebidas': 'Bebidas',
      'aseo': 'Aseo Personal'
    };
    const categoriaNombre = categoriaMap[categoria];
    productosFiltrados = productosFiltrados.filter(p => 
      p.categoria && p.categoria.includes(categoriaNombre)
    );
  }

  // Filtrar por subcategoría
  if (subcategoria && subcategoria !== 'General') {
    productosFiltrados = productosFiltrados.filter(p => 
      p.subcategoria && p.subcategoria === subcategoria
    );
  }

  // Filtrar por búsqueda
  if (busqueda) {
    productosFiltrados = productosFiltrados.filter(p => 
      p.nombre.toLowerCase().includes(busqueda) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(busqueda))
    );
  }

  mostrarProductos(productosFiltrados);
}

function mostrarProductos(productos) {
  const tableContainer = document.getElementById('productosTable');
  
  if (productos.length === 0) {
    tableContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <p>No hay productos que coincidan con los filtros</p>
      </div>
    `;
    return;
  }

  tableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Subcategoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${productos.map(p => `
          <tr>
            <td>#${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.categoria || 'Sin categoría'}</td>
            <td>${p.subcategoria || 'General'}</td>
            <td>$${p.precio?.toLocaleString('es-CO')}</td>
            <td>
              ${p.stock < 10 ? '<span class="badge badge-danger">' : '<span class="badge badge-success">'}
              ${p.stock}
              </span>
            </td>
            <td>
              <button class="btn-action btn-edit" onclick="editarProducto(${p.id})">✏️ Editar</button>
              <button class="btn-action btn-delete" onclick="eliminarProducto(${p.id})">🗑️ Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ========================================
// PEDIDOS
// ========================================
async function cargarPedidos() {
  try {
    const response = await fetch(`${API_URL}/api/admin/ventas`, {
      credentials: 'include'
    });

    todosLosPedidos = await response.json();
    mostrarPedidos(todosLosPedidos);

  } catch (error) {
    console.error('Error:', error);
  }
}

function filtrarPedidos() {
  const estado = document.getElementById('filterEstadoPedido').value;
  const fecha = document.getElementById('filterFechaPedido').value;

  let pedidosFiltrados = todosLosPedidos;

  if (estado) {
    pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === estado);
  }

  if (fecha) {
    pedidosFiltrados = pedidosFiltrados.filter(p => {
      const fechaPedido = new Date(p.fecha).toISOString().split('T')[0];
      return fechaPedido === fecha;
    });
  }

  mostrarPedidos(pedidosFiltrados);
}

function mostrarPedidos(pedidos) {
  const tableContainer = document.getElementById('pedidosTable');
  
  if (pedidos.length === 0) {
    tableContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛍️</div>
        <p>No hay pedidos registrados</p>
      </div>
    `;
    return;
  }

  tableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${pedidos.map(p => {
          const estadoBadge = {
            'pendiente': 'badge-warning',
            'preparando': 'badge-info',
            'enviado': 'badge-info',
            'entregado': 'badge-success',
            'cancelado': 'badge-danger'
          };
          
          return `
            <tr>
              <td>#${p.id}</td>
              <td>${p.Cliente?.nombre || 'N/A'}</td>
              <td>$${p.total?.toLocaleString('es-CO')}</td>
              <td>${new Date(p.fecha).toLocaleDateString('es-CO')}</td>
              <td>
                <span class="badge ${estadoBadge[p.estado] || 'badge-info'}">
                  ${p.estado || 'Pendiente'}
                </span>
              </td>
              <td>
                <button class="btn-action btn-view" onclick="verPedido(${p.id})">👁️ Ver</button>
                <button class="btn-action btn-edit" onclick="cambiarEstadoPedido(${p.id})">🔄 Estado</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// ========================================
// INVENTARIO
// ========================================
async function cargarInventario() {
  try {
    const response = await fetch(`${API_URL}/api/admin/productos`, {
      credentials: 'include'
    });

    todosLosProductos = await response.json();
    filtrarInventario();

  } catch (error) {
    console.error('Error:', error);
  }
}

function filtrarInventario() {
  const filtro = document.getElementById('filterInventario').value;
  let productosFiltrados = todosLosProductos;

  if (filtro === 'bajo') {
    productosFiltrados = todosLosProductos.filter(p => p.stock > 0 && p.stock < 10);
  } else if (filtro === 'agotado') {
    productosFiltrados = todosLosProductos.filter(p => p.stock === 0);
  } else if (filtro === 'suficiente') {
    productosFiltrados = todosLosProductos.filter(p => p.stock >= 10);
  }

  mostrarInventario(productosFiltrados);
}

function mostrarInventario(productos) {
  const tableContainer = document.getElementById('inventarioTable');
  
  if (productos.length === 0) {
    tableContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p>No hay productos en este rango de stock</p>
      </div>
    `;
    return;
  }

  tableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Stock Actual</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${productos.map(p => {
          let estado, badge;
          if (p.stock === 0) {
            estado = 'Agotado';
            badge = 'badge-danger';
          } else if (p.stock < 10) {
            estado = 'Stock Bajo';
            badge = 'badge-warning';
          } else {
            estado = 'Suficiente';
            badge = 'badge-success';
          }
          
          return `
            <tr>
              <td>#${p.id}</td>
              <td>${p.nombre}</td>
              <td>${p.categoria || 'N/A'}</td>
              <td><strong>${p.stock}</strong> unidades</td>
              <td><span class="badge ${badge}">${estado}</span></td>
              <td>
                <button class="btn-action btn-edit" onclick="actualizarStock(${p.id}, ${p.stock})">
                  ➕ Actualizar
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// ========================================
// EMPLEADOS
// ========================================
async function cargarEmpleados() {
  try {
    const response = await fetch(`${API_URL}/empleados`, {
      credentials: 'include'
    });

    todosLosEmpleados = await response.json();
    mostrarEmpleados(todosLosEmpleados);

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('empleadosTable').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👔</div>
        <p>No se pudieron cargar los empleados</p>
      </div>
    `;
  }
}

function mostrarEmpleados(empleados) {
  const tableContainer = document.getElementById('empleadosTable');
  
  if (empleados.length === 0) {
    tableContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👔</div>
        <p>No hay empleados registrados</p>
      </div>
    `;
    return;
  }

  tableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Cargo</th>
          <th>Salario</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${empleados.map(e => `
          <tr>
            <td>#${e.id}</td>
            <td>${e.nombre}</td>
            <td>${e.correo}</td>
            <td>${e.cargo}</td>
            <td>$${e.salario?.toLocaleString('es-CO')}</td>
            <td>
              <span class="badge ${e.activo ? 'badge-success' : 'badge-danger'}">
                ${e.activo ? 'Activo' : 'Inactivo'}
              </span>
            </td>
            <td>
              <button class="btn-action btn-edit" onclick="editarEmpleado(${e.id})">✏️ Editar</button>
              <button class="btn-action btn-delete" onclick="eliminarEmpleado(${e.id})">🗑️ Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ========================================
// CLIENTES
// ========================================
async function cargarClientes() {
  try {
    const response = await fetch(`${API_URL}/api/admin/clientes`, {
      credentials: 'include'
    });

    const clientes = await response.json();
    
    const tableContainer = document.getElementById('clientesTable');
    
    if (clientes.length === 0) {
      tableContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <p>No hay clientes registrados</p>
        </div>
      `;
      return;
    }

    tableContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Registrado</th>
          </tr>
        </thead>
        <tbody>
          ${clientes.map(c => `
            <tr>
              <td>#${c.id}</td>
              <td>${c.nombre}</td>
              <td>${c.correo}</td>
              <td>${c.telefono || 'N/A'}</td>
              <td>${new Date(c.created_at).toLocaleDateString('es-CO')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('Error:', error);
  }
}

// ========================================
// MODALES
// ========================================
function abrirModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

function cerrarModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

// ========================================
// ACCIONES PRODUCTOS
// ========================================
async function guardarProducto() {
  const producto = {
    nombre: document.getElementById('productoNombre').value,
    descripcion: document.getElementById('productoDescripcion').value,
    precio: parseFloat(document.getElementById('productoPrecio').value),
    stock: parseInt(document.getElementById('productoStock').value),
    categoria: document.getElementById('productoCategoria').value,
    imagen: document.getElementById('productoImagen').value
  };

  try {
    const response = await fetch(`${API_URL}/api/admin/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(producto)
    });

    if (response.ok) {
      alert('✅ Producto creado exitosamente');
      cerrarModal('modalProducto');
      await cargarProductos();
    } else {
      alert('❌ Error al crear producto');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
}

function editarProducto(id) {
  alert(`Editar producto #${id} - Funcionalidad completa próximamente`);
}

async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;

  try {
    const response = await fetch(`${API_URL}/api/admin/productos/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      alert('✅ Producto eliminado');
      await cargarProductos();
    } else {
      alert('❌ Error al eliminar');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// ========================================
// ACCIONES PEDIDOS
// ========================================
function verPedido(id) {
  alert(`Ver detalles del pedido #${id} - Funcionalidad completa próximamente`);
}

function cambiarEstadoPedido(id) {
  alert(`Cambiar estado del pedido #${id} - Funcionalidad completa próximamente`);
}

// ========================================
// ACCIONES INVENTARIO
// ========================================
function actualizarStock(id, stockActual) {
  const nuevoStock = prompt(`Stock actual: ${stockActual}\nIngresa el nuevo stock:`, stockActual);
  
  if (nuevoStock === null) return;
  
  alert(`Actualizar stock del producto #${id} a ${nuevoStock} - Funcionalidad completa próximamente`);
}

// ========================================
// ACCIONES EMPLEADOS
// ========================================
async function guardarEmpleado() {
  const empleado = {
    nombre: document.getElementById('empleadoNombre').value,
    correo: document.getElementById('empleadoCorreo').value,
    telefono: document.getElementById('empleadoTelefono').value,
    cargo: document.getElementById('empleadoCargo').value,
    salario: parseFloat(document.getElementById('empleadoSalario').value),
    activo: true
  };

  try {
    const response = await fetch(`${API_URL}/empleados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(empleado)
    });

    if (response.ok) {
      alert('✅ Empleado creado exitosamente');
      cerrarModal('modalEmpleado');
      await cargarEmpleados();
    } else {
      alert('❌ Error al crear empleado');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
}

function editarEmpleado(id) {
  alert(`Editar empleado #${id} - Funcionalidad completa próximamente`);
}

async function eliminarEmpleado(id) {
  if (!confirm('¿Estás seguro de eliminar este empleado?')) return;

  try {
    const response = await fetch(`${API_URL}/empleados/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      alert('✅ Empleado eliminado');
      await cargarEmpleados();
    } else {
      alert('❌ Error al eliminar');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// ========================================
// LOGOUT
// ========================================
async function logout() {
  if (!confirm('¿Estás seguro de cerrar sesión?')) return;

  try {
    await fetch(`${API_URL}/auth/admin/logout`, {
      credentials: 'include'
    });

    localStorage.removeItem('admin');
    window.location.href = 'admin-login.html';
  } catch (error) {
    console.error('Error:', error);
  }
}