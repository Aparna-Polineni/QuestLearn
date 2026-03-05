package com.questlearn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** One row in the leaderboard response */
@Data @AllArgsConstructor
public class LeaderboardEntry {
    private Integer rank;
    private String  displayName;
    private Integer totalXp;
    private Integer currentStage;
}
