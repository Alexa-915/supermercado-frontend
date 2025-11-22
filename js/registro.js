// frontend/js/registro.js - VERSIÓN MEJORADA CON DIAGNÓSTICO
const form = document.getElementById('form-registro');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 🔹 Capturar valores
  const datos = {
    nombre: form.nombre.value.trim(),
    apellido: form.apellido.value.trim(),
    correo: form.correo.value.trim(),
    contrasena: form.contrasena.value.trim()
  };

  // 🔹 Verificar coincidencia de contraseñas
  const confirmar = document.getElementById('confirmar').value.trim();
  if (datos.contrasena !== confirmar) {
    alert('❌ Las contraseñas no coinciden.');
    return;
  }

  // 🔹 MOSTRAR MENSAJE DE CARGA
  const btnRegistrar = document.querySelector('.btn-registrar');
  const textoOriginal = btnRegistrar.textContent;
  btnRegistrar.textContent = 'Registrando...';
  btnRegistrar.disabled = true;

  try {
    console.log('📤 Enviando datos:', datos);
    
    // 🔹 Conectar al backend
    const resp = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    console.log('📥 Respuesta del servidor:', resp.status);

    const json = await resp.json();
    console.log('📦 Datos recibidos:', json);

    if (!resp.ok) {
      throw new Error(json.error || json.mensaje || 'Error en el registro');
    }

    alert('✅ Registro exitoso. Serás redirigido al inicio de sesión.');
    window.location.href = 'iniciar-sesion.html';

  } catch (err) {
    console.error('❌ Error completo:', err);
    
    // MENSAJES DE ERROR MÁS ESPECÍFICOS
    if (err.message === 'Failed to fetch') {
      alert('⚠️ No se puede conectar al servidor.\n\n' +
            '✓ Verifica que el backend esté corriendo en http://localhost:3001\n' +
            '✓ Ejecuta "npm start" en la terminal del backend\n' +
            '✓ Verifica que no haya errores en la consola del backend');
    } else {
      alert('❌ ' + err.message);
    }
    
    // Restaurar botón
    btnRegistrar.textContent = textoOriginal;
    btnRegistrar.disabled = false;
  }
});