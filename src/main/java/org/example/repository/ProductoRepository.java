package org.example.repository;

import org.example.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @Query("SELECT p FROM Producto p WHERE p.id = :productoId AND p.categoria.id = :categoriaId")
    Optional<Producto> findByIdAndCategoriaId(
            @Param("productoId") Long productoId,
            @Param("categoriaId") Long categoriaId);

    List<Producto> findByCategoriaId(Long categoriaId);
}