#!/usr/bin/env python3
from fastapi import FastAPI
from pydantic import BaseModel
import statistics
from datetime import datetime
import os  # Para os.getenv()


# Crear la aplicación FastAPI
app = FastAPI()

# Definir el modelo de datos para la solicitud
class DataRequest(BaseModel):
    numbers: list[float]
    text: str = ""

# Endpoint de salud
@app.get("/health")
def health():
    return {"service": "python-service", "status": "healthy"}

# Endpoint para analizar datos
@app.post("/analyze")
def analyze_data(data: DataRequest):
    result = {
        "service": "python-service",
        "timestamp": datetime.now(),
        "analysis": {
            "count": len(data.numbers),
            "sum": sum(data.numbers),
            "average": statistics.mean(data.numbers) if data.numbers else 0,
            "text_length": len(data.text),
            "word_count": len(data.text.split()) if data.text else 0
        }
    }
    # Devolver el resultado del análisis
    return result


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
        response = requests.post(f"{cpp_url}/calculate", json={"numbers": data.numbers})
        heavy_calculations = response.json()
    except:
        heavy_calculations = {"error": "Could not reach C++ service"}
    # Devolver el resultado combinado
    return {
        "service": "python-service",
        "timestamp": datetime.now(),
        "basic_analysis": basic_analysis,
        "heavy_calculations": heavy_calculations
    }