// frontend/js/registro.js
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
    alert(' Las contraseñas no coinciden.');
    return;
  }

  try {
    // 🔹 Conectar al backend (usa la ruta de autenticación)
    const resp = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const json = await resp.json();

    if (!resp.ok) {
      throw new Error(json.error || json.mensaje || 'Error en el registro');
    }

    alert(' Registro exitoso. Serás redirigido al inicio de sesión.');
    window.location.href = 'iniciar-sesion.html';
  } catch (err) {
    alert(' ' + err.message);
    console.error('Error en el registro:', err);
  }
});
