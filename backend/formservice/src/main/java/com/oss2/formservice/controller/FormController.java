package com.oss2.formservice.controller;
import com.oss2.formservice.model.FormSchema;
import com.oss2.formservice.repository.FormSchemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FormController {
    
    private final FormSchemaRepository formSchemaRepository;
    
    // Create or update form schema (UPSERT logic for singleton pattern)
    @PostMapping
    public ResponseEntity<FormSchema> createOrUpdateForm(@RequestBody FormSchema formSchema) {
        // Check if form with this context already exists
        Optional<FormSchema> existing = formSchemaRepository.findByContextAndActiveTrue(formSchema.getContext());
        
        if (existing.isPresent()) {
            // Update existing form (singleton pattern)
            FormSchema existingForm = existing.get();
            existingForm.setTitle(formSchema.getTitle());
            existingForm.setSchemaJson(formSchema.getSchemaJson());
            FormSchema saved = formSchemaRepository.save(existingForm);
            return ResponseEntity.ok(saved);
        } else {
            // Create new form
            formSchema.setCreatedBy("system"); // TODO: Replace with actual user when auth is enabled
            FormSchema saved = formSchemaRepository.save(formSchema);
            return ResponseEntity.ok(saved);
        }
    }
    
    // Get all active forms, optionally filtered by context
    @GetMapping
    public ResponseEntity<List<FormSchema>> getAllForms(@RequestParam(required = false) String context) {
        if (context != null && !context.isEmpty()) {
            return formSchemaRepository.findByContextAndActiveTrue(context)
                    .map(form -> ResponseEntity.ok(List.of(form)))
                    .orElse(ResponseEntity.ok(List.of()));
        }
        return ResponseEntity.ok(formSchemaRepository.findByActiveTrue());
    }
    
    // Get form by context (singleton pattern - returns single form)
    @GetMapping("/by-context/{context}")
    public ResponseEntity<FormSchema> getFormByContext(@PathVariable String context) {
        return formSchemaRepository.findByContextAndActiveTrue(context)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
                    existing.setContext(formSchema.getContext());
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