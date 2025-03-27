package org.example.controller;

import org.example.model.Producto;
import org.example.repository.CategoriaRepository;
import org.example.repository.ProductoRepository;
import org.example.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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

                        producto.setCategoria(categoria);
                        categoria.getProductos().add(producto);

                        return ResponseEntity.ok(productoRepository.save(producto));
                    } catch (IOException e) {
                        return ResponseEntity.internalServerError().build();
                    }
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT: Actualizar producto completamente
    @PutMapping("/{productoId}")
    @Transactional
    public ResponseEntity<Producto> updateProducto(
            @PathVariable Long categoriaId,
            @PathVariable Long productoId,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam String precio,
            @RequestParam(required = false) MultipartFile imagen) {

        return (ResponseEntity<Producto>) productoRepository.findByIdAndCategoriaId(productoId, categoriaId)
                .map(producto -> {
                    producto.setNombre(nombre);
                    producto.setDescripcion(descripcion);
                    producto.setPrecio(precio);

                    if (imagen != null && !imagen.isEmpty()) {
                        try {
                            if (producto.getImagenPath() != null) {
                                fileStorageService.deleteFile(producto.getImagenPath());
                            }
                            producto.setImagenPath(fileStorageService.storeFile(imagen));
                        } catch (IOException e) {
                            return ResponseEntity.<Producto>internalServerError().build();
                        }
                    }

                    return ResponseEntity.<Producto>ok(productoRepository.save(producto));
                })
                .orElseGet(() -> ResponseEntity.<Producto>notFound().build());
    }

    @PatchMapping("/{productoId}")
    @Transactional
    public ResponseEntity<Producto> updatePartialProducto(
            @PathVariable Long categoriaId,
            @PathVariable Long productoId,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) String precio) {

        return productoRepository.findByIdAndCategoriaId(productoId, categoriaId)
                .map(producto -> {
                    if (descripcion != null) {
                        producto.setDescripcion(descripcion);
                    }
                    if (precio != null) {
                        producto.setPrecio(precio);
                    }
                    return ResponseEntity.<Producto>ok(productoRepository.save(producto));
                })
                .orElseGet(() -> ResponseEntity.<Producto>notFound().build());
    }

    @DeleteMapping("/{productoId}")
    @Transactional
    public ResponseEntity<Object> deleteProducto(
            @PathVariable Long categoriaId,
            @PathVariable Long productoId) {

        return productoRepository.findByIdAndCategoriaId(productoId, categoriaId)
                .map(producto -> {
                    try {
                        // Eliminar imagen asociada
                        if (producto.getImagenPath() != null) {
                            fileStorageService.deleteFile(producto.getImagenPath());
                        }
                        productoRepository.delete(producto);
                        return ResponseEntity.<Void>ok().build();
                    } catch (IOException e) {
                        return ResponseEntity.<Void>internalServerError().build();
                    }
                })
                .orElseGet(() -> ResponseEntity.<Void>notFound().build());
    }
}