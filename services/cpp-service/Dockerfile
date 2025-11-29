# Etapa 1: Construcción
FROM ubuntu:22.04 AS build

# Instalar dependencias necesarias para la construcción
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    nlohmann-json3-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Descargar e instalar httplib
RUN git clone https://github.com/yhirose/cpp-httplib.git && \
    cd cpp-httplib && \
    mkdir build && cd build && \
    cmake .. && make && make install

# Copiar archivos de construccion
COPY CMakeLists.txt .
COPY src/ ./src/

# Actualizar CMakeLists.txt para user httplib correctamente
RUN echo 'cmake_minimum_required(VERSION 3.16)\n\
project(cpp_service)\n\
set(CMAKE_CXX_STANDARD 17)\n\
add_executable(cpp_service src/main.cpp)\n\
target_link_libraries(cpp_service pthread)\n\
target_include_directories(cpp_service PRIVATE /usr/local/include)' > CMakeLists.txt

# Compilar aplicacion
RUN mkdir build && cd build && \
    cmake .. && \
    make

# Etapa 2: Imagen final
FROM ubuntu:22.04


WORKDIR /app

# Copiar binario compilado
COPY --from=build /app/build/cpp_service .

# Exponer puerto
EXPOSE 8002

# Comando para ejecutar la aplicación
CMD ["./cpp_service"]