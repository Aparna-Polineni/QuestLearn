package com.questlearn.repository;

import com.questlearn.entity.LevelProgress;
import com.questlearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LevelProgressRepository extends JpaRepository<LevelProgress, Long> {

    /** All completed levels for a user — used to rebuild frontend progress state */
    List<LevelProgress> findByUserOrderByStageAscLevelIdAsc(User user);

    /** Check if a specific level is already completed */
    Optional<LevelProgress> findByUserAndStageAndLevelId(User user, Integer stage, Integer levelId);

    /** Count distinct levels completed in a given stage */
    @Query("SELECT COUNT(lp) FROM LevelProgress lp WHERE lp.user = :user AND lp.stage = :stage")
    long countByUserAndStage(User user, int stage);

    /** Total XP across all users for a stage — analytics */
    @Query("SELECT AVG(lp.xpEarned) FROM LevelProgress lp WHERE lp.stage = :stage AND lp.levelId = :levelId")
    Double avgXpForLevel(int stage, int levelId);
}
