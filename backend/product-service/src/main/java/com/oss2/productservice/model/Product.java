package com.oss2.productservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(length = 1000)
    private String description;
    
    private String category;
    private String brand;
    private String sku;
    private Double price;
    private Integer stock;
    private String imageUrl;
    private Double weight;
    private String dimensions;
}
