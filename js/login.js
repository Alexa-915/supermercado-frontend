// js/login.js - VERSIÓN CORREGIDA
const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Sistema de login unificado cargado');
  
  const form = document.querySelector('form');
  const btnLogin = form.querySelector('button[type="submit"]');
  const correoInput = document.getElementById('correo') || document.querySelector('input[type="email"]');
  const passwordInput = document.getElementById('contrasena') || document.querySelector('input[type="password"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const correo = correoInput.value.trim();
    const contrasena = passwordInput.value;

    if (!correo || !contrasena) {
      mostrarAlerta('Por favor completa todos los campos', 'error');
      return;
    }

    btnLogin.disabled = true;
    const textoOriginal = btnLogin.textContent;
    btnLogin.textContent = 'Iniciando sesión...';

    try {
      console.log('🔐 Intentando login con:', correo);

      // ✅ PASO 1: Intentar login como CLIENTE
      console.log('👤 Verificando si es cliente...');
      const loginCliente = await intentarLoginCliente(correo, contrasena);
      
      if (loginCliente.exito) {
        console.log('✅ Login exitoso como CLIENTE');
        
        // ✅ GUARDAR CORRECTAMENTE EN LOCALSTORAGE
        const cliente = loginCliente.data.cliente;
        localStorage.setItem('clienteId', cliente.id);
        localStorage.setItem('clienteNombre', cliente.nombre);
        
        console.log('💾 Guardado en localStorage:');
        console.log('   - clienteId:', cliente.id);
        console.log('   - clienteNombre:', cliente.nombre);
        
        mostrarAlerta('¡Bienvenido! Redirigiendo...', 'success');
        
        setTimeout(() => {
          window.location.href = 'inicio-usuarios.html';
        }, 1000);
        return;
      }

      // ✅ PASO 2: Si no es cliente, intentar login como ADMINISTRADOR
      console.log('👨‍💼 Verificando si es administrador...');
      const loginAdmin = await intentarLoginAdmin(correo, contrasena);
      
      if (loginAdmin.exito) {
        console.log('✅ Login exitoso como ADMINISTRADOR');
        mostrarAlerta('¡Bienvenido Administrador! Redirigiendo...', 'success');
        
        setTimeout(() => {
          window.location.href = 'admin-panel.html';
        }, 1000);
        return;
      }

      console.log('❌ Usuario no encontrado en ninguna tabla');
      mostrarAlerta('Correo o contraseña incorrectos', 'error');

    } catch (error) {
      console.error('❌ Error en login:', error);
      mostrarAlerta('Error de conexión. Verifica que el servidor esté corriendo.', 'error');
    } finally {
      btnLogin.disabled = false;
      btnLogin.textContent = textoOriginal;
    }
  });
});

// ========================================
// INTENTAR LOGIN COMO CLIENTE
// ========================================
async function intentarLoginCliente(correo, contrasena) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await response.json();
    console.log('📦 Respuesta del servidor (cliente):', data);

    if (response.ok && data.cliente) {
      // ✅ GUARDAR CORRECTAMENTE EN LOCALSTORAGE
      console.log('💾 Guardando en localStorage:');
      console.log('   - clienteId:', data.cliente.id);
      console.log('   - clienteNombre:', data.cliente.nombre);
      
      localStorage.setItem('clienteId', data.cliente.id.toString());
      localStorage.setItem('clienteNombre', data.cliente.nombre);
      
      // ✅ VERIFICAR QUE SE GUARDÓ
      console.log('✅ Verificación:');
      console.log('   - Guardado clienteId:', localStorage.getItem('clienteId'));
      console.log('   - Guardado clienteNombre:', localStorage.getItem('clienteNombre'));
      
      return { exito: true, data };
    } else {
      return { exito: false, mensaje: data.message };
    }

  } catch (error) {
    console.log('⚠️ Error al intentar login de cliente:', error.message);
    return { exito: false, error };
  }
}


// ========================================
// INTENTAR LOGIN COMO ADMINISTRADOR
// ========================================
async function intentarLoginAdmin(correo, contrasena) {
  try {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('admin', JSON.stringify(data.admin));
      return { exito: true, data };
    } else {
      return { exito: false, mensaje: data.message };
    }

  } catch (error) {
    console.log('⚠️ Error al intentar login de admin:', error.message);
    return { exito: false, error };
  }
}

// ========================================
// MOSTRAR ALERTAS
// ========================================
function mostrarAlerta(mensaje, tipo = 'error') {
  let alertContainer = document.querySelector('.alert-container');
  
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    alertContainer.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      min-width: 300px;
      max-width: 500px;
    `;
    document.body.appendChild(alertContainer);
  }

  const alerta = document.createElement('div');
  alerta.className = `alerta alerta-${tipo}`;
  alerta.style.cssText = `
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideDown 0.3s ease;
    ${tipo === 'error' ? 'background: #fee; color: #c00; border: 2px solid #c00;' : ''}
    ${tipo === 'success' ? 'background: #d4edda; color: #155724; border: 2px solid #28a745;' : ''}
  `;

  const icono = tipo === 'error' ? '❌' : '✅';
  alerta.innerHTML = `<span>${icono}</span><span>${mensaje}</span>`;

  alertContainer.appendChild(alerta);

  setTimeout(() => {
    alerta.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
      alerta.remove();
      if (alertContainer.children.length === 0) {
        alertContainer.remove();
      }
    }, 300);
  }, 5000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

console.log('📋 Endpoints configurados:');
console.log('  👤 Clientes:', `${API_URL}/auth/login`);
console.log('  👨‍💼 Admin:', `${API_URL}/auth/admin/login`);