// main.cpp
#include <httplib.h>
#include <iostream>
#include <nlohmann/json.hpp>
#include <vector>
#include <numeric>
#include <cmath>
#include <algorithm>

// Alias para nlohmann::json
using json = nlohmann::json;

// Función para realizar cálculos intensivos
struct CalculationResult
{
    // Resultados de los cálculos
    double factorial_sum;
    double geometric_mean;
    double standard_deviation;
    std::vector<double> fibonacci_sequence;
};

// Función para realizar cálculos intensivos
CalculationResult performHeavyCalculations(const std::vector<double>& numbers) {
    CalculationResult result;

    // Cálculo intensivo: suma de factoriales
    result.factorial_sum = 0;
    // Factorial limitado a 10! para evitar overflow
    for (double num : numbers) {
        int n = static_cast<int>(num);
        // Calcular factorial
        double factorial = 1;
        // Limitar n a 10 para evitar overflow
        for (int i = 1; i <= n && i <= 10; ++i) {
            factorial *=i;
        }
        //
        result.factorial_sum += factorial;
    }

    // Media geométrica
    double product = 1;
    for (double num : numbers) {
        if (num > 0) product *= num;
    }
    result.geometric_mean = std::pow(product, 1.0 / numbers.size());

    // Desviación estándar
    double mean = std::accumulate(numbers.begin(), numbers.end(), 0.0) / numbers.size();
    double variance = 0;
    for (double num : numbers) {
        variance += std::pow(num - mean, 2);
    }
    result.standard_deviation = std::sqrt(variance / numbers.size());

    // Secuencia Fibonacci hasta el numero mas grande
    int max_num = *std::max_element(numbers.begin(), numbers.end());
    result.fibonacci_sequence = {0, 1};
    // Generar la secuencia
    while (result.fibonacci_sequence.back() < max_num) {
        int next = result.fibonacci_sequence[result.fibonacci_sequence.size()-1] +
                   result.fibonacci_sequence[result.fibonacci_sequence.size()-2];
        result.fibonacci_sequence.push_back(next);
    }
    // Eliminar el último elemento si excede max_num
    return result;
}

// Punto de entrada del servidor
int main() {
    httplib::Server server;

    // Endpoint de salud
    server.Get("/health", [](const httplib::Request&, httplib::Response& res) {
        json response = {
            {"service", "cpp-service"},
            {"message", "Servicio C++ saludable"},
            {"status", "healthy"}
        };
        // Responder con JSON
        res.set_content(response.dump(), "application/json");
    });

    // Endpoint para cálculos intensivos
    server.Post("/calculate", [](const httplib::Request& req, httplib::Response& res) {
        // Manejar errores de parsing y cálculos
        try {
            // Parsear el cuerpo de la solicitud JSON
            json input = json::parse(req.body);
            std::vector<double> numbers = input["numbers"];

            // Realizar cálculos intensivos
            auto result = performHeavyCalculations(numbers);

            // Construir la respuesta JSON
            json response = {
                {"service", "cpp-service"},
                {"heavy_calculations", {
                    {"factorial_sum", result.factorial_sum},
                    {"geometric_mean", result.geometric_mean},
                    {"standard_deviation", result.standard_deviation},
                    {"fibonacci_sequence", result.fibonacci_sequence}
                }}
            };

            // Responder con JSON
            res.set_content(response.dump(), "application/json");
            // catch para manejo de errores
        } catch (const std::exception& e) {
            json error = {
                {"service", "cpp-service"},
                {"error", e.what()}
            };
            // Responder con error 500
            res.status = 500;
            // Responder con JSON de error
            res.set_content(error.dump(), "application/json");
        }
    });

    // Iniciar el servidor en el puerto 8002
    std::cout << "Servicio C++ ejecutándose en puerto 8002" << std::endl;
    server.listen("0.0.0.0", 8002);

    // Fin del programa
    return 0;
}
