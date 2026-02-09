package com.oss2.userservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    @Id
    private String id; // Keycloak User ID

    private String username;
    private String email;
    private String firstName;
    private String lastName;
}
