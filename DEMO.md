# 🎯 Demo en Vivo - Sistema Multilenguaje

## 🚀 Demostración Rápida (2 minutos)

### Paso 1: Levantar el Sistema
```bash
cd docker && docker-compose up --build
```

### Paso 2: Probar la Integración Completa
```bash
# Análisis que pasa por Java → Go → Rust → Python
curl -X POST http://localhost:8081/api/go/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": [10, 20, 30, 40, 50],
    "text": "Demostración de arquitectura multilenguaje"
  }'
```

### Paso 3: Cálculos Pesados (Python → C++)
```bash
# Análisis que incluye cálculos matemáticos avanzados
curl -X POST http://localhost:8083/heavy-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": [5, 10, 15],
    "text": "Cálculos de alto rendimiento"
  }'
```

## 📊 Resultados Esperados

### Respuesta del Sistema Completo:
```json
{
  "service": "python-service",
  "timestamp": "2025-11-29T19:37:48.719303",
  "analysis": {
    "count": 5,
    "sum": 150.0,
    "average": 30.0,
    "text_length": 44,
    "word_count": 4
  }
}
```

### Respuesta con Cálculos Avanzados:
```json
{
  "service": "python-service",
  "basic_analysis": {
    "count": 3,
    "sum": 30.0,
    "average": 10.0
  },
  "heavy_calculations": {
    "factorial_sum": 1307674368015.0,
    "geometric_mean": 8.434326653017491,
    "standard_deviation": 4.08248290463863,
    "fibonacci_sequence": [0, 1, 1, 2, 3, 5, 8, 13, 21]
  }
}
```

## 🎥 Video Demo
*[Aquí puedes agregar un link a un video demo cuando lo tengas]*

## 🔗 Links Útiles
- **Repositorio**: [GitHub](tu-link-aqui)
- **Documentación**: [Docs](./docs/)
- **Arquitectura**: [Diagrama](./docs/architecture.md)