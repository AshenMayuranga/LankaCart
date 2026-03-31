package com.lankacart.userservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Login credentials")
public class AuthRequest {

    @Schema(description = "Username", example = "john_doe")
    private String username;

    @Schema(description = "Password", example = "secret123")
    private String password;
}
