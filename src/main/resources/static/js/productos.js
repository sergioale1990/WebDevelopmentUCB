let currentCategoriaId = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentCategoriaId = urlParams.get('categoriaId');

    if (currentCategoriaId) {
        loadCategoria(currentCategoriaId);
        loadProductos(currentCategoriaId);
        setupEventListeners();
    } else {
        alert("No se especificó categoría");
        window.location.href = "categorias.html";
    }
});

function setupEventListeners() {
    document.getElementById('addProductoBtn').addEventListener('click', () => {
        showProductoModal();
    });

    document.getElementById('saveProductoBtn').addEventListener('click', saveProducto);
}

async function loadCategoria(categoriaId) {
    try {
        const response = await fetch(`http://localhost:8080/api/categorias/${categoriaId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const categoria = await response.json();
        document.getElementById('categoriaNombre').textContent = `Productos de ${categoria.nombre}`;
    } catch (error) {
        console.error("Error cargando categoría:", error);
        alert("Error al cargar categoría");
    }
}

async function loadProductos(categoriaId) {
    try {
        const response = await fetch(`http://localhost:8080/api/categorias/${categoriaId}/productos`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const productos = await response.json();
        renderProductos(productos);
    } catch (error) {
        console.error("Error cargando productos:", error);
        alert("Error al cargar productos");
    }
}

async function createProducto(productoData) {
    try {
        const formData = new FormData();
        formData.append('nombre', productoData.nombre);
        formData.append('descripcion', productoData.descripcion);
        formData.append('precio', productoData.precio);
        formData.append('imagen', productoData.imagen);

        const response = await fetch(`http://localhost:8080/api/categorias/${currentCategoriaId}/productos`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const nuevoProducto = await response.json();
        loadProductos(currentCategoriaId); // Recargar lista
        return nuevoProducto;
    } catch (error) {
        console.error("Error creando producto:", error);
        throw error;
    }
}

async function updateProducto(productoId, productoData) {
    try {
        const formData = new FormData();
        formData.append('nombre', productoData.nombre);
        formData.append('descripcion', productoData.descripcion);
        formData.append('precio', productoData.precio);

        if (productoData.imagen) {
            formData.append('imagen', productoData.imagen);
        }

        const response = await fetch(`http://localhost:8080/api/categorias/${currentCategoriaId}/productos/${productoId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const productoActualizado = await response.json();
        loadProductos(currentCategoriaId); // Recargar lista
        return productoActualizado;
    } catch (error) {
        console.error("Error actualizando producto:", error);
        throw error;
    }
}

async function updatePartialProducto(productoId, { descripcion, precio }) {
    try {
        const response = await fetch(`http://localhost:8080/api/categorias/${currentCategoriaId}/productos/${productoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descripcion, precio })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const productoActualizado = await response.json();
        loadProductos(currentCategoriaId); // Recargar lista
        return productoActualizado;
    } catch (error) {
        console.error("Error actualizando parcialmente producto:", error);
        throw error;
    }
}

async function deleteProducto(productoId) {
    try {
        const response = await fetch(`http://localhost:8080/api/categorias/${currentCategoriaId}/productos/${productoId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        loadProductos(currentCategoriaId); // Recargar lista
        return true;
    } catch (error) {
        console.error("Error eliminando producto:", error);
        throw error;
    }
}

function renderProductos(productos) {
    const container = document.getElementById('productosContainer');
    container.innerHTML = '';

    productos.forEach(producto => {
        const card = `
                <div class="card producto-card">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <div class="producto-img-container">
                        <img src="http://localhost:63342/WebDevelopmentUCB/WebDevelopmentUCB.main/static/uploads/${producto.imagenPath}" class="card-img-top" alt="${producto.nombre}">
                    </div>
                    <div class="card-body">
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="card-text"><strong>$${producto.precio}</strong></p>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-warning edit-producto-btn" data-id="${producto.id}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-danger delete-producto-btn" data-id="${producto.id}">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                            <button class="btn btn-sm btn-info quick-edit-btn" data-id="${producto.id}">
                                <i class="fas fa-pencil-alt"></i> Edición Rápida
                            </button>
                        </div>
                    </div>
                </div>
        `;
        container.innerHTML += card;
    });

    document.querySelectorAll('.edit-producto-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productoId = btn.dataset.id;
            showEditModal(productoId);
        });
    });

    document.querySelectorAll('.delete-producto-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const productoId = btn.dataset.id;
            if (confirm("¿Estás seguro de eliminar este producto?")) {
                await deleteProducto(productoId);
            }
        });
    });

    document.querySelectorAll('.quick-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productoId = btn.dataset.id;
            showQuickEditModal(productoId);
        });
    });
}

function showProductoModal(producto = null) {
    const modal = new bootstrap.Modal(document.getElementById('productoModal'));

    if (producto) {
        document.getElementById('productoId').value = producto.id;
        document.getElementById('productoName').value = producto.nombre;
        document.getElementById('productoDescripcion').value = producto.descripcion;
        document.getElementById('productoPrice').value = producto.precio;
        document.getElementById('modalTitle').textContent = "Editar Producto";
    } else {
        document.getElementById('productoForm').reset();
        document.getElementById('modalTitle').textContent = "Nuevo Producto";
    }

    modal.show();
}

async function saveProducto() {
    const form = document.getElementById('productoForm');
    if (!form) {
        alert("Error: Formulario no encontrado");
        return;
    }

    try {
        const productoId = form.productoId?.value || null; // Opcional para creación
        const nombre = form.productoName.value;
        const descripcion = form.productoDescripcion.value;
        const precio = form.productoPrice.value;
        const imagen = form.productoImage.files[0];

        if (!nombre || !descripcion || isNaN(precio) || !imagen) {
            throw new Error("Por favor complete todos los campos");
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('imagen', imagen);

        const url = productoId
            ? `http://localhost:8080/api/categorias/${currentCategoriaId}/productos/${productoId}`
            : `http://localhost:8080/api/categorias/${currentCategoriaId}/productos`;

        const method = productoId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error en la solicitud");
        }

        bootstrap.Modal.getInstance(document.getElementById('productoModal')).hide();
        loadProductos(currentCategoriaId);

    } catch (error) {
        console.error("Error al guardar producto:", error);
        alert(error.message || "Error al guardar producto");
    }
}