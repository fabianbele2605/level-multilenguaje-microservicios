# Etapa 1: Construcción
FROM golang:1.21-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY go.mod go.sum ./

# Descargar dependencias (se cachea si go.mod no cambia)
RUN go mod download

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Etapa 2: Ejecución
FROM alpine:latest

# Instalar certificados SSL
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copiar el binario compilado
COPY --from=build /app/main .

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["./main"]
