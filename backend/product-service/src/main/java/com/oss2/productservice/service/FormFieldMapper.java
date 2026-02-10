package com.oss2.productservice.service;

import com.oss2.productservice.model.Product;

import com.oss2.common.form.util.FormMappingUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Maps dynamic form data to Product entity
 * Handles field name variations and type conversions
 */
@Component
public class FormFieldMapper {


    
    /**
     * Maps form submission data to a Product entity
     * Supports multiple field name variations for flexibility
     */
    public Product mapToProduct(Map<String, Object> formData) {
        return mapToProduct(formData, null);
    }

    /**
     * Maps form submission data to a Product entity using schema definition
     */
    public Product mapToProduct(Map<String, Object> formData, String schemaJson) {
        // Log received keys for debugging
        System.out.println("DEBUG: FormFieldMapper received keys: " + formData.keySet());
        
        // Build label-to-ID mapping from schema if provided
        Map<String, String> labelToIdMap = FormMappingUtils.buildLabelToIdMap(schemaJson);
        
        Product product = new Product();
        
        // Map with flexible field names and schema support
        String name = FormMappingUtils.getFieldValue(formData, labelToIdMap, "name", "Name", "Product Name", "productName", "product_name");
        product.setName(name != null && !name.isEmpty() ? name : "Draft Product (from Form)");
        
        String description = FormMappingUtils.getFieldValue(formData, labelToIdMap, "description", "Description", "Product Description", "productDescription", "product_description", "Details");
        product.setDescription(description != null && !description.isEmpty() ? description : "");
        
        String category = FormMappingUtils.getFieldValue(formData, labelToIdMap, "category", "Category", "Product Category", "productCategory", "product_category", "Type");
        product.setCategory(category != null && !category.isEmpty() ? category : "General");
        
        String brand = FormMappingUtils.getFieldValue(formData, labelToIdMap, "brand", "Brand", "Manufacturer", "brandName", "brand_name");
        product.setBrand(brand != null && !brand.isEmpty() ? brand : "Unknown");
        
        String sku = FormMappingUtils.getFieldValue(formData, labelToIdMap, "sku", "SKU", "Product Code", "productCode", "product_code", "Code");
        product.setSku(sku != null && !sku.isEmpty() ? sku : "N/A");
        
        Double price = FormMappingUtils.getDoubleValue(formData, labelToIdMap, "price", "Price", "Cost", "Amount", "unitPrice", "unit_price");
        product.setPrice(price != null ? price : 0.0);
        
        Integer stock = FormMappingUtils.getIntegerValue(formData, labelToIdMap, "stock", "Stock", "Quantity", "Available", "Inventory", "stockQuantity", "stock_quantity");
        product.setStock(stock != null ? stock : 0);
        
        String imageUrl = FormMappingUtils.getFieldValue(formData, labelToIdMap, "imageUrl", "image_url", "Image URL", "Image", "Picture", "Photo");
        product.setImageUrl(imageUrl);
        
        Double weight = FormMappingUtils.getDoubleValue(formData, labelToIdMap, "weight", "Weight", "productWeight", "product_weight");
        product.setWeight(weight);
        
        String dimensions = FormMappingUtils.getFieldValue(formData, labelToIdMap, "dimensions", "Dimensions", "Size", "productDimensions", "product_dimensions");
        product.setDimensions(dimensions);
        
        return product;
    }
    
    /**
     * Get field value trying multiple possible field names AND schema labels
     */
    private String getFieldValue(Map<String, Object> data, Map<String, String> labelMap, String... possibleNames) {
        // 1. Try exact match first on data keys
        for (String name : possibleNames) {
            if (data.containsKey(name)) {
                return toString(data.get(name));
            }
        }

        if (!labelMap.isEmpty()) {
            // 2. Try looking up the ID via the label map (Exact & Normalized)
            for (String name : possibleNames) {
                String normalizedName = name.toLowerCase().trim();
                String id = labelMap.get(normalizedName);
                if (id == null) {
                    id = labelMap.get(normalizedName.replace(" ", ""));
                }
                
                if (id != null && data.containsKey(id)) {
                    System.out.println("DEBUG: Mapped label '" + name + "' to ID '" + id + "'");
                    return toString(data.get(id));
                }
            }

            // 3. Fuzzy match: Check if any label in the schema *contains* the expected keywords
            for (Map.Entry<String, String> entry : labelMap.entrySet()) {
                String label = entry.getKey();
                String id = entry.getValue();
                
                for (String target : possibleNames) {
                    if (label.contains(target.toLowerCase())) {
                         System.out.println("DEBUG: Fuzzy mapped label '" + label + "' to target '" + target + "' (ID: " + id + ")");
                         if (data.containsKey(id)) {
                             return toString(data.get(id));
                         }
                    }
                }
            }
        }

        // 4. Try case-insensitive matching and normalized matching on keys (fallback)
        for (String key : data.keySet()) {
            for (String name : possibleNames) {
                if (key.equalsIgnoreCase(name)) {
                    return toString(data.get(key));
                }
                
                String normalizedKey = key.replace(" ", "").toLowerCase();
                String normalizedName = name.replace(" ", "").toLowerCase();
                
                if (normalizedKey.equals(normalizedName)) {
                     return toString(data.get(key));
                }
            }
        }
        return null;
    }
    
    private String toString(Object value) {
        return value != null ? value.toString().trim() : null;
    }
    
    private Double getDoubleValue(Map<String, Object> data, Map<String, String> labelMap, String... possibleNames) {
        String value = getFieldValue(data, labelMap, possibleNames);
        if (value == null || value.isEmpty()) {
            return null; // Allow null for optional fields
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("WARN: Invalid number format for field " + java.util.Arrays.toString(possibleNames) + ": " + value + ". Using null.");
            return null;
        }
    }
    
    private Integer getIntegerValue(Map<String, Object> data, Map<String, String> labelMap, String... possibleNames) {
        String value = getFieldValue(data, labelMap, possibleNames);
        if (value == null || value.isEmpty()) {
            return 0; // Default to 0 for stock
        }
        try {
            return (int) Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("WARN: Invalid number format for field " + java.util.Arrays.toString(possibleNames) + ": " + value + ". Using default 0.");
            return 0;
        }
    }

    /**
     * Validates that a Product entity has all required fields
     * Returns a list of missing field names, or empty list if valid.
     */
    public java.util.List<String> getValidationErrors(Product product) {
        java.util.List<String> missing = new java.util.ArrayList<>();
        
        if (product.getName() == null || product.getName().isEmpty()) missing.add("name");
        if (product.getPrice() == null || product.getPrice() <= 0) missing.add("price");
        
        return missing;
    }

    public boolean isValid(Product product) {
        return getValidationErrors(product).isEmpty();
    }
}
