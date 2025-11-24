document.addEventListener("DOMContentLoaded", () => {

  // Contenedor donde se mostrará el bloque 
  const panel = document.getElementById("subCategorias");

  // Opciones de subcategorías por categoría
  const datosSubcategorias = {

  frutas: {
    titulo: "🥦 Frutas y Verduras",
    items: [
      "General",
      "Frutas frescas",
      "Verduras frescas",
      "Hierbas y aromáticas",
      "Ensaladas listas",
      "Frutas secas"
    ]
  },

  carnes: {
    titulo: "🥩 Carnes y Pescados",
    items: [
      "General",
      "Carnes frescas",
      "Pollo",
      "Cerdo",
      "Pescados y mariscos",
      "Embutidos",
      "Carnes frías"
    ]
  },

  lacteos: {
    titulo: "🥛 Lácteos y Huevos",
    items: [
      "General",
      "Leche",
      "Queso",
      "Yogurt",
      "Mantequilla",
      "Crema",
      "Huevos"
    ]
  },

  pan: {
    titulo: "🍞 Panadería",
    items: [
      "General",
      "Pan fresco",
      "Ponqués y tortas",
      "Galletas",
      "Pasabocas",
      "Pan tajado"
    ]
  },

  bebidas: {
    titulo: "🧃 Bebidas",
    items: [
      "General",
      "Gaseosas",
      "Jugos",
      "Café e infusiones",
      "Bebidas energéticas",
      "Aguas",
      "Bebidas alcohólicas"
    ]
  },

  dulces: {
    titulo: "🍬 Dulces y Snacks",
    items: [
      "General",
      "Chocolates",
      "Gomas y caramelos",
      "Snacks y papas",
      "Galletas dulces",
      "Postres"
    ]
  },

  aseo: {
    titulo: "🧹 Limpieza y Hogar",
    items: [
      "General",
      "Lavado de ropa",
      "Aseo general",
      "Baño",
      "Cocina",
      "Detergentes",
      "Ambientadores"
    ]
  },

  mascotas: {
    titulo: "🐶 Mascotas",
    items: [
      "General",
      "Perros",
      "Gatos",
      "Snacks",
      "Arena y accesorios"
    ]
  },

  granos: {
    titulo: "🍚 Granos y Empaquetados",
    items: [
      "General",
      "Arroz",
      "Lentejas",
      "Fríjoles",
      "Garbanzos",
      "Maíz",
      "Avena y cereales",
      "Otros empaquetados"
    ]
  },

  hogar: {
    titulo: "🍽 Cocina y Hogar",
    items: [
      "General",
      "Utensilios de cocina",
      "Vajillas",
      "Cubiertos",
      "Organización",
      "Hogar y decoración"
    ]
  }
};



 
  

  // Detectar clic en las opciones del menú
  document.querySelectorAll("#menuCategorias li").forEach(li => {
    li.addEventListener("click", () => {

      const id = li.getAttribute("data-cat");

      // Si aún no hay contenido para esa categoría, salir
      if (!datosSubcategorias[id]) return;

      // Construir el HTML
      const info = datosSubcategorias[id];

      panel.innerHTML = `
        <div class="subcat-box">
          <h2>${info.titulo}</h2>
          <hr>
          <ul>
            ${info.items.map(i => `
  <li>
    <a href="productos/${id}/${i.toLowerCase().replace(/ /g, '-')}.html">
      • ${i}
    </a>
  </li>
`).join("")}
          </ul>
        </div>
      `;

      panel.style.display = "block";
    });
  });

});
