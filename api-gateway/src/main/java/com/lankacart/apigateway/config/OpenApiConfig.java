package com.lankacart.apigateway.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Value("${services.gateway.base-url}")
    private String gatewayBaseUrl;

    @Bean
    public OpenAPI apiGatewayOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server().url(gatewayBaseUrl).description("LankaCart API Gateway"))
                .info(new Info()
                        .title("LankaCart API Gateway")
                        .description("Aggregated API documentation for all LankaCart microservices")
                        .version("1.0.0")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
