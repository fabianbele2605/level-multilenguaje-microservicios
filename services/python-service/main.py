#!/usr/bin/env python3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
import statistics
from datetime import datetime
import os  # Para os.getenv()
import logging
from typing import List


# Crear la aplicación FastAPI
app = FastAPI()

# Definir el modelo de datos para la solicitud

class DataRequest(BaseModel):
    numbers: List[float] = Field(..., min_items=1, max_items=100)
    text: str = Field("", max_length=500)

    @validator('numbers')
    def validate_numbers(cls, v):
        if not v:
            raise ValueError("El array de números no puede estar vacío")
        for num in v:
            if abs(num) > 1000000:
                raise ValueError(f"El número {num} está fuera de rango")
        return v

# Endpoint de salud
@app.get("/health")
def health():
    return {
        "service": 
        "python-service",
        "message": "Servicio Python saludable", 
        "status": "healthy"
    }

# Endpoint de análisis
@app.post("/analyze")
def analyze_data(data: DataRequest):
    try:
        # Validacion adicional
        if len(data.numbers) > 100:
            raise HTTPException(status_code=400, detail="Demasiados números")
        
        result = {
        "service": "python-service",
        "timestamp": datetime.now().isoformat(),  # Formato estándar
        "analysis": {
            "count": len(data.numbers),
            "sum": round(sum(data.numbers), 6),  # Limitar decimales
            "average": round(statistics.mean(data.numbers), 6) if data.numbers else 0,
            "text_length": len(data.text),
            "word_count": len(data.text.split()) if data.text else 0
        }
    }
        # Devolver el resultado del análisis
        return result
    except ValueError as e:     
        raise HTTPException(status_code=400, detail="Datos inválidos")
    except Exception as e:
        logging.error(f"Error inesperado: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.post("/heavy-analyze")
async def heavy_analyze_data(data: DataRequest):
    # Analisis basico en python
    basic_analysis = {
        "count": len(data.numbers),
        "sum": sum(data.numbers),
        "average": statistics.mean(data.numbers) if data.numbers else 0,
        "text_length": len(data.text),
        "word_count": len(data.text.split()) if data.text else 0
    }

    # llamar a C++ microservicio para analisis pesado
    cpp_url = os.getenv("CPP_SERVICE_URL", "http://cpp-service:8002")
    # Realizar la solicitud al servicio C++
    try:
        import requests
        response = requests.post(
            f"{cpp_url}/calculate",
            json={"numbers": data.numbers},
            timeout=10,  # Ajustar según sea necesario
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()  # Lanza una excepción si la respuesta no es exitosa
        heavy_calculations = response.json()
    except requests.exceptions.Timeout:
        heavy_calculations = {"error": "Servicio C++ agotó tiempo de espera"}
    except requests.exceptions.RequestException as e:
        logging.error(f"Error del servicio C++: {str(e)}")
        heavy_calculations = {"error": "Error del servicio C++"}
    except Exception as e:
        logging.error(f"Error inesperado en llamada al servicio C++: {str(e)}")
        heavy_calculations = {"error": "Error inesperado en llamada al servicio C++"}

    # Devolver el resultado combinado
    return {
        "service": "python-service",
        "timestamp": datetime.now(),
        "basic_analysis": basic_analysis,
        "heavy_calculations": heavy_calculations
    }