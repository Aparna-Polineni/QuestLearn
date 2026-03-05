package com.questlearn.controller;

import com.questlearn.dto.CompleteLevelRequest;
import com.questlearn.dto.ProgressResponse;
import com.questlearn.entity.User;
import com.questlearn.service.ProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    /**
     * GET /api/progress
     * Returns all completed levels + totalXp + currentStage.
     * Called on app load to restore progress state.
     */
    @GetMapping
    public ResponseEntity<ProgressResponse> getProgress(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(progressService.getProgress(user));
    }

    /**
     * POST /api/progress/complete
     * Body: { stage, levelId, timeTakenSeconds?, attempts? }
     * Idempotent — safe to call multiple times for the same level.
     * Returns: updated full progress state.
     */
    @PostMapping("/complete")
    public ResponseEntity<ProgressResponse> completeLevel(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CompleteLevelRequest req
    ) {
        return ResponseEntity.ok(progressService.completeLevel(user, req));
    }
}
