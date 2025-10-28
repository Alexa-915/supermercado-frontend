// frontend/js/login.js
const form = document.getElementById('form-login');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      correo: form.correo.value.trim(),
      contrasena: form.contrasena.value.trim()
    };

    try {
      const resp = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const json = await resp.json();

      if (!resp.ok) {
        throw new Error(json.error || 'Error al iniciar sesión');
      }

      alert(`✅ Bienvenido, ${json.cliente.nombre}`);
      window.location.href = 'index.html';
    } catch (err) {
      alert(' ' + err.message);
      console.error('Error al iniciar sesión:', err);
    }
  });
}
