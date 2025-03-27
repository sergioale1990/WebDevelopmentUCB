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
            <div class="category-card">
                    <h2>${category.nombre}</h2>
                <div class="category-img-container">
                    <img src="http://localhost:63342/WebDevelopmentUCB/WebDevelopmentUCB.main/static/uploads/${category.imagenPath}" title="${category.nombre}" alt="${category.nombre}">
                </div>
                <div class="category-actions">
                <button class="btn btn-sm btn-warning edit-btn" data-id="${category.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${category.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
                </div>
                <a href="productos.html?categoriaId=${category.id}" class="btn btn-info mt-2">
                <i class="fas fa-box-open"></i> Ver Productos
            </a>
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

async function updateCategoria(id, nombre, imagenFile) {
    const formData = new FormData();
    formData.append('nombre', nombre);
    if (imagenFile) formData.append('imagen', imagenFile);

    try {
        const response = await fetch(`http://localhost:8080/api/categorias/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        loadCategories();
    } catch (error) {
        console.error("Error al actualizar:", error);
    }
}

async function updatePartialCategoria(id, nombre) {
    try {
        const response = await fetch(`http://localhost:8080/api/categorias/${id}?nombre=${encodeURIComponent(nombre)}`, {
            method: 'PATCH'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        loadCategories();
    } catch (error) {
        console.error("Error al actualizar parcialmente:", error);
    }
}

async function deleteCategoria(id) {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
        const response = await fetch(`http://localhost:8080/api/categorias/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        loadCategories();
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

document.addEventListener('click', async (e) => {
    if (e.target.closest('.edit-btn')) {
        const id = e.target.closest('.edit-btn').dataset.id;
        const nuevoNombre = prompt("Nuevo nombre:");
        if (nuevoNombre) {
            await updatePartialCategoria(id, nuevoNombre);
        }
    }
    if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('.delete-btn').dataset.id;
            await deleteCategoria(id);
        }
    });