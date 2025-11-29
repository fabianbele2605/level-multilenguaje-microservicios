// Copyright 2024 Level Up Labs, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
package com.level.gateway.service;

// importaciones necesarias
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

// Servicio para interactuar con el microservicio Go
@Service
// Clase cliente para el servicio Go
public class GoServiceClient {

    // Cliente WebClient para realizar solicitudes HTTP
    private final WebClient webClient;

    // URL base del servicio Go, configurable vía propiedades
    @Value("${go.service.url:http://go-service:8080}")
    private String goServiceUrl;

    // Constructor
    public GoServiceClient() {
        this.webClient = WebClient.builder()
        .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
        .build();
    }

    // Método para obtener el estado del servicio Go
    public String getStatus() {
        return webClient.get()
            .uri(goServiceUrl + "/status")
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }

    // Método para procesar una solicitud en el servicio Go
    public String processRequest(String request) {
        return webClient.post()
            .uri(goServiceUrl + "/process")
            .body(BodyInserters.fromValue(request))
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }

    // Método para analizar una solicitud en el servicio Go
    public String analyzeRequest(String request) {
        return webClient.post()
            .uri(goServiceUrl + "/analyze")
            .body(BodyInserters.fromValue(request))
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}