package com.oss2.common.form.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

public class FormMappingUtils {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Map<String, String> buildLabelToIdMap(String schemaJson) {
        Map<String, String> labelToIdMap = new HashMap<>();
        if (schemaJson != null && !schemaJson.isEmpty()) {
            try {
                JsonNode root = objectMapper.readTree(schemaJson);
                JsonNode fields = root.get("fields");
                if (fields != null && fields.isArray()) {
                    for (JsonNode field : fields) {
                        String id = field.path("id").asText();
                        String label = field.path("label").asText();
                        if (!id.isEmpty() && !label.isEmpty()) {
                            labelToIdMap.put(label.toLowerCase().trim(), id);
                            labelToIdMap.put(label.toLowerCase().replace(" ", ""), id);
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("WARN: Failed to parse schemaJson: " + e.getMessage());
            }
        }
        return labelToIdMap;
    }

    public static String getFieldValue(Map<String, Object> data, Map<String, String> labelMap, String... possibleNames) {
        // 1. Try exact match first on data keys (fastest)
        for (String name : possibleNames) {
            if (data.containsKey(name)) {
                return toString(data.get(name));
            }
        }

        if (labelMap != null && !labelMap.isEmpty()) {
            // 2. Try looking up the ID via the label map (Exact & Normalized)
            for (String name : possibleNames) {
                String normalizedName = name.toLowerCase().trim();
                String id = labelMap.get(normalizedName);
                if (id == null) {
                    id = labelMap.get(normalizedName.replace(" ", ""));
                }
                
                if (id != null && data.containsKey(id)) {
                    return toString(data.get(id));
                }
            }

            // 3. Fuzzy match:To Check if any label in the schema contains the expected/target keywords
            for (Map.Entry<String, String> entry : labelMap.entrySet()) {
                String label = entry.getKey();
                String id = entry.getValue();
                
                for (String target : possibleNames) {
                    if (label.contains(target.toLowerCase())) {
                         if (data.containsKey(id)) {
                             return toString(data.get(id));
                         }
                    }
                }
            }
        }

        // 4. Try case-insensitive matching and normalized matching on keys (fallback)
        for (String key : data.keySet()) {
            for (String name : possibleNames) {
                // Case-insensitive
                if (key.equalsIgnoreCase(name)) {
                    return toString(data.get(key));
                }
                // Spaceless
                String normalizedKey = key.replace(" ", "").toLowerCase();
                String normalizedName = name.replace(" ", "").toLowerCase();
                
                if (normalizedKey.equals(normalizedName)) {
                     return toString(data.get(key));
                }
            }
        }
        return null;
    }
    
    public static String toString(Object value) {
        return value != null ? value.toString().trim() : null;
    }
    
    public static Double getDoubleValue(Map<String, Object> data, Map<String, String> labelMap, String... possibleNames) {
        String value = getFieldValue(data, labelMap, possibleNames);
        if (value == null || value.isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("WARN: Invalid number format for field " + java.util.Arrays.toString(possibleNames) + ": " + value);
            return null;
        }
    }
    
    public static Integer getIntegerValue(Map<String, Object> data, Map<String, String> labelMap, String... possibleNames) {
        String value = getFieldValue(data, labelMap, possibleNames);
        if (value == null || value.isEmpty()) {
            return null;
        }
        try {
            return (int) Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("WARN: Invalid number format for field " + java.util.Arrays.toString(possibleNames) + ": " + value);
            return null;
        }
    }
}
