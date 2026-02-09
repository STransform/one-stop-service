package com.oss2.orderservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_orders") // 'order' is a reserved keyword in SQL
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookId;
    private Integer quantity;
    private String bookTitle;
    private String bookAuthor;
    private Double bookPrice;

    private String userId; // From Keycloak Token Subject
    private LocalDateTime orderDate;
    private String status; // PENDING, CONFIRMED
}
