// src/main/java/com/questlearn/controller/StatsController.java
//
// Public endpoint — no auth required. Returns a simple count of level
// completions in the last 7 days. Used by the landing page live counter.
//
// GET /api/stats/weekly-completions
// Response: { "count": 47 }

package com.questlearn.controller;

import com.questlearn.repository.LevelCompletionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "${cors.allowed-origins:*}")
public class StatsController {

    private final LevelCompletionRepository completionRepository;

    public StatsController(LevelCompletionRepository completionRepository) {
        this.completionRepository = completionRepository;
    }

    /**
     * GET /api/stats/weekly-completions
     *
     * Returns the number of level completions in the last 7 days.
     * Called by the landing page every 60 seconds.
     * No authentication required — this is a public social proof signal.
     *
     * Example response: { "count": 47 }
     */
    @GetMapping("/weekly-completions")
    public ResponseEntity<Map<String, Long>> weeklyCompletions() {
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        long count = completionRepository.countByCompletedAtAfter(since);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * GET /api/stats/learner-count
     *
     * Total number of registered users.
     * TODO: add once you have 50+ users to avoid showing "12 learners"
     * which reads as unproven rather than specific.
     *
     * Uncomment when ready:
     * @GetMapping("/learner-count")
     * public ResponseEntity<Map<String, Long>> learnerCount() {
     *     long count = userRepository.count();
     *     return ResponseEntity.ok(Map.of("count", count));
     * }
     */
}
