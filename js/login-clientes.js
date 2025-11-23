const form = document.getElementById('form-login');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      correo: form.correo.value.trim(),
      contrasena: form.contrasena.value.trim()
    };

    if (!datos.correo || !datos.contrasena) {
      alert("⚠️ Por favor completa todos los campos");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      const json = await resp.json();

      if (!resp.ok) throw new Error(json.error || json.message);

      alert(`✅ Bienvenido, ${json.cliente.nombre}`);

      localStorage.setItem("clienteId", json.cliente.id);
      localStorage.setItem("clienteNombre", json.cliente.nombre);

      window.location.href = "inicio-usuarios.html";

    } catch (err) {
      alert("❌ " + err.message);
    }
  });
}
