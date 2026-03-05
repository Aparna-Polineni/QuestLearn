package com.questlearn.dto;

import lombok.Data;

/** Payload for PUT /api/user/profile — all fields optional (patch semantics) */
@Data
public class UpdateProfileRequest {
    private String displayName;
    private String careerPath;
    private String domainName;
    private String domainColor;
}
