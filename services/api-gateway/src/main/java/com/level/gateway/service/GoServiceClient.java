package com.level.gateway.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GoServiceClient {

    private final WebClient webClient;

    @Value("${go.service.url:http://go-service:8080}")
    private String goServiceUrl;

    public GoServiceClient() {
        this.webClient = WebClient.builder()
        .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
        .build();
    }

    public String getStatus() {
        return webClient.get()
            .uri(goServiceUrl + "/status")
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }

    public String processRequest(String request) {
        return webClient.post()
            .uri(goServiceUrl + "/process")
            .body(BodyInserters.fromValue(request))
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}