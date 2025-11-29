# Etapa 1: Construcción
FROM rust:latest as build

WORKDIR /app

# Copiar archivos de configuracion
COPY Cargo.toml Cargo.lock* ./

# Crear directorio src con archivos dummy para cachear dependencias
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Descargar y compilar dependencias
RUN cargo build --release && rm -rf src

# Copiar codigo fuente real
COPY src ./src

# Compilar la aplicacion
RUN cargo build --release

# Etapa 2: Ejecucion
FROM debian:bookworm-slim

# Instalar dependencias de runtime
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar binario compilado 
COPY --from=build /app/target/release/rust_service .

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar la aplicacion
CMD ["./rust_service"]