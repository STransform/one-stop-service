package com.oss2.formservice.repository;
import com.oss2.formservice.model.FormSchema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface FormSchemaRepository extends JpaRepository<FormSchema, Long> {
    List<FormSchema> findByActiveTrue();
    List<FormSchema> findByCreatedBy(String createdBy);
    Optional<FormSchema> findByContextAndActiveTrue(String context);
}