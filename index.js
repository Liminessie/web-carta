async function cargarCarta() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Liminessie/web-carta/main/carta.xml');
        
        if (!response.ok) {
            throw new Error(`Error al cargar el XML: ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const menuContainer = document.querySelector(".menu-container");
        menuContainer.innerHTML = ''; 

        // Getting all the "grup"'s
        const grupos = xmlDoc.getElementsByTagName("grup");
        
        Array.from(grupos).forEach(grup => {
            let currentCategory = ""; // Categoría

            Array.from(grup.childNodes).forEach(node => {
                if (node.nodeName === "categoria") {
                    // Si el nodo es una categoría, actualiza la categoría actual y muestra un encabezado
                    currentCategory = node.textContent;
                    const categoryHTML = `<h2 class="category-title">${currentCategory}</h2>`;
                    menuContainer.insertAdjacentHTML('beforeend', categoryHTML);
                } else if (node.nodeName === "plat") {
                    // Si el nodo es un platillo, obtén sus detalles
                    const imagen = node.getElementsByTagName("img")[0]?.textContent || 'img/default-dish.jpg'; // Imagen predeterminada si falta
                    const nombre = node.getElementsByTagName("nom")[0]?.textContent || '';
                    const descripcion = node.getElementsByTagName("descripcio")[0]?.textContent || '';
                    const precio = node.getElementsByTagName("preu")[0]?.textContent || '';

                    // Creating HTML version
                    const platilloHTML = `
                        <div class="menu-item">
                            <img src="${imagen}" alt="${nombre}">
                            <div class="menu-item-content">
                                <h3>${nombre}</h3>
                                <p>${descripcion}</p>
                                <div class="price">${precio}</div>
                            </div>
                        </div>
                    `;
                    
                    // Inserting in the container
                    menuContainer.insertAdjacentHTML('beforeend', platilloHTML);
                }
            });
        });
    } catch (error) {
        console.error("Error al cargar la carta:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarCarta);
