package com.lankacart.userservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "New user registration details")
public class RegisterRequest {

    @Schema(description = "Unique username", example = "john_doe")
    private String username;

    @Schema(description = "Email address", example = "john@example.com")
    private String email;

    @Schema(description = "First name", example = "John")
    private String firstName;

    @Schema(description = "Last name", example = "Doe")
    private String lastName;

    @Schema(description = "Password", example = "secret123")
    private String password;

    @Schema(description = "Phone number", example = "+94771234567")
    private String phoneNumber;
}
