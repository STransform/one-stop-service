package com.oss2.coreservice.service;

import com.oss2.coreservice.model.BureauRegistry;
import com.oss2.coreservice.repository.BureauRegistryRepository;
import com.oss2.coreservice.dto.BureauRegistryDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@org.springframework.transaction.annotation.Transactional
public class BureauRegistryService {

    private final BureauRegistryRepository repository;

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<BureauRegistryDTO> getAllBureaus() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public java.util.Optional<BureauRegistryDTO> getBureauById(String id) {
        return repository.findById(id)
                .map(this::mapToDTO);
    }

    public BureauRegistryDTO createBureau(BureauRegistryDTO dto) {
        if (dto.getId() == null) {
            dto.setId(UUID.randomUUID().toString());
        }
        BureauRegistry entity = mapToEntity(dto);
        return mapToDTO(repository.save(entity));
    }

    public BureauRegistryDTO updateBureau(String id, BureauRegistryDTO dto) {
        if (repository.existsById(id)) {
            dto.setId(id);
            BureauRegistry entity = mapToEntity(dto);
            return mapToDTO(repository.save(entity));
        }
        return null;
    }

    public void deleteBureau(String id) {
        repository.deleteById(id);
    }

    private BureauRegistryDTO mapToDTO(BureauRegistry entity) {
        BureauRegistryDTO dto = new BureauRegistryDTO();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private BureauRegistry mapToEntity(BureauRegistryDTO dto) {
        BureauRegistry entity = new BureauRegistry();
        entity.setId(dto.getId());
        entity.setCode(dto.getCode());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
