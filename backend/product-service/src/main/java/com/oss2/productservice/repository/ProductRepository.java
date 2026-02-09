package com.oss2.productservice.repository;

import com.oss2.productservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByBrand(String brand);
    List<Product> findByStockLessThan(Integer threshold);
    List<Product> findByNameContainingIgnoreCase(String name);
}
