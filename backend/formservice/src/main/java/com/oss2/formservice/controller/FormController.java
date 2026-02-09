package com.oss2.formservice.controller;
import com.oss2.formservice.model.FormSchema;
import com.oss2.formservice.repository.FormSchemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FormController {
    
    private final FormSchemaRepository formSchemaRepository;
    
    // Create a new form schema
    @PostMapping
    public ResponseEntity<FormSchema> createForm(@RequestBody FormSchema formSchema) {
        formSchema.setCreatedBy("system"); // TODO: Replace with actual user when auth is enabled
        FormSchema saved = formSchemaRepository.save(formSchema);
        return ResponseEntity.ok(saved);
    }
    
    // Get all active forms
    @GetMapping
    public ResponseEntity<List<FormSchema>> getAllForms() {
        return ResponseEntity.ok(formSchemaRepository.findByActiveTrue());
    }
    
    // Get a specific form by ID
    @GetMapping("/{id}")
    public ResponseEntity<FormSchema> getFormById(@PathVariable Long id) {
        return formSchemaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Update a form schema
    @PutMapping("/{id}")
    public ResponseEntity<FormSchema> updateForm(
            @PathVariable Long id,
            @RequestBody FormSchema formSchema) {
        return formSchemaRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(formSchema.getTitle());
                    existing.setSchemaJson(formSchema.getSchemaJson());
                    return ResponseEntity.ok(formSchemaRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete (soft delete) a form
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable Long id) {
        return formSchemaRepository.findById(id)
                .map(form -> {
                    form.setActive(false);
                    formSchemaRepository.save(form);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}