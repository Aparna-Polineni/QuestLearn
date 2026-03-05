package com.questlearn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/** Returned by both /register and /login on success */
@Data @Builder @AllArgsConstructor
public class AuthResponse {
    private String token;          // JWT — store in localStorage on the frontend
    private Long   userId;
    private String email;
    private String displayName;
    private String careerPath;
    private String domainName;
    private String domainColor;
    private Integer totalXp;
    private Integer currentStage;
}
