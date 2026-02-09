package com.oss2.userservice.service;

import com.oss2.userservice.model.UserProfile;
import com.oss2.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfile syncUser(UserProfile userProfile) {
        return userRepository.save(userProfile);
    }

    public UserProfile getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
