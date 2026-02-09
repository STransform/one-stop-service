package com.oss2.formservice.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Table(name = "form_submissions")
@Data
public class FormSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long formSchemaId;
    
    @Column(columnDefinition = "TEXT")
    private String submissionData;  // Store the submitted form data as JSON
    
    private String submittedBy;
    
    private LocalDateTime submittedAt;
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}