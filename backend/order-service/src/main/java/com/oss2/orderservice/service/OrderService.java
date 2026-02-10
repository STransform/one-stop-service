package com.oss2.orderservice.service;

import com.oss2.orderservice.client.BookClient;
import com.oss2.orderservice.dto.BookDTO;
import com.oss2.orderservice.model.Order;
import com.oss2.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookClient bookClient;

    public OrderService(OrderRepository orderRepository, BookClient bookClient) {
        this.orderRepository = orderRepository;
        this.bookClient = bookClient;
    }

    @Transactional
    public Order placeOrder(Order order, String userId) {
        // Fetch book details first
        BookDTO book = bookClient.getBookById(order.getBookId());

        // Snapshot data
        order.setBookTitle(book.getTitle());
        order.setBookAuthor(book.getAuthor());
        order.setBookPrice(book.getPrice());

        // Call Book Service to reduce stock (will throw if insufficient)
        bookClient.reduceStock(order.getBookId(), order.getQuantity());

        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("CONFIRMED");
        return orderRepository.save(order);
    }

    public List<Order> getOrdersForUser(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
