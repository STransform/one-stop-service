package com.oss2.formservice.repository;

import com.oss2.formservice.model.FormSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormSubmissionRepository extends JpaRepository<FormSubmission, Long> {
    List<FormSubmission> findByFormSchemaId(Long formSchemaId);
    List<FormSubmission> findBySubmittedBy(String submittedBy);
}
