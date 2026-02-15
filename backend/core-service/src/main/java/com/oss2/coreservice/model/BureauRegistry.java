package com.oss2.coreservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Entity
@Table(name = "bureau_registry")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BureauRegistry {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String code;
    private String name;
    private String description;

}
