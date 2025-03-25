document.addEventListener('DOMContentLoaded', function () {
    loadCategories();
});
function loadCategories(){
    fetch ('/api/categorias').then(response=> {
        if (!response.ok) {
            throw new Error('Error al cargar las categorias');
        }
        return response.json();
    }).then(categories=> {
        const container = document.getElementById('categoriesContainer');
        container.innerHTML='';
        if (categories.length == 0) {
            container.innerHTML = '<h2>No hay categorias</h2>';
            return;
        }
        categories.forEach(category => {
            const categoryCard = '<div>\n' +
                '                       <div>\n' +
                '                           <h2>${category.name}</h2>\n' +
                '                       </div>\n' +
                '                       <div>\n' +
                '                           <img src="${category.imagepath}" title="${category.name}" alt="${category.name}" >\n' +
                '                       </div>\n' +
                '                     </div>';
            container.innerHTML += categoryCard;
        });
    })
}