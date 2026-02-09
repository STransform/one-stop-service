package com.oss2.orderservice.dto;

import lombok.Data;

@Data
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private Double price;
    private Integer stock;
}
