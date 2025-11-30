// Controlador del API Gateway para enrutar solicitudes al servicio Go
package com.level.gateway.controller;

// importaciones necesarias
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.level.gateway.dto.AnalyzeRequest;
import com.level.gateway.service.GoServiceClient;

import jakarta.validation.Valid;


// Controlador REST para el API Gateway
@RestController
// Mapeo base para el controlador
@RequestMapping("/api")
// Clase controlador del API Gateway
public class GatewayController {

    // Inyección del cliente del servicio Go
    @Autowired
    // Cliente del servicio Go
    private GoServiceClient goServiceClient;

    private static final Logger logger = LoggerFactory.getLogger(GatewayController.class);

    @Autowired
    private ObjectMapper objectMapper;

    // Endpoint de salud del API Gateway
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"service\": \"api-gateway\", \"message\": \"API Gateway saludable\", \"status\": \"healthy\"}");
    }

    // Endpoint para obtener el estado del servicio Go
    @GetMapping("/go/status")
    public ResponseEntity<String> getGoStatus() {
        // Llamada al cliente del servicio Go para obtener el estado
        try {
            String status = goServiceClient.getStatus();
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error al obtener el estado de Go: " + e.getMessage());
        }
    }

    // Endpoint para procesar una solicitud en el servicio Go
    @PostMapping("/go/process")
    public ResponseEntity<String> processGoRequest(@RequestBody String request) {
        // Llamada al cliente del servicio Go para procesar la solicitud
        try {
            String response = goServiceClient.processRequest(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error al procesar la solicitud en Go: " + e.getMessage());
        }
    }

    // Endpoint para analizar una solicitud en el servicio Go
    @PostMapping("/go/analyze")
    // Llamada al cliente del servicio Go para analizar la solicitud
    public ResponseEntity<String> analyzeGoRequest(@Valid @RequestBody AnalyzeRequest request) {
        // Llamada al cliente del servicio Go para analizar la solicitud
        try {
            String jsonRequest = objectMapper.writeValueAsString(request);
            String response = goServiceClient.analyzeRequest(jsonRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error procesando solicitud de análisis", e);
            return ResponseEntity.status(500)
                .body("{\"error\": \"Error procesando solicitud\"}");
        }
    }

}