package com.lankacart.inventoryservice.exception;

public record ApiErrorResponse(
        String timestamp,
        int status,
        String error,
        String message,
        String path
) {
}
