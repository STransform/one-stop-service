package com.oss2.productservice.service;

import com.oss2.productservice.model.Product;
import com.oss2.productservice.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findByStockLessThan(threshold);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Product existing = getProductById(id);
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setCategory(product.getCategory());
        existing.setBrand(product.getBrand());
        existing.setSku(product.getSku());
        existing.setPrice(product.getPrice());
        existing.setStock(product.getStock());
        existing.setImageUrl(product.getImageUrl());
        existing.setWeight(product.getWeight());
        existing.setDimensions(product.getDimensions());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public void reduceStock(Long id, Integer quantity) {
        Product product = getProductById(id);
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }

    @Transactional
    public void increaseStock(Long id, Integer quantity) {
        Product product = getProductById(id);
        product.setStock(product.getStock() + quantity);
        productRepository.save(product);
    }
}
