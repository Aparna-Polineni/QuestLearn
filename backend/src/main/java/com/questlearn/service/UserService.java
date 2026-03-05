package com.questlearn.service;

import com.questlearn.dto.AuthResponse;
import com.questlearn.dto.UpdateProfileRequest;
import com.questlearn.entity.User;
import com.questlearn.repository.UserRepository;
import com.questlearn.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtService     jwtService;

    /**
     * Update career path, domain, and display name.
     * Only updates fields that are non-null in the request (patch semantics).
     * Returns a fresh JWT + updated profile — frontend replaces its stored token.
     */
    public AuthResponse updateProfile(User user, UpdateProfileRequest req) {
        if (req.getDisplayName() != null) user.setDisplayName(req.getDisplayName());
        if (req.getCareerPath()  != null) user.setCareerPath(req.getCareerPath());
        if (req.getDomainName()  != null) user.setDomainName(req.getDomainName());
        if (req.getDomainColor() != null) user.setDomainColor(req.getDomainColor());

        userRepository.save(user);

        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
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
