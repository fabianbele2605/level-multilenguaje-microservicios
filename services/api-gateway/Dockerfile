# Etapa 1: Construcción
FROM maven:3.9.4-openjdk-17 AS build

WORKDIR /app

# Copiar archivos de configuracion de maven
COPY pom.xml .

# Descargar dependencias (se cachea si pom.xml no cambia)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar la aplicacíon
RUN mvn clean package -DskipTests

# Etapa 2: Ejecucíon
FROM openjdk:17-jre-slim

WORKDIR /app

# Copiar el JAR compilado desde la etapa anterior
COPY --from=build /app/target/api-gateway-1.0.0.jar app.jar

# Exponer el puerto
EXPOSE 8081

# Comando para ejecutar la aplicacion
ENTRYPOINT [ "java", "-jar", "app.jar" ]