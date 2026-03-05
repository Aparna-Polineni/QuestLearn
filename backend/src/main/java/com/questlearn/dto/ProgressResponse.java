package com.questlearn.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

/** Full progress state returned by GET /api/progress — used to hydrate the frontend */
@Data @Builder
public class ProgressResponse {
    private Integer totalXp;
    private Integer currentStage;
    private List<CompletedLevel> completedLevels;

    @Data @Builder
    public static class CompletedLevel {
        private Integer stage;
        private Integer levelId;
        private Integer xpEarned;
        private Integer attempts;
        private String  completedAt;
    }
}
