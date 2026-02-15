package com.oss2.coreservice.repository;

import com.oss2.coreservice.model.BureauRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BureauRegistryRepository extends JpaRepository<BureauRegistry, String> {
    boolean existsByCode(String code);
}
