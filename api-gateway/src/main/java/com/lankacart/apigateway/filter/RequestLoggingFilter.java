package com.lankacart.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class RequestLoggingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startNanos = System.nanoTime();

        String incomingCorrelationId = exchange.getRequest().getHeaders().getFirst(CORRELATION_ID_HEADER);
        final String correlationId = (incomingCorrelationId == null || incomingCorrelationId.isBlank())
                ? UUID.randomUUID().toString()
                : incomingCorrelationId;

        HttpMethod method = exchange.getRequest().getMethod();
        String path = exchange.getRequest().getURI().getRawPath();

        ServerWebExchange mutated = exchange.mutate()
                .request(request -> request.headers(headers -> headers.set(CORRELATION_ID_HEADER, correlationId)))
                .build();
        mutated.getResponse().getHeaders().set(CORRELATION_ID_HEADER, correlationId);

        return chain.filter(mutated)
                .doFinally(signalType -> {
                    long durationMs = (System.nanoTime() - startNanos) / 1_000_000;
                    HttpStatusCode statusCode = mutated.getResponse().getStatusCode();
                    int status = statusCode != null ? statusCode.value() : 200;
                    String methodValue = method != null ? method.name() : "UNKNOWN";
                    log.info("cid={} method={} path={} status={} durationMs={}",
                            correlationId, methodValue, path, status, durationMs);
                });
    }

    @Override
    public int getOrder() {
        // Run before auth so every request (including 401s) is logged.
        return -2;
    }
}
