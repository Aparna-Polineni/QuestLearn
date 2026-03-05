package com.questlearn.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Tracks one user completing one level.
 * The unique constraint on (user_id, stage, level_id) prevents duplicates
 * while allowing upsert-style logic in the service layer.
 */
@Entity
@Table(name = "level_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "stage", "level_id"})
})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class LevelProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer stage;

    @Column(nullable = false)
    private Integer levelId;

    /** XP awarded for this level. Default 100, bonus levels can award more. */
    @Column(nullable = false)
    @Builder.Default
    private Integer xpEarned = 100;

    /** How many attempts before passing — useful for analytics */
    @Column(nullable = false)
    @Builder.Default
    private Integer attempts = 1;

    /** Optional: seconds the student spent on this level */
    private Integer timeTakenSeconds;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();
}
