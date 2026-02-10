package com.oss2.orderservice.controller;

import com.oss2.orderservice.client.FormServiceClient;
import com.oss2.orderservice.dto.FormSubmissionDTO;
import com.oss2.orderservice.model.Order;
import com.oss2.orderservice.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final FormServiceClient formServiceClient;

    public OrderController(OrderService orderService, FormServiceClient formServiceClient) {
        this.orderService = orderService;
        this.formServiceClient = formServiceClient;
    }

    @PostMapping
    public Order placeOrder(@RequestBody Order order, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return orderService.placeOrder(order, userId);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/my-orders")
    public List<Order> getMyOrders(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return orderService.getOrdersForUser(userId);
    }

    /**
     * Submit feedback for an order using a dynamic form
     * Example: POST /orders/123/feedback?formId=5
     * Body: {"Delivery Speed": "5", "Product Quality": "5", "Comments": "Great service!"}
     */
    @PostMapping("/{orderId}/feedback")
    public ResponseEntity<FormSubmissionDTO> submitOrderFeedback(
            @PathVariable Long orderId,
            @RequestParam Long formId,
            @RequestBody Map<String, Object> feedbackData,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userId = jwt.getSubject();
        Order order = orderService.getOrderById(orderId);
        
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Verify user owns this order
        if (!order.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        // Add order context to the feedback data
        Map<String, Object> enrichedData = new HashMap<>(feedbackData);
        enrichedData.put("orderId", orderId);
        enrichedData.put("userId", userId);
        enrichedData.put("bookTitle", order.getBookTitle());
        enrichedData.put("orderDate", order.getOrderDate().toString());
        
        // Submit to form service
        FormSubmissionDTO submission = formServiceClient.submitFormData(formId, enrichedData);
        
        return ResponseEntity.ok(submission);
    }
    
    /**
     * Get all feedback for an order
     * Example: GET /orders/123/feedback?formId=5
     */
    @GetMapping("/{orderId}/feedback")
    public ResponseEntity<FormSubmissionDTO[]> getOrderFeedback(
            @PathVariable Long orderId,
            @RequestParam Long formId,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userId = jwt.getSubject();
        Order order = orderService.getOrderById(orderId);
        
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Verify user owns this order
        if (!order.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        FormSubmissionDTO[] submissions = formServiceClient.getFormSubmissions(formId);
        return ResponseEntity.ok(submissions);
    }
}
