// frontend/js/login.js - VERSIÓN MEJORADA CON DIAGNÓSTICO
const form = document.getElementById('form-login');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      correo: form.correo.value.trim(),
      contrasena: form.contrasena.value.trim()
    };

    // Validación básica
    if (!datos.correo || !datos.contrasena) {
      alert('⚠️ Por favor completa todos los campos');
      return;
    }

    // 🔹 MOSTRAR MENSAJE DE CARGA
    const btnIniciar = document.querySelector('.btn-iniciar');
    const textoOriginal = btnIniciar.textContent;
    btnIniciar.textContent = 'Iniciando sesión...';
    btnIniciar.disabled = true;

    try {
      console.log('📤 Intentando iniciar sesión con:', datos.correo);

      const resp = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      console.log('📥 Respuesta del servidor:', resp.status);

      const json = await resp.json();
      console.log('📦 Datos recibidos:', json);

      if (!resp.ok) {
        throw new Error(json.error || 'Error al iniciar sesión');
      }

      // ✅ LOGIN EXITOSO
      alert(`✅ Bienvenido, ${json.cliente.nombre}!`);
      
      // Guardar datos del usuario (opcional)
      localStorage.setItem('clienteNombre', json.cliente.nombre);
      localStorage.setItem('clienteId', json.cliente.id);
      
      // Redirigir
      window.location.href = 'inicio-usuarios.html';

    } catch (err) {
      console.error('❌ Error completo:', err);

      // MENSAJES DE ERROR MÁS ESPECÍFICOS
      if (err.message === 'Failed to fetch') {
        alert('⚠️ No se puede conectar al servidor.\n\n' +
              '✓ Verifica que el backend esté corriendo en http://localhost:3001\n' +
              '✓ Ejecuta "npm start" en la terminal del backend\n' +
              '✓ Verifica que no haya errores en la consola del backend');
      } else if (err.message === 'Usuario no encontrado') {
        alert('❌ No existe una cuenta con ese correo.\n\n¿Deseas registrarte?');
      } else if (err.message === 'Contraseña incorrecta') {
        alert('❌ La contraseña es incorrecta. Inténtalo de nuevo.');
      } else {
        alert('❌ ' + err.message);
      }

      // Restaurar botón
      btnIniciar.textContent = textoOriginal;
      btnIniciar.disabled = false;
    }
  });
}