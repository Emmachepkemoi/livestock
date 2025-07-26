package com.farmtech.livestock.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivestockDto {

    private Integer livestockId;
    private Integer categoryId;
    private String categoryName;
    private Integer breedId;
    private String breedName;
    private String tagNumber;
    private String name;
    private String gender; // "MALE" or "FEMALE"
    private LocalDate dateOfBirth;
    private Integer estimatedAgeMonths;
    private Integer age; // For backward compatibility
    private Double weightKg;
    private Double weight; // For backward compatibility
    private String color;
    private String healthStatus; // "HEALTHY", "SICK", etc.
    private LocalDate acquisitionDate;
    private String acquisitionMethod; // "BORN_ON_FARM", etc.
    private Double acquisitionCost;
    private Double currentValue;
    private Integer motherId;
    private Integer fatherId;
    private String locationOnFarm;
    private String identificationMarks;
    private String microchipNumber;
    private String insurancePolicyNumber;
    private Double insuranceValue;
    private Boolean isForSale;
    private Double salePrice;
    private String notes;
    private String images;

    @JsonIgnoreProperties({"livestock"})
    private FarmerProfileDto farmer;

    // Convenience methods
    public Integer getAge() {
        return this.estimatedAgeMonths;
    }

    public void setAge(Integer age) {
        this.estimatedAgeMonths = age;
        this.age = age;
    }

    public Double getWeight() {
        return this.weightKg;
    }

    public void setWeight(Double weight) {
        this.weightKg = weight;
        this.weight = weight;
    }
}
