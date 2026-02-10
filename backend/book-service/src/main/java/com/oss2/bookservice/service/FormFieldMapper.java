package com.oss2.bookservice.service;

import com.oss2.bookservice.model.Book;

import com.oss2.common.form.util.FormMappingUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Maps dynamic form data to Book entity
 * Handles field name variations and type conversions
 */
@Component
public class FormFieldMapper {


    
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
        Map<String, String> labelToIdMap = FormMappingUtils.buildLabelToIdMap(schemaJson);
        
        Book book = new Book();
        
        // Map with flexible field names and schema support
        String title = FormMappingUtils.getFieldValue(formData, labelToIdMap, "title", "Title", "Book Title", "Name", "Book Name");
        book.setTitle(title != null && !title.isEmpty() ? title : "Draft Book (from Form)");
        
        String author = FormMappingUtils.getFieldValue(formData, labelToIdMap, "author", "Author", "Author Name", "Writer");
        book.setAuthor(author != null && !author.isEmpty() ? author : "Unknown Author");
        
        String isbn = FormMappingUtils.getFieldValue(formData, labelToIdMap, "isbn", "ISBN", "ISBN Number", "ISBN Code");
        book.setIsbn(isbn != null && !isbn.isEmpty() ? isbn : "N/A");
        
        Double price = FormMappingUtils.getDoubleValue(formData, labelToIdMap, "price", "Price", "Cost", "Amount");
        book.setPrice(price != null ? price : 0.0);
        
        Integer stock = FormMappingUtils.getIntegerValue(formData, labelToIdMap, "stock", "Stock", "Quantity", "Available", "Inventory");
        book.setStock(stock != null ? stock : 0);
        
        return book;
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
