package org.example.controller;


import org.example.model.Categoria;
import org.example.repository.CategoriaRepository;
import org.example.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
}