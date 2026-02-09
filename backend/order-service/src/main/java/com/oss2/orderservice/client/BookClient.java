package com.oss2.orderservice.client;

import com.oss2.orderservice.dto.BookDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "book-service", url = "http://localhost:8082/books")
public interface BookClient {
    
    @GetMapping("/{id}")
    BookDTO getBookById(@PathVariable Long id);

    @PutMapping("/{id}/reduce-stock")
    void reduceStock(@PathVariable Long id, @RequestParam Integer quantity);
}
