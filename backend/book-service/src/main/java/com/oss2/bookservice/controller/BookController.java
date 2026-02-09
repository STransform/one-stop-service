package com.oss2.bookservice.controller;

import com.oss2.bookservice.client.FormServiceClient;
import com.oss2.bookservice.dto.FormSubmissionDTO;
import com.oss2.bookservice.model.Book;
import com.oss2.bookservice.service.BookService;
import com.oss2.bookservice.service.FormFieldMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private final FormServiceClient formServiceClient;
    private final FormFieldMapper formFieldMapper;

    public BookController(BookService bookService, FormServiceClient formServiceClient, FormFieldMapper formFieldMapper) {
        this.bookService = bookService;
        this.formServiceClient = formServiceClient;
        this.formFieldMapper = formFieldMapper;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Book createBook(@RequestBody Book book) {
        return bookService.createBook(book);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return bookService.updateBook(id, book);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @PutMapping("/{id}/reduce-stock")
    public void reduceStock(@PathVariable Long id, @RequestParam Integer quantity) {
        // ideally secured for internal service usage only
        bookService.reduceStock(id, quantity);
    }


    @PostMapping("/{bookId}/reviews")
    public ResponseEntity<FormSubmissionDTO> submitBookReview(
            @PathVariable Long bookId,
            @RequestParam Long formId,
            @RequestBody Map<String, Object> reviewData) {
        
        Book book = bookService.getBookById(bookId);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Add book context to the review data
        Map<String, Object> enrichedData = new HashMap<>(reviewData);
        enrichedData.put("bookId", bookId);
        enrichedData.put("bookTitle", book.getTitle());
        enrichedData.put("bookAuthor", book.getAuthor());
        
        // Submit to form service
        FormSubmissionDTO submission = formServiceClient.submitFormData(formId, enrichedData);
        
        return ResponseEntity.ok(submission);
    }
    @GetMapping("/{bookId}/reviews")
    public ResponseEntity<FormSubmissionDTO[]> getBookReviews(
            @PathVariable Long bookId,
            @RequestParam Long formId) {
        
        FormSubmissionDTO[] submissions = formServiceClient.getFormSubmissions(formId);
        return ResponseEntity.ok(submissions);
    }
    @PostMapping("/from-form")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBookFromForm(
            @RequestParam Long formId,
            @RequestBody Map<String, Object> formData) {
        
        System.out.println("DEBUG: Entering createBookFromForm with formId: " + formId);
        
        
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
                    com.oss2.bookservice.dto.FormSchemaDTO formSchema = formServiceClient.getForm(formId);
                    if (formSchema != null) {
                        schemaJson = formSchema.getSchemaJson();
                        System.out.println("DEBUG: Fetched schema for form " + formId);
                    }
                } catch (Exception e) {
                    System.err.println("WARN: Could not fetch form schema for formId " + formId + ": " + e.getMessage());
                    // Continue without schema (will use fallback mapping)
                }
            } else {
                System.out.println("DEBUG: Using schema provided in payload");
            }

            // Map form data to Book entity using schema for label lookup
            Book book = formFieldMapper.mapToBook(formData, schemaJson);
            
            // Validate required fields (Optional: We now allow partial data with defaults)
            java.util.List<String> errors = formFieldMapper.getValidationErrors(book);
            if (!errors.isEmpty()) {
                System.out.println("WARN: Missing fields: " + errors + ". Using defaults for Book creation.");
                // We proceed to save even if fields are missing, because FormFieldMapper has applied defaults.
            }
            
            // Save the book
            Book savedBook = bookService.createBook(book);
            
            return ResponseEntity.ok(savedBook);
            
        } catch (IllegalArgumentException e) {
            System.err.println("ERROR: Bad Request in createBookFromForm: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to create book: " + e.getMessage()));
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

