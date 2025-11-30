    // src/main.rs
use actix_web::{web, App, HttpServer, Result, HttpResponse, middleware::Logger};
use serde::{Deserialize, Serialize};

// Estructuras de datos para solicitudes y respuestas
#[derive(Serialize, Deserialize)]
struct DataRequest {
    numbers: Vec<f64>,
    text: String,
}

// Respuesta de validacion
#[derive(Serialize)]
struct ValidationResponse {
    is_valid: bool,
    message: String,
    data: Option<DataRequest>,
}

// Endpoint de salud
async fn health() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "service": "rust-service",
        "message": "Servicio Rust saludable",
        "status": "healthy"
    })))
}

// Endpoint de validacion y comunicacion con servicio Python
async fn validate(data: web::Json<DataRequest>) -> Result<HttpResponse> {
    // Validaciones basicas
    if data.numbers.is_empty() {
        return Ok(HttpResponse::BadRequest().json(ValidationResponse {
            is_valid: false,
            message: "El array 'numbers' no puede estar vacío.".to_string(),
            data: None,
        }));
    }

    if data.numbers.len() > 100 {
        return Ok(HttpResponse::BadRequest().json(ValidationResponse {
            is_valid: false,
            message: "Demasiados números (máximo 100)".to_string(),
            data: None,
        }));
    }

    for &num in &data.numbers {
        if num.abs() > 1_000_000.0 {
            return Ok(HttpResponse::BadRequest().json(ValidationResponse {
                is_valid: false,
                message: "Número fuera del rango válido".to_string(),
                data: None,
            }));
        }
    }

    // Validar longitud del texto
    if data.text.len() > 1000 {
        return Ok(HttpResponse::BadRequest().json(ValidationResponse {
            is_valid: false,
            message: "El campo 'text' excede la longitud máxima de 1000 caracteres.".to_string(),
            data: None,
        }));
    }

    // Si pasa validacion, enviar a Python
    let python_url = std::env::var("PYTHON_SERVICE_URL")
        .unwrap_or_else(|_|"http://python-service:8000".to_string());
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .unwrap();
    let response = client
        .post(&format!("{}/analyze", python_url))
        .json(&*data)
        .send()
        .await;

    // Manejar respuesta del servicio Python
    match response {
        Ok(resp) => {
            // Reenviar la respuesta del servicio Python al cliente
            let body = resp.text().await.unwrap_or_else(|_|"{}".to_string());
            Ok(HttpResponse::Ok().body(body))
        }
        // En caso de error al comunicarse con el servicio Python
        Err(_) => Ok(HttpResponse::InternalServerError().json(ValidationResponse {
            is_valid: false,
            message: "Error al comunicarse con el servicio Python.".to_string(),
            data: None,
        })),
    }
}

// Configuracion del servidor Actix
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Inicializar logger
    env_logger::init();

    // Iniciar servidor HTTP
    HttpServer::new(|| {
        // Configurar rutas y middleware
        App::new()
            .wrap(Logger::default())        // Middleware de logging
            .route("/health", web::get().to(health))    // Ruta de salud
            .route("/analyze", web::post().to(validate))  // Ruta de validacion
    })
    // Escuchar en el puerto 8001
    .bind("0.0.0.0:8001")?
    // Correr el servidor
    .run()
    // Esperar a que termine
    .await
}