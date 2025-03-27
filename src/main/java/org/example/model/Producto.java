package org.example.model;

import javax.persistence.*;

@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String Nombre;
    private String Descripcion;
    private String Precio;
    private String imagenPath;

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
    public String getNombre() {return Nombre;}
    public void setNombre(String Nombre) {this.Nombre = Nombre;}
    public String getDescripcion() {return Descripcion;}
    public void setDescripcion(String Descripcion) {this.Descripcion = Descripcion;}
    public String getPrecio() {return Precio;}
    public void setPrecio(String Precio) {this.Precio = Precio;}
    public String getImagenPath() {return imagenPath;}
    public void setImagenPath(String imagenPath) {this.imagenPath = imagenPath;}

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}
