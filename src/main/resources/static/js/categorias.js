document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    document.getElementById('saveCategoryBtn').addEventListener('click', saveCategory);
});

async function loadCategories() {
    try {
        const response = await fetch('http://localhost:8080/api/categorias');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Datos recibidos:", data);
        renderCategories(data);
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        alert("Error al cargar categorías. Ver consola para detalles.");
    }
}

function renderCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    container.innerHTML = '';
    categories.forEach(category => {
        const card = `
            <div>
                <div>
                    <h2>${category.nombre}</h2>
                </div>
                <div>
                    <img src="http://localhost:63342/WebDevelopmentUCB/WebDevelopmentUCB.main/static/uploads/${category.imagenPath}" title="Bombas Centrifugas" alt="${category.nombre}" >
                </div>
            </div>    
        `;
        container.innerHTML += card;
    });
}

async function saveCategory() {
    const formData = new FormData();
    formData.append('nombre', document.getElementById('categoryName').value);
    formData.append('imagen', document.getElementById('categoryImage').files[0]);

    try {
        const response = await fetch('http://localhost:8080/api/categorias', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
        modal.hide();
        document.getElementById('categoryForm').reset();
        loadCategories();
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error al guardar. Ver consola para detalles.");
    }
}