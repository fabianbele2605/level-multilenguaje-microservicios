package com.level.gateway.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class AnalyzeRequest {
    @NotNull
    @Size(min = 1, max = 100, message = "Numbers array must have 1-100 elements")
    private List<Double> numbers;

    @Size(max = 500, message = "Text must not exceed 500 characters")
    private String text = "";

    // Getters y setters
    public List<Double> getNumbers() { return numbers; }
    public void setNumbers(List<Double> numbers) { this.numbers = numbers; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}