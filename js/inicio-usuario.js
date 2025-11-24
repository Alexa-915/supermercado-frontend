// js/inicio-usuarios.js
// Script para mostrar el nombre del usuario logueado

document.addEventListener("DOMContentLoaded", () => {
  console.log('🔍 Verificando sesión de usuario...');
  
  // Obtener datos del localStorage
  const clienteId = localStorage.getItem("clienteId");
  const clienteNombre = localStorage.getItem("clienteNombre");
  
  console.log('📦 Datos en localStorage:');
  console.log('   - clienteId:', clienteId);
  console.log('   - clienteNombre:', clienteNombre);

  const saludoElement = document.getElementById("saludoUsuario");
  const loginElement = document.querySelector(".login a");

  // Si hay sesión activa, mostrar nombre
  if (clienteId && clienteNombre) {
    console.log('✅ Sesión activa detectada');
    
    if (saludoElement) {
      saludoElement.textContent = `¡Hola, ${clienteNombre}!`;
      console.log('✅ Nombre actualizado en header:', clienteNombre);
    }
    
    if (loginElement) {
      loginElement.textContent = 'Mi cuenta';
      loginElement.href = 'mi-cuenta.html';
    }
  } else {
    console.log('⚠️ No hay sesión activa');
    
    // Si no hay sesión, preguntar si quiere iniciar sesión
    if (confirm('No has iniciado sesión. ¿Quieres ir a la página de login?')) {
      window.location.href = 'iniciar-sesion.html';
    } else {
      window.location.href = 'inicio.html';
    }
  }
});