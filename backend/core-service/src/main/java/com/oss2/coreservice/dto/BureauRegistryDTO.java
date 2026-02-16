package com.oss2.coreservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BureauRegistryDTO {
    private String id;
    private String code;
    private String name;
    private String description;
}
