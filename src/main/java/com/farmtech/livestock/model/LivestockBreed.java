package com.farmtech.livestock.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "livestock_breeds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivestockBreed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "breed_id")
    private Integer breedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private LivestockCategory category;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "origin_country", length = 100)
    private String originCountry;

    @Column(name = "average_weight_male_kg", precision = 6, scale = 2)
    private BigDecimal averageWeightMaleKg;

    @Column(name = "average_weight_female_kg", precision = 6, scale = 2)
    private BigDecimal averageWeightFemaleKg;

    @Column(name = "average_lifespan_years")
    private Integer averageLifespanYears;

    @Column(name = "maturity_age_months")
    private Integer maturityAgeMonths;

    @Column(name = "gestation_period_days")
    private Integer gestationPeriodDays;

    @Column(name = "average_litter_size")
    private Double averageLitterSize;

    @Column(name = "primary_purpose", length = 100)
    private String primaryPurpose; // e.g., "MILK", "MEAT", "WOOL", "EGGS", "BREEDING"

    @Column(name = "characteristics", columnDefinition = "TEXT")
    private String characteristics;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // One-to-many relationship with Livestock
    @OneToMany(mappedBy = "breed", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Livestock> livestock;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Convenience constructor
    public LivestockBreed(String name, LivestockCategory category) {
        this.name = name;
        this.category = category;
        this.isActive = true;
    }

    // Convenience constructor with description
    public LivestockBreed(String name, String description, LivestockCategory category) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.isActive = true;
    }
}