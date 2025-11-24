// js/mi-cuenta.js - VERSIÓN COMPLETA Y FUNCIONAL

const API_URL = 'http://localhost:3001';
let clienteId = null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 INICIALIZAR AL CARGAR LA PÁGINA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si hay sesión activa
  clienteId = localStorage.getItem('clienteId');
  const clienteNombre = localStorage.getItem('clienteNombre');

  if (!clienteId) {
    alert('⚠️ Debes iniciar sesión para acceder a tu cuenta');
    window.location.href = 'iniciar-sesion.html';
    return;
  }

  // Actualizar saludo en header
  document.getElementById('saludoUsuario').textContent = `Hola, ${clienteNombre}`;

  // Cargar información del usuario
  cargarInformacionUsuario();

  // Inicializar navegación
  inicializarMenuNavegacion();

  // Inicializar formularios
  inicializarFormularios();

  // Cargar pedidos (si existen)
  cargarPedidos();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 NAVEGACIÓN ENTRE SECCIONES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function inicializarMenuNavegacion() {
  const menuItems = document.querySelectorAll('.menu-item:not(.logout)');
  const sections = document.querySelectorAll('.section');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.dataset.section;

      // Actualizar clases activas
      menuItems.forEach(i => i.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(sectionId).classList.add('active');
    });
  });

  // Cerrar sesión
  document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👤 CARGAR INFORMACIÓN DEL USUARIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function cargarInformacionUsuario() {
  try {
    console.log('📡 Cargando información del cliente ID:', clienteId);

    const response = await fetch(`${API_URL}/clientes/${clienteId}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const cliente = await response.json();
    console.log('✅ Cliente cargado:', cliente);

    // Llenar perfil lateral
    document.getElementById('nombreCompleto').textContent = 
      `${cliente.nombre} ${cliente.apellido}`;
    document.getElementById('emailUsuario').textContent = cliente.correo;

    // Llenar formulario de información personal
    document.getElementById('nombre').value = cliente.nombre || '';
    document.getElementById('apellido').value = cliente.apellido || '';
    document.getElementById('correo').value = cliente.correo || '';
    document.getElementById('telefono').value = cliente.telefono || '';
    document.getElementById('documento').value = cliente.documento || '';
    document.getElementById('genero').value = cliente.genero || '';
    document.getElementById('fecha_nacimiento').value = cliente.fecha_nacimiento || '';

  } catch (error) {
    console.error('❌ Error al cargar información:', error);
    mostrarToast('❌ Error al cargar información del usuario', 'error');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📝 INICIALIZAR FORMULARIOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function inicializarFormularios() {
  // ✅ FORMULARIO DE INFORMACIÓN PERSONAL
  document.getElementById('formInformacion').addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      documento: document.getElementById('documento').value.trim(),
      genero: document.getElementById('genero').value,
      fecha_nacimiento: document.getElementById('fecha_nacimiento').value
    };

    console.log('📤 Enviando actualización:', datos);

    try {
      const response = await fetch(`${API_URL}/clientes/${clienteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar');
      }

      const resultado = await response.json();
      console.log('✅ Actualización exitosa:', resultado);

      // Actualizar localStorage
      localStorage.setItem('clienteNombre', datos.nombre);
      document.getElementById('saludoUsuario').textContent = `Hola, ${datos.nombre}`;

      mostrarToast('✅ Información actualizada correctamente');
      cargarInformacionUsuario();

    } catch (error) {
      console.error('❌ Error:', error);
      mostrarToast(`❌ ${error.message}`, 'error');
    }
  });

  // ✅ FORMULARIO DE CAMBIO DE CONTRASEÑA
  document.getElementById('formContrasena').addEventListener('submit', async (e) => {
    e.preventDefault();

    const contrasenaActual = document.getElementById('contrasena_actual').value;
    const nuevaContrasena = document.getElementById('nueva_contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar_contrasena').value;

    // Validar que las contraseñas coincidan
    if (nuevaContrasena !== confirmarContrasena) {
      mostrarToast('❌ Las contraseñas no coinciden', 'error');
      return;
    }

    // Validar longitud mínima
    if (nuevaContrasena.length < 6) {
      mostrarToast('❌ La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/clientes/${clienteId}/cambiar-contrasena`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contrasena_actual: contrasenaActual,
          nueva_contrasena: nuevaContrasena
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cambiar contraseña');
      }

      console.log('✅ Contraseña actualizada');
      mostrarToast('✅ Contraseña actualizada correctamente');
      document.getElementById('formContrasena').reset();

    } catch (error) {
      console.error('❌ Error:', error);
      mostrarToast(`❌ ${error.message}`, 'error');
    }
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 CARGAR PEDIDOS DEL USUARIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function cargarPedidos() {
  try {
    const response = await fetch(`${API_URL}/ventas?cliente_id=${clienteId}`);

    if (!response.ok) {
      throw new Error('Error al cargar pedidos');
    }

    const pedidos = await response.json();
    const container = document.getElementById('listaPedidos');

    if (pedidos.length === 0) {
      container.innerHTML = '<p class="empty-state">No tienes pedidos aún 📦</p>';
      return;
    }

    container.innerHTML = pedidos.map(pedido => `
      <div class="pedido-card">
        <div class="pedido-header">
          <span class="pedido-numero">Pedido #${pedido.id}</span>
          <span class="pedido-estado estado-${pedido.estado || 'pendiente'}">
            ${pedido.estado || 'Pendiente'}
          </span>
        </div>
        <div class="pedido-info">
          <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString('es-CO')}</p>
          <p><strong>Total:</strong> $${formatearPrecio(pedido.total)}</p>
          <p><strong>Método de pago:</strong> ${pedido.metodo_pago || 'N/A'}</p>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('❌ Error al cargar pedidos:', error);
    document.getElementById('listaPedidos').innerHTML = 
      '<p class="empty-state">Error al cargar pedidos ⚠️</p>';
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚪 CERRAR SESIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function cerrarSesion() {
  if (!confirm('¿Estás seguro de cerrar sesión?')) return;

  console.log('🚪 Cerrando sesión...');
  
  localStorage.removeItem('clienteId');
  localStorage.removeItem('clienteNombre');
  
  window.location.href = 'inicio.html';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛠️ UTILIDADES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
}

function mostrarToast(mensaje, tipo = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  toastMessage.textContent = mensaje;
  toast.style.background = tipo === 'error' ? '#d32f2f' : '#2c5e1a';
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}