package com.lankacart.apigateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AggregatedOpenApiController {

    private final WebClient webClient;
    private final String userServiceBaseUrl;
    private final String productServiceBaseUrl;
    private final String orderServiceBaseUrl;
    private final String inventoryServiceBaseUrl;
    private final String gatewayBaseUrl;

    public AggregatedOpenApiController(
            WebClient.Builder webClientBuilder,
            @Value("${services.user.base-url}") String userServiceBaseUrl,
            @Value("${services.product.base-url}") String productServiceBaseUrl,
            @Value("${services.order.base-url}") String orderServiceBaseUrl,
            @Value("${services.inventory.base-url}") String inventoryServiceBaseUrl,
            @Value("${services.gateway.base-url}") String gatewayBaseUrl) {
        this.webClient = webClientBuilder.build();
        this.userServiceBaseUrl = userServiceBaseUrl;
        this.productServiceBaseUrl = productServiceBaseUrl;
        this.orderServiceBaseUrl = orderServiceBaseUrl;
        this.inventoryServiceBaseUrl = inventoryServiceBaseUrl;
        this.gatewayBaseUrl = gatewayBaseUrl;
    }

    @SuppressWarnings("unchecked")
    @GetMapping(value = "/api-docs/aggregated", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Map<String, Object>> aggregatedDocs() {
        return Flux.fromIterable(serviceDocUrls())
                .flatMap(url -> webClient.get()
                        .uri(url)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .onErrorResume(e -> Mono.empty()))
                .collectList()
                .map(specs -> {
                    Map<String, Object> paths = new LinkedHashMap<>();
                    Map<String, Object> schemas = new LinkedHashMap<>();

                    for (Map<?, ?> spec : specs) {
                        if (spec.containsKey("paths")) {
                            paths.putAll((Map<String, Object>) spec.get("paths"));
                        }
                        if (spec.containsKey("components")) {
                            Map<String, Object> comp = (Map<String, Object>) spec.get("components");
                            if (comp.containsKey("schemas")) {
                                schemas.putAll((Map<String, Object>) comp.get("schemas"));
                            }
                        }
                    }

                    Map<String, Object> combined = new LinkedHashMap<>();
                    combined.put("openapi", "3.0.1");
                    combined.put("info", Map.of(
                            "title", "LankaCart API Gateway",
                            "description", "API Gateway - Aggregated documentation for all LankaCart microservices",
                            "version", "1.0.0"
                    ));
                    combined.put("paths", paths);
                    if (!schemas.isEmpty()) {
                        combined.put("components", Map.of("schemas", schemas));
                    }

                    return combined;
                });
    }

    private List<String> serviceDocUrls() {
        List<String> urls = new ArrayList<>();
        urls.add(userServiceBaseUrl + "/api-docs");
        urls.add(productServiceBaseUrl + "/api-docs");
        urls.add(orderServiceBaseUrl + "/api-docs");
        urls.add(inventoryServiceBaseUrl + "/api-docs");
        urls.add(gatewayBaseUrl + "/api-docs");
        return urls;
    }
}
