package com.questlearn.controller;

import com.questlearn.dto.AuthResponse;
import com.questlearn.dto.LoginRequest;
import com.questlearn.dto.RegisterRequest;
import com.questlearn.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Body: { email, displayName, password }
     * Returns: AuthResponse with JWT + user profile
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     * Returns: AuthResponse with JWT + user profile
     * Throws: 401 if credentials are wrong
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
