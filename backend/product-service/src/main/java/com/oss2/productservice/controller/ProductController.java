package com.oss2.productservice.controller;

import com.oss2.common.form.client.FormServiceClient;
import com.oss2.common.form.dto.FormSubmissionDTO;
import com.oss2.productservice.model.Product;
import com.oss2.productservice.service.ProductService;
import com.oss2.productservice.service.FormFieldMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;
    private final FormServiceClient formServiceClient;
    private final FormFieldMapper formFieldMapper;

    public ProductController(ProductService productService, FormServiceClient formServiceClient, FormFieldMapper formFieldMapper) {
        this.productService = productService;
        this.formServiceClient = formServiceClient;
        this.formFieldMapper = formFieldMapper;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/brand/{brand}")
    public List<Product> getProductsByBrand(@PathVariable String brand) {
        return productService.getProductsByBrand(brand);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String q) {
        return productService.searchProducts(q);
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Product> getLowStockProducts(@RequestParam(defaultValue = "5") Integer threshold) {
        return productService.getLowStockProducts(threshold);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}/reduce-stock")
    public void reduceStock(@PathVariable Long id, @RequestParam Integer quantity) {
        // For internal service usage (Order Service)
        productService.reduceStock(id, quantity);
    }

    @PutMapping("/{id}/increase-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public void increaseStock(@PathVariable Long id, @RequestParam Integer quantity) {
        productService.increaseStock(id, quantity);
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<FormSubmissionDTO> submitProductReview(
            @PathVariable Long productId,
            @RequestParam Long formId,
            @RequestBody Map<String, Object> reviewData) {
        
        Product product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Add product context to the review data
        Map<String, Object> enrichedData = new HashMap<>(reviewData);
        enrichedData.put("productId", productId);
        enrichedData.put("productName", product.getName());
        enrichedData.put("productBrand", product.getBrand());
        
        // Submit to form service
        FormSubmissionDTO submission = formServiceClient.submitFormData(formId, enrichedData);
        
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<FormSubmissionDTO[]> getProductReviews(
            @PathVariable Long productId,
            @RequestParam Long formId) {
        
        FormSubmissionDTO[] submissions = formServiceClient.getFormSubmissions(formId);
        return ResponseEntity.ok(submissions);
    }

    @PostMapping("/from-form")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProductFromForm(
            @RequestParam Long formId,
            @RequestBody Map<String, Object> formData) {
        
        System.out.println("DEBUG: Entering createProductFromForm with formId: " + formId);
        
        try {
            // First check if schema was provided in the request body
            String schemaJson = null;
            if (formData.containsKey("_schemaJson")) {
                Object schemaObj = formData.get("_schemaJson");
                if (schemaObj != null) {
                    schemaJson = schemaObj.toString();
                    System.out.println("DEBUG: Using frontend-provided schema");
                }
                // Remove from map to avoid interfering with field mapping
                formData.remove("_schemaJson");
            }
            
            // If not provided, try to fetch from service (fallback)
            if (schemaJson == null || schemaJson.isEmpty()) {
                try {
                    com.oss2.common.form.dto.FormSchemaDTO formSchema = formServiceClient.getForm(formId);
                    if (formSchema != null) {
                        schemaJson = formSchema.getSchemaJson();
                        System.out.println("DEBUG: Fetched schema for form " + formId);
                    }
                } catch (Exception e) {
                    System.err.println("WARN: Could not fetch form schema for formId " + formId + ": " + e.getMessage());
                    // Continue without schema (will use fallback mapping)
                }
            }

            // Map form data to Product entity using schema for label lookup
            Product product = formFieldMapper.mapToProduct(formData, schemaJson);
            
            // Validate required fields
            java.util.List<String> errors = formFieldMapper.getValidationErrors(product);
            if (!errors.isEmpty()) {
                System.out.println("WARN: Missing fields: " + errors + ". Using defaults for Product creation.");
            }
            
            // Save the product
            Product savedProduct = productService.createProduct(product);
            
            return ResponseEntity.ok(savedProduct);
            
        } catch (IllegalArgumentException e) {
            System.err.println("ERROR: Bad Request in createProductFromForm: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to create product: " + e.getMessage()));
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        System.out.println("DEBUG: Global Exception Handler caught: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Server Error: " + e.getMessage()));
    }
}
