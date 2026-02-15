package com.oss2.coreservice.service;

import com.oss2.coreservice.model.BureauRegistry;
import com.oss2.common.form.util.FormMappingUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class BureauFieldMapper {

    public BureauRegistry mapToBureau(Map<String, Object> formData) {
        return mapToBureau(formData, null);
    }

    public BureauRegistry mapToBureau(Map<String, Object> formData, String schemaJson) {
        // Build label-to-ID mapping from schema if provided
        Map<String, String> labelToIdMap = FormMappingUtils.buildLabelToIdMap(schemaJson);

        BureauRegistry bureau = new BureauRegistry();

        // 1. Map Name
        // Flexible mapping: "name", "Bureau Name", "Name of Bureau", "Sector Name"
        String name = FormMappingUtils.getFieldValue(formData, labelToIdMap,
                "name", "Bureau Name", "Name", "Sector Name", "Bureau");
        bureau.setName(name != null ? name : "Draft Bureau");

        // 2. Map Code
        // Flexible mapping: "code", "Bureau Code", "Code", "Abbreviation"
        String code = FormMappingUtils.getFieldValue(formData, labelToIdMap,
                "code", "Bureau Code", "Code", "Abbreviation", "Short Code");
        // If code is missing, we might generate one or let validation fail.
        // For now, set it if found.
        if (code != null) {
            bureau.setCode(code.toUpperCase());
        }

        // 3. Map Description
        // Flexible mapping: "description", "details", "about"
        String description = FormMappingUtils.getFieldValue(formData, labelToIdMap,
                "description", "Description", "Details", "About");
        bureau.setDescription(description);

        return bureau;
    }

    public List<String> getValidationErrors(BureauRegistry bureau) {
        List<String> missing = new ArrayList<>();

        if (bureau.getName() == null || bureau.getName().isEmpty() || "Draft Bureau".equals(bureau.getName())) {
            // If we want strict validation
            // missing.add("name");
        }

        if (bureau.getCode() == null || bureau.getCode().isEmpty()) {
            missing.add("code");
        }

        return missing;
    }
}
