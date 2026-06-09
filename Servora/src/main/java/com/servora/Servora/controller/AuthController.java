package com.servora.Servora.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servora.Servora.dto.APiResponse;
import com.servora.Servora.dto.AuthRequest;
import com.servora.Servora.dto.AuthResponse;
import com.servora.Servora.dto.UserDto;
import com.servora.Servora.entity.User;
import com.servora.Servora.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<APiResponse<User>> register(@Valid @RequestBody UserDto dto) {
        User user = userService.register(dto);
        return ResponseEntity.ok(new APiResponse<>("User registered successfully", user));

    }

    @PostMapping("/login")
    public ResponseEntity<APiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {

        String token = userService.authenticate(request);
        User user = userService.findByEmail(request.getEmail()).orElseThrow();

        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(token);
        authResponse.setEmail(user.getEmail());
        authResponse.setRole(user.getRole());

        return ResponseEntity.ok(new APiResponse<>("Login successful", authResponse));
    }

    @GetMapping("/users/me")
    public ResponseEntity<APiResponse<User>> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(new APiResponse<>("User details fetched successfully", user));
    }

}
