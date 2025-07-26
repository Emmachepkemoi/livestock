package com.farmtech.livestock.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BreedResponseDTO {
    private Integer breedId;
    private String categoryName; // now using name instead of ID
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
    private Boolean isActive;
}
