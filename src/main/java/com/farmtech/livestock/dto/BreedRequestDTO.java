package com.farmtech.livestock.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BreedRequestDTO {
    @NotBlank
    private String name;

    private String description;
    private String originCountry;
    private BigDecimal averageWeightMaleKg;
    private BigDecimal averageWeightFemaleKg;
    private Integer averageLifespanYears;
    private Integer maturityAgeMonths;
    private Integer gestationPeriodDays;
    private Double averageLitterSize;
    private String primaryPurpose;
    private String characteristics;
    private Boolean isActive = true;

    @NotBlank
    private String categoryName;
}
