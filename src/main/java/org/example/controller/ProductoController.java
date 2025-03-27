package org.example.controller;

import org.example.model.Producto;
import org.example.repository.CategoriaRepository;
import org.example.repository.ProductoRepository;
import org.example.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/categorias/{categoriaId}/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<Producto> getProductosByCategoria(@PathVariable Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @PostMapping
    public ResponseEntity<Producto> createProducto(
            @PathVariable Long categoriaId,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam String precio,
            @RequestParam MultipartFile imagen) {

        return (ResponseEntity<Producto>) categoriaRepository.findById(categoriaId)
                .map(categoria -> {
                    try {
                        Producto producto = new Producto();
                        producto.setNombre(nombre);
                        producto.setDescripcion(descripcion);
                        producto.setPrecio(precio);
                        producto.setImagenPath(fileStorageService.storeFile(imagen));

                        // ESTABLECER LA RELACIÓN EN AMBOS LADOS
                        producto.setCategoria(categoria); // ← Esto es lo que faltaba
                        categoria.getProductos().add(producto); // ← Mantener consistencia bidireccional

                        return ResponseEntity.ok(productoRepository.save(producto));
                    } catch (IOException e) {
                        return ResponseEntity.internalServerError().build();
                    }
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}