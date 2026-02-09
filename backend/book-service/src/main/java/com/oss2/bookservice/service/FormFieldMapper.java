package com.oss2.bookservice.service;

import com.oss2.bookservice.model.Book;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Maps dynamic form data to Book entity
 * Handles field name variations and type conversions
 */
@Component
public class FormFieldMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Maps form submission data to a Book entity
     * Supports multiple field name variations for flexibility
     */
    public Book mapToBook(Map<String, Object> formData) {
        return mapToBook(formData, null);
    }

    /**
     * Maps form submission data to a Book entity using schema definition
     */
    public Book mapToBook(Map<String, Object> formData, String schemaJson) {
        // Log received keys for debugging
        System.out.println("DEBUG: FormFieldMapper received keys: " + formData.keySet());
        
        // Build label-to-ID mapping from schema if provided
        Map<String, String> labelToIdMap = new HashMap<>();
        if (schemaJson != null && !schemaJson.isEmpty()) {
            try {
                JsonNode root = objectMapper.readTree(schemaJson);
                JsonNode fields = root.get("fields");
                if (fields != null && fields.isArray()) {
                    for (JsonNode field : fields) {
                        String id = field.path("id").asText();
                        String label = field.path("label").asText();
                        if (!id.isEmpty() && !label.isEmpty()) {
                            labelToIdMap.put(label.toLowerCase().trim(), id);
                            // Also store normalized version for looser matching
                            labelToIdMap.put(label.toLowerCase().replace(" ", ""), id);
                        }
                    }
                }
                System.out.println("DEBUG: Schema mapping: " + labelToIdMap);
            } catch (Exception e) {
                System.err.println("WARN: Failed to parse schemaJson: " + e.getMessage());
            }
        }
        
        Book book = new Book();
        
        // Map with flexible field names and schema support
        String title = getFieldValue(formData, labelToIdMap, "title", "Title", "Book Title", "Name", "Book Name");
        book.setTitle(title != null && !title.isEmpty() ? title : "Draft Book (from Form)");
        
        String author = getFieldValue(formData, labelToIdMap, "author", "Author", "Author Name", "Writer");
        book.setAuthor(author != null && !author.isEmpty() ? author : "Unknown Author");
        
        String isbn = getFieldValue(formData, labelToIdMap, "isbn", "ISBN", "ISBN Number", "ISBN Code");
        book.setIsbn(isbn != null && !isbn.isEmpty() ? isbn : "N/A");
        
        Double price = getDoubleValue(formData, labelToIdMap, "price", "Price", "Cost", "Amount");
        book.setPrice(price != null ? price : 0.0);
        
        Integer stock = getIntegerValue(formData, labelToIdMap, "stock", "Stock", "Quantity", "Available", "Inventory");
        book.setStock(stock != null ? stock : 0);
        
        return book;
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
            // e.g. mapping "Unit Price" (label) -> "price" (target)
            for (Map.Entry<String, String> entry : labelMap.entrySet()) {
                String label = entry.getKey();
                String id = entry.getValue();
                
                for (String target : possibleNames) {
                    // key is "title", "price" etc. We want to see if label contains it.
                    // But possibleNames includes synonyms like "Cost".
                    // So if label contains "Cost", use it.
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
            return 0.0; // Default instead of null
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("WARN: Invalid number format for field " + java.util.Arrays.toString(possibleNames) + ": " + value + ". Using default 0.0.");
            return 0.0;
        }
    }
    
    private Integer getIntegerValue(Map<String, Object> data, Map<String, String> labelMap, String... possibleNames) {
        String value = getFieldValue(data, labelMap, possibleNames);
        if (value == null || value.isEmpty()) {
            return 0; // Default instead of null
        }
        try {
            return (int) Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("WARN: Invalid number format for field " + java.util.Arrays.toString(possibleNames) + ": " + value + ". Using default 0.");
            return 0;
        }
    }

    /**
     * Validates that a Book entity has all required fields
     * Returns a list of missing field names, or empty list if valid.
     */
    public java.util.List<String> getValidationErrors(Book book) {
        java.util.List<String> missing = new java.util.ArrayList<>();
        
        if (book.getTitle() == null || book.getTitle().isEmpty()) missing.add("title");
        if (book.getAuthor() == null || book.getAuthor().isEmpty()) missing.add("author");
        if (book.getPrice() == null || book.getPrice() <= 0) missing.add("price");
        if (book.getStock() == null || book.getStock() < 0) missing.add("stock");
        
        return missing;
    }

    public boolean isValid(Book book) {
        return getValidationErrors(book).isEmpty();
    }
}
