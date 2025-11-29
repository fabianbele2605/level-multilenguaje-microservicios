// handlers.go
package main

// Importar paquetes necesarios
import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"
	"bytes"
	"os"
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
// AnalyzeHandler - Envia datos a python para analisis
func AnalyzeHandler(w http.ResponseWriter, r *http.Request) {
	// Leer el cuerpo de la solicitud
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error al leer datos ", http.StatusBadRequest)
		return
	}

	defer r.Body.Close()

	// LLamar al servicio de Python
	pythonURL := os.Getenv("PYTHON_SERVICE_URL")
	if pythonURL == "" {
		pythonURL = "http://python-service:8000"
	}

	resp, err := http.Post(pythonURL+"/analyze", "application/json", bytes.NewBuffer(body))
	if err != nil {
		log.Printf("Error al llamar al servicio Python: %v", err)
		http.Error(w, "Error al comunicarse con el servicio Python", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Reenviar la respuesta del servicio Python al cliente
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)

}