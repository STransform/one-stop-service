package com.oss2.formservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class FormServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FormServiceApplication.class, args);
    }
}
