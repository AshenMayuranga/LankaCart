package com.lankacart.apigateway.exception;

public record ApiErrorResponse(
        String timestamp,
        int status,
        String error,
        String message,
        String path
) {
}
