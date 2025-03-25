package org.example.controller;


import org.example.model.Categoria;
import org.example.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long id) {
        Optional<Categoria> categoria = categoriaRepository.findById(id);
        return categoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
