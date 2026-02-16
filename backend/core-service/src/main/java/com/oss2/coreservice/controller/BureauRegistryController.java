package com.oss2.coreservice.controller;

import com.oss2.coreservice.dto.BureauRegistryDTO;
import com.oss2.coreservice.service.BureauRegistryService;
import com.oss2.common.form.client.FormServiceClient;
import com.oss2.common.form.dto.FormSchemaDTO;
import com.oss2.coreservice.service.BureauFieldMapper;
import com.oss2.coreservice.model.BureauRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bureaus")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend to access
public class BureauRegistryController {

    private final BureauRegistryService bureauRegistryService;
    private final FormServiceClient formServiceClient;
    private final BureauFieldMapper bureauFieldMapper;

    @GetMapping
    public List<BureauRegistryDTO> getAllBureaus() {
        return bureauRegistryService.getAllBureaus();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BureauRegistryDTO> getBureauById(@PathVariable String id) {
        return bureauRegistryService.getBureauById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BureauRegistryDTO createBureau(@RequestBody BureauRegistryDTO bureauDTO) {
        return bureauRegistryService.createBureau(bureauDTO);
    }

    @PostMapping("/from-form")
    public ResponseEntity<?> createBureauFromForm(
            @RequestParam(required = false) Long formId,
            @RequestBody Map<String, Object> formData) {

        try {
            // Check if schema is in payload
            String schemaJson = null;
            if (formData.containsKey("_schemaJson")) {
                schemaJson = formData.get("_schemaJson").toString();
                formData.remove("_schemaJson");
            } else if (formId != null) {
                try {
                    FormSchemaDTO formSchema = formServiceClient.getForm(formId);
                    if (formSchema != null) {
                        schemaJson = formSchema.getSchemaJson();
                    }
                } catch (Exception e) {
                    System.err.println("WARN: Could not fetch form schema: " + e.getMessage());
                }
            }

            // Map to Entity
            BureauRegistry bureau = bureauFieldMapper.mapToBureau(formData, schemaJson);

            // Validate
            java.util.List<String> errors = bureauFieldMapper.getValidationErrors(bureau);
            if (!errors.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields: " + errors));
            }

            BureauRegistryDTO dto = new BureauRegistryDTO();
            dto.setId(bureau.getId()); // Set ID from mapped entity
            dto.setCode(bureau.getCode());
            dto.setName(bureau.getName());
            dto.setDescription(bureau.getDescription());

            BureauRegistryDTO saved;
            if (dto.getId() != null && !dto.getId().isEmpty()) {
                // Update existing bureau
                saved = bureauRegistryService.updateBureau(dto.getId(), dto);
                if (saved == null) {
                    return ResponseEntity.notFound().build();
                }
            } else {
                // Create new bureau
                saved = bureauRegistryService.createBureau(dto);
            }
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to create bureau: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BureauRegistryDTO> updateBureau(@PathVariable String id,
            @RequestBody BureauRegistryDTO bureauDTO) {
        BureauRegistryDTO updated = bureauRegistryService.updateBureau(id, bureauDTO);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBureau(@PathVariable String id) {
        bureauRegistryService.deleteBureau(id);
        return ResponseEntity.noContent().build();
    }
}
