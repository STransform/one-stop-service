package com.oss2.userservice.controller;

import com.oss2.userservice.model.UserProfile;
import com.oss2.userservice.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserProfile getMe(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return userService.getUserById(userId);
    }

    @PutMapping("/me")
    public UserProfile updateMe(@AuthenticationPrincipal Jwt jwt) {
        UserProfile profile = new UserProfile();
        profile.setId(jwt.getSubject());
        profile.setUsername(jwt.getClaimAsString("preferred_username"));
        profile.setEmail(jwt.getClaimAsString("email"));
        profile.setFirstName(jwt.getClaimAsString("given_name"));
        profile.setLastName(jwt.getClaimAsString("family_name"));
        
        return userService.syncUser(profile);
    }
}
