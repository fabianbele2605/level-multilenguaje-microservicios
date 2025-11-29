# Dockerfile for Python FastAPI microservice
FROM python:3.11-slim

# directorio de trabajo dentro del contenedor
WORKDIR /app

# copiar el archivo de requerimientos e instalar dependencias
COPY requirements.txt .

# instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# copiar el código fuente de la aplicación
COPY . .

# exponer el puerto en el que correrá la aplicación
EXPOSE 8000

# comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
