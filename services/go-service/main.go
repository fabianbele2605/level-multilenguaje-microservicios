package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main()  {
	// Crear router
	router := mux.NewRouter()

	// Configurar rutas
	router.HandleFunc("/status", StatusHandler).Methods("GET")
	router.HandleFunc("/process", ProcessHandler).Methods("POST")
	router.HandleFunc("/health", HealthHandler).Methods("GET")

	// Middleware de logging
	router.Use(loggingMiddleware)

	// Configurar puerto
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Servidor escuchando en el puerto %s...", port)

	// Iniciar servidor
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal("Error al iniciar servidor:", err)
	}
}

// Middleware de logging
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s", r.Method, r.RequestURI, r.RemoteAddr)
		next.ServeHTTP(w, r)
	})
}