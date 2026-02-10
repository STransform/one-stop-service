package com.oss2.formservice.controller;
import com.oss2.formservice.model.FormSubmission;
import com.oss2.formservice.repository.FormSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {
    
    private final FormSubmissionRepository submissionRepository;
    
    @PostMapping
    public ResponseEntity<FormSubmission> submitForm(
            @RequestBody FormSubmission submission,
            Authentication authentication) {
        submission.setSubmittedBy(authentication.getName());
        FormSubmission saved = submissionRepository.save(submission);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/form/{formSchemaId}")
    public ResponseEntity<List<FormSubmission>> getSubmissionsByForm(
            @PathVariable Long formSchemaId) {
        return ResponseEntity.ok(
            submissionRepository.findByFormSchemaId(formSchemaId)
        );
    }
}