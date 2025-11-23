const form = document.getElementById('form-login-admin');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      correo: form.correo.value.trim(),
      contrasena: form.contrasena.value.trim()
    };

    if (!datos.correo || !datos.contrasena) {
      alert("⚠️ Completa todos los campos");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3001/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      const json = await resp.json();

      if (!resp.ok) throw new Error(json.error || json.message);

      alert(`👨‍💼 Bienvenido Admin: ${json.admin.nombre}`);

      localStorage.setItem("adminId", json.admin.id);
      localStorage.setItem("adminNombre", json.admin.nombre);
      localStorage.setItem("adminRol", json.admin.rol);

      window.location.href = "inicio-admin.html";

    } catch (err) {
      alert("❌ " + err.message);
    }
  });
}