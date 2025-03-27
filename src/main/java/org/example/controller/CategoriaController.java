package org.example.controller;


import org.example.model.Categoria;
import org.example.repository.CategoriaRepository;
import org.example.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long id) {
        return categoriaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categoria> createCategoria(
            @RequestParam String nombre,
            @RequestParam MultipartFile imagen) {

        try {
            String imagenPath = fileStorageService.storeFile(imagen);
            Categoria categoria = new Categoria();
            categoria.setNombre(nombre);
            categoria.setImagenPath(imagenPath);

            return ResponseEntity.ok(categoriaRepository.save(categoria));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(
            @PathVariable Long id,
            @RequestParam String nombre,
            @RequestParam(required = false) MultipartFile imagen) {

        return (ResponseEntity<Categoria>) categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNombre(nombre);

                    if (imagen != null && !imagen.isEmpty()) {
                        try {
                            String nuevaImagenPath = fileStorageService.storeFile(imagen);
                            categoria.setImagenPath(nuevaImagenPath);
                        } catch (IOException e) {
                            return ResponseEntity.internalServerError().build();
                        }
                    }

                    return ResponseEntity.ok(categoriaRepository.save(categoria));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Categoria> updatePartialCategoria(
            @PathVariable Long id,
            @RequestParam String nombre) {

        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNombre(nombre);
                    return ResponseEntity.ok(categoriaRepository.save(categoria));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategoria(@PathVariable Long id) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    try{
                        Path imagenPath = Paths.get("src/main/resources/static/uploads/" + categoria.getImagenPath());
                        System.out.println(imagenPath);
                        Files.deleteIfExists(imagenPath);
                        categoriaRepository.delete(categoria);
                        return ResponseEntity.ok().build();
                    } catch (IOException e) {
                        return ResponseEntity.internalServerError().body("Error al eliminar Categoria");
                    }
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
