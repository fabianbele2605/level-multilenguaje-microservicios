package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"
)

// Estructura para respuestas JSON
type Response struct {
	Service  string `json:"service"`
	Message string `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	
}

// StatusHandler - Devuelve el estado del service Go
func StatusHandler(w http.ResponseWriter, r *http.Request) {
	response := Response{
		Service: "go-Service",
		Message: "Go Service esta funcionado correctamente ",
		Timestamp: time.Now(),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error al codificar respuesta: %v", err)
		http.Error(w, "Error interno del servidor", http.StatusInternalServerError)
	}
}

// ProcessHandler - Procesa datos enviados desde el API Gateway
func ProcessHandler(w http.ResponseWriter, r *http.Request) {
	// Leer el cuerpo de la solicitud
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error al leer cuerpo de la petición: %v", err)
		http.Error(w, "Error al leer datos", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Simular procesamineto de datos
	log.Printf("Procesando datos: %s", string(body))

	response := Response{
		Message: "Datos procesados exitosamente por Go Service" + string(body),
		Timestamp: time.Now(),
		Service: "go-service",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error al codificar respuesta: %v", err)
		http.Error(w, "Error interno del servidor", http.StatusInternalServerError)
	}
}

// HealthHandler - Health check para monitoreo
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	response := Response{
		Service: "go-Service",
		Message: "Go Service esta saludable ",
		Timestamp: time.Now(),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error al codificar respuesta: %v", err)
		http.Error(w, "Error interno del servidor", http.StatusInternalServerError)
	}
}