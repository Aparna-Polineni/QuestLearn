package com.questlearn.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** Payload for POST /api/progress/complete */
@Data
public class CompleteLevelRequest {

    @NotNull @Min(1)
    private Integer stage;

    @NotNull @Min(0)
    private Integer levelId;

    /** Optional: how many seconds the student spent on this level */
    private Integer timeTakenSeconds;

    /** Optional: how many attempts it took */
    private Integer attempts;
}
