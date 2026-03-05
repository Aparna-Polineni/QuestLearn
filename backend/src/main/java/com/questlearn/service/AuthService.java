package com.questlearn.service;

import com.questlearn.dto.*;
import com.questlearn.entity.User;
import com.questlearn.repository.UserRepository;
import com.questlearn.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository      userRepository;
    private final PasswordEncoder     passwordEncoder;
    private final JwtService          jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Register a new user.
     * 1. Check email is not already taken
     * 2. Hash the password with BCrypt
     * 3. Save user to PostgreSQL
     * 4. Return a JWT so the user is immediately logged in
     */
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(req.getEmail())
                .displayName(req.getDisplayName())
                .password(passwordEncoder.encode(req.getPassword()))
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return buildAuthResponse(token, user);
    }

    /**
     * Log in an existing user.
     * AuthenticationManager calls our UserDetailsService + BCrypt comparison.
     * If credentials are wrong it throws BadCredentialsException → 401.
     */
    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Update last active timestamp
        user.setLastActiveAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return buildAuthResponse(token, user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .careerPath(user.getCareerPath())
                .domainName(user.getDomainName())
                .domainColor(user.getDomainColor())
                .totalXp(user.getTotalXp())
                .currentStage(user.getCurrentStage())
                .build();
    }
}
