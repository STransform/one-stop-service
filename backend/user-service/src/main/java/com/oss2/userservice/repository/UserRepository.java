package com.oss2.userservice.repository;

import com.oss2.userservice.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserProfile, String> {
}
