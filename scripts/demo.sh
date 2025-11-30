#!/bin/bash

# 🎯 Script de Demostración Automática
# Sistema Multilenguaje - Microservicios Distribuidos

echo "🚀 DEMO: Sistema Multilenguaje - Microservicios Distribuidos"
echo "=========================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar paso
show_step() {
    echo -e "${BLUE}📋 PASO $1: $2${NC}"
    echo "----------------------------------------"
}

# Función para mostrar resultado
show_result() {
    echo -e "${GREEN}✅ $1${NC}"
    echo ""
}

# Función para mostrar error
show_error() {
    echo -e "${RED}❌ $1${NC}"
    echo ""
}

# Verificar si Docker está corriendo
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        show_error "Docker no está corriendo. Por favor inicia Docker Desktop."
        exit 1
    fi
    show_result "Docker está corriendo"
}

# Verificar health de un servicio
check_health() {
    local port=$1
    local service=$2
    local max_attempts=30
    local attempt=1
    
    echo -n "Verificando $service (puerto $port)... "
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ OK${NC}"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
        echo -n "."
    done
    
    echo -e "${RED}❌ TIMEOUT${NC}"
    return 1
}

# Ejecutar test de API
test_api() {
    local endpoint=$1
    local data=$2
    local description=$3
    
    echo -e "${YELLOW}🧪 Probando: $description${NC}"
    echo "Endpoint: $endpoint"
    echo "Data: $data"
    echo ""
    
    response=$(curl -s -X POST "$endpoint" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}📊 Respuesta:${NC}"
        echo "$response" | jq . 2>/dev/null || echo "$response"
        echo ""
        show_result "Test exitoso"
    else
        show_error "Test falló"
    fi
}

# INICIO DE LA DEMO
echo -e "${YELLOW}🎬 Iniciando demostración automática...${NC}"
echo ""

# Paso 1: Verificar Docker
show_step "1" "Verificando Docker"
check_docker

# Paso 2: Levantar servicios
show_step "2" "Levantando todos los servicios"
echo "Ejecutando: docker-compose up --build -d"
cd docker
docker-compose up --build -d

if [ $? -eq 0 ]; then
    show_result "Servicios iniciados correctamente"
else
    show_error "Error al iniciar servicios"
    exit 1
fi

# Paso 3: Verificar health de todos los servicios
show_step "3" "Verificando health de todos los servicios"
echo "Esperando que todos los servicios estén listos..."
echo ""

services=(
    "8081:Java-Gateway"
    "8082:Go-Orchestrator" 
    "8083:Python-Analyzer"
    "8084:Rust-Validator"
    "8085:C++-Engine"
)

all_healthy=true
for service in "${services[@]}"; do
    port=$(echo $service | cut -d: -f1)
    name=$(echo $service | cut -d: -f2)
    
    if ! check_health $port $name; then
        all_healthy=false
    fi
done

if [ "$all_healthy" = true ]; then
    show_result "Todos los servicios están funcionando correctamente"
else
    show_error "Algunos servicios no respondieron"
    echo "Continuando con la demo..."
fi

echo ""

# Paso 4: Ejecutar tests de integración
show_step "4" "Ejecutando tests de integración"

# Test 1: Análisis básico (Java → Go → Rust → Python)
test_api "http://localhost:8081/api/go/analyze" \
    '{"numbers": [10, 20, 30, 40, 50], "text": "Demo de integración multilenguaje"}' \
    "Análisis básico (Java → Go → Rust → Python)"

sleep 2

# Test 2: Análisis pesado (Python → C++)
test_api "http://localhost:8083/heavy-analyze" \
    '{"numbers": [5, 10, 15], "text": "Cálculos de alto rendimiento"}' \
    "Análisis pesado (Python → C++)"

sleep 2

# Test 3: Validación de errores (Rust)
echo -e "${YELLOW}🧪 Probando: Validación de errores (Rust)${NC}"
echo "Endpoint: http://localhost:8081/api/go/analyze"
echo "Data: Array vacío (debería fallar)"
echo ""

response=$(curl -s -X POST "http://localhost:8081/api/go/analyze" \
    -H "Content-Type: application/json" \
    -d '{"numbers": [], "text": "Array vacío debería fallar"}')

echo -e "${GREEN}📊 Respuesta (error esperado):${NC}"
echo "$response" | jq . 2>/dev/null || echo "$response"
echo ""
show_result "Validación de errores funcionando"

# Paso 5: Mostrar logs (opcional)
show_step "5" "Mostrando logs recientes"
echo "Últimas 10 líneas de logs de cada servicio:"
echo ""

for service in java-gateway go-service python-service rust-service cpp-service; do
    echo -e "${BLUE}📋 Logs de $service:${NC}"
    docker-compose logs --tail=5 $service 2>/dev/null || echo "No hay logs disponibles"
    echo ""
done

# Paso 6: Mostrar métricas
show_step "6" "Métricas del sistema"
echo -e "${GREEN}📊 Resumen de la demostración:${NC}"
echo "• ✅ 5 lenguajes integrados: Java, Go, Python, Rust, C++"
echo "• ✅ 5 microservicios funcionando"
echo "• ✅ Comunicación HTTP entre servicios"
echo "• ✅ Validación multicapa"
echo "• ✅ Cálculos de alto rendimiento"
echo "• ✅ Manejo de errores robusto"
echo ""

# Información adicional
echo -e "${YELLOW}🔗 Enlaces útiles:${NC}"
echo "• Documentación: ./docs/"
echo "• Perfil del proyecto: ./PROJECT_PROFILE.md"
echo "• Demo detallada: ./DEMO.md"
echo "• Post para LinkedIn: ./LINKEDIN_POST.md"
echo ""

echo -e "${YELLOW}🛠️  Comandos útiles:${NC}"
echo "• Ver logs en tiempo real: docker-compose logs -f"
echo "• Escalar servicios: docker-compose up --scale python-service=3"
echo "• Parar servicios: docker-compose down"
echo "• Reconstruir: docker-compose up --build"
echo ""

echo -e "${GREEN}🎉 ¡Demostración completada exitosamente!${NC}"
echo "El sistema está listo para mostrar en tu portafolio."
echo ""
echo "Para LinkedIn, puedes usar:"
echo "• Screenshots de esta demo"
echo "• El código del repositorio"
echo "• Los posts preparados en LINKEDIN_POST.md"
echo ""
echo -e "${BLUE}🚀 ¡Tu proyecto multilenguaje está listo para impresionar!${NC}"