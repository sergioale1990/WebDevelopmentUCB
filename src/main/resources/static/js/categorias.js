// document.addEventListener('DOMContentLoaded', function () {
//     loadCategories();
// });
// function loadCategories(){
//     fetch ('http://localhost:8080/api/categorias', {
//         mode:'no-cors',
//         credentials: 'include'
//     }).then(response=> {
//         if (!response.ok) {
//             throw new Error('Error al cargar las categorias');
//         }
//         return response.json();
//     }).then(categories=> {
//         const container = document.getElementById('categoriesContainer');
//         container.innerHTML='';
//         if (categories.length === 0) {
//             container.innerHTML = '<h2>No hay categorias</h2>';
//             return;
//         }
//         categories.forEach(category => {
//             const categoryCard = '<div>\n' +
//                 '                       <div>\n' +
//                 '                           <h2>${category.nombre}</h2>\n' +
//                 '                       </div>\n' +
//                 '                       <div>\n' +
//                 '                           <img src="${category.imagenPath}" title="${category.nombre}" alt="${category.nombre}" >\n' +
//                 '                       </div>\n' +
//                 '                     </div>';
//             container.innerHTML += categoryCard;
//         });
//     })
// }
fetch('http://localhost:8080/api/categorias', {
    mode:"no-cors"
})
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    })
    .catch(error => {
        console.error("Error completo:", error);
        alert("Error al cargar categorías. Ver consola para detalles.");
    });