package com.farmtech.livestock.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "livestock")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"farmer", "mother", "father"}) // Prevent circular toString
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Livestock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "livestock_id")
    private Integer livestockId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    @JsonBackReference("farmer-livestock") // Prevent circular reference
    private FarmerProfile farmer;

    @ManyToOne(fetch = FetchType.EAGER) // Changed to EAGER to avoid lazy loading issues
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({"livestock"}) // Ignore back reference
    private LivestockCategory category;

    @ManyToOne(fetch = FetchType.EAGER) // Changed to EAGER to avoid lazy loading issues
    @JoinColumn(name = "breed_id", nullable = false)
    @JsonIgnoreProperties({"livestock"}) // Ignore back reference
    private LivestockBreed breed;

    @Column(name = "tag_number", nullable = false, length = 50)
    private String tagNumber;

    @Column(name = "name", length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "estimated_age_months")
    private Integer estimatedAgeMonths;

    @Column(name = "weight_kg", precision = 6, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "color", length = 50)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status")
    private HealthStatus healthStatus = HealthStatus.HEALTHY;

    @Column(name = "acquisition_date", nullable = false)
    private LocalDate acquisitionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "acquisition_method", nullable = false)
    private AcquisitionMethod acquisitionMethod;

    @Column(name = "acquisition_cost", precision = 10, scale = 2)
    private BigDecimal acquisitionCost;

    @Column(name = "current_value", precision = 10, scale = 2)
    private BigDecimal currentValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mother_id")
    @JsonIgnoreProperties({"farmer", "mother", "father", "category", "breed"}) // Prevent deep nesting
    private Livestock mother;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "father_id")
    @JsonIgnoreProperties({"farmer", "mother", "father", "category", "breed"}) // Prevent deep nesting
    private Livestock father;

    @Column(name = "location_on_farm", length = 100)
    private String locationOnFarm;

    @Column(name = "identification_marks", columnDefinition = "TEXT")
    private String identificationMarks;

    @Column(name = "microchip_number", length = 50)
    private String microchipNumber;

    @Column(name = "insurance_policy_number", length = 50)
    private String insurancePolicyNumber;

    @Column(name = "insurance_value", precision = 10, scale = 2)
    private BigDecimal insuranceValue;

    @Column(name = "is_for_sale")
    private Boolean isForSale = false;

    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "images", columnDefinition = "JSON")
    private String images;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Integer getFatherId() {
        return 0;
    }

    public Integer getMotherId() {
        return 0;
    }


    public enum Gender {
        MALE, FEMALE
    }

    public enum HealthStatus {
        HEALTHY, SICK, RECOVERING, DECEASED
    }

    public enum AcquisitionMethod {
        BORN_ON_FARM, PURCHASED, GIFT, INHERITED
    }
}