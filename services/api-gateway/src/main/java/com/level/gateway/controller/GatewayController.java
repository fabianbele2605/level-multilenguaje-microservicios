package com.level.gateway.controller;

import com.level.gateway.service.GoServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GatewayController {

    @Autowired
    private GoServiceClient goServiceClient;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("API Gateway Ok");
    }

    @GetMapping("/go/status")
    public ResponseEntity<String> getGoStatus() {
        try {
            String status = goServiceClient.getStatus();
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error al obtener el estado de Go: " + e.getMessage());
        }
    }

    @PostMapping("/go/process")
    public ResponseEntity<String> processGoRequest(@RequestBody String request) {
        try {
            String response = goServiceClient.processRequest(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error al procesar la solicitud en Go: " + e.getMessage());
        }
    }

}