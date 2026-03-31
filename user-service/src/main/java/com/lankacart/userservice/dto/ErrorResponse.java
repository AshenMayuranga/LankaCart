package com.lankacart.userservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Error response")
public class ErrorResponse {

    @Schema(description = "Error message", example = "Invalid credentials")
    private String message;
}
