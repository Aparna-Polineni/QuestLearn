package com.questlearn.controller;

import com.questlearn.dto.LeaderboardEntry;
import com.questlearn.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    /**
     * GET /api/leaderboard?limit=20
     * Public endpoint — no auth required.
     * Returns top N players by XP with rank, displayName, totalXp, currentStage.
     */
    @GetMapping
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard(
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(leaderboardService.getTopPlayers(limit));
    }
}
