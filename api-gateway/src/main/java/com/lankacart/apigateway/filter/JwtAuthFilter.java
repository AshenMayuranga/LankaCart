package com.lankacart.apigateway.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lankacart.apigateway.exception.ApiErrorResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.List;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String secret;
    private final ObjectMapper objectMapper;

    public JwtAuthFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/api-docs",
            "/swagger-ui",
            "/webjars",
            "/gateway"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        if (isPublicRequest(path, method)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return writeErrorResponse(exchange, HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            ServerWebExchange mutated = exchange.mutate()
                    .request(r -> r
                            .header("X-User-Id", claims.getSubject())
                            .header("X-User-Role", claims.get("role", String.class)))
                    .build();
            return chain.filter(mutated);
        } catch (JwtException e) {
            return writeErrorResponse(exchange, HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
    }

    private boolean isPublicRequest(String path, HttpMethod method) {
        if (HttpMethod.OPTIONS.equals(method)) {
            return true;
        }

        if ("/auth/login".equals(path) || "/auth/register".equals(path)) {
            return true;
        }

        if (PUBLIC_PREFIXES.stream().anyMatch(path::startsWith)) {
            return true;
        }

        // Keep product catalog reads public while protecting product writes.
        return HttpMethod.GET.equals(method) && ("/products".equals(path) || path.startsWith("/products/"));
    }

    private Mono<Void> writeErrorResponse(ServerWebExchange exchange, HttpStatus status, String message) {
        try {
            ApiErrorResponse errorResponse = new ApiErrorResponse(
                    Instant.now().toString(),
                    status.value(),
                    status.getReasonPhrase(),
                    message,
                    exchange.getRequest().getURI().getPath()
            );

            byte[] body = objectMapper.writeValueAsBytes(errorResponse);
            exchange.getResponse().setStatusCode(status);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
            DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(body);
            return exchange.getResponse().writeWith(Mono.just(buffer));
        } catch (Exception ex) {
            exchange.getResponse().setStatusCode(status);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
