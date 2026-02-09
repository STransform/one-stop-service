package com.oss2.bookservice.client;

import com.oss2.bookservice.dto.FormSchemaDTO;
import com.oss2.bookservice.dto.FormSubmissionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FormServiceClient {
    
    private final RestTemplate restTemplate;
    private static final String FORM_SERVICE_URL = "http://form-service";
    
    /**
     * Get a form schema by ID
     */
    public FormSchemaDTO getForm(Long formId) {
        try {
            return restTemplate.getForObject(
                FORM_SERVICE_URL + "/api/forms/" + formId,
                FormSchemaDTO.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch form from form-service: " + e.getMessage());
        }
    }
    
    /**
     * Submit form data
     */
    public FormSubmissionDTO submitFormData(Long formSchemaId, Map<String, Object> data) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("formSchemaId", formSchemaId);
            requestBody.put("submissionData", data);
            
            return restTemplate.postForObject(
                FORM_SERVICE_URL + "/api/submissions",
                requestBody,
                FormSubmissionDTO.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to submit form data: " + e.getMessage());
        }
    }
    
    /**
     * Get submissions for a specific form
     */
    public FormSubmissionDTO[] getFormSubmissions(Long formSchemaId) {
        try {
            return restTemplate.getForObject(
                FORM_SERVICE_URL + "/api/submissions/form/" + formSchemaId,
                FormSubmissionDTO[].class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch form submissions: " + e.getMessage());
        }
    }
}
