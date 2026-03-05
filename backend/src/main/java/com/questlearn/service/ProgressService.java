package com.questlearn.service;

import com.questlearn.dto.CompleteLevelRequest;
import com.questlearn.dto.ProgressResponse;
import com.questlearn.entity.LevelProgress;
import com.questlearn.entity.User;
import com.questlearn.repository.LevelProgressRepository;
import com.questlearn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final LevelProgressRepository progressRepository;
    private final UserRepository           userRepository;

    // XP awarded per level — could become a DB table later for per-level config
    private static final int XP_PER_LEVEL = 100;

    /**
     * Return all completed levels for a user.
     * The frontend calls this on load to hydrate progress state.
     */
    public ProgressResponse getProgress(User user) {
        List<LevelProgress> records = progressRepository
                .findByUserOrderByStageAscLevelIdAsc(user);

        List<ProgressResponse.CompletedLevel> levels = records.stream()
                .map(r -> ProgressResponse.CompletedLevel.builder()
                        .stage(r.getStage())
                        .levelId(r.getLevelId())
                        .xpEarned(r.getXpEarned())
                        .attempts(r.getAttempts())
                        .completedAt(r.getCompletedAt().toString())
                        .build())
                .toList();

        return ProgressResponse.builder()
                .totalXp(user.getTotalXp())
                .currentStage(user.getCurrentStage())
                .completedLevels(levels)
                .build();
    }

    /**
     * Mark a level as complete.
     *
     * Idempotent — if already complete, updates the attempts count but
     * does NOT award XP again. This prevents grinding the same level for XP.
     *
     * Also advances currentStage if the user has completed all levels in a stage.
     */
    @Transactional
    public ProgressResponse completeLevel(User user, CompleteLevelRequest req) {
        Optional<LevelProgress> existing = progressRepository
                .findByUserAndStageAndLevelId(user, req.getStage(), req.getLevelId());

        if (existing.isPresent()) {
            // Already completed — just update attempts if provided
            LevelProgress record = existing.get();
            if (req.getAttempts() != null) record.setAttempts(req.getAttempts());
            progressRepository.save(record);
        } else {
            // First completion — award XP and save
            LevelProgress record = LevelProgress.builder()
                    .user(user)
                    .stage(req.getStage())
                    .levelId(req.getLevelId())
                    .xpEarned(XP_PER_LEVEL)
                    .attempts(req.getAttempts() != null ? req.getAttempts() : 1)
                    .timeTakenSeconds(req.getTimeTakenSeconds())
                    .build();

            progressRepository.save(record);

            // Add XP to user total
            user.setTotalXp(user.getTotalXp() + XP_PER_LEVEL);

            // Advance stage if all levels in current stage are done
            // Stage 2 has 21 levels (0-20). Adjust LEVELS_PER_STAGE as you add stages.
            long completedInStage = progressRepository.countByUserAndStage(user, req.getStage());
            int levelsInStage = getLevelsInStage(req.getStage());
            if (completedInStage >= levelsInStage && req.getStage().equals(user.getCurrentStage())) {
                user.setCurrentStage(user.getCurrentStage() + 1);
            }

            userRepository.save(user);
        }

        return getProgress(user);
    }

    /**
     * How many levels exist in each stage.
     * Update this as you build more stages.
     */
    private int getLevelsInStage(int stage) {
        return switch (stage) {
            case 1 -> 8;   // Stage 1: 8 levels
            case 2 -> 21;  // Stage 2: levels 0-20
            default -> 10; // Future stages — default 10
        };
    }
}
