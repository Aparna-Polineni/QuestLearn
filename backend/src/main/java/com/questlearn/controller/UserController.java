package com.questlearn.controller;

import com.questlearn.dto.AuthResponse;
import com.questlearn.dto.UpdateProfileRequest;
import com.questlearn.entity.User;
import com.questlearn.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/user/me
     * Returns the current user's profile.
     * @AuthenticationPrincipal injects the User object from the JWT — no DB call needed here.
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .careerPath(user.getCareerPath())
                .domainName(user.getDomainName())
                .domainColor(user.getDomainColor())
                .totalXp(user.getTotalXp())
                .currentStage(user.getCurrentStage())
                .build());
    }

    /**
     * PUT /api/user/profile
     * Body: { displayName?, careerPath?, domainName?, domainColor? }
     * All fields are optional — only non-null fields are updated.
     * Returns: fresh AuthResponse (new token + updated profile).
     */
    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest req
    ) {
        return ResponseEntity.ok(userService.updateProfile(user, req));
    }
}
